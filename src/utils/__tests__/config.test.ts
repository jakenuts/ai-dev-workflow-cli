import { jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { loadConfig, getProjectConfig, syncConfigWithTemplate, ProjectConfig } from '../config';

// Mock dependencies
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn()
}));
jest.mock('path');
jest.mock('yaml');

// Get mocked modules
const mockedFs = jest.mocked(fs);
const mockedPath = jest.mocked(path);
const mockedYaml = jest.mocked(yaml);

describe('Config Utilities', () => {
  const mockConfig: ProjectConfig = {
    project: {
      name: 'test-project',
      type: 'test',
      description: 'Test Project'
    },
    name: 'test',
    development_workflow: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup common path mock
    mockedPath.join.mockImplementation((...paths) => paths.join('/'));
    mockedPath.dirname.mockImplementation((p) => p.split('/').slice(0, -1).join('/'));

    // Setup default mocks
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue('config content');
    mockedYaml.parse.mockReturnValue(mockConfig);
  });

  describe('loadConfig', () => {
    it('should load and parse config file', async () => {
      const result = await loadConfig();

      expect(result).toEqual(mockConfig);
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('config.yaml'),
        'utf8'
      );
      expect(mockedYaml.parse).toHaveBeenCalledWith('config content');
    });

    it('should return null if config file does not exist', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      const result = await loadConfig();

      expect(result).toBeNull();
    });
  });

  describe('getProjectConfig', () => {
    it('should return project config', async () => {
      const result = await getProjectConfig();

      expect(result).toEqual(mockConfig);
    });

    it('should return null if config file does not exist', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      const result = await getProjectConfig();

      expect(result).toBeNull();
    });
  });

  describe('syncConfigWithTemplate', () => {
    it('should sync config with template', async () => {
      const mockTemplate = {
        project: {
          name: 'template-project',
          type: 'template',
          description: 'Template Project'
        }
      };

      mockedFs.readFileSync.mockReturnValue('template content');
      mockedYaml.parse.mockReturnValue(mockTemplate);
      mockedYaml.stringify.mockReturnValue('stringified template');
      mockedPath.dirname.mockReturnValue('.ai');

      await syncConfigWithTemplate('template.yaml');

      expect(mockedFs.readFileSync).toHaveBeenCalledWith('template.yaml', 'utf8');
      expect(mockedFs.mkdirSync).toHaveBeenCalledWith('.ai', { recursive: true });
      expect(mockedYaml.stringify).toHaveBeenCalledWith(mockTemplate);
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        'stringified template'
      );
    });

    it('should throw error if template does not exist', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await expect(syncConfigWithTemplate('template.yaml'))
        .rejects
        .toThrow('Template not found: template.yaml');
    });

    it('should create config directory if it does not exist', async () => {
      const mockTemplate = {
        project: {
          name: 'template-project',
          type: 'template',
          description: 'Template Project'
        }
      };

      mockedFs.readFileSync.mockReturnValue('template content');
      mockedYaml.parse.mockReturnValue(mockTemplate);
      mockedYaml.stringify.mockReturnValue('stringified template');
      mockedPath.dirname.mockReturnValue('.ai');

      await syncConfigWithTemplate('template.yaml');

      expect(mockedFs.mkdirSync).toHaveBeenCalledWith('.ai', { recursive: true });
    });

    it('should handle template parsing errors', async () => {
      mockedFs.readFileSync.mockReturnValue('invalid yaml');
      mockedYaml.parse.mockImplementation(() => {
        throw new Error('Invalid YAML');
      });

      await expect(syncConfigWithTemplate('template.yaml'))
        .rejects
        .toThrow('Invalid YAML');
    });
  });
});
