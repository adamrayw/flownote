'use client';

import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, MoreVertical, Trash2, Share2, Copy } from 'lucide-react';
import { useState } from 'react';

const allNotes = [
  {
    id: 1,
    title: 'Project Ideas',
    excerpt: 'Brainstorm new features for FlowNote dashboard and mobile app...',
    date: 'Today',
    category: 'Work',
    isFavorite: true,
  },
  {
    id: 2,
    title: 'Meeting Notes',
    excerpt: 'Quick summary from the design sync meeting about upcoming improvements...',
    date: 'Yesterday',
    category: 'Meetings',
    isFavorite: false,
  },
  {
    id: 3,
    title: 'Personal Goals',
    excerpt: 'H2 objectives and milestones for personal development and learning...',
    date: '2 days ago',
    category: 'Personal',
    isFavorite: true,
  },
  {
    id: 4,
    title: 'React Patterns',
    excerpt: 'Notes on advanced React hooks and performance optimization techniques...',
    date: '3 days ago',
    category: 'Learning',
    isFavorite: false,
  },
  {
    id: 5,
    title: 'Design System',
    excerpt: 'Color palette, typography, and component spacing guidelines for brand consistency...',
    date: '1 week ago',
    category: 'Design',
    isFavorite: true,
  },
  {
    id: 6,
    title: 'Grocery List',
    excerpt: 'Weekly groceries and supplies needed for meal prep and cooking...',
    date: '1 week ago',
    category: 'Personal',
    isFavorite: false,
  },
];

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [showNoteMenu, setShowNoteMenu] = useState<number | null>(null);

  const filteredNotes = allNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">All Notes</h1>
        <p className="text-foreground/60">Manage and organize all your notes in one place</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus size={18} className="mr-2" />
          New Note
        </Button>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group relative p-5 rounded-lg border border-border bg-card/50 hover:border-accent/30 hover:bg-card/80 transition-all cursor-pointer"
              onClick={() => setSelectedNote(note.id)}
            >
              {/* Note Content */}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                  {note.title}
                </h3>
                <p className="text-sm text-foreground/60 mt-2 line-clamp-2">{note.excerpt}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                    {note.category}
                  </span>
                </div>
                <button
                  className="relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNoteMenu(showNoteMenu === note.id ? null : note.id);
                  }}
                >
                  <MoreVertical size={16} className="text-foreground/40 hover:text-foreground" />
                  {showNoteMenu === note.id && (
                    <div className="absolute right-0 mt-2 w-40 rounded-lg bg-card border border-border shadow-lg py-1 z-10">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted">
                        <Copy size={14} />
                        Duplicate
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted">
                        <Share2 size={14} />
                        Share
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 border-t border-border">
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </button>
              </div>

              {/* Date */}
              <p className="text-xs text-foreground/50 mt-3">{note.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-block p-4 rounded-lg bg-accent/10 mb-4">
            <Search size={32} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No notes found</h3>
          <p className="text-foreground/60 mb-6">Try searching with different keywords</p>
          <Button variant="outline">Clear Search</Button>
        </div>
      )}
    </div>
  );
}
