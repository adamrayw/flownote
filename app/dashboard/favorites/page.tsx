'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Search, ArrowRight } from 'lucide-react';
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

export default function FavoritesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavorites = async (query: string) => {
    const params = new URLSearchParams();
    params.set('favorite', 'true');
    if (query.trim()) {
      params.set('q', query.trim());
    }

    const response = await fetch(`/api/notes?${params.toString()}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to load favorite notes');
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
        await loadFavorites(searchQuery);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load favorite notes');
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

  const handleToggleFavorite = async (note: Note) => {
    setError('');

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFavorite: !note.isFavorite,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Failed to update favorite state');
      }

      await loadFavorites(searchQuery);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Failed to update favorite state');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-accent/10">
            <Heart className="text-accent fill-accent" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Favorites</h1>
        </div>
        <p className="text-foreground/60">Your most important notes at a glance.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Search favorite notes..."
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
        <p className="text-foreground/60">Loading favorites...</p>
      ) : notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <article
              key={note.id}
              className="group p-6 rounded-lg border border-border bg-card/50 hover:border-accent/30 hover:bg-card/80 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/dashboard/notes/${note.id}`}>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors truncate">
                      {note.title}
                    </h3>
                  </Link>

                  <Link href={`/dashboard/notes/${note.id}`}>
                    <NoteMarkdown
                      content={note.content || 'No content yet.'}
                      className="text-foreground/70 mt-2 max-h-24 overflow-hidden hover:text-foreground/85 transition-colors"
                    />
                  </Link>

                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {note.tags.map((tag) => (
                      <span key={tag.id} className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                        {tag.name}
                      </span>
                    ))}
                    <span className="text-xs text-foreground/50">Updated {formatDate(note.updatedAt)}</span>
                  </div>
                </div>

                <button
                  className="p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors"
                  onClick={() => handleToggleFavorite(note)}
                  aria-label="Remove from favorites"
                  title="Remove from favorites"
                >
                  <Heart className="fill-accent" size={20} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <div className="inline-block p-4 rounded-lg bg-accent/10 mb-4">
            <Heart size={32} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No favorites yet</h3>
          <p className="text-foreground/60 mb-6">Mark important notes as favorites to access them quickly.</p>
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
