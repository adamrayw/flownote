'use client';

import { useMemo, useState } from 'react';
import { Sparkles, Wand2, ListChecks, Tags, MessageSquareQuote, Lightbulb, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NoteMarkdown } from '@/components/note-markdown';

type Mode = 'summary' | 'action-items' | 'rewrite' | 'smart-tags' | 'ask-notes';

type AiResponse = {
  output: string;
  mode: Mode;
  model: string;
};

type TagSummary = {
  id: string;
  name: string;
};

const modeItems: { id: Mode; label: string; description: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  {
    id: 'summary',
    label: 'Summarize',
    description: 'Turn long notes into concise takeaways.',
    icon: Sparkles,
  },
  {
    id: 'action-items',
    label: 'Action Items',
    description: 'Extract clear to-dos from meeting notes.',
    icon: ListChecks,
  },
  {
    id: 'rewrite',
    label: 'Rewrite',
    description: 'Polish draft text for clarity and tone.',
    icon: Wand2,
  },
  {
    id: 'smart-tags',
    label: 'Smart Tags',
    description: 'Suggest tags automatically from content.',
    icon: Tags,
  },
  {
    id: 'ask-notes',
    label: 'Ask Notes',
    description: 'Answer questions using all notes in your account.',
    icon: MessageSquareQuote,
  },
];

function getDefaultTitle(mode: Mode) {
  const date = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (mode === 'summary') return `AI Summary - ${date}`;
  if (mode === 'action-items') return `AI Action Items - ${date}`;
  if (mode === 'rewrite') return `AI Rewrite - ${date}`;
  if (mode === 'smart-tags') return `AI Smart Tags - ${date}`;
  return `AI Notes Answer - ${date}`;
}

function normalizeTagName(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^#/, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractSmartTags(output: string) {
  const fromBullets = output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => normalizeTagName(line.slice(2)));

  return [...new Set(fromBullets)].filter((name) => name.length > 0 && name.length <= 30).slice(0, 3);
}

function parseTagInput(raw: string) {
  return [...new Set(
    raw
      .split(/[\n,]/)
      .map((value) => normalizeTagName(value))
      .filter((name) => name.length > 0 && name.length <= 30),
  )].slice(0, 12);
}

function formatTagDisplay(raw: string) {
  return raw
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function AIDashboardPage() {
  const [mode, setMode] = useState<Mode>('summary');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('AI output will appear here after you run a prompt.');
  const [usedModel, setUsedModel] = useState('');
  const [noteTitle, setNoteTitle] = useState(getDefaultTitle('summary'));
  const [tagInput, setTagInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const activeMode = useMemo(() => modeItems.find((item) => item.id === mode), [mode]);
  const manualTags = useMemo(() => parseTagInput(tagInput), [tagInput]);
  const smartTagsPreview = useMemo(() => (mode === 'smart-tags' ? extractSmartTags(outputText) : []), [mode, outputText]);
  const selectedTags = useMemo(
    () => [...new Set([...manualTags, ...smartTagsPreview])].slice(0, 12),
    [manualTags, smartTagsPreview],
  );
  const inputPlaceholder = mode === 'ask-notes'
    ? 'Ask a question. AI will read all your saved notes as context...'
    : 'Paste note content or type context here...';

  const handleSwitchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setNoteTitle(getDefaultTitle(nextMode));
    setSaveMessage('');
    setError('');
  };

  const handleGenerateAI = async () => {
    setError('');
    setSaveMessage('');

    if (!inputText.trim()) {
      setError('Please add note content or context first.');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          input: inputText,
        }),
      });

      const data = (await response.json().catch(() => null)) as AiResponse | { message?: string } | null;
      if (!response.ok) {
        throw new Error((data as { message?: string } | null)?.message ?? 'Failed to generate AI output');
      }

      const payload = data as AiResponse;
      setOutputText(payload.output);
      setUsedModel(payload.model);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : 'Failed to generate AI output');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTags = async () => {
    setError('');
    setSaveMessage('');

    if (!inputText.trim()) {
      setError('Please add note content or context first.');
      return;
    }

    setIsGeneratingTags(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'smart-tags',
          input: inputText,
        }),
      });

      const data = (await response.json().catch(() => null)) as AiResponse | { message?: string } | null;
      if (!response.ok) {
        throw new Error((data as { message?: string } | null)?.message ?? 'Failed to generate tags');
      }

      const payload = data as AiResponse;
      const generatedTags = extractSmartTags(payload.output);
      if (generatedTags.length === 0) {
        throw new Error('AI did not return usable tags. Try adding more context.');
      }

      const merged = [...new Set([...manualTags, ...generatedTags])].slice(0, 12);
      setTagInput(merged.map((tag) => formatTagDisplay(tag)).join(', '));
      setSaveMessage(`Generated ${generatedTags.length} tag suggestions.`);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : 'Failed to generate tags');
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const ensureTags = async (tagNames: string[]) => {
    if (tagNames.length === 0) {
      return [] as string[];
    }

    const existingResponse = await fetch('/api/tags', { cache: 'no-store' });
    if (!existingResponse.ok) {
      throw new Error('Failed to load tags before saving note');
    }

    const existingData = (await existingResponse.json()) as { tags: TagSummary[] };
    const byCanonicalName = new Map(
      existingData.tags.map((tag) => [normalizeTagName(tag.name), tag.id]),
    );

    for (const tagName of tagNames) {
      const canonicalTagName = normalizeTagName(tagName);
      if (!canonicalTagName) {
        continue;
      }

      if (byCanonicalName.has(canonicalTagName)) {
        continue;
      }

      const createResponse = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formatTagDisplay(canonicalTagName) }),
      });

      if (createResponse.status === 409) {
        continue;
      }

      if (!createResponse.ok) {
        const data = (await createResponse.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? `Failed to create tag: ${tagName}`);
      }
    }

    const refreshedResponse = await fetch('/api/tags', { cache: 'no-store' });
    if (!refreshedResponse.ok) {
      throw new Error('Failed to reload tags after creating smart tags');
    }

    const refreshedData = (await refreshedResponse.json()) as { tags: TagSummary[] };
    const refreshedMap = new Map(
      refreshedData.tags.map((tag) => [normalizeTagName(tag.name), tag.id]),
    );

    return tagNames
      .map((name) => refreshedMap.get(normalizeTagName(name)))
      .filter((id): id is string => typeof id === 'string');
  };

  const handleSaveAsNote = async () => {
    setError('');
    setSaveMessage('');

    const trimmedOutput = outputText.trim();
    if (!trimmedOutput || trimmedOutput === 'AI output will appear here after you run a prompt.') {
      setError('Generate AI output first before saving.');
      return;
    }

    const trimmedTitle = noteTitle.trim();
    if (!trimmedTitle) {
      setError('Please provide a note title.');
      return;
    }

    setIsSavingNote(true);

    try {
      const tagIds = await ensureTags(selectedTags);

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: trimmedTitle,
          content: trimmedOutput,
          tagIds,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Failed to save AI output as note');
      }

      if (tagIds.length > 0) {
        setSaveMessage(`Saved as note with ${tagIds.length} tags.`);
      } else {
        setSaveMessage('Saved as note successfully.');
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save note');
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-accent/10">
            <Sparkles className="text-accent" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AI Workspace</h1>
        </div>
        <p className="text-foreground/60">Run AI-assisted note tasks powered by OpenRouter.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {modeItems.map((item) => {
          const Icon = item.icon;
          const isActive = mode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSwitchMode(item.id)}
              className={`text-left p-4 rounded-lg border transition-colors ${
                isActive
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-card/50 text-foreground/70 hover:border-accent/30 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} />
                <p className="font-semibold">{item.label}</p>
              </div>
              <p className="text-sm leading-relaxed">{item.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card/60 p-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Input</p>
            <p className="text-xs text-foreground/55 mt-1">
              Mode: <span className="font-medium text-foreground/75">{activeMode?.label}</span>
            </p>
          </div>

          <textarea
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            rows={14}
            placeholder={inputPlaceholder}
            className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
          />

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {saveMessage ? <p className="text-sm text-emerald-600">{saveMessage}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleGenerateAI}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </Button>
            <Button variant="outline" onClick={() => setInputText('')} disabled={isGenerating || isSavingNote}>
              Clear Input
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/60 p-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Output</p>
            <p className="text-xs text-foreground/55 mt-1">
              Model: <span className="font-medium text-foreground/75">{usedModel || '-'}</span>
            </p>
          </div>

          <div className="text-sm text-foreground/80 bg-background border border-border rounded-lg p-3 min-h-[260px] leading-relaxed overflow-auto">
            <NoteMarkdown
              content={outputText}
              className="text-foreground/85"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Note Title</label>
            <input
              type="text"
              value={noteTitle}
              onChange={(event) => setNoteTitle(event.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Title for saved note"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Tags</label>
            <input
              type="text"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="design-system, meeting-notes, roadmap"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateTags}
                disabled={isGenerating || isGeneratingTags || isSavingNote}
              >
                <Tags size={16} className="mr-2" />
                {isGeneratingTags ? 'Generating Tags...' : 'Generate AI Tags'}
              </Button>
              {selectedTags.length > 0 ? (
                <p className="text-xs text-foreground/60">
                  {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected
                </p>
              ) : null}
            </div>
          </div>

          {mode === 'smart-tags' ? (
            <div className="rounded-md border border-border bg-background px-3 py-2">
              <p className="text-xs text-foreground/60 mb-1">Detected smart tags:</p>
              {smartTagsPreview.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {smartTagsPreview.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
                      {formatTagDisplay(tag)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-foreground/50">No tag bullets detected yet from AI output.</p>
              )}
            </div>
          ) : null}

          <Button
            className="bg-accent hover:bg-accent/90 text-accent-foreground w-full"
            onClick={handleSaveAsNote}
            disabled={isGenerating || isGeneratingTags || isSavingNote}
          >
            <Save size={16} className="mr-2" />
            {isSavingNote ? 'Saving Note...' : 'Save Output as Note'}
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-background p-4">
        <div className="flex items-center gap-2 mb-2 text-foreground">
          <Lightbulb size={16} className="text-accent" />
          <p className="font-semibold">Best first AI features for FlowNote</p>
        </div>
        <p className="text-sm text-foreground/70">
          Highest-impact starting points: <span className="font-medium">Summarize</span>,
          <span className="font-medium"> Action Items</span>, and
          <span className="font-medium"> Smart Tags</span>. They deliver immediate value with simple UX and low implementation risk.
        </p>
      </div>
    </div>
  );
}
