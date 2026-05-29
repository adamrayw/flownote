'use client';

import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Zap, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const recentNotes = [
  {
    id: 1,
    title: 'Project Ideas',
    excerpt: 'Brainstorm new features for FlowNote dashboard and mobile app...',
    date: 'Today',
    category: 'Work',
  },
  {
    id: 2,
    title: 'Meeting Notes',
    excerpt: 'Quick summary from the design sync meeting about upcoming improvements...',
    date: 'Yesterday',
    category: 'Meetings',
  },
  {
    id: 3,
    title: 'Personal Goals',
    excerpt: 'H2 objectives and milestones for personal development and learning...',
    date: '2 days ago',
    category: 'Personal',
  },
];

const quickActions = [
  { icon: Plus, label: 'New Note', color: 'bg-accent' },
  { icon: Sparkles, label: 'AI Assistant', color: 'bg-purple-500' },
  { icon: Clock, label: 'Recent', color: 'bg-blue-500' },
  { icon: Zap, label: 'Quick Capture', color: 'bg-amber-500' },
];

export default function DashboardPage() {
  const [newNoteOpen, setNewNoteOpen] = useState(false);

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Welcome Section */}
      <div className="mb-12">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome back, Jane
          </h1>
          <p className="text-foreground/60">
            You have 24 notes. Keep your thoughts flowing.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="group flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all"
              >
                <div className={`${action.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Notes Section */}
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

        {recentNotes.length > 0 ? (
          <div className="grid gap-4">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="group p-5 rounded-lg border border-border bg-card/50 hover:border-accent/30 hover:bg-card/80 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-sm text-foreground/60 mt-1">{note.excerpt}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium whitespace-nowrap ml-3">
                    {note.category}
                  </span>
                </div>
                <p className="text-xs text-foreground/50 mt-3">{note.date}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/60 mb-4">No notes yet. Start writing to get started!</p>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus size={16} className="mr-2" />
              Create Your First Note
            </Button>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        <div className="p-6 rounded-lg border border-border bg-card/30 backdrop-blur-sm">
          <p className="text-sm text-foreground/60 mb-1">Total Notes</p>
          <p className="text-3xl font-bold text-foreground">24</p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card/30 backdrop-blur-sm">
          <p className="text-sm text-foreground/60 mb-1">Favorites</p>
          <p className="text-3xl font-bold text-foreground">8</p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card/30 backdrop-blur-sm">
          <p className="text-sm text-foreground/60 mb-1">This Week</p>
          <p className="text-3xl font-bold text-foreground">12</p>
        </div>
      </div>
    </div>
  );
}
