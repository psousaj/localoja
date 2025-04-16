import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { domainRepositories } from './repository.provider';

@Global()
@Module({
    providers: [...databaseProviders, ...domainRepositories],
    exports: [...databaseProviders, ...domainRepositories],
})
export class DatabaseModule { }
