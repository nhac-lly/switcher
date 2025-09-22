import ImageUpload from '@/components/ImageUpload';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-base-200 py-8">
      <ImageUpload />
    </div>
  );
}

export const metadata = {
  title: 'Texture Upload - Switcher App',
  description: 'Upload and manage texture files for 3D projects',
};
