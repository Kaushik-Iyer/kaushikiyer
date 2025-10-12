import { NextRequest, NextResponse } from 'next/server';
import { getSuggestions, writeJsonFile } from '@/lib/data';
import { verifySession } from '@/lib/auth';

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionHash = request.cookies.get('admin_session')?.value;
  if (!sessionHash) return false;
  return await verifySession(sessionHash);
}

// Public endpoint - anyone can submit a suggestion
export async function POST(request: NextRequest) {
  try {
    const { text, userName, userEmail } = await request.json();

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Suggestion must be at least 10 characters long' },
        { status: 400 }
      );
    }

    const suggestions = await getSuggestions();
    const newSuggestion = {
      id: Date.now().toString(),
      text: text.trim(),
      userName: userName?.trim() || undefined,
      userEmail: userEmail?.trim() || undefined,
      submittedAt: new Date().toISOString(),
      isReviewed: false,
    };

    suggestions.push(newSuggestion);
    await writeJsonFile('suggestions.json', suggestions);

    return NextResponse.json({ success: true, suggestion: newSuggestion });
  } catch (error) {
    console.error('Failed to save suggestion:', error);
    return NextResponse.json({ error: 'Failed to save suggestion' }, { status: 500 });
  }
}

// Admin-only endpoint - get all suggestions
export async function GET(request: NextRequest) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const suggestions = await getSuggestions();
    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}

// Admin-only endpoint - delete or mark as reviewed
export async function DELETE(request: NextRequest) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const suggestions = await getSuggestions();
    const filteredSuggestions = suggestions.filter((s) => s.id !== id);
    
    await writeJsonFile('suggestions.json', filteredSuggestions);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete suggestion' }, { status: 500 });
  }
}

// Admin-only endpoint - mark as reviewed
export async function PATCH(request: NextRequest) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, isReviewed } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const suggestions = await getSuggestions();
    const index = suggestions.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
    }

    suggestions[index].isReviewed = isReviewed;
    if (isReviewed) {
      suggestions[index].reviewedAt = new Date().toISOString();
    } else {
      delete suggestions[index].reviewedAt;
    }

    await writeJsonFile('suggestions.json', suggestions);
    return NextResponse.json({ success: true, suggestion: suggestions[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 });
  }
}
