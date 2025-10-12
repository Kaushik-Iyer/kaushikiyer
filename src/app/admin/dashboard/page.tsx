'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionHash = localStorage.getItem('admin_session');
    if (!sessionHash) {
      router.push('/admin');
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('admin_session');
    router.push('/admin');
  };

  if (!authenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Projects Card */}
          <Link href="/admin/projects" className="block">
            <div className="p-6 bg-card border border-accent rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2 text-text">Projects</h2>
              <p className="text-text/70">Manage your portfolio projects</p>
            </div>
          </Link>

          {/* Experience Card */}
          <Link href="/admin/experience" className="block">
            <div className="p-6 bg-card border border-accent rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2 text-text">Experience</h2>
              <p className="text-text/70">Manage work experience entries</p>
            </div>
          </Link>

          {/* Education Card */}
          <Link href="/admin/education" className="block">
            <div className="p-6 bg-card border border-accent rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2 text-text">Education</h2>
              <p className="text-text/70">Manage education history</p>
            </div>
          </Link>

          {/* Testimonials Card */}
          <Link href="/admin/testimonials" className="block">
            <div className="p-6 bg-card border border-accent rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2 text-text">Testimonials</h2>
              <p className="text-text/70">Manage testimonials</p>
            </div>
          </Link>

          {/* Blog Posts Card */}
          <Link href="/admin/posts" className="block">
            <div className="p-6 bg-card border border-accent rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2 text-text">Blog Posts</h2>
              <p className="text-text/70">Manage blog content</p>
            </div>
          </Link>

          {/* Visited Places Card */}
          <Link href="/admin/visitedPlaces" className="block">
            <div className="p-6 bg-card border border-accent rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2 text-text">Visited Places</h2>
              <p className="text-text/70">Manage travel map locations</p>
            </div>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-card border border-accent rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-text">Quick Actions</h3>
          <div className="space-y-2 text-text/70">
            <p>• All changes are automatically committed to your GitHub repository</p>
            <p>• Cloudflare Pages will rebuild your site after each commit</p>
            <p>• Changes typically go live within 1-2 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
