import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, ValidationPipe, Query, Inject } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Controller('stores')
export class StoreController {
  constructor(
    @Inject()
    private readonly storeService: StoreService
  ) { }

  @Post()
  create(@Body(new ValidationPipe()) createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  async getAllStores(@Query() pagination: PaginationDto) {
    return this.storeService.findAll(pagination);
  }

  @Get('/:storeId')
  findOne(@Param('storeId', new ParseUUIDPipe()) storeId: string) {
    return this.storeService.findOne(storeId);
  }

  @Get('/state/:uf')
  findByUf(@Query('uf') uf: string) {
    return this.storeService.findByUf(uf);
  }

  @Patch('/:storeId')
  update(@Param('storeId', new ParseUUIDPipe(), new ValidationPipe()) storeId: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(storeId, updateStoreDto);
  }

  @Delete('/:storeId')
  remove(@Param('storeId', new ParseUUIDPipe()) storeId: string) {
    return this.storeService.remove(storeId);
  }
}
