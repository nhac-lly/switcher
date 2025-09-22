import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Configure maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed texture/image types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/tiff',
  'image/tga',
  'image/bmp',
  'image/exr',
  'image/hdr'
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file type (allow common texture formats even if MIME type isn't detected)
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'tga', 'bmp', 'exr', 'hdr'];
    
    if (!ALLOWED_TYPES.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only texture/image files are allowed.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;

    // Upload to Vercel Blob Storage
    const blob = await put(fileName, file, {
      access: 'public',
    });

    // Return success response with file info
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: blob.url,
        downloadUrl: blob.downloadUrl
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Handle GET requests to return upload info or list files
export async function GET() {
  try {
    return NextResponse.json({
      maxSize: MAX_FILE_SIZE,
      allowedTypes: ALLOWED_TYPES,
      endpoint: '/api/upload'
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
