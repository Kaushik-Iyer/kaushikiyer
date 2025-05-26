import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fplEndpoint = searchParams.get('endpoint');

  if (!fplEndpoint) {
    return NextResponse.json({ error: 'FPL API endpoint is required' }, { status: 400 });
  }

  const FPL_BASE_URL = 'https://fantasy.premierleague.com/api/';
  const targetUrl = `${FPL_BASE_URL}${fplEndpoint}`;

  try {
    const apiResponse = await fetch(targetUrl, {
      headers: {
        // Add any necessary headers for the FPL API if required in the future
        // 'User-Agent': 'YourAppName/1.0 (your-contact-email-or-url)', // Good practice
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      console.error(`FPL API Error (${apiResponse.status}) for ${targetUrl}:`, errorData);
      return NextResponse.json(
        { error: `Failed to fetch from FPL API: ${apiResponse.statusText}`, details: errorData },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy request failed for ${targetUrl}:', error);
    return NextResponse.json({ error: 'Proxy request failed', details: error.message }, { status: 500 });
  }
}
