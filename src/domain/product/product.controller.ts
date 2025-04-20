import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() options: PaginationDto & Partial<CreateProductDto>) {
    return this.productService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string | number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string | number) {
    return this.productService.remove(+id);
  }
}
