import { NextRequest, NextResponse } from 'next/server';
import { getTestimonials, writeJsonFile } from '@/lib/data';
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
    const testimonials = await getTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const testimonial = await request.json();
    const testimonials = await getTestimonials();

    if (testimonial.id) {
      // Update existing
      const index = testimonials.findIndex((t) => t.id === testimonial.id);
      if (index !== -1) {
        testimonials[index] = testimonial;
      }
    } else {
      // Create new
      testimonial.id = Date.now().toString();
      testimonials.push(testimonial);
    }

    await writeJsonFile('testimonials.json', testimonials);
    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error('Error saving testimonial:', error);
    return NextResponse.json({ 
      error: 'Failed to save testimonial', 
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

    const testimonials = await getTestimonials();
    const filtered = testimonials.filter((t) => t.id !== id);

    await writeJsonFile('testimonials.json', filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
