import { NextRequest, NextResponse } from 'next/server';
import { getVisitedPlaces, writeJsonFile } from '@/lib/data';
import { verifySession } from '@/lib/auth';

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionHash = request.cookies.get('admin_session')?.value;
  if (!sessionHash) return false;
  return await verifySession(sessionHash);
}

export async function GET(request: NextRequest) {
  // Check if this is an admin request
  const isAdmin = await isAuthenticated(request);
  
  try {
    const places = await getVisitedPlaces();
    
    // If not admin, only return essential fields (no notes)
    if (!isAdmin) {
      const publicPlaces = places.map(p => ({
        id: p.id,
        countryName: p.countryName,
        countryCode: p.countryCode,
        city: p.city,
        dateVisited: p.dateVisited,
      }));
      return NextResponse.json(publicPlaces);
    }
    
    return NextResponse.json(places);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch visited places' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const place = await request.json();
    const places = await getVisitedPlaces();

    if (place.id) {
      // Update existing
      const index = places.findIndex((p) => p.id === place.id);
      if (index !== -1) {
        places[index] = place;
      }
    } else {
      // Create new
      place.id = Date.now().toString();
      places.push(place);
    }

    await writeJsonFile('visitedPlaces.json', places);
    return NextResponse.json({ success: true, place });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save visited place' }, { status: 500 });
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

    const places = await getVisitedPlaces();
    const filtered = places.filter((p) => p.id !== id);

    await writeJsonFile('visitedPlaces.json', filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete visited place' }, { status: 500 });
  }
}
