import { jest } from '@jest/globals';
import { runTests, loadTestConfig, runTest } from '../test';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import path from 'path';
import type { ProjectConfig } from '../config';
import type { AIContext } from '../context';
import * as contextModule from '../context';
import * as configModule from '../config';
import * as yamlModule from '../yaml';

// Mock dependencies
jest.mock('child_process');
jest.mock('fs');
jest.mock('../context');
jest.mock('../config');
jest.mock('../yaml');

// Mock chalk
jest.mock('chalk', () => ({
  default: {
    yellow: jest.fn((str: string) => `[yellow]${str}[/yellow]`),
    green: jest.fn((str: string) => `[green]${str}[/green]`),
    red: jest.fn((str: string) => `[red]${str}[/red]`),
    gray: jest.fn((str: string) => `[gray]${str}[/gray]`)
  }
}));

// Create mock implementations
const mockContext: AIContext = {
  config: null,
  workflow: { history: [] },
  memory: {}
};

const mockConfig: ProjectConfig = {
  project: {
    name: 'test-project',
    type: 'test',
    description: 'Test Project'
  },
  name: 'test',
  development_workflow: {},
  test: { command: 'jest' }
};

// Setup mocked functions
const mockedContext = jest.mocked(contextModule);
const mockedConfig = jest.mocked(configModule);
const mockedYaml = jest.mocked(yamlModule);

describe('Test Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementations
    mockedContext.loadAIContext.mockResolvedValue(mockContext);
    mockedConfig.getProjectConfig.mockResolvedValue(mockConfig);
    mockedYaml.loadYamlFile.mockImplementation((_, defaultConfig) => Promise.resolve(defaultConfig));
  });

  describe('runTests', () => {
    it('should run tests with default options', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      await runTests({});

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        [],
        expect.objectContaining({
          stdio: 'inherit',
          shell: true
        })
      );
    });

    it('should add correct args based on options', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      await runTests({
        files: 'test.ts',
        update: true,
        watch: true,
        coverage: true,
        analyze: true
      });

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        expect.arrayContaining([
          'test.ts',
          '--updateSnapshot',
          '--watch',
          '--coverage',
          '--coverageDirectory=.ai/coverage',
          '--json',
          '--outputFile=.ai/test-results.json'
        ]),
        expect.any(Object)
      );
    });

    it('should throw error when tests fail', async () => {
      jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 1,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      await expect(runTests({})).rejects.toThrow('Tests failed with exit code 1');
    });
  });

  describe('loadTestConfig', () => {
    it('should return default config when file does not exist', async () => {
      const config = await loadTestConfig('test/path');

      expect(config).toEqual({
        name: 'Default Test Suite',
        tests: []
      });
    });
  });

  describe('runTest', () => {
    it('should run test steps and return true', async () => {
      const mockTest = {
        name: 'Test Suite',
        description: 'Test Description',
        steps: [
          {
            name: 'Step 1',
            command: 'test command'
          }
        ]
      };

      const consoleSpy = jest.spyOn(console, 'log');
      const result = await runTest(mockTest);

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test Suite'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Step 1'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('test command'));
    });
  });
});
