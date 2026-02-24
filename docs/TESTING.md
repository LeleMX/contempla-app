# Estrategia de Pruebas - Contempla

Este documento detalla el plan integral de pruebas para asegurar la calidad, funcionalidad y experiencia de usuario del proyecto Contempla.

## 1. 🧪 Pruebas Unitarias (Unit Testing)

Las pruebas unitarias verifican la lógica aislada de servicios y componentes críticos.

### Ejecución
Para correr las pruebas unitarias automatizadas:
```bash
npx ng test
```

### Cobertura Actual
*   **`AuthService`**: Verifica la inyección de dependencias y la creación del servicio de autenticación.
*   **`MenuService`**: Verifica la inyección de dependencias (`Firestore`, `StorageService`) y la creación del servicio de gestión de menús.

> **Nota Técnica**: Se utilizan mocks (dobles de prueba) para aislar los servicios de la base de datos real (Firestore) durante las pruebas, garantizando velocidad y fiabilidad sin costos de nube.

---

## 2. ⚙️ Pruebas Funcionales (Functional Testing)

Estas pruebas validan que el sistema funcione según las especificaciones de negocio. Deben realizarse manualmente o automatizarse con herramientas E2E (como Cypress o Playwright).

### Escenario A: Experiencia del Comensal (Menú Digital)
| ID | Paso | Resultado Esperado |
|----|------|--------------------|
| A1 | Acceder a la URL pública (Home) | Carga rápida, visualización del Hero y botón "Ver Menú". |
| A2 | Navegar al Menú | Se muestran las categorías y los productos con precios. |
| A3 | Filtrar por Categoría | Al hacer clic en "Bebidas", solo se muestran bebidas. |
| A4 | Ver Detalle de Producto | Al hacer clic en un platillo, se abre un modal/lightbox con la foto ampliada y descripción completa. |
| A5 | Responsividad Móvil | El menú se adapta perfectamente a pantallas verticales de celular sin scroll horizontal. |

### Escenario B: Panel Administrativo
| ID | Paso | Resultado Esperado |
|----|------|--------------------|
| B1 | Acceso Oculto | Encontrar el acceso al login (e.g., botón pi `π` en el footer). |
| B2 | Login Fallido | Ingresar credenciales erróneas muestra mensaje de error. |
| B3 | Login Exitoso | Redirección al Dashboard administrativo. |
| B4 | Gestión de Productos (CRUD) | Poder crear, editar y eliminar un platillo. La imagen se sube correctamente. |
| B5 | Timeout de Sesión | Tras 5 minutos de inactividad, el usuario es desconectado automáticamente. |

### Escenario C: Sistema de Fidelización (Check-in)
| ID | Paso | Resultado Esperado |
|----|------|--------------------|
| C1 | Registro de Visita | Ingresar número celular registra un check-in exitoso. |
| C2 | Prevención de Fraude | Intentar hacer check-in nuevamente antes de 24 horas muestra mensaje de bloqueo/error. |

---

## 3. 👥 Pruebas de Aceptación de Usuario (UAT)

Estas pruebas son ejecutadas por el cliente final (Dueño de Restaurante) para validar que el sistema cumple sus necesidades.

### Guion de Prueba para el Administrador
1.  **Objetivo**: Verificar que puede actualizar precios rápidamente.
    *   *Acción*: Loguearse, buscar la "Hamburguesa Especial", cambiar precio de $150 a $160, guardar.
    *   *Verificación*: Abrir el menú público en su celular y confirmar el nuevo precio inmediatamente.

2.  **Objetivo**: Verificar auditoría de seguridad.
    *   *Acción*: Revisar la bitácora de cambios.
    *   *Verificación*: Debe aparecer el registro "Usuario X cambió precio de Hamburguesa a las HH:MM".

---

## 4. 🎨 Pruebas de Diseño y UX (Design Testing)

Aseguran que la interfaz sea estética, usable y accesible.

### Checklist de Diseño Visual
- [ ] **Glassmorphism**: Verificar que los fondos semitransparentes tengan el efecto de desenfoque (`backdrop-filter: blur`) correcto en navegadores modernos.
- [ ] **Tipografía**: Las fuentes manuscritas deben ser legibles en títulos, y las sans-serif en cuerpos de texto.
- [ ] **Espaciado**: Márgenes consistentes entre tarjetas de productos (Grid Layout).
- [ ] **Imágenes**: Las imágenes de comida no deben deformarse (`object-fit: cover`).

### Checklist de Accesibilidad (A11y)
- [ ] **Contraste**: El texto sobre fondos claros/oscuros debe tener suficiente contraste.
- [ ] **Navegación por Teclado**: Es posible navegar el menú usando solo `Tab` y `Enter`.
- [ ] **Textos Alternativos**: Las imágenes de productos deben tener atributos `alt` descriptivos para lectores de pantalla.

### Pruebas de Compatibilidad (Cross-Browser)
- [ ] Google Chrome (Desktop/Mobile)
- [ ] Safari (iOS/macOS) - Crítico para usuarios de iPhone en restaurantes.
- [ ] Mozilla Firefox
