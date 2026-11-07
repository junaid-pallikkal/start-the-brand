export interface AIArtworkRequest {
  prompt: string;
  style: 'cyberpunk' | 'vintage_distressed' | 'brutalist_mono' | 'gothic_chrome' | 'anime_street';
  width?: number;
  height?: number;
}

export interface AIArtworkResponse {
  imageUrl: string;
  prompt: string;
  provider: string;
}

export const STREETWEAR_PROMPT_PRESETS = [
  {
    title: 'Cyberpunk Barcode Badge',
    style: 'cyberpunk',
    prompt: 'Brutalist cyberpunk apparel graphic, technical barcode, Japanese katakana typography, cyber neon volt accents on pitch black background, vector style',
  },
  {
    title: 'Vintage 90s Tour Heavy Metal',
    style: 'vintage_distressed',
    prompt: 'Vintage 1994 distressed heavy metal band tour shirt graphic, cracked ink screenprint texture, gothic wings, monochrome raw aesthetic',
  },
  {
    title: 'Gothic Chrome Cross & Spikes',
    style: 'gothic_chrome',
    prompt: 'Gothic silver liquid chrome 3D cross, metallic thorns, Y2K aesthetic, sharp edges, high contrast transparent background',
  },
  {
    title: 'Brutalist Spec Typography',
    style: 'brutalist_mono',
    prompt: 'Swiss brutalist graphic design, industrial caution hazard icon, technical specifications text, bold black and international safety orange',
  },
];

export async function requestAIArtwork(
  req: AIArtworkRequest
): Promise<AIArtworkResponse> {
  // Use Pollinations.ai free open tier as zero-cost default (safe, free, no keys required)
  const encodedPrompt = encodeURIComponent(
    `${req.prompt}, apparel print graphic, streetwear t-shirt decal, high detail, clean edges, dark background`
  );

  const width = req.width || 768;
  const height = req.height || 768;
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

  return {
    imageUrl,
    prompt: req.prompt,
    provider: 'Open Zero-Cost Gateway (Pollinations)',
  };
}
