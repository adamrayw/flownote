'use client';

import { Button } from '@/components/ui/button';
import { Tag, Plus, X } from 'lucide-react';

const tags = [
  { id: 1, name: 'Work', count: 8, color: 'bg-blue-500' },
  { id: 2, name: 'Personal', count: 6, color: 'bg-green-500' },
  { id: 3, name: 'Learning', count: 5, color: 'bg-purple-500' },
  { id: 4, name: 'Meetings', count: 4, color: 'bg-orange-500' },
  { id: 5, name: 'Design', count: 3, color: 'bg-pink-500' },
  { id: 6, name: 'Ideas', count: 7, color: 'bg-indigo-500' },
];

export default function TagsPage() {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-accent/10">
              <Tag className="text-accent" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Tags</h1>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus size={16} className="mr-2" />
            New Tag
          </Button>
        </div>
        <p className="text-foreground/60">Organize your notes with custom tags</p>
      </div>

      {/* Tags Grid */}
      {tags.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="group p-6 rounded-lg border border-border bg-card/50 hover:border-accent/30 hover:bg-card/80 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${tag.color} p-3 rounded-lg text-white`}>
                    <Tag size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {tag.name}
                    </h3>
                    <p className="text-sm text-foreground/60">{tag.count} notes</p>
                  </div>
                </div>
                <button className="p-1 rounded hover:bg-muted text-foreground/40 hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: Math.min(3, tag.count) }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-accent/50"></div>
                ))}
                {tag.count > 3 && (
                  <span className="text-xs text-foreground/50">+{tag.count - 3}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-block p-4 rounded-lg bg-accent/10 mb-4">
            <Tag size={32} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No tags yet</h3>
          <p className="text-foreground/60 mb-6">Create tags to organize your notes better</p>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus size={16} className="mr-2" />
            Create a Tag
          </Button>
        </div>
      )}
    </div>
  );
}
