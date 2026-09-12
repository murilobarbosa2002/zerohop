import type { SourcesOptions } from 'electron';

export const CAPTURE_SOURCE_TYPES: SourcesOptions['types'] = ['window', 'screen'];
export const CAPTURE_THUMBNAIL_WIDTH = 300;
export const CAPTURE_THUMBNAIL_HEIGHT = 200;
export const NOISE_SOURCE_NAME_PATTERNS = [/^notifica[çc][ãa]o\b/i, /^notification\b/i, /^toast\b/i];
export const EXPERIMENTAL_WGC_CAPTURE_FEATURES = 'AllowWgcScreenCapturer,AllowWgcWindowCapturer';
