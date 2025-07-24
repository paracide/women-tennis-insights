"use client";

import { useState, useEffect } from 'react';

// Define the shape of the API response for type safety
interface MetabaseEmbedResponse {
  iframeUrl: string;
  error?: string;
}

const MetabaseDashboard = () => {
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        const response = await fetch('/api/metabase-embed');

        if (!response.ok) {
          throw new Error('Failed to fetch Metabase embed URL');
        }

        const data: MetabaseEmbedResponse = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setIframeUrl(data.iframeUrl);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmbedUrl();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  let div = <>
    <div className="p-4 w-5xl">
      <h1 className="text-2xl font-bold mb-4">Metabase Dashboard</h1>
      <iframe
        src={iframeUrl}
        frameBorder={0}
        width="100%"
        height="500"
        className="border-none"
      />
    </div>
  </>;
  return div;
};

export default MetabaseDashboard;