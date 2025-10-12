'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Experience } from '@/lib/types';

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionHash = localStorage.getItem('admin_session');
    if (!sessionHash) {
      router.push('/admin');
      return;
    }
    fetchExperiences();
  }, [router]);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/admin/experience');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const response = await fetch(`/api/admin/experience?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchExperiences();
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditing(experience);
  };

  const handleSave = async (experience: Experience) => {
    try {
      const response = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experience),
      });

      if (response.ok) {
        setEditing(null);
        fetchExperiences();
      }
    } catch (error) {
      console.error('Failed to save experience:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text">Manage Experience</h1>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <button
          onClick={() => setEditing({
            id: '',
            jobTitle: '',
            company: '',
            slug: '',
            companyLogo: '',
            startDate: '',
            endDate: '',
            location: '',
            description: [],
            tags: [],
            orderRank: '',
          })}
          className="mb-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors shadow-md"
        >
          + Add New Experience
        </button>

        {editing && (
          <ExperienceForm
            experience={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {experiences.map((exp) => (
            <div key={exp.id} className="p-6 bg-card border border-accent rounded-lg">
              <h3 className="text-xl font-semibold mb-1 text-text">{exp.jobTitle}</h3>
              <p className="text-text/80 mb-2">{exp.company}</p>
              <p className="text-sm text-text/60 mb-4">{exp.startDate} - {exp.endDate}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExperienceForm({ 
  experience, 
  onSave, 
  onCancel 
}: { 
  experience: Experience; 
  onSave: (experience: Experience) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState(experience);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(experience.companyLogo || '');

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('category', 'experience');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, companyLogo: data.path });
        setLogoPreview(data.path);
      } else {
        alert('Failed to upload logo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug) {
      formData.slug = `${formData.jobTitle}-${formData.company}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    onSave(formData);
  };

  return (
    <div className="mb-8 p-6 bg-card border-2 border-green-500 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-text">
        {experience.id ? 'Edit Experience' : 'New Experience'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Job Title *</label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Company *</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            placeholder="City, Country"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Start Date *</label>
            <input
              type="month"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">End Date (or "Present") *</label>
            <input
              type="text"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              placeholder="YYYY-MM or Present"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Company Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-green-500 mt-2">Uploading...</p>}
          {logoPreview && (
            <div className="mt-4">
              <p className="text-sm text-text/70 mb-2">Preview:</p>
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                className="max-w-xs max-h-32 rounded-md border border-accent object-contain bg-white p-2"
              />
              <p className="text-xs text-text/60 mt-1">{formData.companyLogo}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Tags/Skills (comma-separated)</label>
          <input
            type="text"
            value={formData.tags?.join(', ')}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            placeholder="JavaScript, React, Node.js"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
          >
            Save Experience
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
