'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Project } from '@/lib/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionHash = localStorage.getItem('admin_session');
    if (!sessionHash) {
      router.push('/admin');
      return;
    }
    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
  };

  const handleSave = async (project: Project) => {
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        alert('Project saved successfully!');
        setEditing(null);
        fetchProjects();
      } else {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        alert(`Failed to save project: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Check console for details.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text">Manage Projects</h1>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-accent text-text rounded-md hover:bg-accent/80 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <button
          onClick={() => setEditing({
            id: '',
            title: '',
            slug: '',
            description: '',
            projectUrl: '',
            tags: [],
            mainImage: '',
            publishedAt: new Date().toISOString().split('T')[0],
          })}
          className="mb-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-md"
        >
          + Add New Project
        </button>

        {editing && (
          <ProjectForm
            project={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {projects.map((project) => (
            <div key={project.id} className="p-6 bg-card border border-accent rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-text">{project.title}</h3>
              <p className="text-text/70 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
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

function ProjectForm({ 
  project, 
  onSave, 
  onCancel 
}: { 
  project: Project; 
  onSave: (project: Project) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState(project);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(project.mainImage || '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('category', 'projects');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, mainImage: data.path });
        setImagePreview(data.path);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate slug from title if empty
    if (!formData.slug) {
      formData.slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    onSave(formData);
  };

  return (
    <div className="mb-8 p-6 bg-card border border-accent rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-text">
        {project.id ? 'Edit Project' : 'New Project'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            placeholder="auto-generated from title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Project URL</label>
          <input
            type="url"
            value={formData.projectUrl}
            onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags?.join(', ')}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            placeholder="React, TypeScript, Next.js"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-text/70 mb-2">Preview:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-xs max-h-48 rounded-md border border-accent object-cover"
              />
              <p className="text-xs text-text/60 mt-1">{formData.mainImage}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Published Date *</label>
          <input
            type="date"
            value={formData.publishedAt}
            onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Save Project
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
