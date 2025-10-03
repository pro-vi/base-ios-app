type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogConfig {
  enabledLevels: Set<LogLevel>;
  isDevelopment: boolean;
}

class Logger {
  private static instance: Logger;
  private config: LogConfig = {
    enabledLevels: new Set(['DEBUG', 'INFO', 'WARN', 'ERROR']),
    isDevelopment: __DEV__,
  };

  private levelPriority: Record<LogLevel, number> = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
  };

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setMinLevel(level: LogLevel): void {
    const minPriority = this.levelPriority[level];
    this.config.enabledLevels.clear();

    Object.entries(this.levelPriority).forEach(([lvl, priority]) => {
      if (priority >= minPriority) {
        this.config.enabledLevels.add(lvl as LogLevel);
      }
    });
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.isDevelopment && level === 'DEBUG') {
      return false;
    }
    return this.config.enabledLevels.has(level);
  }

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const prefix = context ? `[${timestamp}] [${level}] [${context}]` : `[${timestamp}] [${level}]`;
    return `${prefix} ${message}`;
  }

  private log(level: LogLevel, message: string, data?: any, context?: string): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);
    const consoleMethod = this.getConsoleMethod(level);

    if (data !== undefined) {
      console[consoleMethod](formattedMessage, data);
    } else {
      console[consoleMethod](formattedMessage);
    }
  }

  private getConsoleMethod(level: LogLevel): 'log' | 'warn' | 'error' {
    switch (level) {
      case 'ERROR':
        return 'error';
      case 'WARN':
        return 'warn';
      default:
        return 'log';
    }
  }

  debug(message: string, data?: any, context?: string): void {
    this.log('DEBUG', message, data, context);
  }

  info(message: string, data?: any, context?: string): void {
    this.log('INFO', message, data, context);
  }

  warn(message: string, data?: any, context?: string): void {
    this.log('WARN', message, data, context);
  }

  error(message: string, error?: any, context?: string): void {
    const errorData =
      error instanceof Error ? { message: error.message, stack: error.stack } : error;
    this.log('ERROR', message, errorData, context);
  }
}

export const logger = Logger.getInstance();
export default logger;
