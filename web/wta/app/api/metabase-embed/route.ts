import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Use environment variables for sensitive data.
// It's a good practice to use a naming convention like NEXT_PUBLIC_... for public variables,
// but for a secret key, you should not prefix it.
const METABASE_SITE_URL: string = process.env.METABASE_SITE_URL || "";
const METABASE_SECRET_KEY: string = process.env.METABASE_SECRET_KEY || "";

// Define the payload type for better type safety
interface MetabasePayload {
  resource: { dashboard: number };
  params: Record<string, unknown>;
  exp: number;
}

export async function GET(request: Request): Promise<NextResponse> {
  // Always check for the secret key in a production environment.
  if (!METABASE_SECRET_KEY) {
    return NextResponse.json({ error: "Metabase secret key not configured." }, { status: 500 });
  }

  // You can get dashboard ID or other parameters from the request query if needed.
  // const { searchParams } = new URL(request.url);
  // const dashboardId = searchParams.get('dashboardId');

  const payload: MetabasePayload = {
    resource: { dashboard: 33 }, // Example dashboard ID. You can make this dynamic.
    params: {},
    exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
  };

  try {
    const token = jwt.sign(payload, METABASE_SECRET_KEY);
    const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;

    // Return the URL as a JSON response
    return NextResponse.json({ iframeUrl });
  } catch (error) {
    console.error("JWT signing error:", error);
    return NextResponse.json({ error: "Failed to generate embed URL." }, { status: 500 });
  }
}