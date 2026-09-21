import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { Producto } from './producto.entity';
import { Response } from 'express'
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarPrecioDto } from './dto/actualizar-precio.dto';

const productoSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    nombre: { type: 'string' },
    precio: { type: 'number' },
  },
};

const linkSchema = {
  type: 'object',
  properties: {
    href: { type: 'string' },
    method: { type: 'string' },
  },
};

const productoConLinksSchema = {
  type: 'object',
  properties: {
    ...productoSchema.properties,
    _links: {
      type: 'object',
      properties: {
        self: linkSchema,
        actualizar: linkSchema,
        eliminar: linkSchema,
      },
    },
  },
};

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos.',
    schema: { type: 'array', items: productoSchema },
  })
  findAll(): Producto[] {
    return this.productosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por id' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado, con enlaces HATEOAS.',
    schema: productoConLinksSchema,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    const producto = this.productosService.findOne(id);
    const href = `/api/v1/productos/${producto.id}`;
    return {
      ...producto,
      _links: {
        self: { href },
        actualizar: { href, method: 'PUT' },
        eliminar: { href, method: 'DELETE' },
      },
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  crear(@Body() dto: CrearProductoDto, @Res({ passthrough: true }) res: Response) {
    const nuevo = this.productosService.crear(dto);
    res.setHeader('Location', `/api/v1/productos/${nuevo.id}`);
    return nuevo;
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  reemplazar(@Param('id', ParseIntPipe) id: number, @Body() dto: CrearProductoDto) {
    this.productosService.reemplazar(id, dto);
  }

  @Patch(':id')
  actualizarPrecio(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarPrecioDto) {
    return this.productosService.actualizarPrecio(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param('id', ParseIntPipe) id: number) {
    this.productosService.eliminar(id);
  }
 
}