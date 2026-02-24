# Arquitectura del Sistema - Contempla

## 🏗️ Visión General
Contempla está construido sobre una arquitectura **Serverless** utilizando **Google Firebase** como backend y **Angular 18+** como framework frontend SPA (Single Page Application). El diseño sigue principios de modularidad y separación de responsabilidades.

## 🛠️ Tecnologías Principales

### Frontend
*   **Angular (v18+)**: Framework robusto para aplicaciones empresariales.
*   **TailwindCSS**: Framework de utilidades CSS para diseño rápido y responsivo.
*   **RxJS**: Programación reactiva para manejo de eventos y flujo de datos asíncronos.
*   **Angular Router**: Gestión de navegación SPA.

### Backend (Firebase)
*   **Firebase Authentication**: Gestión de identidades (Email/Password).
*   **Cloud Firestore**: Base de datos NoSQL en tiempo real.
*   **Cloud Storage**: Almacenamiento de objetos (imágenes del menú).
*   **Firebase Hosting**: Alojamiento estático y CDN global.

## 📂 Estructura de Directorios

La estructura sigue las recomendaciones oficiales de Angular con una separación clara por responsabilidades:

```bash
src/app/
├── components/       # Componentes de presentación reutilizables (UI "tonta")
│   ├── navbar/       # Barra de navegación
│   └── ...
├── core/             # Lógica de negocio central (Singletons)
│   ├── guards/       # Protección de rutas (AuthGuard)
│   ├── services/     # Comunicación con Firebase y gestión de estado
│   │   ├── auth.service.ts
│   │   ├── menu.service.ts
│   │   └── ...
│   └── models/       # Interfaces TypeScript (User, MenuItem)
├── layouts/          # Estructuras maestras de página
│   ├── main-layout/  # Layout público (Landing, Menú)
│   └── admin-layout/ # Layout administrativo (Panel de control)
├── pages/            # Vistas principales enrutadas (Smart Components)
│   ├── home/         # Landing Page
│   ├── login/        # Inicio de sesión
│   ├── menu-public/  # Vista del menú para clientes
│   ├── menu-admin/   # Gestión del menú para dueños
│   └── ...
└── app.routes.ts     # Definición de rutas y Lazy Loading
```

## 🔄 Flujo de Datos y Estado

1.  **Patrón de Servicios**: Los componentes delegan la lógica de negocio y comunicación de datos a los servicios en `core/services/`.
2.  **Reactividad**: Se utiliza `RxJS` (`BehaviorSubject`, `Observable`) para propagar cambios de estado (como el usuario autenticado) a través de la aplicación sin prop drilling excesivo.
3.  **Fuente de Verdad**: Firestore actúa como la fuente de verdad. Los servicios se suscriben a colecciones en tiempo real (`onSnapshot`) para mantener la UI sincronizada automáticamente.

## 🔒 Seguridad y Escalabilidad

*   **Autenticación**: `AuthService` gestiona el ciclo de vida de la sesión, incluyendo timeouts por inactividad.
*   **Protección de Rutas**: `AuthGuard` verifica el estado de autenticación antes de permitir acceso a rutas administrativas `/admin/*`.
*   **Validación de Inputs**: Sanitización básica en el frontend antes de enviar datos a Firebase.
*   **Manejo de Errores**: Bloques `try-catch` en operaciones asíncronas para fallos de red o base de datos.

## 📦 Construcción y Despliegue

El proyecto utiliza `ng build` para compilar la aplicación en archivos estáticos optimizados (`dist/`), que luego se despliegan a Firebase Hosting mediante `firebase deploy`.
