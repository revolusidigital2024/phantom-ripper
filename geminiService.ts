
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PromptResult, PromptVariant } from "./types";

export const analyzeMedia = async (
  file: File,
  context: string,
  apiKey: string
): Promise<PromptResult> => {
  if (!apiKey) throw new Error("API KEY MISSING: Pasang key dulu di panel System Config! 💀");
  
  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await fileToBase64(file);
  
  const parts = [
    {
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    },
    {
      text: `You are a high-end Cinema Production Specialist & Aesthetic Auditor. 
      DECONSTRUCT this media into a technical "Visual DNA" profile.
      
      FOCUS AREAS:
      - Subject & Costume details.
      - Exact Lighting temperature and direction.
      - Lens characteristics (bokeh, distortion, flare).
      - Environment textures and color palette.
      
      Additional User Context: "${context || 'Provide a professional cinematic breakdown.'}"
      
      Output MUST be a valid JSON matching the schema provided.`
    }
  ];

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vibe_title: { type: Type.STRING },
          subject: { type: Type.STRING },
          environment: { type: Type.STRING },
          mood: { type: Type.STRING },
          style: { type: Type.STRING },
          camera: { type: Type.STRING },
          motion: { type: Type.STRING },
          angle: { type: Type.STRING },
          lens: { type: Type.STRING },
          lighting: { type: Type.STRING },
          audio: { type: Type.STRING },
          setting: { type: Type.STRING },
          place: { type: Type.STRING },
          time: { type: Type.STRING },
          characters: { type: Type.STRING },
          plot_points: { type: Type.ARRAY, items: { type: Type.STRING } },
          duration_seconds: { type: Type.NUMBER },
          aspect_ratio: { type: Type.STRING },
          main_prompt: { type: Type.STRING },
          negative_prompt: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["vibe_title", "subject", "main_prompt", "plot_points"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as PromptResult;
};

export const generateVariants = async (
  originalResult: PromptResult, 
  file: File,
  apiKey: string
): Promise<PromptVariant[]> => {
  if (!apiKey) throw new Error("API KEY MISSING: Cek panel System Config. 💀");
  
  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await fileToBase64(file);
  
  const prompt = `You are a Director of Photography (DoP) working on a continuous sequence. 
  Look at the attached media and use the following MASTER DNA as an absolute anchor.
  
  MASTER DNA ANCHORS (DO NOT CHANGE):
  - Subject DNA: ${originalResult.subject}
  - Time/Weather: ${originalResult.time}
  - Environment/Location: ${originalResult.environment}
  - Lighting Profile: ${originalResult.lighting}
  - Visual Style: ${originalResult.style}
  
  TASK: Generate 5 TECHNICAL SHOT VARIANTS that are 100% DNA-LOCKED to this scene.
  
  STRICT DNA LOCK RULES:
  1. TEMPORAL LOCK: Maintain exact lighting intensity and color temperature.
  2. SPATIAL LOCK: All shots must exist within the exact same location/set.
  3. SUBJECT LOCK: Subject, clothing, and props must be identical.
  4. GEAR LOCK: Match the camera sensor and grain profile of the source.
  
  Variation should only come from camera placement and movement (e.g., Extreme Close Up, Low Angle tracking, etc.).
  
  Output 5 FULL-SPEC technical objects in a JSON array.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: file.type } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            shot_number: { type: Type.NUMBER },
            vibe_title: { type: Type.STRING },
            action_focus: { type: Type.STRING },
            main_prompt: { type: Type.STRING },
            negative_prompt: { type: Type.STRING },
            technical_specs: {
              type: Type.OBJECT,
              properties: {
                angle: { type: Type.STRING },
                lens: { type: Type.STRING },
                motion: { type: Type.STRING },
                lighting: { type: Type.STRING },
                camera: { type: Type.STRING },
              },
              required: ["angle", "lens", "motion"]
            }
          },
          required: ["shot_number", "vibe_title", "main_prompt", "technical_specs"],
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate shot extensions");
  return JSON.parse(text) as PromptVariant[];
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};
