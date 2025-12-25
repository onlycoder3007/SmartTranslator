
export enum TranslationMode {
  UZ_RU = 'UZ_RU',
  UZ_EN = 'UZ_EN'
}

export type AppStatus = 'READY' | 'TRANSLATING' | 'ERROR' | 'SUCCESS';

export interface AppSettings {
  mode: TranslationMode;
  apiKey: string;
}

export interface TranslationResult {
  original: string;
  translated: string;
  timestamp: number;
}
