'use client';

import { Button } from '@/components/ui/button';
import { Archive, Plus, RotateCcw } from 'lucide-react';

const archivedNotes = [
  {
    id: 7,
    title: 'Old Project Notes',
    excerpt: 'Archived project documentation from completed initiative...',
    date: '2 weeks ago',
    category: 'Archive',
  },
  {
    id: 8,
    title: 'Previous Quarter Review',
    excerpt: 'Review of goals and accomplishments from the previous quarter...',
    date: '1 month ago',
    category: 'Archive',
  },
];

export default function ArchivedPage() {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-accent/10">
            <Archive className="text-accent" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Archived</h1>
        </div>
        <p className="text-foreground/60">Notes you've archived are safely stored here</p>
      </div>

      {/* Notes List */}
      {archivedNotes.length > 0 ? (
        <div className="space-y-4">
          {archivedNotes.map((note) => (
            <div
              key={note.id}
              className="group p-6 rounded-lg border border-border bg-card/50 hover:border-accent/30 hover:bg-card/80 transition-all cursor-pointer opacity-75 hover:opacity-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-foreground/60 mt-2">{note.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-foreground/10 text-foreground/60 font-medium">
                      {note.category}
                    </span>
                    <span className="text-sm text-foreground/50">{note.date}</span>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground/40 hover:text-foreground flex-shrink-0 ml-4">
                  <RotateCcw size={18} title="Restore" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-block p-4 rounded-lg bg-accent/10 mb-4">
            <Archive size={32} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No archived notes</h3>
          <p className="text-foreground/60 mb-6">Archive old notes to keep your workspace clean</p>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus size={16} className="mr-2" />
            Create a Note
          </Button>
        </div>
      )}
    </div>
  );
}
