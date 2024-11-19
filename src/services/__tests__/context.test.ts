import { jest } from '@jest/globals';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import {
  loadContext,
  saveContext,
  clearContext,
  addHistoryEntry,
  ContextData,
  displayContext
} from '../context';

// Mock fs/promises
jest.mock('fs/promises');
const mockedFs = jest.mocked(fs);

// Mock yaml
jest.mock('js-yaml', () => ({
  load: jest.fn(),
  dump: jest.fn((obj) => JSON.stringify(obj))
}));

// Mock chalk
jest.mock('chalk', () => ({
  yellow: jest.fn((str) => `[yellow]${str}[/yellow]`),
  green: jest.fn((str) => `[green]${str}[/green]`),
  red: jest.fn((str) => `[red]${str}[/red]`),
  gray: jest.fn((str) => `[gray]${str}[/gray]`)
}));

// Mock console.log for displayContext tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Context Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (yaml.dump as jest.Mock).mockImplementation((obj) => JSON.stringify(obj));
    jest.mocked(yaml.load).mockImplementation((data: unknown) => {
      if (typeof data === 'string') {
        return JSON.parse(data);
      }
      return null;
    });
  });

  describe('loadContext', () => {
    it('should load existing context', async () => {
      const mockContext: ContextData = {
        history: [],
        data: { test: 'value' }
      };
      
      mockedFs.readFile.mockResolvedValueOnce(JSON.stringify(mockContext));
      
      const result = await loadContext();
      expect(result).toEqual(mockContext);
      expect(mockedFs.readFile).toHaveBeenCalled();
    });

    it('should create default context if file does not exist', async () => {
      const error = new Error('ENOENT');
      (error as NodeJS.ErrnoException).code = 'ENOENT';
      mockedFs.readFile.mockRejectedValueOnce(error);
      
      const result = await loadContext();
      expect(result).toEqual({
        history: [],
        data: {}
      });
      expect(mockedFs.writeFile).toHaveBeenCalled();
    });
  });

  describe('saveContext', () => {
    it('should save context to file', async () => {
      const mockContext: ContextData = {
        history: [],
        data: { test: 'value' }
      };
      
      await saveContext(mockContext);
      
      expect(mockedFs.mkdir).toHaveBeenCalled();
      expect(mockedFs.writeFile).toHaveBeenCalled();
      expect(yaml.dump).toHaveBeenCalledWith(mockContext, expect.any(Object));
    });

    it('should handle save errors', async () => {
      mockedFs.writeFile.mockRejectedValueOnce(new Error('Write failed'));
      
      const mockContext: ContextData = {
        history: [],
        data: {}
      };
      
      await expect(saveContext(mockContext)).rejects.toThrow('Failed to save context');
    });
  });

  describe('clearContext', () => {
    it('should clear all context data', async () => {
      await clearContext();
      
      expect(mockedFs.writeFile).toHaveBeenCalled();
      expect(yaml.dump).toHaveBeenCalledWith(
        expect.objectContaining({
          history: [],
          data: {}
        }),
        expect.any(Object)
      );
    });
  });

  describe('addHistoryEntry', () => {
    it('should add entry to history', async () => {
      const mockContext: ContextData = {
        history: [],
        data: {}
      };
      
      mockedFs.readFile.mockResolvedValueOnce(JSON.stringify(mockContext));
      
      await addHistoryEntry('test-command', 'success', 'test message', ['arg1']);
      
      expect(mockedFs.writeFile).toHaveBeenCalled();
      const dumpCalls = (yaml.dump as jest.Mock).mock.calls;
      const lastDumpCall = dumpCalls[dumpCalls.length - 1][0] as { history: Array<{
        command: string;
        status: string;
        message?: string;
        args?: string[];
        timestamp: string;
      }> };
      expect(lastDumpCall.history[0]).toMatchObject({
        command: 'test-command',
        status: 'success',
        message: 'test message',
        args: ['arg1']
      });
    });

    it('should limit history to 100 entries', async () => {
      const mockContext: ContextData = {
        history: Array(100).fill({
          timestamp: new Date().toISOString(),
          command: 'old-command',
          status: 'success'
        }),
        data: {}
      };
      
      mockedFs.readFile.mockResolvedValueOnce(JSON.stringify(mockContext));
      
      await addHistoryEntry('new-command', 'success');
      
      const dumpCalls = (yaml.dump as jest.Mock).mock.calls;
      const lastDumpCall = dumpCalls[dumpCalls.length - 1][0] as ContextData;
      expect(lastDumpCall.history).toHaveLength(100);
      expect(lastDumpCall.history[99].command).toBe('new-command');
    });
  });

  describe('displayContext', () => {
    it('should display context with verbose option', async () => {
      const mockContext: ContextData = {
        currentStep: 'current-step',
        history: [{
          timestamp: '2023-01-01T00:00:00.000Z',
          command: 'test-command',
          status: 'success',
          message: 'test message'
        }],
        data: { test: 'value' }
      };

      await displayContext(mockContext, { verbose: true });

      const calls = mockConsoleLog.mock.calls;
      expect(calls[0][0]).toContain('[yellow]Current Step:[/yellow]');
      expect(calls[0][0]).toContain('current-step');
      expect(calls[1][0]).toContain('[yellow]Command History:[/yellow]');
      expect(calls[2][0]).toContain('[green]✓[/green]');
      expect(calls[2][0]).toContain('test message');
    });

    it('should display limited history without verbose option', async () => {
      const mockContext: ContextData = {
        history: Array(10).fill({
          timestamp: '2023-01-01T00:00:00.000Z',
          command: 'test-command',
          status: 'success'
        }),
        data: {}
      };

      await displayContext(mockContext, { verbose: false });

      const calls = mockConsoleLog.mock.calls;
      expect(calls[0][0]).toContain('[yellow]Command History:[/yellow]');
      expect(calls[6][0]).toContain('[gray]... and 5 more entries[/gray]');
      expect(calls[7][0]).toContain('[green]Tip: Use --verbose flag to see all history and stored data[/green]');
    });
  });
});
