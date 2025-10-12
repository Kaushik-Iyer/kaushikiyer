'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Suggestion } from '@/lib/types';

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unreviewed' | 'reviewed'>('all');
  const router = useRouter();

  useEffect(() => {
    const sessionHash = localStorage.getItem('admin_session');
    if (!sessionHash) {
      router.push('/admin');
      return;
    }
    fetchSuggestions();
  }, [router]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/admin/suggestions');
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this suggestion?')) return;

    try {
      const response = await fetch(`/api/admin/suggestions?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSuggestions();
      }
    } catch (error) {
      console.error('Failed to delete suggestion:', error);
    }
  };

  const handleToggleReviewed = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isReviewed: !currentStatus }),
      });

      if (response.ok) {
        fetchSuggestions();
      }
    } catch (error) {
      console.error('Failed to update suggestion:', error);
    }
  };

  const filteredSuggestions = suggestions.filter(s => {
    if (filter === 'unreviewed') return !s.isReviewed;
    if (filter === 'reviewed') return s.isReviewed;
    return true;
  });

  const unreviewedCount = suggestions.filter(s => !s.isReviewed).length;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text">User Suggestions</h1>
            {unreviewedCount > 0 && (
              <p className="text-sm text-rose-600 mt-2">
                {unreviewedCount} unreviewed suggestion{unreviewedCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-rose-600 text-white'
                : 'bg-card text-text border border-accent hover:bg-accent/10'
            }`}
          >
            All ({suggestions.length})
          </button>
          <button
            onClick={() => setFilter('unreviewed')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'unreviewed'
                ? 'bg-rose-600 text-white'
                : 'bg-card text-text border border-accent hover:bg-accent/10'
            }`}
          >
            Unreviewed ({unreviewedCount})
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'reviewed'
                ? 'bg-rose-600 text-white'
                : 'bg-card text-text border border-accent hover:bg-accent/10'
            }`}
          >
            Reviewed ({suggestions.length - unreviewedCount})
          </button>
        </div>

        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-accent">
            <p className="text-text/60">No suggestions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-6 rounded-lg border-2 transition-all ${
                  suggestion.isReviewed
                    ? 'bg-card border-accent/50 opacity-75'
                    : 'bg-card border-rose-500 shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {!suggestion.isReviewed && (
                        <span className="px-2 py-1 bg-rose-500 text-white text-xs font-semibold rounded">
                          NEW
                        </span>
                      )}
                      {suggestion.userName && (
                        <span className="text-text font-semibold">
                          {suggestion.userName}
                        </span>
                      )}
                      {suggestion.userEmail && (
                        <a
                          href={`mailto:${suggestion.userEmail}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {suggestion.userEmail}
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-text/60 mb-3">
                      Submitted: {new Date(suggestion.submittedAt).toLocaleString()}
                      {suggestion.reviewedAt && (
                        <> • Reviewed: {new Date(suggestion.reviewedAt).toLocaleString()}</>
                      )}
                    </p>
                  </div>
                </div>

                <p className="text-text mb-4 whitespace-pre-wrap bg-background p-4 rounded border border-accent">
                  {suggestion.text}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleReviewed(suggestion.id, suggestion.isReviewed || false)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      suggestion.isReviewed
                        ? 'bg-gray-500 text-white hover:bg-gray-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {suggestion.isReviewed ? 'Mark Unreviewed' : 'Mark Reviewed'}
                  </button>
                  <button
                    onClick={() => handleDelete(suggestion.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
