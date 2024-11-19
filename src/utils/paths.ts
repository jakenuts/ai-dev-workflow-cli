import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Gets the directory name for the current module, equivalent to __dirname in CommonJS
 * @param importMetaUrl The import.meta.url of the calling module
 * @returns The directory path
 */
export function getDirname(importMetaUrl: string): string {
  return fileURLToPath(new URL('.', importMetaUrl));
}

/**
 * Resolves a path relative to the current module's directory
 * @param importMetaUrl The import.meta.url of the calling module
 * @param ...paths Path segments to join with the dirname
 * @returns The resolved path
 */
export function resolveFromDir(importMetaUrl: string, ...paths: string[]): string {
  return join(getDirname(importMetaUrl), ...paths);
}
