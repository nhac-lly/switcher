'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface UploadedFile {
  fileName: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  data?: UploadedFile | UploadedFile[];
  errors?: Array<{ fileName: string; error: string }>;
}

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);

  const handleSingleUpload = async (file: File) => {
    setUploading(true);
    setErrors([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (result.success && result.data) {
        setUploadedFiles(prev => [...prev, result.data as UploadedFile]);
      } else {
        setErrors([result.message || 'Upload failed']);
      }
    } catch {
      setErrors(['Network error occurred']);
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleUpload = async (files: FileList) => {
    setUploading(true);
    setErrors([]);

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload/multiple', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (result.success && result.data) {
        const newFiles = Array.isArray(result.data) ? result.data : [result.data];
        setUploadedFiles(prev => [...prev, ...newFiles]);
      }

      if (result.errors && result.errors.length > 0) {
        setErrors(result.errors.map(err => `${err.fileName}: ${err.error}`));
      }
    } catch {
      setErrors(['Network error occurred']);
    } finally {
      setUploading(false);
    }
  };

  const handleSingleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleSingleUpload(file);
    }
  };

  const handleMultipleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleMultipleUpload(files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearUploads = () => {
    setUploadedFiles([]);
    setErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (multipleFileInputRef.current) multipleFileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Texture Upload</h1>
        <p className="text-base-content/70">
          Upload texture files for your 3D projects (preserves original quality)
        </p>
      </div>

      {/* Single File Upload */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Single File Upload</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose a texture file</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.tga,.exr,.hdr"
              onChange={handleSingleFileChange}
              disabled={uploading}
              className="file-input file-input-bordered w-full"
            />
          </div>
        </div>
      </div>

      {/* Multiple File Upload */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Multiple File Upload</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose multiple texture files (max 10)</span>
            </label>
            <input
              ref={multipleFileInputRef}
              type="file"
              accept="image/*,.tga,.exr,.hdr"
              multiple
              onChange={handleMultipleFileChange}
              disabled={uploading}
              className="file-input file-input-bordered w-full"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {uploading && (
        <div className="alert alert-info">
          <span className="loading loading-spinner"></span>
          <span>Uploading files...</span>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Uploaded Files ({uploadedFiles.length})</h2>
              <button
                onClick={clearUploads}
                className="btn btn-outline btn-sm"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="card card-compact bg-base-200 shadow-md">
                  <figure className="px-4 pt-4">
                    <Image
                      src={file.url}
                      alt={file.originalName}
                      width={300}
                      height={192}
                      className="rounded-lg object-cover w-full h-48"
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="font-semibold text-sm truncate" title={file.originalName}>
                      {file.originalName}
                    </h3>
                    <div className="text-xs text-base-content/70 space-y-1">
                      <div>Size: {formatFileSize(file.size)}</div>
                      <div>Type: {file.type}</div>
                    </div>
                    <div className="card-actions justify-end mt-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-xs"
                      >
                        View Full
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
