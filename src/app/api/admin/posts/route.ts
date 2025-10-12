import { NextRequest, NextResponse } from 'next/server';
import { getPosts, writeJsonFile } from '@/lib/data';
import { verifySession } from '@/lib/auth';

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionHash = request.cookies.get('admin_session')?.value;
  if (!sessionHash) return false;
  return await verifySession(sessionHash);
}

export async function GET(request: NextRequest) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const post = await request.json();
    const posts = await getPosts();

    if (post.id) {
      // Update existing
      const index = posts.findIndex((p) => p.id === post.id);
      if (index !== -1) {
        posts[index] = post;
      }
    } else {
      // Create new
      post.id = Date.now().toString();
      posts.push(post);
    }

    await writeJsonFile('posts.json', posts);
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ 
      error: 'Failed to save post', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const posts = await getPosts();
    const filtered = posts.filter((p) => p.id !== id);

    await writeJsonFile('posts.json', filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
