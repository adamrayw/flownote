'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Search, Pencil, Trash2, X, Heart, Archive } from 'lucide-react';
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

function NotesPageContent() {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<TagSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q')?.trim() ?? '');
  const [selectedTagId, setSelectedTagId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });

  const selectedTagSet = useMemo(() => new Set(selectedTagIds), [selectedTagIds]);

  useEffect(() => {
    const queryFromUrl = searchParams.get('q')?.trim() ?? '';
    setSearchQuery((prev) => (prev === queryFromUrl ? prev : queryFromUrl));
  }, [searchParams]);

  const loadTags = async () => {
    const response = await fetch('/api/tags', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to load tags');
    }
    const data = (await response.json()) as { tags: TagSummary[] };
    setTags(data.tags);
  };

  const loadNotes = async (query: string, tagId: string) => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    if (tagId) {
      params.set('tagId', tagId);
    }

    const response = await fetch(`/api/notes?${params.toString()}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to load notes');
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
        await Promise.all([loadTags(), loadNotes(searchQuery, selectedTagId)]);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load data');
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
  }, [searchQuery, selectedTagId]);

  const resetEditor = () => {
    setEditingNoteId(null);
    setTitle('');
    setContent('');
    setSelectedTagIds([]);
  };

  const openCreateEditor = () => {
    resetEditor();
    setIsEditorOpen(true);
  };

  const openEditEditor = (note: Note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSelectedTagIds(note.tags.map((tag) => tag.id));
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    resetEditor();
  };

  const toggleTagSelection = (tagId: string) => {
    setSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      }
      return [...prev, tagId];
    });
  };

  const syncSelectionRange = () => {
    const textarea = contentRef.current;
    if (!textarea) {
      return;
    }

    setSelectionRange({
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    });
  };

  const updateContentWithSelection = (newValue: string, selectionStart: number, selectionEnd: number) => {
    setContent(newValue);
    setSelectionRange({ start: selectionStart, end: selectionEnd });
    requestAnimationFrame(() => {
      const textarea = contentRef.current;
      if (!textarea) {
        return;
      }

      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const toggleBoldSelection = () => {
    const textarea = contentRef.current;
    if (!textarea) {
      return;
    }

    const isWordChar = (char: string) => /[A-Za-z0-9_]/.test(char);
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      let left = start;
      let right = end;

      while (left > 0 && isWordChar(content[left - 1] ?? '')) {
        left -= 1;
      }
      while (right < content.length && isWordChar(content[right] ?? '')) {
        right += 1;
      }

      if (left < right) {
        const selectedWord = content.slice(left, right);
        const beforeWord = content.slice(Math.max(0, left - 2), left);
        const afterWord = content.slice(right, right + 2);

        if (beforeWord === '**' && afterWord === '**') {
          const newValue = `${content.slice(0, left - 2)}${selectedWord}${content.slice(right + 2)}`;
          updateContentWithSelection(newValue, left - 2, right - 2);
          return;
        }

        const replacement = `**${selectedWord}**`;
        const newValue = `${content.slice(0, left)}${replacement}${content.slice(right)}`;
        updateContentWithSelection(newValue, left + 2, right + 2);
        return;
      }

      const insertion = '****';
      const newValue = `${content.slice(0, start)}${insertion}${content.slice(end)}`;
      updateContentWithSelection(newValue, start + 2, start + 2);
      return;
    }

    const selected = content.slice(start, end);
    if (selected.startsWith('**') && selected.endsWith('**') && selected.length >= 4) {
      const unwrapped = selected.slice(2, -2);
      const newValue = `${content.slice(0, start)}${unwrapped}${content.slice(end)}`;
      updateContentWithSelection(newValue, start, start + unwrapped.length);
      return;
    }

    const before = content.slice(Math.max(0, start - 2), start);
    const after = content.slice(end, end + 2);
    if (before === '**' && after === '**') {
      const newValue = `${content.slice(0, start - 2)}${selected}${content.slice(end + 2)}`;
      updateContentWithSelection(newValue, start - 2, start - 2 + selected.length);
      return;
    }

    const replacement = `**${selected}**`;
    const newValue = `${content.slice(0, start)}${replacement}${content.slice(end)}`;
    updateContentWithSelection(newValue, start + 2, start + 2 + selected.length);
  };

  const isPrefixActive = (prefix: string) => {
    const getLinePrefixKind = (line: string): 'h1' | 'h2' | 'bullet' | 'numbered' | null => {
      if (/^\d+\.\s/.test(line)) {
        return 'numbered';
      }
      if (line.startsWith('## ')) {
        return 'h2';
      }
      if (line.startsWith('# ')) {
        return 'h1';
      }
      if (line.startsWith('- ')) {
        return 'bullet';
      }
      return null;
    };

    const kindFromPrefix = (value: string): 'h1' | 'h2' | 'bullet' | 'numbered' | null => {
      if (value === '# ') return 'h1';
      if (value === '## ') return 'h2';
      if (value === '- ') return 'bullet';
      if (value === '1. ') return 'numbered';
      return null;
    };

    const targetKind = kindFromPrefix(prefix);
    if (!targetKind) {
      return false;
    }

    const start = selectionRange.start;
    const end = selectionRange.end;
    const lineStart = content.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    let lineEnd = content.indexOf('\n', end);
    if (lineEnd === -1) {
      lineEnd = content.length;
    }

    const lines = content
      .slice(lineStart, lineEnd)
      .split('\n')
      .filter((line) => line.trim().length > 0);

    if (lines.length === 0) {
      return false;
    }

    return lines.every((line) => getLinePrefixKind(line) === targetKind);
  };

  const isBoldActive = () => {
    const start = selectionRange.start;
    const end = selectionRange.end;
    const selected = content.slice(start, end);

    if (start !== end && selected.startsWith('**') && selected.endsWith('**') && selected.length >= 4) {
      return true;
    }

    const before = content.slice(Math.max(0, start - 2), start);
    const after = content.slice(end, end + 2);
    return before === '**' && after === '**';
  };

  const isNumberedPrefixActive = () => {
    const start = selectionRange.start;
    const end = selectionRange.end;
    const lineStart = content.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    let lineEnd = content.indexOf('\n', end);
    if (lineEnd === -1) {
      lineEnd = content.length;
    }

    const lines = content
      .slice(lineStart, lineEnd)
      .split('\n')
      .filter((line) => line.trim().length > 0);

    if (lines.length === 0) {
      return false;
    }

    return lines.every((line) => /^\d+\.\s/.test(line));
  };

  const isH1Active = isPrefixActive('# ');
  const isH2Active = isPrefixActive('## ');
  const isBulletActive = isPrefixActive('- ');
  const isNumberedActive = isNumberedPrefixActive();
  const isBoldNow = isBoldActive();

  const toolbarButtonClass = (active: boolean) =>
    active ? 'h-8 px-3 bg-accent text-accent-foreground border-accent hover:bg-accent/90' : 'h-8 px-3';

  const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    const textarea = contentRef.current;
    if (!textarea) {
      return;
    }

    const cursorStart = textarea.selectionStart;
    const cursorEnd = textarea.selectionEnd;
    if (cursorStart !== cursorEnd) {
      return;
    }

    const lineStart = content.lastIndexOf('\n', Math.max(0, cursorStart - 1)) + 1;
    let lineEnd = content.indexOf('\n', cursorStart);
    if (lineEnd === -1) {
      lineEnd = content.length;
    }

    if (cursorStart !== lineEnd) {
      return;
    }

    const line = content.slice(lineStart, lineEnd);
    const bulletMatch = line.match(/^(\s*)-\s(.*)$/);
    const numberedMatch = line.match(/^(\s*)(\d+)\.\s(.*)$/);

    if (!bulletMatch && !numberedMatch) {
      return;
    }

    event.preventDefault();

    if (bulletMatch) {
      const indent = bulletMatch[1] ?? '';
      const text = bulletMatch[2] ?? '';

      if (!text.trim()) {
        const replacement = indent;
        const newValue = `${content.slice(0, lineStart)}${replacement}${content.slice(lineEnd)}`;
        const nextCursor = lineStart + replacement.length;
        updateContentWithSelection(newValue, nextCursor, nextCursor);
        return;
      }

      const insertion = `\n${indent}- `;
      const newValue = `${content.slice(0, cursorStart)}${insertion}${content.slice(cursorStart)}`;
      const nextCursor = cursorStart + insertion.length;
      updateContentWithSelection(newValue, nextCursor, nextCursor);
      return;
    }

    const indent = numberedMatch?.[1] ?? '';
    const currentNumber = Number(numberedMatch?.[2] ?? '1');
    const text = numberedMatch?.[3] ?? '';

    if (!text.trim()) {
      const replacement = indent;
      const newValue = `${content.slice(0, lineStart)}${replacement}${content.slice(lineEnd)}`;
      const nextCursor = lineStart + replacement.length;
      updateContentWithSelection(newValue, nextCursor, nextCursor);
      return;
    }

    const insertion = `\n${indent}${currentNumber + 1}. `;
    const newValue = `${content.slice(0, cursorStart)}${insertion}${content.slice(cursorStart)}`;
    const nextCursor = cursorStart + insertion.length;
    updateContentWithSelection(newValue, nextCursor, nextCursor);
  };

  const toggleLinePrefix = (prefix: string) => {
    const textarea = contentRef.current;
    if (!textarea) {
      return;
    }

    const getLinePrefixKind = (line: string): 'h1' | 'h2' | 'bullet' | 'numbered' | null => {
      if (/^\d+\.\s/.test(line)) {
        return 'numbered';
      }
      if (line.startsWith('## ')) {
        return 'h2';
      }
      if (line.startsWith('# ')) {
        return 'h1';
      }
      if (line.startsWith('- ')) {
        return 'bullet';
      }
      return null;
    };

    const kindFromPrefix = (value: string): 'h1' | 'h2' | 'bullet' | 'numbered' | null => {
      if (value === '# ') return 'h1';
      if (value === '## ') return 'h2';
      if (value === '- ') return 'bullet';
      if (value === '1. ') return 'numbered';
      return null;
    };

    const targetKind = kindFromPrefix(prefix);
    if (!targetKind) {
      return;
    }

    const stripKnownPrefix = (line: string) => {
      if (/^\d+\.\s/.test(line)) {
        return line.replace(/^\d+\.\s/, '');
      }
      if (line.startsWith('## ')) {
        return line.slice(3);
      }
      if (line.startsWith('# ')) {
        return line.slice(2);
      }
      if (line.startsWith('- ')) {
        return line.slice(2);
      }
      return line;
    };

    const rawStart = textarea.selectionStart;
    const rawEnd = textarea.selectionEnd;
    const lineStart = content.lastIndexOf('\n', rawStart - 1) + 1;
    let lineEnd = content.indexOf('\n', rawEnd);
    if (lineEnd === -1) {
      lineEnd = content.length;
    }

    const block = content.slice(lineStart, lineEnd);
    const lines = block.split('\n');
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
    const shouldRemove = nonEmptyLines.length > 0 && nonEmptyLines.every((line) => getLinePrefixKind(line) === targetKind);
    const localStart = rawStart - lineStart;
    const localEnd = rawEnd - lineStart;
    let startShift = 0;
    let endShift = 0;
    let offset = 0;

    let numberedCounter = 0;
    const transformed = lines
      .map((line, index) => {
        const isEmpty = !line.trim();
        const lineOffset = offset;
        const currentKind = getLinePrefixKind(line);
        const stripped = stripKnownPrefix(line);
        let nextLine = line;
        if (!isEmpty) {
          if (shouldRemove) {
            nextLine = currentKind ? stripped : line;
          } else {
            if (targetKind === 'numbered') {
              numberedCounter += 1;
              nextLine = `${numberedCounter}. ${stripped}`;
            } else {
              nextLine = `${prefix}${stripped}`;
            }
          }
        }
        const delta = nextLine.length - line.length;

        if (lineOffset < localStart) {
          startShift += delta;
        }
        if (lineOffset < localEnd) {
          endShift += delta;
        }

        offset += line.length;
        if (index < lines.length - 1) {
          offset += 1;
        }

        if (!line.trim()) {
          return line;
        }
        return nextLine;
      })
      .join('\n');

    const newValue = `${content.slice(0, lineStart)}${transformed}${content.slice(lineEnd)}`;
    const newStart = Math.max(0, rawStart + startShift);
    const newEnd = Math.max(0, rawEnd + endShift);
    updateContentWithSelection(newValue, newStart, newEnd);
  };

  const handleSaveNote = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(editingNoteId ? `/api/notes/${editingNoteId}` : '/api/notes', {
        method: editingNoteId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          tagIds: selectedTagIds,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Failed to save note');
      }

      closeEditor();
      await Promise.all([loadTags(), loadNotes(searchQuery, selectedTagId)]);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const confirmed = window.confirm('Delete this note? This action cannot be undone.');
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

      await Promise.all([loadTags(), loadNotes(searchQuery, selectedTagId)]);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete note');
    }
  };

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

      await loadNotes(searchQuery, selectedTagId);
    } catch (favoriteError) {
      setError(favoriteError instanceof Error ? favoriteError.message : 'Failed to update favorite state');
    }
  };

  const handleToggleArchived = async (note: Note) => {
    setError('');

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isArchived: !note.isArchived,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Failed to archive note');
      }

      await Promise.all([loadTags(), loadNotes(searchQuery, selectedTagId)]);
    } catch (archiveError) {
      setError(archiveError instanceof Error ? archiveError.message : 'Failed to archive note');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">All Notes</h1>
        <p className="text-foreground/60">Create, edit, search, and organize your notes with tags.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        <select
          value={selectedTagId}
          onChange={(e) => setSelectedTagId(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>

        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={openCreateEditor}>
          <Plus size={18} className="mr-2" />
          New Note
        </Button>
      </div>

      {error ? <p className="text-sm text-red-500 mb-4">{error}</p> : null}

      {isEditorOpen ? (
        <div className="mb-6 p-5 rounded-lg border border-border bg-card/60 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">{editingNoteId ? 'Edit Note' : 'Create Note'}</h2>
            <button onClick={closeEditor} className="p-1 rounded hover:bg-muted" aria-label="Close editor">
              <X size={18} />
            </button>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
            <div className="space-y-3">
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleEditorKeyDown}
                onSelect={syncSelectionRange}
                onKeyUp={syncSelectionRange}
                onClick={syncSelectionRange}
                placeholder="Write your note here..."
                rows={10}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className={toolbarButtonClass(isH1Active)}
                  onClick={() => toggleLinePrefix('# ')}
                >
                  H1
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={toolbarButtonClass(isH2Active)}
                  onClick={() => toggleLinePrefix('## ')}
                >
                  H2
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`${toolbarButtonClass(isBoldNow)} font-bold`}
                  onClick={toggleBoldSelection}
                >
                  B
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={toolbarButtonClass(isBulletActive)}
                  onClick={() => toggleLinePrefix('- ')}
                >
                  Bullet
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={toolbarButtonClass(isNumberedActive)}
                  onClick={() => toggleLinePrefix('1. ')}
                >
                  Numbered
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-3 min-h-[260px]">
              <p className="text-xs uppercase tracking-wide text-foreground/50 mb-2">Live Preview</p>
              <NoteMarkdown
                content={content.trim() ? content : '_Start typing to preview markdown..._'}
                className="text-sm text-foreground/80"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.length === 0 ? (
                <span className="text-sm text-foreground/60">No tags yet. Create tags in the Tags page.</span>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTagSelection(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedTagSet.has(tag.id)
                        ? 'bg-accent text-accent-foreground border-accent'
                        : 'bg-card text-foreground/70 border-border hover:text-foreground'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveNote}
              disabled={isSaving}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isSaving ? 'Saving...' : editingNoteId ? 'Update Note' : 'Create Note'}
            </Button>
            <Button variant="outline" onClick={closeEditor} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-foreground/60">Loading notes...</p>
      ) : notes.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-border rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-1">No notes found</h3>
          <p className="text-foreground/60 mb-5">Create your first note or adjust your search/filter.</p>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={openCreateEditor}>
            <Plus size={16} className="mr-2" />
            Create Note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <article key={note.id} className="p-5 rounded-lg border border-border bg-card/50">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-foreground line-clamp-2">{note.title}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFavorite(note)}
                    className={`p-1.5 rounded transition-colors ${
                      note.isFavorite
                        ? 'text-accent hover:bg-accent/10'
                        : 'text-foreground/50 hover:text-accent hover:bg-accent/10'
                    }`}
                    aria-label={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart size={15} className={note.isFavorite ? 'fill-accent' : ''} />
                  </button>
                  <button
                    onClick={() => openEditEditor(note)}
                    className="p-1.5 rounded hover:bg-muted text-foreground/60 hover:text-foreground"
                    aria-label="Edit note"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 rounded hover:bg-destructive/10 text-foreground/60 hover:text-destructive"
                    aria-label="Delete note"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() => handleToggleArchived(note)}
                    className="p-1.5 rounded hover:bg-muted text-foreground/60 hover:text-foreground"
                    aria-label="Archive note"
                  >
                    <Archive size={15} />
                  </button>
                </div>
              </div>

              <NoteMarkdown
                content={note.content || 'No content yet.'}
                className="text-sm text-foreground/70 mt-2 max-h-24 overflow-hidden"
              />

              <div className="flex flex-wrap gap-2 mt-4">
                {note.tags.map((tag) => (
                  <span key={tag.id} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                    {tag.name}
                  </span>
                ))}
              </div>

              <p className="text-xs text-foreground/50 mt-4">Updated {formatDate(note.updatedAt)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full text-foreground/60">Loading notes...</div>}>
      <NotesPageContent />
    </Suspense>
  );
}
