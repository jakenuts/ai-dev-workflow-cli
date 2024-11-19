// Mock chalk for all tests
jest.mock('chalk', () => ({
  default: {
    yellow: jest.fn((str) => `[yellow]${str}[/yellow]`),
    green: jest.fn((str) => `[green]${str}[/green]`),
    red: jest.fn((str) => `[red]${str}[/red]`),
    gray: jest.fn((str) => `[gray]${str}[/gray]`)
  },
  yellow: jest.fn((str) => `[yellow]${str}[/yellow]`),
  green: jest.fn((str) => `[green]${str}[/green]`),
  red: jest.fn((str) => `[red]${str}[/red]`),
  gray: jest.fn((str) => `[gray]${str}[/gray]`)
}));
