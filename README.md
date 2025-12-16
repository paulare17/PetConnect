# PetConnect

## Overview

Aplicación web SPA desarrollada con React y Django REST Framework orientada a facilitar la adopción de animales de compañía. La plataforma conecta protectoras y refugios de animales con personas interesadas en adoptar, proporcionando herramientas de búsqueda avanzada, sistema de chat en tiempo real y asistente virtual con inteligencia artificial.

## Features

- Registro y autenticación de usuarios con roles diferenciados (adoptantes y protectoras)
- Publicación y gestión de fichas de animales en adopción
- Búsqueda y filtrado avanzado de mascotas por características
- Sistema de favoritos para guardar animales de interés
- Chat en tiempo real entre adoptantes y protectoras
- Asistente virtual (chatbot) con IA para resolver dudas frecuentes
- Generación automática de descripciones de mascotas mediante IA
- Interfaz multiidioma (Castellano, Catalán, Inglés)
- Diseño responsive adaptado a dispositivos móviles y escritorio
- Modo oscuro/claro personalizable

## Tech Stack

**Frontend:**
- React 19
- Vite 7
- Material UI 7
- Bootstrap 5
- Axios
- i18next (internacionalización)
- React Router DOM 7

**Backend:**
- Python 3
- Django 5.2
- Django REST Framework 3.16
- Django Simple JWT (autenticación)
- OpenAI API (servicios IA)
- NLTK (procesamiento lenguaje natural)
- Gunicorn (servidor WSGI)

**Chat Server:**
- Node.js
- Express 4
- WebSocket (ws)

**Base de Datos:**
- PostgreSQL 15

**DevOps:**
- Docker
- Docker Compose
- Nginx (servidor frontend)
- Git

## System Requirements

**Para ejecución con Docker (recomendado):**
- Docker >= 20.10
- Docker Compose >= 2.0
- 4 GB RAM mínimo

**Para desarrollo local:**
- Node.js >= 18.x
- npm >= 9.x
- Python >= 3.10
- pip >= 21.x
- PostgreSQL >= 15

**Navegador:**
- Navegador moderno compatible con ES6+ (Chrome, Firefox, Edge, Safari)

## Installation

### Opción 1: Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/PetConnect.git
cd PetConnect

# Iniciar todos los servicios
docker-compose up --build
```

La aplicación estará disponible en:
- **Frontend:** http://localhost:4173
- **Backend API:** http://localhost:8000
- **Chat WebSocket:** ws://localhost:8081

### Opción 2: Desarrollo Local

**Backend:**
```bash
cd backend/PetConnect
python -m venv venv
venv\Scripts\activate  # En Windows
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

**Chat Server:**
```bash
cd backend/chat-server
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Usage

### Acceso a la Aplicación

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:4173 |
| API REST | http://localhost:8000/api/ |
| Panel Admin Django | http://localhost:8000/admin/ |
| Chat WebSocket | ws://localhost:8081 |

### Flujo Principal de Uso

**Para Adoptantes:**
1. Registrarse como usuario adoptante
2. Explorar el catálogo de mascotas disponibles
3. Utilizar filtros para buscar por especie, tamaño, edad, etc.
4. Guardar mascotas en favoritos
5. Contactar con la protectora a través del chat en tiempo real
6. Consultar dudas al asistente virtual (chatbot)

**Para Protectoras:**
1. Registrarse como protectora/refugio
2. Publicar fichas de animales en adopción
3. Utilizar el generador IA para crear descripciones atractivas
4. Gestionar solicitudes y conversaciones con adoptantes
5. Actualizar el estado de las mascotas (adoptado, en proceso, etc.)

### Condiciones de Operación

- Todos los servicios (backend, frontend, chat-server, base de datos) deben estar en ejecución
- Para funcionalidades de IA, se requiere configurar la API key de OpenAI en las variables de entorno
- El sistema soporta múltiples usuarios concurrentes en el chat en tiempo real

## Project Structure

```
PetConnect/
├── docker-compose.yml          # Orquestación de servicios
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt        # Dependencias Python
│   ├── entrypoint.sh
│   │
│   ├── chat-server/            # Servidor WebSocket (Node.js)
│   │   ├── server.js
│   │   └── package.json
│   │
│   └── PetConnect/             # Proyecto Django
│       ├── manage.py
│       ├── PetConnect/         # Configuración principal
│       │   ├── settings.py
│       │   ├── urls.py
│       │   └── wsgi.py
│       ├── usuarios/           # App: Gestión de usuarios
│       │   ├── models.py
│       │   ├── views.py
│       │   ├── serializers.py
│       │   └── urls.py
│       ├── mascotas/           # App: Gestión de mascotas
│       │   ├── models.py
│       │   ├── views.py
│       │   ├── serializers.py
│       │   └── urls.py
│       ├── chat/               # App: Sistema de chat
│       │   ├── models.py
│       │   ├── views.py
│       │   └── urls.py
│       ├── ai_service/         # App: Servicios de IA
│       │   ├── chatbot_faq.py
│       │   ├── description_generator.py
│       │   └── views.py
│       └── media/              # Archivos subidos
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf              # Configuración servidor web
    ├── package.json
    ├── vite.config.js
    ├── index.html
    │
    └── src/
        ├── main.jsx            # Entry point
        ├── App.jsx             # Componente raíz
        ├── i18n.js             # Configuración idiomas
        ├── theme.js            # Tema Material UI
        ├── api/
        │   └── client.js       # Cliente Axios
        ├── components/         # Componentes React
        │   ├── Navbar/
        │   ├── Footer/
        │   ├── Chat/
        │   ├── ChatBot/
        │   ├── MostraMascotes/
        │   ├── Forms/
        │   └── ...
        ├── context/            # Context API (Auth, DarkMode)
        ├── hooks/              # Custom hooks
        ├── constants/          # Constantes y configuración
        └── locales/            # Traducciones (es, ca, en)
```

## Available Scripts

### Docker

| Comando | Descripción |
|---------|-------------|
| `docker-compose up --build` | Construye e inicia todos los servicios |
| `docker-compose up -d` | Inicia servicios en segundo plano |
| `docker-compose down` | Detiene y elimina los contenedores |
| `docker-compose logs -f` | Muestra logs en tiempo real |

### Frontend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo (Vite) |
| `npm run build` | Genera build de producción |
| `npm run preview` | Previsualiza build de producción |
| `npm run lint` | Ejecuta ESLint para análisis de código |

### Backend (Django)

| Comando | Descripción |
|---------|-------------|
| `python manage.py runserver` | Inicia servidor de desarrollo |
| `python manage.py migrate` | Aplica migraciones de base de datos |
| `python manage.py makemigrations` | Genera nuevas migraciones |
| `python manage.py createsuperuser` | Crea usuario administrador |
| `python manage.py collectstatic` | Recopila archivos estáticos |

### Chat Server

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia servidor WebSocket |
| `npm run dev` | Inicia con nodemon (hot-reload) |

## Configuration

### Variables de Entorno

Las variables de entorno se configuran en archivos `.env` y **no deben incluirse en el repositorio**.

**Backend (`backend/PetConnect/PetConnect.env`):**

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DJANGO_SECRET_KEY` | Clave secreta de Django | `tu-clave-secreta-aqui` |
| `DJANGO_DEBUG` | Modo debug | `True` / `False` |
| `DJANGO_ALLOWED_HOSTS` | Hosts permitidos | `localhost,127.0.0.1` |
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `CORS_ALLOWED_ORIGINS` | Orígenes CORS permitidos | `http://localhost:5173` |
| `OPENAI_API_KEY` | API key de OpenAI (para IA) | `sk-...` |

**Frontend (`frontend/.env`):**

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend API | `http://localhost:8000` |
| `VITE_WS_URL` | URL del servidor WebSocket | `ws://localhost:8081` |

### Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `docker-compose.yml` | Orquestación de servicios Docker |
| `backend/PetConnect/PetConnect/settings.py` | Configuración Django |
| `frontend/vite.config.js` | Configuración Vite |
| `frontend/nginx.conf` | Configuración servidor web producción |

### Diferencias entre Entornos

| Aspecto | Desarrollo | Producción |
|---------|------------|------------|
| `DJANGO_DEBUG` | `True` | `False` |
| Base de datos | SQLite | PostgreSQL |
| Servidor frontend | Vite dev server | Nginx |
| Servidor backend | Django runserver | Gunicorn |
| CORS | `localhost:5173` | Dominio producción |

## Code Standards

### Convenciones de Nombres

**Frontend (React):**
- Componentes: PascalCase (`ChatBot.jsx`, `MostraMascotes.jsx`)
- Hooks: camelCase con prefijo `use` (`useAuth.jsx`, `useMascotas.jsx`)
- Archivos de contexto: PascalCase (`AuthProvider.jsx`, `DarkModeProvider.jsx`)
- Constantes: camelCase o UPPER_SNAKE_CASE (`colors.jsx`, `ROLES`)

**Backend (Python/Django):**
- Clases: PascalCase (`MascotaViewSet`, `UsuarioSerializer`)
- Funciones y variables: snake_case (`get_queryset`, `is_active`)
- Constantes: UPPER_SNAKE_CASE (`TAMAÑOS`, `ESPECIES`)
- Apps Django: minúsculas (`usuarios`, `mascotas`, `chat`)

### Organización del Código

**Frontend:**
- Componentes organizados por funcionalidad en carpetas independientes
- Separación de lógica de negocio en hooks personalizados
- Contextos para estado global (autenticación, tema)
- Constantes centralizadas en `/constants`
- Traducciones separadas por idioma en `/locales`

**Backend:**
- Arquitectura Django apps para separación de dominios
- Serializers para transformación de datos
- ViewSets para endpoints REST
- Signals para lógica desacoplada
- Permisos personalizados por rol de usuario

### Principios de Diseño

- **Componentes funcionales**: Uso exclusivo de React Hooks
- **Separación de responsabilidades**: Lógica, presentación y datos desacoplados
- **DRY (Don't Repeat Yourself)**: Componentes y hooks reutilizables
- **API RESTful**: Endpoints siguiendo convenciones REST
- **Internacionalización**: Textos externalizados para soporte multiidioma

## Contributing

### Flujo de Colaboración

1. **Fork** del repositorio
2. **Clonar** tu fork localmente
   ```bash
   git clone https://github.com/tu-usuario/PetConnect.git
   ```
3. **Crear rama** para tu feature o fix
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```
4. **Realizar cambios** siguiendo los estándares de código
5. **Commit** con mensajes descriptivos
   ```bash
   git commit -m "feat: añadir funcionalidad X"
   ```
6. **Push** a tu fork
   ```bash
   git push origin feature/nombre-descriptivo
   ```
7. **Pull Request** con descripción técnica detallada

### Convención de Ramas

| Prefijo | Uso |
|---------|-----|
| `feature/` | Nueva funcionalidad |
| `fix/` | Corrección de errores |
| `hotfix/` | Corrección urgente en producción |
| `docs/` | Cambios en documentación |
| `refactor/` | Refactorización de código |

### Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato (sin cambios de código)
- `refactor:` Refactorización
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento
## License

Este proyecto está bajo la licencia **MIT License**.

