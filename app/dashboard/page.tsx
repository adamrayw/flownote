'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Plus, Tag, FileText, ArrowRight, Heart, Archive, Sparkles } from 'lucide-react';
import { NoteMarkdown } from '@/components/note-markdown';

type TagItem = {
  id: string;
  name: string;
  color: string | null;
};

type NoteItem = {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  tags: TagItem[];
};

type TagSummary = {
  id: string;
  name: string;
  color: string | null;
  count: number;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getUserFirstName(name?: string | null) {
  if (!name?.trim()) {
    return 'there';
  }

  return name.trim().split(' ')[0] ?? 'there';
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [tags, setTags] = useState<TagSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        setError('');
        setIsLoading(true);

        const [notesResponse, archivedResponse, tagsResponse] = await Promise.all([
          fetch('/api/notes', { cache: 'no-store' }),
          fetch('/api/notes?archived=true', { cache: 'no-store' }),
          fetch('/api/tags', { cache: 'no-store' }),
        ]);

        if (!notesResponse.ok || !archivedResponse.ok || !tagsResponse.ok) {
          throw new Error('Failed to load dashboard data');
        }

        const notesData = (await notesResponse.json()) as { notes: NoteItem[] };
        const archivedData = (await archivedResponse.json()) as { notes: NoteItem[] };
        const tagsData = (await tagsResponse.json()) as { tags: TagSummary[] };

        if (!active) {
          return;
        }

        setNotes(notesData.notes);
        setArchivedCount(archivedData.notes.length);
        setTags(tagsData.tags);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard data');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  const recentNotes = useMemo(() => notes.slice(0, 5), [notes]);

  const thisWeekNotesCount = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return notes.filter((note) => new Date(note.updatedAt).getTime() >= sevenDaysAgo).length;
  }, [notes]);

  const favoritesCount = useMemo(() => notes.filter((note) => note.isFavorite).length, [notes]);

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back, {getUserFirstName(session?.user?.name)}</h1>
          <p className="text-foreground/60">
            {isLoading ? 'Loading your notes...' : `You have ${notes.length} notes and ${tags.length} tags.`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3 mb-8">
          <Link href="/dashboard/notes" className="group p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-accent text-white group-hover:scale-105 transition-transform">
                <Plus size={18} />
              </div>
              <div>
                <p className="font-medium text-foreground">Create Note</p>
                <p className="text-sm text-foreground/60">Open notes editor</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/notes" className="group p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500 text-white group-hover:scale-105 transition-transform">
                <FileText size={18} />
              </div>
              <div>
                <p className="font-medium text-foreground">All Notes</p>
                <p className="text-sm text-foreground/60">Browse and search notes</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/tags" className="group p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-emerald-500 text-white group-hover:scale-105 transition-transform">
                <Tag size={18} />
              </div>
              <div>
                <p className="font-medium text-foreground">Manage Tags</p>
                <p className="text-sm text-foreground/60">Create and clean up tags</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/favorites" className="group p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-rose-500 text-white group-hover:scale-105 transition-transform">
                <Heart size={18} />
              </div>
              <div>
                <p className="font-medium text-foreground">Favorites</p>
                <p className="text-sm text-foreground/60">Important saved notes</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/archived" className="group p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-amber-500 text-white group-hover:scale-105 transition-transform">
                <Archive size={18} />
              </div>
              <div>
                <p className="font-medium text-foreground">Archived</p>
                <p className="text-sm text-foreground/60">Restore old notes</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/ai" className="group p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-violet-500 text-white group-hover:scale-105 transition-transform">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="font-medium text-foreground">AI Assistant</p>
                <p className="text-sm text-foreground/60">Summarize and rewrite notes</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recent Notes</h2>
          <Link href="/dashboard/notes">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        {isLoading ? (
          <p className="text-foreground/60">Loading notes...</p>
        ) : recentNotes.length > 0 ? (
          <div className="grid gap-4">
            {recentNotes.map((note) => (
              <Link
                key={note.id}
                href="/dashboard/notes"
                className="group p-5 rounded-lg border border-border bg-card/50 hover:border-accent/30 hover:bg-card/80 transition-all"
              >
                <div className="flex items-start justify-between mb-2 gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">{note.title}</h3>
                    <NoteMarkdown
                      content={note.content || 'No content yet.'}
                      className="text-sm text-foreground/60 mt-1 max-h-16 overflow-hidden"
                    />
                  </div>
                  {note.tags[0] ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium whitespace-nowrap ml-3">
                      {note.tags[0].name}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-foreground/50 mt-3">Updated {formatDate(note.updatedAt)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/60 mb-4">No notes yet. Start writing to get started.</p>
            <Link href="/dashboard/notes">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus size={16} className="mr-2" />
                Create Your First Note
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
        <div className="p-6 rounded-lg border border-border bg-card/30 backdrop-blur-sm">
          <p className="text-sm text-foreground/60 mb-1">Total Notes</p>
          <p className="text-3xl font-bold text-foreground">{isLoading ? '...' : notes.length}</p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card/30 backdrop-blur-sm">
          <p className="text-sm text-foreground/60 mb-1">Favorites</p>
          <p className="text-3xl font-bold text-foreground">{isLoading ? '...' : favoritesCount}</p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card/30 backdrop-blur-sm">
          <p className="text-sm text-foreground/60 mb-1">Archived</p>
          <p className="text-3xl font-bold text-foreground">{isLoading ? '...' : archivedCount}</p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card/30 backdrop-blur-sm">
          <p className="text-sm text-foreground/60 mb-1">Updated This Week</p>
          <p className="text-3xl font-bold text-foreground">{isLoading ? '...' : thisWeekNotesCount}</p>
        </div>
      </div>
    </div>
  );
}
