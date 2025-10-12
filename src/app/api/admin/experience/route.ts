// src/app/api/admin/experience/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeJsonFile } from '@/lib/data';
import { verifySession } from '@/lib/auth';
import type { Experience } from '@/lib/types';
import fs from 'fs';
import path from 'path';

// Verify admin session
function isAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get('admin_session');
  return cookie ? verifySession(cookie.value) : false;
}

// GET all experience
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'experience.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

// POST - Create or update experience
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const experience: Experience = await request.json();
    
    const filePath = path.join(process.cwd(), 'data', 'experience.json');
    const experiences: Experience[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const existingIndex = experiences.findIndex(e => e.id === experience.id);
    
    if (existingIndex >= 0) {
      experiences[existingIndex] = experience;
    } else {
      experience.id = `experience-${Date.now()}`;
      experiences.push(experience);
    }
    
    writeJsonFile('experience.json', experiences);
    
    return NextResponse.json({ success: true, experience });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save experience' }, { status: 500 });
  }
}

// DELETE - Remove experience
export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Experience ID required' }, { status: 400 });
    }
    
    const filePath = path.join(process.cwd(), 'data', 'experience.json');
    let experiences: Experience[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    experiences = experiences.filter(e => e.id !== id);
    
    writeJsonFile('experience.json', experiences);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
