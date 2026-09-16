# Contrato de API — GET /productos

| Recurso     | Verbo | Código de respuesta | Descripción de la respuesta                          |
|-------------|-------|----------------------|--------------------------------------------------------|
| /productos  | GET   | 200                  | Lista de productos: `[{ id, nombre, precio }]`         |
| /productos  | GET   | 500                  | Error interno del servidor al procesar la solicitud    |

## Detalle

### 200 OK

Devuelve un arreglo de productos, cada uno con la siguiente estructura:

```json
[
  {
    "id": 1,
    "nombre": "Producto ejemplo",
    "precio": 19.99
  }
]
```

| Campo   | Tipo   | Descripción                  |
|---------|--------|-------------------------------|
| id      | number | Identificador único del producto |
| nombre  | string | Nombre del producto           |
| precio  | number | Precio del producto           |

### 500 Internal Server Error

Se retorna cuando ocurre un fallo inesperado en el servidor al procesar la solicitud.

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```
