import { LoggerService } from '@nestjs/common';
import * as pkg from '../../package.json';

export function bootstrapLogger(logger: LoggerService, nodeEnv: string) {
    logger.log('info', 'db       .d88b.   .o88b.  .d8b.  db       .d88b.     d88b  .d8b.  ');
    logger.log('info', '88      .8P  Y8. d8P  Y8 d8\' `8b 88      .8P  Y8.    `8P\' d8\' `8b ');
    logger.log('info', '88      88    88 8P      88ooo88 88      88    88     88  88ooo88 ');
    logger.log('info', '88      88    88 8b      88~~~88 88      88    88     88  88~~~88 ');
    logger.log('info', '88booo. `8b  d8\' Y8b  d8 88   88 88booo. `8b  d8\' db. 88  88   88 ');
    logger.log('info', 'Y88888P  `Y88P\'   `Y88P\' YP   YP Y88888P  `Y88P\'  Y8888P  YP   YP ');
    logger.log('info', '');
    logger.log('info', `${pkg.name} v${pkg.version} Copyright (C) ${new Date().getFullYear()} Psousaj`);
    logger.log('info', `Running in: ${nodeEnv} mode on ${process.platform}`);
    logger.log('info', `Server Time: ${new Date().toString()}`);
}
