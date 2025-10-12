'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionHash = localStorage.getItem('admin_session');
    if (!sessionHash) {
      router.push('/admin');
      return;
    }
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text">Site Settings</h1>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-6 bg-card p-8 rounded-lg border border-accent">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text border-b border-accent pb-2">Hero Section</h2>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">Hero Title *</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
                placeholder="Hello, I'm..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Hero Subtitle *</label>
              <input
                type="text"
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
                placeholder="CS Masters @ Cornell"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Hero Description *</label>
              <textarea
                value={settings.heroDescription}
                onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
                rows={4}
                placeholder="Introduce yourself..."
                required
              />
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-accent">
            <h2 className="text-2xl font-semibold text-text border-b border-accent pb-2">About Section</h2>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">About Title *</label>
              <input
                type="text"
                value={settings.aboutTitle}
                onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
                placeholder="Who am I?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">About Description *</label>
              <textarea
                value={settings.aboutDescription}
                onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })}
                className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
                rows={5}
                placeholder="Tell more about yourself..."
                required
              />
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-accent">
            <h2 className="text-2xl font-semibold text-text border-b border-accent pb-2">Other Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                FPL Manager ID 
                <span className="text-xs text-text/60 ml-2">(Optional - for Fantasy Premier League scorecard)</span>
              </label>
              <input
                type="number"
                value={settings.fplManagerId || ''}
                onChange={(e) => setSettings({ ...settings, fplManagerId: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
                placeholder="1361280"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
