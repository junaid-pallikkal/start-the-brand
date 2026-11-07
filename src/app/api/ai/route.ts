import { NextRequest, NextResponse } from 'next/server';
import { requestAIArtwork } from '@/lib/ai/provider-gateway';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, style } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = await requestAIArtwork({
      prompt,
      style: style || 'cyberpunk',
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'AI generation failed' },
      { status: 500 }
    );
  }
}
