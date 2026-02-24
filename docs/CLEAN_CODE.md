# Guía de Clean Code y Buenas Prácticas - Contempla

Para mantener la mantenibilidad, escalabilidad y legibilidad del código de Contempla, seguimos estrictos estándares de ingeniería de software.

## 1. 🧹 Principios Generales (Clean Code)

### Naming Conventions
*   **Variables y Propiedades**: `camelCase`. Deben ser descriptivas.
    *   ✅ `menuItems`, `isLoggedIn`, `userProfile`
    *   ❌ `list`, `flag`, `data`
*   **Clases y Componentes**: `PascalCase`.
    *   ✅ `AuthService`, `ProductCardComponent`
*   **Archivos**: `kebab-case`.
    *   ✅ `auth.service.ts`, `product-card.component.html`

### Funciones y Métodos
*   **Responsabilidad Única**: Una función debe hacer una sola cosa y hacerla bien.
*   **Tamaño**: Evitar funciones de más de 20-30 líneas. Si crece, refactorizar en sub-funciones privadas.
*   **Argumentos**: Limitar a máximo 3 argumentos. Si se necesitan más, usar un objeto de configuración o interfaz.

## 2. 🅰️ Estándares Angular

### Componentes "Smart" vs "Dumb"
*   **Smart (Contenedores)**: Componentes de página (`pages/`) que interactúan con servicios, manejan datos y estado.
*   **Dumb (Presentacionales)**: Componentes (`components/`) que solo reciben datos via `@Input()` y emiten eventos via `@Output()`. No deben inyectar servicios complejos ni acceder a la BD directamente.

### Gestión de Suscripciones (RxJS)
*   Evitar fugas de memoria (memory leaks).
*   Usar `AsyncPipe` (`| async`) en las plantillas siempre que sea posible para que Angular gestione la suscripción automáticamente.
*   Si se suscribe manualmente en `.ts`, asegurar la desuscripción en `ngOnDestroy` o usar operadores como `takeUntil`.

### Inyección de Dependencias
*   Usar la función `inject()` (Angular 14+) para inyectar dependencias de manera más limpia y funcional, en lugar del constructor clásico, donde sea coherente con el estilo del equipo.

## 3. 🛡️ TypeScript y Tipado

*   **Evitar `any`**: El tipo `any` desactiva el chequeo de tipos, perdiendo los beneficios de TS. Usar interfaces o tipos específicos.
    *   ✅ `user: User`
    *   ❌ `user: any`
*   **Interfaces**: Definir interfaces para todos los modelos de datos (ver `src/app/core/models/`).

## 4. 🎨 CSS y Tailwind

*   **Utilidad primero**: Usar clases de utilidad de Tailwind para estilos directos.
*   **Componentes CSS**: Para patrones repetitivos complejos (botones con múltiples estados), usar `@apply` en `styles.css` o crear componentes Angular reutilizables, evitando ensuciar el HTML con cadenas de clases excesivamente largas.

## 5. 📝 Documentación de Código

*   **Comentarios**: El código debe ser auto-explicativo. Los comentarios deben explicar el *POR QUÉ* de una decisión compleja, no el *QUÉ* hace el código (eso debe ser obvio al leerlo).
*   **JSDoc**: Usar JSDoc (`/** ... */`) para documentar servicios públicos y métodos complejos, detallando parámetros y valores de retorno.

---

> "Cualquier tonto puede escribir código que un ordenador entienda. Los buenos programadores escriben código que los humanos entiendan." - Martin Fowler
