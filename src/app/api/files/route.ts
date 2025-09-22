import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({
        success: true,
        files: [],
        message: 'No uploads directory found'
      });
    }

    const files = await readdir(uploadsDir);
    const fileDetails = await Promise.all(
      files.map(async (fileName) => {
        const filePath = join(uploadsDir, fileName);
        const stats = await stat(filePath);
        
        return {
          fileName,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          url: `/uploads/${fileName}`
        };
      })
    );

    // Sort by creation date (newest first)
    fileDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      files: fileDetails,
      count: fileDetails.length
    });

  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}
