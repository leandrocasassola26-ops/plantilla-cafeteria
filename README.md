# Plantilla Cafetería

Aplicación independiente y personalizable para cafeterías.

Incluye dos experiencias dentro del mismo proyecto aislado:

- App del cliente: carta, carrito, retiro o delivery, promociones, puntos y seguimiento.
- Panel de la empresa: comandas, delivery, clientes, menú, stock, caja y reportes.

## Aislamiento

Cada negocio creado desde esta plantilla debe recibir:

1. Un repositorio nuevo.
2. Un proyecto Supabase nuevo.
3. Variables de entorno nuevas.
4. Un despliegue y dominio nuevos.

Nunca se reutilizan las credenciales ni la base de datos de otro cliente.

## Personalización

La identidad de demostración está en `lib/config.ts`. En el aprovisionamiento final se reemplazará por una configuración persistida durante el alta en Mica Studio.

## Base de datos

`supabase/schema.sql` contiene el esquema inicial para empresa, perfiles, sucursales, servicios, promociones, clientes, turnos, actividad y notificaciones.

## Desarrollo

```bash
npm install
npm run dev
```

- App del cliente: `http://localhost:3000`
- Panel de la empresa: `http://localhost:3000/admin`
