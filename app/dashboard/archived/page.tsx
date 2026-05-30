'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Archive, Plus, RotateCcw, Search, Trash2, ArrowRight } from 'lucide-react';
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

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ArchivedPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadArchivedNotes = async (query: string) => {
    const params = new URLSearchParams();
    params.set('archived', 'true');
    if (query.trim()) {
      params.set('q', query.trim());
    }

    const response = await fetch(`/api/notes?${params.toString()}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to load archived notes');
    }

    const data = (await response.json()) as { notes: Note[] };
    setNotes(data.notes);
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        setError('');
        setIsLoading(true);
        await loadArchivedNotes(searchQuery);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load archived notes');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    const timeout = setTimeout(run, 250);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  const handleRestoreNote = async (note: Note) => {
    setError('');

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isArchived: false,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Failed to restore note');
      }

      await loadArchivedNotes(searchQuery);
    } catch (restoreError) {
      setError(restoreError instanceof Error ? restoreError.message : 'Failed to restore note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const confirmed = window.confirm('Delete this archived note permanently? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setError('');

    try {
      const response = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Failed to delete note');
      }

      await loadArchivedNotes(searchQuery);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete note');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-accent/10">
            <Archive className="text-accent" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Archived</h1>
        </div>
        <p className="text-foreground/60">Archived notes are stored here. Restore anytime.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Search archived notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <Link href="/dashboard/notes">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus size={16} className="mr-2" />
            New Note
          </Button>
        </Link>
      </div>

      {error ? <p className="text-sm text-red-500 mb-4">{error}</p> : null}

      {isLoading ? (
        <p className="text-foreground/60">Loading archived notes...</p>
      ) : notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <article
              key={note.id}
              className="group p-6 rounded-lg border border-border bg-card/50 hover:border-accent/30 hover:bg-card/80 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors truncate">
                    {note.title}
                  </h3>

                  <NoteMarkdown
                    content={note.content || 'No content yet.'}
                    className="text-foreground/70 mt-2 max-h-24 overflow-hidden"
                  />

                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {note.tags.map((tag) => (
                      <span key={tag.id} className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                        {tag.name}
                      </span>
                    ))}
                    <span className="text-xs text-foreground/50">Updated {formatDate(note.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    className="p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
                    onClick={() => handleRestoreNote(note)}
                    aria-label="Restore note"
                    title="Restore note"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    className="p-2 rounded-lg text-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={() => handleDeleteNote(note.id)}
                    aria-label="Delete note"
                    title="Delete note permanently"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <div className="inline-block p-4 rounded-lg bg-accent/10 mb-4">
            <Archive size={32} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No archived notes</h3>
          <p className="text-foreground/60 mb-6">Archive notes from the Notes page to keep your workspace clean.</p>
          <Link href="/dashboard/notes">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Go to Notes
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
