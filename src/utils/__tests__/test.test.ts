import { jest } from '@jest/globals';
import { runTests, loadTestConfig, runTest } from '../test';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import path from 'path';
import * as configModule from '../config';
import * as yamlModule from '../yaml';
import type { ProjectConfig } from '../config';

// Mock dependencies
jest.mock('child_process');
jest.mock('fs');
jest.mock('../config');
jest.mock('../yaml');

// Mock chalk
jest.mock('chalk', () => ({
  __esModule: true,
  default: {
    yellow: jest.fn().mockImplementation((str: unknown) => `[yellow]${String(str).trim()}[/yellow]`),
    green: jest.fn().mockImplementation((str: unknown) => `[green]${String(str).trim()}[/green]`),
    red: jest.fn().mockImplementation((str: unknown) => `[red]${String(str).trim()}[/red]`),
    gray: jest.fn().mockImplementation((str: unknown) => `[gray]${String(str).trim()}[/gray]`)
  }
}));

describe('Test Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock config
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
    jest.mocked(configModule.getProjectConfig).mockResolvedValue(mockConfig);

    // Setup mock yaml
    jest.mocked(yamlModule.loadYamlFile).mockImplementation((_, defaultConfig) => Promise.resolve(defaultConfig));
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

    it('should throw error when no project config found', async () => {
      jest.mocked(configModule.getProjectConfig).mockResolvedValue(null);

      await expect(runTests({})).rejects.toThrow('Project configuration not found');
    });

    it('should use default test command when not specified', async () => {
      const mockConfig: ProjectConfig = {
        project: {
          name: 'test-project',
          type: 'test',
          description: 'Test Project'
        },
        name: 'test',
        development_workflow: {}
      };
      jest.mocked(configModule.getProjectConfig).mockResolvedValue(mockConfig);

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

    it('should analyze test results when requested', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      const mockResults = {
        numTotalTestSuites: 5,
        numTotalTests: 10,
        numFailedTests: 0,
        testResults: [],
        startTime: 0,
        success: true,
        coverage: {
          statements: { pct: 90 },
          branches: { pct: 85 },
          functions: { pct: 95 },
          lines: { pct: 92 }
        }
      };

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockResults));

      await runTests({ analyze: true });

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        expect.arrayContaining(['--json', '--outputFile=.ai/test-results.json']),
        expect.any(Object)
      );
    });

    it('should handle missing test results file', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      await runTests({ analyze: true });

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        expect.arrayContaining(['--json', '--outputFile=.ai/test-results.json']),
        expect.any(Object)
      );
    });

    it('should handle slow test performance', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      const mockResults = {
        numTotalTestSuites: 5,
        numTotalTests: 10,
        numFailedTests: 0,
        testResults: [],
        startTime: 0,
        success: true,
        coverage: {
          statements: { pct: 70 },
          branches: { pct: 65 },
          functions: { pct: 75 },
          lines: { pct: 72 }
        }
      };

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockResults));

      await runTests({ analyze: true });

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        expect.arrayContaining(['--json', '--outputFile=.ai/test-results.json']),
        expect.any(Object)
      );
    });

    it('should handle invalid test results JSON', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue('invalid json');

      await runTests({ analyze: true });

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        expect.arrayContaining(['--json', '--outputFile=.ai/test-results.json']),
        expect.any(Object)
      );
    });

    it('should handle missing coverage data', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      const mockResults = {
        numTotalTestSuites: 5,
        numTotalTests: 10,
        numFailedTests: 0,
        testResults: [],
        startTime: 0,
        success: true
      };

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockResults));

      await runTests({ analyze: true });

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        expect.arrayContaining(['--json', '--outputFile=.ai/test-results.json']),
        expect.any(Object)
      );
    });
  });

  describe('loadTestConfig', () => {
    it('should return default config when file does not exist', async () => {
      const defaultConfig = {
        name: 'Default Test Suite',
        tests: []
      };

      jest.mocked(yamlModule.loadYamlFile).mockResolvedValue(defaultConfig);

      const config = await loadTestConfig('test/path');

      expect(config).toEqual(defaultConfig);
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

    it('should handle test steps without commands', async () => {
      const mockTest = {
        name: 'Test Suite',
        description: 'Test Description',
        steps: [
          {
            name: 'Step 1'
          }
        ]
      };

      const result = await runTest(mockTest);

      expect(result).toBe(true);
    });

    it('should handle test without description', async () => {
      const mockTest = {
        name: 'Test Suite',
        steps: [
          {
            name: 'Step 1',
            command: 'test command'
          }
        ]
      };

      const result = await runTest(mockTest);

      expect(result).toBe(true);
    });

    it('should handle test without steps', async () => {
      const mockTest = {
        name: 'Test Suite',
        description: 'Test Description',
        steps: []
      };

      const result = await runTest(mockTest);

      expect(result).toBe(true);
    });
  });
});
