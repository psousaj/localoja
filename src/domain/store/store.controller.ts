import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Inject
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PaginatedResponse, PaginatedStoreResponse, PaginatedStoreWithFreteResponse } from '../dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { StoreDto } from './dto/store.dto';
import { StoreResponseDto } from './dto/store-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('Stores')
@Controller('stores')
export class StoreController {
  constructor(
    @Inject()
    private readonly storeService: StoreService
  ) { }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova loja' })
  @ApiResponse({ status: 201, description: 'Loja criada com sucesso', type: StoreDto })
  @ApiBody({ type: CreateStoreDto })
  async create(@Body() createStoreDto: CreateStoreDto) {
    const savedStore = await this.storeService.create(createStoreDto);
    return plainToInstance(StoreDto, savedStore, {
      excludeExtraneousValues: false
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as lojas' })
  @ApiResponse({ status: 200, description: 'Lista paginada de lojas', type: PaginatedStoreResponse })
  @ApiQuery({ name: 'offset', required: false, description: 'Deslocamento para paginação' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de itens por página' })
  async getAllStores(@Query() pagination: PaginatedStoreResponse & Partial<CreateStoreDto>) {
    const data = await this.storeService.findAll(pagination);
    return plainToInstance(StoreResponseDto, data, {
      excludeExtraneousValues: false,
      enableCircularCheck: true
    });
  }

  @Get('/:storeId')
  @ApiOperation({ summary: 'Busca uma loja pelo ID' })
  @ApiParam({ name: 'storeId', description: 'UUID da loja' })
  @ApiResponse({ status: 200, description: 'Loja encontrada', type: PaginatedStoreResponse })
  findOne(@Param('storeId', ParseUUIDPipe) storeId: string) {
    const data = this.storeService.findOne(storeId);
    return plainToInstance(StoreResponseDto, data, {
      excludeExtraneousValues: false,
      enableCircularCheck: true,
    });
  }

  @Get('/state/:uf')
  @ApiOperation({ summary: 'Lista lojas por estado (UF)' })
  @ApiParam({ name: 'uf', description: 'Sigla do estado (ex: SP, RJ, MG)' })
  @ApiQuery({ name: 'offset', required: false, description: 'Deslocamento para paginação' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de itens por página' })
  @ApiResponse({ status: 200, description: 'Lista de lojas por estado', type: PaginatedStoreResponse })
  findByUf(@Param('uf') uf: string, @Query() pagination: PaginatedResponse) {
    return this.storeService.findByUf(uf, pagination);
  }

  @Patch('/:storeId')
  @ApiOperation({ summary: 'Atualiza uma loja pelo ID' })
  @ApiParam({ name: 'storeId', description: 'UUID da loja' })
  @ApiBody({ type: UpdateStoreDto })
  @ApiResponse({ status: 200, description: 'Loja atualizada', type: UpdateStoreDto })
  update(@Param('storeId', ParseUUIDPipe) storeId: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(storeId, updateStoreDto);
  }

  @Delete('/:storeId')
  @ApiOperation({ summary: 'Remove uma loja pelo ID' })
  @ApiParam({ name: 'storeId', description: 'UUID da loja' })
  @ApiResponse({ status: 200, description: 'Loja removida' })
  remove(@Param('storeId', ParseUUIDPipe) storeId: string) {
    return this.storeService.remove(storeId);
  }

  @Get('/cep/:postalCode')
  @ApiOperation({ summary: 'Busca lojas elegíveis para entrega baseado no CEP do cliente' })
  @ApiParam({ name: 'postalCode', description: 'CEP do cliente' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filtrar por uma loja específica (opcional)' })
  @ApiQuery({ name: 'offset', required: false, description: 'Deslocamento para paginação' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de itens por página' })
  @ApiResponse({ status: 200, description: 'Opções de frete encontradas', type: PaginatedStoreWithFreteResponse })
  findFreteOptions(
    @Param('postalCode') postalCode: string,
    @Query() queryOptions: PaginatedResponse
  ) {
    return this.storeService.findFreteOptions(postalCode, queryOptions);
  }
}
