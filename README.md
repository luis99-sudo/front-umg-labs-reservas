# UMG Labs — Frontend de reserva de laboratorios

Frontend React que consume la API ya construida en
`https://umg-api-django.onrender.com/api`. Toda la lógica de negocio
(validaciones de traslape, horario hábil, permisos) vive en el backend; este
front solo la consume y la presenta.

## Stack

- React 18 + Vite 7 + React Router 6
- Tailwind CSS
- Axios (con interceptor que agrega `X-User-ID` automáticamente)
- react-datepicker, react-hot-toast, date-fns, lucide-react

## Requisitos

- Node.js 18 o superior

## Desarrollo local

```bash
npm install
npm run dev
```

Por defecto apunta al backend de Render. Si necesitas apuntar a otro backend
(por ejemplo uno local), copia `.env.example` a `.env` y ajusta
`VITE_API_URL`.

## Build de producción

```bash
npm run build
npm run preview   # para probar el build localmente
```

## Reemplazar el repo actual en GitHub

1. Vacía el contenido de tu repo `front-umg-labs-reservas` (o crea una rama
   nueva) y copia todo el contenido de esta carpeta encima.
2. Haz commit y push a `main`.
3. Vercel detecta el push automáticamente y despliega — no hay que tocar
   nada en la configuración de Vercel; `vercel.json` sigue siendo el mismo
   rewrite catch-all de SPA que ya tenías.
4. Si quieres que Vercel use una URL de API distinta a la de Render por
   defecto, agrega la variable de entorno `VITE_API_URL` en el dashboard de
   Vercel (Project Settings → Environment Variables). Si no la agregas, el
   front sigue apuntando a Render igual que ahora.

## Roles y credenciales

El primer login siempre debe ser un usuario `Admin` ya existente en la base
de datos (el backend no expone `GET /api/roles/`, así que los IDs de rol se
fijaron en `src/constants.js` como 1 = Admin, 2 = Docente — confirmado
manualmente, no derivado de ningún endpoint).

## Estructura

```
src/
  api/          Una función por endpoint, agrupadas por dominio
  constants.js  Roles, horario hábil, estados de reserva
  context/      AuthContext (sesión + rol)
  routes/       PrivateRoute (protección por sesión/rol)
  layouts/      DashboardLayout (sidebar + topbar por rol)
  components/   Modales de formulario y el HorarioGrid (grilla de 48 franjas)
  pages/
    Login.jsx
    docente/    NuevaReserva, MisReservas
    admin/      Reservas, Usuarios, Laboratorios, Bloqueos, Bitacora
```

## Decisiones que vale la pena recordar

- El botón "Editar" de una reserva solo lo ve el rol Admin, aunque el
  backend técnicamente también lo permite al docente dueño de la reserva.
- El `X-User-ID` (solicitante) siempre es el usuario logueado — nunca se
  pide ni se elige manualmente, para no romper la trazabilidad de la
  bitácora (HU-009).
- El horario hábil (07:00–22:00) está hardcodeado en el front porque
  también lo está en el backend; no hay endpoint que lo exponga.
