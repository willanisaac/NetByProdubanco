# Angular Login Sidebar

Una aplicación Angular con TypeScript que incluye un sistema de login y una barra lateral con paneles desplegables.

## Características

- 🔐 **Sistema de Login**: Autenticación de usuario con validación de formularios
- 📱 **Barra Lateral**: Navegación lateral con botones para diferentes paneles
- 📊 **Panel de Estadísticas**: Dashboard con métricas y gráficos simulados
- ⚙️ **Panel de Configuración**: Opciones de configuración del sistema
- 🎨 **Diseño Responsivo**: Interfaz adaptativa para diferentes dispositivos
- ✨ **Animaciones**: Transiciones suaves entre paneles

## Credenciales de Prueba

- **Usuario**: `admin`
- **Contraseña**: `admin`

## Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos para ejecutar

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar la aplicación en modo desarrollo**:
   ```bash
   npm start
   ```

3. **Abrir en el navegador**:
   Navega a `http://localhost:4200`

### Comandos disponibles

- `npm start` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas unitarias

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.css
│   │   ├── dashboard/
│   │   │   ├── dashboard.component.ts
│   │   │   ├── dashboard.component.html
│   │   │   └── dashboard.component.css
│   │   ├── product-modal/
│   │   │   └── product-modal.component.ts
│   │   └── notification/
│   │       └── notification.component.ts
│   ├── models/
│   │   ├── product.model.ts
│   │   └── movement.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   └── notification.service.ts
│   ├── styles/
│   │   └── global.css
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── styles.css
├── index.html
└── main.ts
```

## Funcionalidades

### Sistema de Login
- Formulario de autenticación con validación
- Manejo de estados de carga
- Mensajes de error
- Persistencia de sesión en localStorage
- Tema personalizado con colores corporativos

### Dashboard
- **Barra Lateral**: Navegación fija con botones para diferentes paneles
- **Gestión de Productos**: 
  - **Integración completa con API REST**: CRUD completo con `https://localhost:7298/api/Products`
  - **Crear productos** (POST): Modal con formulario validado
  - **Actualizar productos** (PUT): Edición inline con modal
  - **Eliminar productos** (DELETE): Confirmación y eliminación segura
  - Lista completa de productos con filtros
  - Búsqueda por nombre y descripción
  - Filtros por categoría y estado
  - Indicadores de stock bajo
  - Estados de carga y manejo de errores
  - Estadísticas de inventario en tiempo real
  - Sistema de notificaciones elegante
- **Gestión de Movimientos**:
  - Registro de entradas y salidas de inventario
  - Filtros por tipo de movimiento y fecha
  - Búsqueda por producto, razón o usuario
  - Estadísticas de movimientos diarios
  - Historial completo de transacciones

### Características Técnicas
- **Angular 17**: Framework moderno con standalone components
- **TypeScript**: Tipado estático para mayor robustez
- **Routing**: Navegación con guards de autenticación
- **HTTP Client**: Comunicación con API REST
- **CSS Grid y Flexbox**: Layout responsivo
- **Animaciones CSS**: Transiciones suaves
- **Servicios**: Manejo de estado con RxJS
- **Arquitectura Modular**: Componentes separados en archivos individuales
- **Sistema de Notificaciones**: Feedback visual para el usuario
- **Validación de Formularios**: Validación en tiempo real

## Operaciones CRUD de Productos

### Crear Producto (POST)
- **Endpoint**: `POST https://localhost:7298/api/Products`
- **Funcionalidad**: Modal con formulario validado
- **Campos**: Nombre, descripción, categoría, URL de imagen, precio, stock
- **Validaciones**: Campos requeridos, tipos de datos, rangos válidos

### Actualizar Producto (PUT)
- **Endpoint**: `PUT https://localhost:7298/api/Products/{id}`
- **Funcionalidad**: Modal pre-poblado con datos existentes
- **Validaciones**: Mismas validaciones que crear
- **Feedback**: Notificación de éxito/error

### Eliminar Producto (DELETE)
- **Endpoint**: `DELETE https://localhost:7298/api/Products/{id}`
- **Funcionalidad**: Confirmación antes de eliminar
- **Seguridad**: Doble confirmación para evitar eliminaciones accidentales
- **Feedback**: Notificación de éxito/error

### Leer Productos (GET)
- **Endpoint**: `GET https://localhost:7298/api/Products`
- **Funcionalidad**: Carga automática al inicializar
- **Filtros**: Búsqueda, categoría, estado
- **Estados**: Carga, error, datos vacíos

## Personalización

### Agregar nuevos paneles

1. Agregar un nuevo botón en la barra lateral:
   ```typescript
   <button class="sidebar-button" (click)="showPanel('nuevoPanel')">
     <i>🔧</i>
     Nuevo Panel
   </button>
   ```

2. Crear el contenido del panel:
   ```typescript
   <div *ngIf="activePanel === 'nuevoPanel'" class="panel fade-in">
     <h2 class="panel-title">Nuevo Panel</h2>
     <div class="panel-content">
       <!-- Contenido del panel -->
     </div>
   </div>
   ```

3. Actualizar los métodos `getPanelTitle()` y `getPanelSubtitle()`

### Modificar estilos

Los estilos están organizados en `src/styles.css` con clases específicas para cada componente. Puedes personalizar:

- Colores del tema
- Tamaños de fuente
- Espaciado
- Animaciones

## Tecnologías Utilizadas

- **Angular 17**
- **TypeScript**
- **RxJS**
- **CSS3** (Grid, Flexbox, Animations)
- **HTML5**

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
