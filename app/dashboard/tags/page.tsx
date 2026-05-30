'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tag as TagIcon, Plus, Trash2 } from 'lucide-react';

type TagItem = {
  id: string;
  name: string;
  color: string | null;
  count: number;
};

const defaultColors = ['#2563eb', '#16a34a', '#f97316', '#7c3aed', '#db2777', '#0d9488'];

function colorForTag(tag: TagItem, index: number) {
  return tag.color || defaultColors[index % defaultColors.length];
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState(defaultColors[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadTags = async () => {
    const response = await fetch('/api/tags', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to load tags');
    }

    const data = (await response.json()) as { tags: TagItem[] };
    setTags(data.tags);
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        setError('');
        setIsLoading(true);
        await loadTags();
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load tags');
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

  const handleCreateTag = async () => {
    if (!name.trim()) {
      setError('Tag name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          color,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Failed to create tag');
      }

      setName('');
      await loadTags();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    const confirmed = window.confirm('Delete this tag? It will be removed from all notes.');
    if (!confirmed) {
      return;
    }

    setError('');

    try {
      const response = await fetch(`/api/tags/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Failed to delete tag');
      }

      await loadTags();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete tag');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-accent/10">
            <TagIcon className="text-accent" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Tags</h1>
        </div>
        <p className="text-foreground/60">Create and manage tags used by your notes.</p>
      </div>

      <div className="mb-6 p-5 rounded-lg border border-border bg-card/60">
        <p className="text-sm font-medium text-foreground mb-3">Create Tag</p>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tag name"
            className="flex-1 px-3 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
          />

          <div className="flex items-center gap-2">
            {defaultColors.map((colorValue) => (
              <button
                key={colorValue}
                type="button"
                onClick={() => setColor(colorValue)}
                aria-label={`Choose ${colorValue}`}
                className={`w-7 h-7 rounded-full border-2 ${color === colorValue ? 'border-foreground' : 'border-transparent'}`}
                style={{ backgroundColor: colorValue }}
              />
            ))}
          </div>

          <Button
            onClick={handleCreateTag}
            disabled={isSubmitting}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Plus size={16} className="mr-2" />
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-500 mb-4">{error}</p> : null}

      {isLoading ? (
        <p className="text-foreground/60">Loading tags...</p>
      ) : tags.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-border rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-1">No tags yet</h3>
          <p className="text-foreground/60">Create your first tag to organize notes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag, index) => (
            <article key={tag.id} className="p-5 rounded-lg border border-border bg-card/50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="p-3 rounded-lg text-white"
                    style={{ backgroundColor: colorForTag(tag, index) }}
                  >
                    <TagIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{tag.name}</h3>
                    <p className="text-sm text-foreground/60">{tag.count} notes</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="p-1.5 rounded hover:bg-destructive/10 text-foreground/60 hover:text-destructive"
                  aria-label="Delete tag"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
