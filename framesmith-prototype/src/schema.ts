import { z } from 'zod';

export const BrandSchema = z.object({
  brand_name: z.string(),
  voice: z.string(),
  audience: z.string(),
  colors: z.object({
    background: z.string(),
    surface: z.string(),
    primary: z.string(),
    accent: z.string(),
    text: z.string(),
    muted: z.string(),
  }),
  font_style: z.string(),
  logo_path: z.string().nullable(),
  cta_style: z.string(),
});

export const SceneSchema = z.object({
  id: z.string(),
  type: z.enum(['hook', 'evidence', 'claim', 'framework', 'shift', 'cta']),
  duration_seconds: z.number().positive(),
  voiceover: z.string().min(1),
  headline: z.string().min(1),
  body: z.string().optional(),
  visual: z.string().min(1),
  source_ref: z.string().min(1),
  citation_visible: z.boolean(),
});

export const StoryboardSchema = z.object({
  title: z.string(),
  duration_seconds_target: z.number().positive(),
  aspect_ratio: z.literal('9:16'),
  style: z.literal('premium-research-explainer'),
  scenes: z.array(SceneSchema).min(5),
});

export type Brand = z.infer<typeof BrandSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Storyboard = z.infer<typeof StoryboardSchema>;
