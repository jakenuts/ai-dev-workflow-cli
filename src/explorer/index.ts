import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { loadConfig } from '../utils/config';

interface ExplorerOptions {
  path?: string;
  pattern?: string;
}

export class ProjectExplorer {
  private config: any;
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.config = loadConfig();
  }

  /**
   * Find priority files based on project type and configuration
   */
  async findPriorityFiles(): Promise<string[]> {
    if (!this.config?.project?.type) {
      return [];
    }

    const projectType = this.config.project.type;
    const priorityPatterns = this.getPriorityPatterns(projectType);
    
    const files: string[] = [];
    for (const pattern of priorityPatterns) {
      const matches = await this.findFiles(pattern);
      files.push(...matches);
    }

    return files;
  }

  /**
   * Get priority file patterns based on project type
   */
  private getPriorityPatterns(projectType: string): string[] {
    const commonPatterns = [
      'README.md',
      'package.json',
      'composer.json',
      'requirements.txt',
      '.gitignore'
    ];

    const typePatterns: Record<string, string[]> = {
      webapp: [
        'src/index.*',
        'src/app.*',
        'public/index.html',
        'src/routes/*',
        'src/components/*'
      ],
      library: [
        'src/index.*',
        'src/lib/*',
        'tests/*'
      ],
      cli: [
        'src/cli.*',
        'src/commands/*',
        'bin/*'
      ]
    };

    return [...commonPatterns, ...(typePatterns[projectType] || [])];
  }

  /**
   * Find files matching a glob pattern
   */
  async findFiles(pattern: string): Promise<string[]> {
    // Implementation would use a glob library like fast-glob
    // For now, basic implementation
    const results: string[] = [];
    const search = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(this.projectRoot, fullPath);

        if (entry.isDirectory()) {
          search(fullPath);
        } else if (this.matchesPattern(entry.name, pattern)) {
          results.push(relativePath);
        }
      }
    };

    search(this.projectRoot);
    return results;
  }

  /**
   * Basic pattern matching
   */
  private matchesPattern(filename: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*');
    return new RegExp(`^${regexPattern}$`).test(filename);
  }

  /**
   * Get file metadata
   */
  getFileMetadata(filepath: string): any {
    const fullPath = path.join(this.projectRoot, filepath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const stats = fs.statSync(fullPath);
    return {
      path: filepath,
      size: stats.size,
      modified: stats.mtime,
      type: path.extname(filepath).slice(1) || 'unknown'
    };
  }
}

// Export a factory function for easier instantiation
export function createExplorer(projectRoot: string): ProjectExplorer {
  return new ProjectExplorer(projectRoot);
}
