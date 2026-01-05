import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4002';

async function handleRequest(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const url = `${BACKEND_URL}/reports/${path}`;
    const userId = request.headers.get('x-user-id');

    const options: RequestInit = {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...(userId && { 'x-user-id': userId }),
      },
    };

    // Add body for POST requests
    if (['POST'].includes(request.method)) {
      const body = await request.json();
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    // Handle PDF responses
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/pdf')) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: response.status,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': response.headers.get('content-disposition') || 'attachment',
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Reports proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  return handleRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  return handleRequest(request, context);
}
