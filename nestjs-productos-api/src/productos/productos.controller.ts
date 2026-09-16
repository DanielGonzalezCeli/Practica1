import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductosService, Producto } from './productos.service';

const productoSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    nombre: { type: 'string' },
    precio: { type: 'number' },
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
    description: 'Producto encontrado.',
    schema: productoSchema,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number): Producto {
    return this.productosService.findOne(id);
  }
}