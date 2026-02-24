# Documentación de Contempla

Bienvenido a la documentación técnica del proyecto **Contempla**. Esta plataforma integral "All-in-One" está diseñada para modernizar la presencia digital de negocios gastronómicos y comerciales.

## 📚 Índice de Documentación

Esta documentación está dividida en varias secciones para facilitar su lectura y mantenimiento:

1.  **[Arquitectura del Sistema](./ARCHITECTURE.md)**
    *   Descripción general de la arquitectura Angular + Firebase.
    *   Estructura de directorios.
    *   Diagramas de flujo de datos.

2.  **[Estrategia de Pruebas](./TESTING.md)**
    *   **Pruebas Unitarias**: Cómo ejecutar y escribir pruebas con Vitest/Karma.
    *   **Pruebas Funcionales**: Casos de prueba manuales para las funcionalidades clave.
    *   **Pruebas de Usuario (UAT)**: Guiones para validación con usuarios finales.
    *   **Pruebas de Diseño**: Verificación de UI/UX y accesibilidad.

3.  **[Guía de Clean Code y Estándares](./CLEAN_CODE.md)**
    *   Convenciones de nomenclatura.
    *   Buenas prácticas en Angular y TypeScript.
    *   Principios SOLID aplicados.

## 🚀 Inicio Rápido

Para poner en marcha el proyecto localmente:

1.  **Instalar dependencias**:
    ```bash
    npm install --legacy-peer-deps
    ```

2.  **Configurar entorno**:
    Asegúrate de tener los archivos `src/environments/environment.ts` y `src/environments/environment.development.ts` configurados con tus credenciales de Firebase.

3.  **Ejecutar servidor de desarrollo**:
    ```bash
    ng serve
    ```
    Navega a `http://localhost:4200/`.

4.  **Ejecutar pruebas unitarias**:
    ```bash
    npx ng test
    ```

## 🤝 Contribución

Por favor, revisa la guía de [Clean Code](./CLEAN_CODE.md) antes de enviar cambios al repositorio.
