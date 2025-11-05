import { Suspense } from 'react';
import { PropertiesPageClient } from './client';
import { Loader2 } from 'lucide-react';

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PropertiesPageClient />
    </Suspense>
  );
}
