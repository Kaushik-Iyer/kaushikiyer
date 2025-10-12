'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Testimonial } from '@/lib/types';

export default function AdminTestimonialsPage() {
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionHash = localStorage.getItem('admin_session');
    if (!sessionHash) {
      router.push('/admin');
      return;
    }
    fetchTestimonials();
  }, [router]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonialsList(data);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditing(testimonial);
  };

  const handleSave = async (testimonial: Testimonial) => {
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonial),
      });

      if (response.ok) {
        setEditing(null);
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Failed to save testimonial:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text">Manage Testimonials</h1>
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
            personName: '',
            relation: '',
            testimonialContent: [],
            slug: '',
            personImage: '',
            testimonialDate: '',
            orderRank: '',
          })}
          className="mb-6 px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors shadow-md"
        >
          + Add New Testimonial
        </button>

        {editing && (
          <TestimonialForm
            testimonial={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {testimonialsList.map((testimonial) => {
            const contentText = Array.isArray(testimonial.testimonialContent) 
              ? testimonial.testimonialContent.map((block: any) => block.children?.map((child: any) => child.text).join('') || '').join(' ')
              : '';
            
            return (
              <div key={testimonial.id} className="p-6 bg-card border border-accent rounded-lg">
                <h3 className="text-xl font-semibold mb-1 text-text">{testimonial.personName}</h3>
                <p className="text-sm text-text/70 mb-2">{testimonial.relation}</p>
                <p className="text-text/80 mb-4 line-clamp-3">{contentText}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TestimonialForm({ 
  testimonial, 
  onSave, 
  onCancel 
}: { 
  testimonial: Testimonial; 
  onSave: (testimonial: Testimonial) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState(testimonial);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(testimonial.personImage || '');
  const [contentText, setContentText] = useState(() => {
    // Convert Portable Text to plain text for editing
    if (Array.isArray(formData.testimonialContent) && formData.testimonialContent.length > 0) {
      return formData.testimonialContent.map((block: any) => block.children?.map((child: any) => child.text).join('') || '').join('\n\n');
    }
    return '';
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('category', 'testimonials');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, personImage: data.path });
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
    if (!formData.slug) {
      formData.slug = `${formData.personName}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    // Convert plain text to Portable Text format
    const portableText = contentText.split('\n\n').map((paragraph) => ({
      _type: 'block',
      children: [{ _type: 'span', text: paragraph }],
      markDefs: [],
      style: 'normal',
    }));
    onSave({ ...formData, testimonialContent: portableText });
  };

  return (
    <div className="mb-8 p-6 bg-card border-2 border-teal-500 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-text">
        {testimonial.id ? 'Edit Testimonial' : 'New Testimonial'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Person Name *</label>
            <input
              type="text"
              value={formData.personName}
              onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Relation/Position *</label>
            <input
              type="text"
              value={formData.relation}
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              placeholder="e.g., Software Engineer at Google"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Testimonial Content *</label>
          <textarea
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            rows={5}
            placeholder="Write the testimonial content..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Person Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-teal-500 mt-2">Uploading...</p>}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-text/70 mb-2">Preview:</p>
              <img 
                src={imagePreview} 
                alt="Person Preview" 
                className="max-w-xs max-h-48 rounded-full border border-accent object-cover w-32 h-32"
              />
              <p className="text-xs text-text/60 mt-1">{formData.personImage}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Testimonial Date</label>
          <input
            type="date"
            value={formData.testimonialDate}
            onChange={(e) => setFormData({ ...formData, testimonialDate: e.target.value })}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors"
          >
            Save Testimonial
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
