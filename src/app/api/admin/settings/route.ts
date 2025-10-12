import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, writeJsonFile } from '@/lib/data';
import { verifySession } from '@/lib/auth';

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionHash = request.cookies.get('admin_session')?.value;
  if (!sessionHash) return false;
  return await verifySession(sessionHash);
}

export async function GET(request: NextRequest) {
  // Public endpoint - anyone can read settings
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedSettings = await request.json();
    // Always use the fixed ID
    updatedSettings.id = 'site-settings';
    
    // Write as array with single item
    await writeJsonFile('settings.json', [updatedSettings]);
    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
