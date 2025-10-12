'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Post } from '@/lib/types';

export default function AdminPostsPage() {
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionHash = localStorage.getItem('admin_session');
    if (!sessionHash) {
      router.push('/admin');
      return;
    }
    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts');
      if (response.ok) {
        const data = await response.json();
        setPostsList(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/admin/posts?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleEdit = (post: Post) => {
    setEditing(post);
  };

  const handleSave = async (post: Post) => {
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        setEditing(null);
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text">Manage Blog Posts</h1>
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
            title: '',
            slug: '',
            mainImage: '',
            publishedAt: new Date().toISOString().split('T')[0],
            body: [],
          })}
          className="mb-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors shadow-md"
        >
          + Add New Post
        </button>

        {editing && (
          <PostForm
            post={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {postsList.map((post) => {
            const bodyText = Array.isArray(post.body) 
              ? post.body.map((block: any) => block.children?.map((child: any) => child.text).join('') || '').join(' ')
              : '';
            
            return (
              <div key={post.id} className="p-6 bg-card border border-accent rounded-lg">
                <h3 className="text-xl font-semibold mb-1 text-text">{post.title}</h3>
                <p className="text-sm text-text/70 mb-2">{new Date(post.publishedAt).toLocaleDateString()}</p>
                <p className="text-text/80 mb-4 line-clamp-3">{bodyText}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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

function PostForm({ 
  post, 
  onSave, 
  onCancel 
}: { 
  post: Post; 
  onSave: (post: Post) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState(post);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(post.mainImage || '');
  const [bodyText, setBodyText] = useState(() => {
    // Convert Portable Text to plain text for editing
    if (Array.isArray(formData.body) && formData.body.length > 0) {
      return formData.body.map((block: any) => block.children?.map((child: any) => child.text).join('') || '').join('\n\n');
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
      uploadFormData.append('category', 'blog');

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
    if (!formData.slug) {
      formData.slug = `${formData.title}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    // Convert plain text to Portable Text format
    const portableText = bodyText.split('\n\n').filter(p => p.trim()).map((paragraph) => ({
      _type: 'block',
      children: [{ _type: 'span', text: paragraph }],
      markDefs: [],
      style: 'normal',
    }));
    onSave({ ...formData, body: portableText });
  };

  return (
    <div className="mb-8 p-6 bg-card border-2 border-indigo-500 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-text">
        {post.id ? 'Edit Post' : 'New Post'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            placeholder="e.g., My Awesome Blog Post"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-indigo-500 mt-2">Uploading...</p>}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-text/70 mb-2">Preview:</p>
              <img 
                src={imagePreview} 
                alt="Post Image Preview" 
                className="max-w-md max-h-64 rounded-md border border-accent object-cover"
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

        <div>
          <label className="block text-sm font-medium text-text mb-2">Post Content *</label>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            rows={10}
            placeholder="Write your blog post content here... (separate paragraphs with blank lines)"
            required
          />
          <p className="text-xs text-text/60 mt-1">Tip: Separate paragraphs with blank lines</p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save Post
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
