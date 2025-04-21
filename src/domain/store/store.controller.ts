import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Inject } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { StoreDto } from './dto/store.dto';
import { StoreResponseDto } from './dto/store-response.dto';

@Controller('stores')
export class StoreController {
  constructor(
    @Inject()
    private readonly storeService: StoreService
  ) { }

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    const savedStore = await this.storeService.create(createStoreDto);

    return plainToInstance(StoreDto, savedStore, {
      excludeExtraneousValues: false
    });
  }

  @Get()
  async getAllStores(@Query() pagination: PaginationDto): Promise<StoreResponseDto> {
    const data = await this.storeService.findAll(pagination);

    return plainToInstance(StoreResponseDto, data, {
      excludeExtraneousValues: false,
      enableCircularCheck: true
    });
  }

  @Get('/:storeId')
  findOne(@Param('storeId', ParseUUIDPipe) storeId: string) {
    const data = this.storeService.findOne(storeId);

    return plainToInstance(StoreResponseDto, data, {
      excludeExtraneousValues: false,
      enableCircularCheck: true,
    });
  }

  @Get('/state/:uf')
  findByUf(@Query('uf') uf: string) {
    return this.storeService.findByUf(uf);
  }

  @Patch('/:storeId')
  update(@Param('storeId', ParseUUIDPipe) storeId: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(storeId, updateStoreDto);
  }

  @Delete('/:storeId')
  remove(@Param('storeId', ParseUUIDPipe) storeId: string) {
    return this.storeService.remove(storeId);
  }
}
