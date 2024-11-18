import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { statSync } from 'fs';

interface FileMetadata {
  type: 'file' | 'directory';
  size: number;
}

class Explorer {
  private rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  async findFiles(pattern: string): Promise<string[]> {
    try {
      const matches = await glob(pattern, { cwd: this.rootDir, nodir: true });
      return matches;
    } catch (error) {
      console.error('Error finding files:', error);
      return [];
    }
  }

  async findPriorityFiles(): Promise<string[]> {
    const priorityPatterns = [
      'package.json',
      'tsconfig.json',
      'README.md',
      'TODO.md',
      '.gitignore',
      'src/**/*.ts'
    ];

    const allFiles: string[] = [];
    for (const pattern of priorityPatterns) {
      const files = await this.findFiles(pattern);
      allFiles.push(...files);
    }

    return allFiles;
  }

  getFileMetadata(filePath: string): FileMetadata {
    const fullPath = path.join(this.rootDir, filePath);
    const stats = statSync(fullPath);
    return {
      type: stats.isDirectory() ? 'directory' : 'file',
      size: stats.size
    };
  }
}

export function createExplorer(rootDir: string): Explorer {
  return new Explorer(rootDir);
}
