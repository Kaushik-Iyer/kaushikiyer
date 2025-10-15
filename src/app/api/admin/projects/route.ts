// src/app/api/admin/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeJsonFile } from '@/lib/data';
import { verifySession } from '@/lib/auth';
import type { Project } from '@/lib/types';
import fs from 'fs';
import path from 'path';

// Verify admin session
function isAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get('admin_session');
  return cookie ? verifySession(cookie.value) : false;
}

// GET all projects
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

// POST - Create or update project
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const project: Project = await request.json();
    
    // Read current projects
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const projects: Project[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Check if updating existing or creating new
    const existingIndex = project.id && project.id.trim() !== '' 
      ? projects.findIndex(p => p.id === project.id)
      : -1;
    
    if (existingIndex >= 0) {
      // Update existing
      projects[existingIndex] = project;
    } else {
      // Create new - generate ID
      project.id = `project-${Date.now()}`;
      projects.push(project);
    }
    
    // Write back to file
    await writeJsonFile('projects.json', projects);
    
    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json({ 
      error: 'Failed to save project', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

// DELETE - Remove a project
export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }
    
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    let projects: Project[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    projects = projects.filter(p => p.id !== id);
    
    await writeJsonFile('projects.json', projects);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
