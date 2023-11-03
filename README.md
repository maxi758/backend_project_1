# backend_project_1

## Descripción

Este proyecto es una API REST que permite realizar operaciones CRUD sobre una base de datos de usuarios.

## Instalación

Para instalar el proyecto, se debe clonar el repositorio y ejecutar el siguiente comando:

```bash
npm install
```

## Uso

Para ejecutar el proyecto, se debe ejecutar el siguiente comando:

```bash
npm start
```

## API

ruta base: http://localhost:5000/api

### GET /categories

Devuelve un listado de todas las categorías.

page: número de página
limit: cantidad de elementos por página

### GET /categories/:id

Devuelve una categoría en particular.

### POST /categories

Crea una nueva categoría.

### PATCH /categories/:id

Actualiza una categoría existente.

### DELETE /categories/:id

Elimina una categoría existente.

### GET /products

Devuelve un listado de todos los productos.

page: número de página
limit: cantidad de elementos por página

### GET /products/:id

Devuelve un producto en particular.

### GET /products/categories/:id

Devuelve un listado de todos los productos de una categoría.

### POST /products

Crea un nuevo producto.

### PATCH /products/:id

Actualiza un producto existente.

### DELETE /products/:id

Elimina un producto existente.

### GET /orders

Devuelve un listado de todas las órdenes.

page: número de página
limit: cantidad de elementos por página

### GET /orders/:id

Devuelve una orden en particular.

### POST /orders

Crea una nueva orden vacía. No recibe elementos en el body.

### POST /orders//products

Crea una nueva orden con productos. Recibe un array con los ids de los productos.

### PATCH /orders/:id

Actualiza una orden existente. Recibe un array con los ids de los productos. Solo guarda los nuevos elementos, enviar todos los productos que se quieran guardar.

### PATCH /orders/:id/products/:id

Agrega un producto a una orden existente.

### DELETE /orders/:id

Elimina una orden existente.

### DELETE /orders/:id/products/:id

Elimina un producto de una orden existente.

### DELETE /orders/:id/products

Elimina todos los productos de una orden existente.
