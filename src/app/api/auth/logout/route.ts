// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { success: true },
    { 
      status: 200,
      headers: {
        'Set-Cookie': `admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
      }
    }
  );
}
