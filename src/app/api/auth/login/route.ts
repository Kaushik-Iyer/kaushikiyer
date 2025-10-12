// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (checkAuth(password)) {
      const sessionHash = hashPassword(password);
      
      return NextResponse.json(
        { success: true, sessionHash },
        { 
          status: 200,
          headers: {
            'Set-Cookie': `admin_session=${sessionHash}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
          }
        }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
