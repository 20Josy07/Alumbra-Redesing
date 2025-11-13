'use server';
/**
 * @fileOverview Generates a custom wallpaper based on a user's prompt.
 *
 * - generateWallpaper - Generates a wallpaper image.
 * - GenerateWallpaperInput - The input type for the generateWallpaper function.
 * - GenerateWallpaperOutput - The return type for the generateWallpaper function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateWallpaperInputSchema = z.object({
  prompt: z.string().describe('A short prompt or keywords to generate a wallpaper from.'),
});
type GenerateWallpaperInput = z.infer<typeof GenerateWallpaperInputSchema>;

const GenerateWallpaperOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated wallpaper image.'),
});
export type GenerateWallpaperOutput = z.infer<typeof GenerateWallpaperOutputSchema>;

export async function generateWallpaper(input: GenerateWallpaperInput): Promise<GenerateWallpaperOutput> {
  return generateWallpaperFlow(input);
}

const generateWallpaperFlow = ai.defineFlow(
  {
    name: 'generateWallpaperFlow',
    inputSchema: GenerateWallpaperInputSchema,
    outputSchema: GenerateWallpaperOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a serene and uplifting phone wallpaper, in a minimalist digital art style. The image should be abstract and beautiful, based on the following theme: "${input.prompt}". The image should be vertical, with an aspect ratio of 9:16. Do not include any text or words.`,
      config: {
        aspectRatio: '9:16',
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed to produce an image.');
    }

    return { imageUrl: media.url };
  }
);
