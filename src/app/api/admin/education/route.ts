// src/app/api/admin/education/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeJsonFile } from '@/lib/data';
import { verifySession } from '@/lib/auth';
import type { Education } from '@/lib/types';
import fs from 'fs';
import path from 'path';

function isAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get('admin_session');
  return cookie ? verifySession(cookie.value) : false;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'education.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const education: Education = await request.json();
    
    const filePath = path.join(process.cwd(), 'data', 'education.json');
    const educationList: Education[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const existingIndex = educationList.findIndex(e => e.id === education.id);
    
    if (existingIndex >= 0) {
      educationList[existingIndex] = education;
    } else {
      education.id = `education-${Date.now()}`;
      educationList.push(education);
    }
    
    writeJsonFile('education.json', educationList);
    
    return NextResponse.json({ success: true, education });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save education' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Education ID required' }, { status: 400 });
    }
    
    const filePath = path.join(process.cwd(), 'data', 'education.json');
    let educationList: Education[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    educationList = educationList.filter(e => e.id !== id);
    
    writeJsonFile('education.json', educationList);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
