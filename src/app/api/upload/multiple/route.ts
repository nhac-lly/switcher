import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Configure maximum file size (10MB per file)
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 10; // Maximum number of files per upload

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
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Too many files. Maximum ${MAX_FILES} files allowed.` },
        { status: 400, headers: corsHeaders }
      );
    }

    const uploadResults = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Validate file type (allow common texture formats even if MIME type isn't detected)
        const fileExtension = file.name.toLowerCase().split('.').pop();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'tga', 'bmp', 'exr', 'hdr'];
        
        if (!ALLOWED_TYPES.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
          errors.push({
            fileName: file.name,
            error: 'Invalid file type. Only texture/image files are allowed.'
          });
          continue;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          errors.push({
            fileName: file.name,
            error: 'File too large. Maximum size is 10MB.'
          });
          continue;
        }

        // Create unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}_${i}_${originalName}`;

        // Upload to Vercel Blob Storage
        const blob = await put(fileName, file, {
          access: 'public',
        });

        uploadResults.push({
          fileName,
          originalName: file.name,
          size: file.size,
          type: file.type,
          url: blob.url,
          downloadUrl: blob.downloadUrl
        });

      } catch (error) {
        errors.push({
          fileName: file.name,
          error: 'Failed to upload file'
        });
      }
    }

    return NextResponse.json({
      success: uploadResults.length > 0,
      message: `${uploadResults.length} files uploaded successfully`,
      data: uploadResults,
      errors: errors.length > 0 ? errors : undefined
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Multiple upload error:', error);
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
