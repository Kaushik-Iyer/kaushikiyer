'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { VisitedPlace } from '@/lib/types';

export default function AdminVisitedPlacesPage() {
  const [placesList, setPlacesList] = useState<VisitedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<VisitedPlace | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionHash = localStorage.getItem('admin_session');
    if (!sessionHash) {
      router.push('/admin');
      return;
    }
    fetchPlaces();
  }, [router]);

  const fetchPlaces = async () => {
    try {
      const response = await fetch('/api/admin/visitedPlaces');
      if (response.ok) {
        const data = await response.json();
        setPlacesList(data);
      }
    } catch (error) {
      console.error('Failed to fetch visited places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this visited place?')) return;

    try {
      const response = await fetch(`/api/admin/visitedPlaces?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPlaces();
      }
    } catch (error) {
      console.error('Failed to delete place:', error);
    }
  };

  const handleEdit = (place: VisitedPlace) => {
    setEditing(place);
  };

  const handleSave = async (place: VisitedPlace) => {
    try {
      const response = await fetch('/api/admin/visitedPlaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(place),
      });

      if (response.ok) {
        setEditing(null);
        fetchPlaces();
      }
    } catch (error) {
      console.error('Failed to save place:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text">Manage Visited Places</h1>
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
            countryName: '',
            countryCode: '',
            city: '',
            dateVisited: '',
            notes: '',
          })}
          className="mb-6 px-6 py-3 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors shadow-md"
        >
          + Add New Place
        </button>

        {editing && (
          <PlaceForm
            place={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {placesList.map((place) => (
            <div key={place.id} className="p-6 bg-card border border-accent rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-text">{place.countryName}</h3>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-mono rounded">
                  {place.countryCode}
                </span>
              </div>
              {place.city && (
                <p className="text-text/80 mb-2">📍 {place.city}</p>
              )}
              {place.dateVisited && (
                <p className="text-sm text-text/60 mb-3">🗓️ {new Date(place.dateVisited).toLocaleDateString()}</p>
              )}
              {place.notes && (
                <p className="text-sm text-text/70 mb-4 line-clamp-2">{place.notes}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(place)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(place.id)}
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

function PlaceForm({ 
  place, 
  onSave, 
  onCancel 
}: { 
  place: VisitedPlace; 
  onSave: (place: VisitedPlace) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState(place);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>(place.cityImage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure countryCode is uppercase
    formData.countryCode = formData.countryCode.toUpperCase();
    onSave(formData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('category', 'visitedPlaces');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, cityImage: data.path });
        setImagePreview(data.path);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-8 p-6 bg-card border-2 border-amber-500 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-text">
        {place.id ? 'Edit Visited Place' : 'New Visited Place'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Country Name *</label>
            <input
              type="text"
              value={formData.countryName}
              onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              placeholder="e.g., Japan"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Country Code (ISO A2) *
              <span className="text-xs text-text/60 block">2-letter code, e.g., JP, US, IN</span>
            </label>
            <input
              type="text"
              value={formData.countryCode}
              onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text uppercase"
              placeholder="e.g., JP"
              maxLength={2}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">City / Region</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              placeholder="e.g., Tokyo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Date Visited</label>
            <input
              type="date"
              value={formData.dateVisited}
              onChange={(e) => setFormData({ ...formData, dateVisited: e.target.value })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Notes / Highlights</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
            rows={3}
            placeholder="Brief notes or highlights about your visit..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Latitude
              <span className="text-xs text-text/60 block">For pin placement on map</span>
            </label>
            <input
              type="number"
              step="any"
              value={formData.latitude || ''}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              placeholder="e.g., 19.0760"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Longitude
              <span className="text-xs text-text/60 block">For pin placement on map</span>
            </label>
            <input
              type="number"
              step="any"
              value={formData.longitude || ''}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text"
              placeholder="e.g., 72.8777"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">City Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-accent rounded-md bg-background text-text file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-amber-500 mt-2">Uploading...</p>}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-text/70 mb-2">Preview:</p>
              <img 
                src={imagePreview} 
                alt="City Preview" 
                className="max-w-md max-h-48 rounded-md border border-accent object-cover"
              />
              <p className="text-xs text-text/60 mt-1">{formData.cityImage}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
          >
            Save Place
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
