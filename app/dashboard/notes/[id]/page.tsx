'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Archive,
  ArrowLeft,
  CalendarDays,
  Clock3,
  Copy,
  Heart,
  ListChecks,
  Save,
  Sparkles,
  Tags,
  Trash2,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NoteMarkdown } from '@/components/note-markdown';

type Tag = {
  id: string;
  name: string;
  color: string | null;
};

type Note = {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
};

type TagSummary = {
  id: string;
  name: string;
};

type Mode = 'summary' | 'action-items' | 'rewrite' | 'smart-tags';

type AiResponse = {
  output: string;
  mode: Mode;
  model: string;
};

const modeItems: {
  id: Mode;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  {
    id: 'summary',
    label: 'Summarize',
    description: 'Create a concise overview with key takeaways.',
    icon: Sparkles,
  },
  {
    id: 'action-items',
    label: 'Action Items',
    description: 'Extract concrete next steps from this note.',
    icon: ListChecks,
  },
  {
    id: 'rewrite',
    label: 'Rewrite',
    description: 'Rewrite content to be clearer and more polished.',
    icon: Wand2,
  },
  {
    id: 'smart-tags',
    label: 'Smart Tags',
    description: 'Suggest useful tags based on note content.',
    icon: Tags,
  },
];

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

export default function NoteDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const noteId = typeof params.id === 'string' ? params.id : '';

  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingNote, setIsUpdatingNote] = useState(false);
  const [error, setError] = useState('');

  const [mode, setMode] = useState<Mode>('summary');
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiModel, setAiModel] = useState('');
  const [outputTitle, setOutputTitle] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [aiError, setAiError] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isSavingOutput, setIsSavingOutput] = useState(false);

  const activeMode = useMemo(() => modeItems.find((item) => item.id === mode), [mode]);
  const manualTags = useMemo(() => parseTagInput(tagInput), [tagInput]);
  const smartTagsPreview = useMemo(() => (mode === 'smart-tags' ? extractSmartTags(aiOutput) : []), [mode, aiOutput]);
  const selectedTags = useMemo(
    () => [...new Set([...manualTags, ...smartTagsPreview])].slice(0, 12),
    [manualTags, smartTagsPreview],
  );

  useEffect(() => {
    let active = true;

    const loadNote = async () => {
      if (!noteId) {
        if (active) {
          setError('Invalid note id');
          setIsLoading(false);
        }
        return;
      }

      try {
        setError('');
        setIsLoading(true);

        const response = await fetch(`/api/notes/${noteId}`, { cache: 'no-store' });
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as { message?: string } | null;
          throw new Error(data?.message ?? 'Failed to load note');
        }

        const data = (await response.json()) as { note: Note };
        if (!active) {
          return;
        }

        setNote(data.note);
        setAiInput('');
        setOutputTitle(`${data.note.title} - ${activeMode?.label ?? 'AI Output'}`);
        setTagInput(data.note.tags.map((tag) => formatTagDisplay(normalizeTagName(tag.name))).join(', '));
        setAiOutput('');
        setAiModel('');
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load note');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadNote();

    return () => {
      active = false;
    };
  }, [noteId]);

  const patchNote = async (payload: Partial<Pick<Note, 'isFavorite' | 'isArchived' | 'title' | 'content'>>) => {
    if (!noteId) return;

    setIsUpdatingNote(true);
    setError('');

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Failed to update note');
      }

      const data = (await response.json()) as { note: Note };
      setNote(data.note);
    } catch (patchError) {
      setError(patchError instanceof Error ? patchError.message : 'Failed to update note');
    } finally {
      setIsUpdatingNote(false);
    }
  };

  const handleDelete = async () => {
    if (!noteId) return;

    const confirmed = window.confirm('Delete this note? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setError('');
    setIsUpdatingNote(true);

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Failed to delete note');
      }

      router.push('/dashboard/notes');
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete note');
      setIsUpdatingNote(false);
    }
  };

  const handleGenerateAI = async () => {
    setAiError('');
    setAiMessage('');

    if (!aiInput.trim()) {
      setAiError('Add note content first.');
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
          input: aiInput,
        }),
      });

      const data = (await response.json().catch(() => null)) as AiResponse | { message?: string } | null;
      if (!response.ok) {
        throw new Error((data as { message?: string } | null)?.message ?? 'Failed to generate AI response');
      }

      const payload = data as AiResponse;
      setAiOutput(payload.output);
      setAiModel(payload.model);
    } catch (generateError) {
      setAiError(generateError instanceof Error ? generateError.message : 'Failed to generate AI response');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTags = async () => {
    setAiError('');
    setAiMessage('');

    if (!aiInput.trim()) {
      setAiError('Add note content first.');
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
          input: aiInput,
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
      setAiMessage(`Generated ${generatedTags.length} tag suggestions.`);
    } catch (generateError) {
      setAiError(generateError instanceof Error ? generateError.message : 'Failed to generate tags');
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

  const handleCopyOutput = async () => {
    if (!aiOutput.trim()) {
      setAiError('No AI output to copy yet.');
      return;
    }

    try {
      await navigator.clipboard.writeText(aiOutput);
      setAiMessage('AI output copied to clipboard.');
      setAiError('');
    } catch {
      setAiError('Failed to copy output.');
    }
  };

  const handleSaveOutputAsNote = async () => {
    if (!note) return;

    const trimmedOutput = aiOutput.trim();
    if (!trimmedOutput) {
      setAiError('Generate AI output first.');
      return;
    }

    const trimmedTitle = outputTitle.trim();
    if (!trimmedTitle) {
      setAiError('Note Title is required.');
      return;
    }

    setIsSavingOutput(true);
    setAiError('');
    setAiMessage('');

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
        throw new Error(data?.message ?? 'Failed to save AI output');
      }

      if (tagIds.length > 0) {
        setAiMessage(`Saved AI output as a new note with ${tagIds.length} tags.`);
      } else {
        setAiMessage('Saved AI output as a new note.');
      }
    } catch (saveError) {
      setAiError(saveError instanceof Error ? saveError.message : 'Failed to save AI output');
    } finally {
      setIsSavingOutput(false);
    }
  };

  if (isLoading) {
    return <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full text-foreground/60">Loading note...</div>;
  }

  if (error && !note) {
    return (
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <Link href="/dashboard/notes">
          <Button variant="outline">Back to Notes</Button>
        </Link>
      </div>
    );
  }

  if (!note) {
    return <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full text-foreground/60">Note not found.</div>;
  }

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link href="/dashboard/notes" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
            Back to notes
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{note.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => patchNote({ isFavorite: !note.isFavorite })}
            disabled={isUpdatingNote}
            className={note.isFavorite ? 'text-accent border-accent/40' : ''}
          >
            <Heart size={16} className={note.isFavorite ? 'fill-accent' : ''} />
            {note.isFavorite ? 'Favorited' : 'Favorite'}
          </Button>
          <Button
            variant="outline"
            onClick={() => patchNote({ isArchived: !note.isArchived })}
            disabled={isUpdatingNote}
          >
            <Archive size={16} />
            {note.isArchived ? 'Unarchive' : 'Archive'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isUpdatingNote}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card/60 p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 mb-4">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                Created {formatDate(note.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                Updated {formatDate(note.updatedAt)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {note.tags.length > 0 ? (
                note.tags.map((tag) => (
                  <span key={tag.id} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                    {tag.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-foreground/50">No tags yet.</span>
              )}
            </div>

            <div className="rounded-lg border border-border bg-background p-4 min-h-[300px]">
              <NoteMarkdown
                content={note.content || '_No content yet._'}
                className="text-foreground/80 leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/60 p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
            <p className="text-sm text-foreground/60 mt-1">
              Recommended for note details: summarize, action items, rewrite, and smart tags.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {modeItems.map((item) => {
              const Icon = item.icon;
              const isActive = mode === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMode(item.id);
                    setOutputTitle(note ? `${note.title} - ${item.label}` : '');
                    setAiError('');
                    setAiMessage('');
                  }}
                  className={`text-left rounded-lg border px-3 py-2 transition-colors ${
                    isActive
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-background text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Icon size={15} />
                    {item.label}
                  </div>
                  <p className="text-xs mt-1 leading-relaxed">{item.description}</p>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">AI Input</label>
            <textarea
              value={aiInput}
              onChange={(event) => setAiInput(event.target.value)}
              rows={8}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Add context for AI..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleGenerateAI}
              disabled={isGenerating}
            >
              <Sparkles size={16} className="mr-2" />
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setAiInput('')}
              disabled={isGenerating || isSavingOutput}
            >
              Clear Input
            </Button>
          </div>

          {aiError ? <p className="text-sm text-red-500">{aiError}</p> : null}
          {aiMessage ? <p className="text-sm text-emerald-600">{aiMessage}</p> : null}

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">AI Output</p>
            <p className="text-xs text-foreground/55">Model: {aiModel || '-'}</p>
            <pre className="whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm text-foreground/80 min-h-[180px] leading-relaxed">
              {aiOutput || 'AI output will appear here.'}
            </pre>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Note Title</label>
            <input
              type="text"
              value={outputTitle}
              onChange={(event) => setOutputTitle(event.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Title for the new note"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tags</label>
            <input
              type="text"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="meeting-notes, personal, ideas"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateTags}
                disabled={isGenerating || isGeneratingTags || isSavingOutput}
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

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCopyOutput}
              disabled={!aiOutput.trim() || isSavingOutput}
            >
              <Copy size={16} className="mr-2" />
              Copy Output
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveOutputAsNote}
              disabled={!aiOutput.trim() || isSavingOutput || isGenerating || isGeneratingTags}
            >
              <Save size={16} className="mr-2" />
              {isSavingOutput ? 'Saving...' : 'Save as New Note'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
