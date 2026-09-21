import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
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
  @ApiQuery({
    name: 'nombre',
    required: false,
    description: 'Filtra por nombre (sin distinguir mayúsculas). Si se omite, devuelve todos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos.',
    schema: { type: 'array', items: productoSchema },
  })
  findAll(@Query('nombre') nombre?: string) {
    return this.productosService.findAll(nombre);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por id' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado, con enlaces HATEOAS.',
    schema: productoConLinksSchema,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const producto = await this.productosService.findOne(id);
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
  async crear(@Body() dto: CrearProductoDto, @Res({ passthrough: true }) res: Response) {
    const nuevo = await this.productosService.crear(dto);
    res.setHeader('Location', `/api/v1/productos/${nuevo.id}`);
    return nuevo;
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reemplazar(@Param('id', ParseIntPipe) id: number, @Body() dto: CrearProductoDto) {
    await this.productosService.reemplazar(id, dto);
  }

  @Patch(':id')
  async actualizarPrecio(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarPrecioDto) {
    return this.productosService.actualizarPrecio(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    await this.productosService.eliminar(id);
  }
 
}