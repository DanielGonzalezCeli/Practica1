# Contrato CRUD de /productos — Semana 2

| Operación           | Verbo  | URI                        | Éxito         |
|---------------------|--------|----------------------------|---------------|
| Listar              | GET    | `/api/v1/productos`        | 200           |
| Obtener uno         | GET    | `/api/v1/productos/{id}`   | 200 / 404     |
| Crear               | POST   | `/api/v1/productos`        | 201 + Location|
| Reemplazar          | PUT    | `/api/v1/productos/{id}`   | 204           |
| Actualizar parcial  | PATCH  | `/api/v1/productos/{id}`   | 200           |
| Eliminar            | DELETE | `/api/v1/productos/{id}`   | 204 / 404     |

## Detalle por operación

### Listar — `GET /api/v1/productos`
Devuelve la lista completa de productos.

- **200 OK** — arreglo de `{ id, nombre, precio }`.

### Obtener uno — `GET /api/v1/productos/{id}`
Devuelve un solo producto por su id.

- **200 OK** — `{ id, nombre, precio }`.
- **404 Not Found** — el id no existe.

### Crear — `POST /api/v1/productos`
Crea un producto nuevo. Cuerpo esperado: `{ nombre, precio }` (validado con DTO).

- **201 Created** — devuelve el producto creado (con su `id` asignado) y el header `Location` apuntando a `/api/v1/productos/{id}`.
- **400 Bad Request** — datos inválidos (ej. `nombre` vacío o `precio` no positivo).

### Reemplazar — `PUT /api/v1/productos/{id}`
Reemplaza el producto completo. Cuerpo esperado: `{ nombre, precio }` (el objeto entero, es idempotente).

- **204 No Content** — reemplazo exitoso, sin cuerpo de respuesta.
- **400 Bad Request** — datos inválidos.
- **404 Not Found** — el id no existe.

### Actualizar parcial — `PATCH /api/v1/productos/{id}`
Actualiza solo el precio. Cuerpo esperado: `{ precio }`.

- **200 OK** — devuelve el producto ya actualizado.
- **400 Bad Request** — precio inválido.
- **404 Not Found** — el id no existe.

### Eliminar — `DELETE /api/v1/productos/{id}`
Elimina un producto (operación idempotente: repetirla no causa error 500).

- **204 No Content** — eliminado correctamente.
- **404 Not Found** — el id no existe (incluye la segunda vez que se borra el mismo id).
