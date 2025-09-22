import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    const { blobs } = await list();
    
    const fileDetails = blobs.map((blob) => ({
      fileName: blob.pathname,
      size: blob.size,
      createdAt: blob.uploadedAt,
      url: blob.url,
      downloadUrl: blob.downloadUrl
    }));

    // Sort by creation date (newest first)
    fileDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      files: fileDetails,
      count: fileDetails.length
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
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
