# Texture Upload API Documentation

This API provides endpoints for uploading and managing texture files for 3D projects. All files are stored in their original format without optimization to preserve texture quality.

## API Endpoints

### 1. Single File Upload

**POST** `/api/upload`

Upload a single texture file.

#### Request
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with `file` field

#### Supported File Types
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- TIFF (.tiff)
- TGA (.tga)
- BMP (.bmp)
- EXR (.exr)
- HDR (.hdr)

#### Limits
- Maximum file size: 10MB
- Single file per request

#### Response
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "fileName": "1695123456_texture.png",
    "originalName": "texture.png",
    "size": 2048576,
    "type": "image/png",
    "url": "/uploads/1695123456_texture.png"
  }
}
```

#### Error Response
```json
{
  "error": "Invalid file type. Only texture/image files are allowed."
}
```

### 2. Multiple File Upload

**POST** `/api/upload/multiple`

Upload multiple texture files at once.

#### Request
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with `files` field (multiple files)

#### Limits
- Maximum file size: 10MB per file
- Maximum files: 10 per request

#### Response
```json
{
  "success": true,
  "message": "3 files uploaded successfully",
  "data": [
    {
      "fileName": "1695123456_0_diffuse.jpg",
      "originalName": "diffuse.jpg",
      "size": 1024000,
      "type": "image/jpeg",
      "url": "/uploads/1695123456_0_diffuse.jpg"
    },
    {
      "fileName": "1695123456_1_normal.png",
      "originalName": "normal.png",
      "size": 2048000,
      "type": "image/png",
      "url": "/uploads/1695123456_1_normal.png"
    }
  ],
  "errors": [
    {
      "fileName": "invalid.txt",
      "error": "Invalid file type. Only texture/image files are allowed."
    }
  ]
}
```

### 3. List Uploaded Files

**GET** `/api/files`

Get a list of all uploaded files.

#### Response
```json
{
  "success": true,
  "files": [
    {
      "fileName": "1695123456_texture.png",
      "size": 2048576,
      "createdAt": "2023-09-19T10:30:56.000Z",
      "modifiedAt": "2023-09-19T10:30:56.000Z",
      "url": "/uploads/1695123456_texture.png"
    }
  ],
  "count": 1
}
```

### 4. Upload Configuration

**GET** `/api/upload`

Get upload configuration and limits.

#### Response
```json
{
  "maxSize": 10485760,
  "allowedTypes": [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/tiff",
    "image/tga",
    "image/bmp",
    "image/exr",
    "image/hdr"
  ],
  "endpoint": "/api/upload"
}
```

## Usage Examples

### JavaScript/TypeScript

#### Single File Upload
```javascript
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  return await response.json();
};
```

#### Multiple Files Upload
```javascript
const uploadMultipleFiles = async (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch('/api/upload/multiple', {
    method: 'POST',
    body: formData,
  });

  return await response.json();
};
```

### cURL

#### Single File Upload
```bash
curl -X POST \
  http://localhost:3000/api/upload \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/texture.png'
```

#### Multiple Files Upload
```bash
curl -X POST \
  http://localhost:3000/api/upload/multiple \
  -H 'Content-Type: multipart/form-data' \
  -F 'files=@/path/to/diffuse.jpg' \
  -F 'files=@/path/to/normal.png' \
  -F 'files=@/path/to/roughness.jpg'
```

## File Storage

- Files are stored in `public/uploads/` directory
- Filenames are prefixed with timestamp to avoid conflicts
- Original filenames are preserved in the response data
- Files are accessible via `/uploads/{filename}` URL path

## Demo Page

Visit `/upload` to test the upload functionality with a user-friendly interface.

## Error Codes

- `400` - Bad request (no file, invalid type, file too large)
- `500` - Internal server error

## Security Considerations

- File type validation by both MIME type and extension
- File size limits to prevent abuse
- Filename sanitization to prevent directory traversal
- No executable file types allowed
