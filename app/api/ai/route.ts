import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const aiRequestSchema = z.object({
  mode: z.enum(["summary", "action-items", "rewrite", "smart-tags", "ask-notes"]),
  input: z.string().trim().min(1, "Input is required"),
});

type AiMode = z.infer<typeof aiRequestSchema>["mode"];

function getInstructions(mode: AiMode) {
  if (mode === "summary") {
    return [
      "You are an assistant for a note-taking app.",
      "Summarize user text with concise structure.",
      "Output format:",
      "1) One short summary paragraph.",
      "2) A 'Key takeaways' section with 3-5 bullets.",
    ].join("\n");
  }

  if (mode === "action-items") {
    return [
      "You are an assistant for meeting/product notes.",
      "Extract concrete action items from the user input.",
      "Output format:",
      "1) Section title: Action Items.",
      "2) Numbered list with clear, executable tasks.",
      "3) Add optional owners only when strongly implied.",
    ].join("\n");
  }

  if (mode === "rewrite") {
    return [
      "You are an assistant that rewrites text in clear, startup-style English.",
      "Keep meaning intact, improve clarity, remove fluff, and keep it concise.",
      "Output format:",
      "1) Title: Rewritten Draft.",
      "2) Rewritten content in 1-3 short paragraphs.",
    ].join("\n");
  }

  if (mode === "smart-tags") {
    return [
      "You are an assistant that suggests useful tags for notes.",
      "Generate 5-8 lowercase kebab-case tags.",
      "Output format:",
      "1) Section title: Suggested Tags.",
      "2) One tag per line prefixed with '- '.",
      "3) Short 'Why these tags' section in 1-2 sentences.",
    ].join("\n");
  }

  return [
    "You are an assistant that answers questions from the provided note context only.",
    "If context is insufficient, state that clearly and suggest what context is missing.",
    "Output format:",
    "1) Direct answer.",
    "2) A short 'Evidence from notes' bullet list.",
  ].join("\n");
}

function getUserPrompt(mode: AiMode, input: string) {
  if (mode === "ask-notes") {
    return input;
  }

  return input;
}

const MAX_NOTES_FOR_CONTEXT = 500;
const MAX_CONTEXT_CHARS = 90_000;
const MAX_CHARS_PER_NOTE = 2_000;

function clampText(value: string, maxChars: number) {
  if (value.length <= maxChars) {
    return value;
  }
  return `${value.slice(0, maxChars)}...`;
}

async function buildAskNotesPrompt(userId: string, question: string) {
  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
    select: {
      title: true,
      content: true,
      updatedAt: true,
      isArchived: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: MAX_NOTES_FOR_CONTEXT,
  });

  if (notes.length === 0) {
    return null;
  }

  const chunks: string[] = [];
  let totalChars = 0;
  let usedNotes = 0;

  for (let index = 0; index < notes.length; index += 1) {
    const note = notes[index];
    const title = note.title.trim() || "(untitled)";
    const body = clampText(note.content || "", MAX_CHARS_PER_NOTE);
    const status = note.isArchived ? "archived" : "active";
    const updated = note.updatedAt.toISOString();
    const block = [
      `Note ${index + 1}`,
      `Title: ${title}`,
      `Status: ${status}`,
      `UpdatedAt: ${updated}`,
      "Content:",
      body || "(empty)",
      "---",
    ].join("\n");

    if (totalChars + block.length > MAX_CONTEXT_CHARS) {
      break;
    }

    chunks.push(block);
    totalChars += block.length;
    usedNotes += 1;
  }

  return [
    "Answer the user's question ONLY using the notes below.",
    "If the notes are insufficient, clearly say what is missing.",
    "When giving evidence, reference note numbers like: Note 3, Note 8.",
    "",
    `User question: ${question}`,
    "",
    `Included notes: ${usedNotes}/${notes.length}`,
    "Notes context:",
    chunks.join("\n"),
  ].join("\n");
}

function extractOpenRouterText(payload: unknown) {
  if (typeof payload !== "object" || payload === null) {
    return "";
  }

  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    return "";
  }

  const firstChoice = choices[0];
  if (typeof firstChoice !== "object" || firstChoice === null) {
    return "";
  }

  const message = (firstChoice as { message?: unknown }).message;
  if (typeof message !== "object" || message === null) {
    return "";
  }

  const content = (message as { content?: unknown }).content;
  if (typeof content === "string" && content.trim()) {
    return sanitizeModelOutput(content);
  }

  if (!Array.isArray(content)) {
    return "";
  }

  const chunks: string[] = [];
  for (const part of content) {
    if (typeof part !== "object" || part === null) {
      continue;
    }

    const text = (part as { text?: unknown }).text;
    if (typeof text === "string" && text.trim()) {
      chunks.push(text.trim());
    }
  }

  return sanitizeModelOutput(chunks.join("\n\n"));
}

function sanitizeModelOutput(raw: string) {
  let cleaned = raw.trim();

  // Strip wrapper tags that some models occasionally append.
  cleaned = cleaned.replace(/<\/?assistant>/gi, "");
  cleaned = cleaned.replace(/<\/?final_answer>/gi, "");
  cleaned = cleaned.replace(/<\/?answer>/gi, "");

  // Remove common fenced wrappers if response is only wrapped in one block.
  if (/^```[\w-]*\n[\s\S]*\n```$/.test(cleaned)) {
    cleaned = cleaned.replace(/^```[\w-]*\n/, "").replace(/\n```$/, "").trim();
  }

  return cleaned.trim();
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.auth.error === "RefreshTokenExpired") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = aiRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid request payload" },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "OPENROUTER_API_KEY is missing. Set it in your .env file." },
      { status: 500 },
    );
  }

  const model = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free";
  const fallbackModel = process.env.OPENROUTER_FALLBACK_MODEL || "openrouter/free";
  const { mode, input } = parsed.data;

  try {
    let effectivePrompt = getUserPrompt(mode, input);

    if (mode === "ask-notes") {
      const askNotesPrompt = await buildAskNotesPrompt(session.user.id, input);
      if (!askNotesPrompt) {
        return NextResponse.json(
          { message: "You don't have any notes yet. Create notes first, then use Ask Notes." },
          { status: 400 },
        );
      }
      effectivePrompt = askNotesPrompt;
    }

    const callOpenRouter = async (targetModel: string) =>
      fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
          "X-Title": "FlowNote",
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            {
              role: "system",
              content: getInstructions(mode),
            },
            {
              role: "user",
              content: effectivePrompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 700,
        }),
      });

    const primaryResponse = await callOpenRouter(model);
    const primaryPayload = (await primaryResponse.json().catch(() => null)) as unknown;

    const primaryErrorMessage =
      typeof primaryPayload === "object" &&
      primaryPayload !== null &&
      "error" in primaryPayload &&
      typeof (primaryPayload as { error?: { message?: unknown } }).error?.message === "string"
        ? (primaryPayload as { error: { message: string } }).error.message
        : null;

    if (
      !primaryResponse.ok &&
      fallbackModel &&
      fallbackModel !== model &&
      primaryErrorMessage?.includes("No endpoints found for")
    ) {
      const fallbackResponse = await callOpenRouter(fallbackModel);
      const fallbackPayload = (await fallbackResponse.json().catch(() => null)) as unknown;

      if (!fallbackResponse.ok) {
        const fallbackMessage =
          typeof fallbackPayload === "object" &&
          fallbackPayload !== null &&
          "error" in fallbackPayload &&
          typeof (fallbackPayload as { error?: { message?: unknown } }).error?.message === "string"
            ? (fallbackPayload as { error: { message: string } }).error.message
            : "Failed to generate AI response";

        return NextResponse.json({ message: fallbackMessage }, { status: fallbackResponse.status });
      }

      const fallbackOutput = extractOpenRouterText(fallbackPayload);
      if (!fallbackOutput) {
        return NextResponse.json(
          { message: "AI returned an empty response. Try a more specific prompt." },
          { status: 502 },
        );
      }

      return NextResponse.json({ output: fallbackOutput, mode, model: fallbackModel });
    }

    if (!primaryResponse.ok) {
      const message = primaryErrorMessage ?? "Failed to generate AI response";
      return NextResponse.json({ message }, { status: primaryResponse.status });
    }

    const output = extractOpenRouterText(primaryPayload);
    if (!output) {
      return NextResponse.json(
        { message: "AI returned an empty response. Try a more specific prompt." },
        { status: 502 },
      );
    }

    return NextResponse.json({ output, mode, model });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error while generating AI response",
      },
      { status: 500 },
    );
  }
}
