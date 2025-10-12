'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Education } from '@/lib/types';

export default function AdminEducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Education | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionHash = localStorage.getItem('admin_session');
    if (!sessionHash) {
      router.push('/admin');
      return;
    }
    fetchEducation();
  }, [router]);

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/admin/education');
      if (response.ok) {
        const data = await response.json();
        setEducationList(data);
      }
    } catch (error) {
      console.error('Failed to fetch education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;

    try {
      const response = await fetch(`/api/admin/education?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEducation();
      }
    } catch (error) {
      console.error('Failed to delete education:', error);
    }
  };

  const handleEdit = (education: Education) => {
    setEditing(education);
  };

  const handleSave = async (education: Education) => {
    try {
      const response = await fetch('/api/admin/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(education),
      });

      if (response.ok) {
        setEditing(null);
        fetchEducation();
      }
    } catch (error) {
      console.error('Failed to save education:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text">Manage Education</h1>
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
            degree: '',
            institution: '',
            slug: '',
            institutionLogo: '',
            startDate: '',
            endDate: '',
            description: [],
            orderRank: '',
          })}
          className="mb-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors shadow-md"
        >
          + Add New Education
        </button>

        {editing && (
          <EducationForm
            education={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {educationList.map((edu) => (
            <div key={edu.id} className="p-6 bg-card border border-accent rounded-lg">
              <h3 className="text-xl font-semibold mb-1 text-text">{edu.degree}</h3>
              <p className="text-text/80 mb-2">{edu.institution}</p>
              <p className="text-sm text-text/60 mb-4">{edu.startDate} - {edu.endDate}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(edu)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
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

function EducationForm({ 
  education, 
  onSave, 
  onCancel 
}: { 
  education: Education; 
  onSave: (education: Education) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState(education);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(education.institutionLogo || '');

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('category', 'education');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, institutionLogo: data.path });
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
      formData.slug = `${formData.degree}-${formData.institution}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    onSave(formData);
  };

  return (
    <div className="mb-8 p-6 bg-card border-2 border-purple-500 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-text">
        {education.id ? 'Edit Education' : 'New Education'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Degree *</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              placeholder="e.g., B.Tech in Computer Science"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Institution *</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              placeholder="e.g., Cornell University"
              required
            />
          </div>
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
          <label className="block text-sm font-medium text-text mb-2">Institution Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-purple-500 mt-2">Uploading...</p>}
          {logoPreview && (
            <div className="mt-4">
              <p className="text-sm text-text/70 mb-2">Preview:</p>
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                className="max-w-xs max-h-32 rounded-md border border-accent object-contain bg-white p-2"
              />
              <p className="text-xs text-text/60 mt-1">{formData.institutionLogo}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors"
          >
            Save Education
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
