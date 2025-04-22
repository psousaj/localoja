// src/common/logger/custom-logger.service.ts
import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

@Injectable()
export class AppLogger extends ConsoleLogger {
    log(message: string) {
        super.log(message);
    }

    info(message: string) {
        super.log(message); // alias pra log()
    }

    warn(message: string) {
        super.warn(message);
    }

    error(message: string, trace?: string) {
        super.error(message, trace);
    }

    debug(message: string) {
        super.debug?.(message);
    }

    verbose(message: string) {
        super.verbose?.(message);
    }
}
