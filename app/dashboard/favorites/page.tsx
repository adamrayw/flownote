'use client';

import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Plus } from 'lucide-react';

const favoriteNotes = [
  {
    id: 1,
    title: 'Project Ideas',
    excerpt: 'Brainstorm new features for FlowNote dashboard and mobile app...',
    date: 'Today',
    category: 'Work',
  },
  {
    id: 3,
    title: 'Personal Goals',
    excerpt: 'H2 objectives and milestones for personal development and learning...',
    date: '2 days ago',
    category: 'Personal',
  },
  {
    id: 5,
    title: 'Design System',
    excerpt: 'Color palette, typography, and component spacing guidelines for brand consistency...',
    date: '1 week ago',
    category: 'Design',
  },
];

export default function FavoritesPage() {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-accent/10">
            <Heart className="text-accent fill-accent" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Favorites</h1>
        </div>
        <p className="text-foreground/60">Your most important notes at a glance</p>
      </div>

      {/* Notes List */}
      {favoriteNotes.length > 0 ? (
        <div className="space-y-4">
          {favoriteNotes.map((note) => (
            <div
              key={note.id}
              className="group p-6 rounded-lg border border-border bg-card/50 hover:border-accent/30 hover:bg-card/80 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-foreground/60 mt-2">{note.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      {note.category}
                    </span>
                    <span className="text-sm text-foreground/50">{note.date}</span>
                  </div>
                </div>
                <Heart className="text-accent fill-accent flex-shrink-0 ml-4" size={20} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-block p-4 rounded-lg bg-accent/10 mb-4">
            <Heart size={32} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No favorites yet</h3>
          <p className="text-foreground/60 mb-6">Mark important notes as favorites to access them quickly</p>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus size={16} className="mr-2" />
            Create a Note
          </Button>
        </div>
      )}
    </div>
  );
}
