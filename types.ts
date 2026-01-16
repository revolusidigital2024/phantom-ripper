
/**
 * Global declaration to satisfy TypeScript for process.env usage
 * required by system instructions.
 */
declare global {
  interface ProcessEnv {
    [key: string]: string | undefined;
    API_KEY?: string;
  }

  interface Process {
    env: ProcessEnv;
  }

  // Mendeklarasikan 'process' sebagai variabel global agar TypeScript tidak komplain.
  // Ini akan diisi secara runtime di index.tsx
  var process: Process;
}

export interface TechnicalSpecs {
  angle: string;
  lens: string;
  motion: string;
  lighting: string;
  camera: string;
}

export interface PromptVariant {
  shot_number: number;
  vibe_title: string;
  action_focus: string;
  main_prompt: string;
  negative_prompt: string;
  technical_specs: TechnicalSpecs;
}

export interface PromptResult {
  vibe_title: string;
  subject: string;
  environment: string;
  mood: string;
  style: string;
  camera: string;
  motion: string;
  angle: string;
  lens: string;
  lighting: string;
  audio: string;
  setting: string;
  place: string;
  time: string;
  characters: string;
  plot_points: string[];
  duration_seconds: number;
  aspect_ratio: string;
  main_prompt: string;
  negative_prompt: string;
  tags: string[];
  variants?: PromptVariant[];
}

export interface AppState {
  isAnalyzing: boolean;
  isMixing: boolean;
  error: string | null;
  result: PromptResult | null;
  selectedFile: File | null;
  previewUrl: string | null;
  context: string;
}

export enum TabType {
  PREVIEW = 'PREVIEW',
  JSON = 'JSON'
}

export {};
