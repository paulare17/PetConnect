## 🔧 Cambios Necesarios en el Frontend

### 1. Actualizar CardAnimal.jsx (Vista Galería)

Actualmente el botón de favorito solo controla el estado local. Necesitas conectarlo al backend:

```jsx
// CardAnimal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client'; // Tu cliente axios configurado
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
// ... resto de imports

export default function CardAnimal({ animal, onLikeSuccess, sx }) {
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const data = animal || null;
  if (!data) return null;

  const handleToggleFavorito = async () => {
    if (loading) return; // Prevenir clicks múltiples
    
    setLoading(true);
    
    try {
      const action = isFavorito ? 'D' : 'L'; // Toggle entre Like y Dislike
      
      const response = await apiClient.post('/api/swipe/action/', {
        mascota_id: data.id,
        action: action
      });
      
      if (response.data.is_like && response.data.chat_id) {
        // Chat creado! Mostrar notificación y/o redirigir
        setIsFavorito(true);
        
        // Opción 1: Mostrar notificación
        alert(`¡Chat creado con ${data.nombre}! Puedes enviar un mensaje a la protectora.`);
        
        // Opción 2: Redirigir al chat automáticamente
        // navigate(`/chat/${response.data.chat_id}`);
        
        // Opción 3: Callback para el componente padre
        if (onLikeSuccess) {
          onLikeSuccess(data, response.data.chat_id);
        }
      } else {
        // Es un dislike
        setIsFavorito(false);
      }
      
    } catch (error) {
      console.error('Error al registrar interacción:', error);
      alert('Error al procesar tu interacción. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ... resto del código del componente
  
  return (
    <Card sx={{ ...sx, /* estilos */ }}>
      {/* ... */}
      
      {/* Botó favorit */}
      <IconButton
        onClick={handleToggleFavorito}
        disabled={loading}
        sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          backgroundColor: 'white',
          '&:hover': { backgroundColor: 'white' },
          opacity: loading ? 0.6 : 1
        }}
      >
        {isFavorito ? (
          <FavoriteIcon sx={{ color: 'red' }} />
        ) : (
          <FavoriteBorderIcon sx={{ color: colors.orange }} />
        )}
      </IconButton>
      
      {/* ... resto del componente */}
    </Card>
  );
}
```

### 2. Actualizar PetTinder.jsx (Vista Tinder)

Tu componente ya está casi listo, solo necesita mostrar el chat creado:

```jsx
// PetTinder.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TinderPet() {
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [chatCreated, setChatCreated] = useState(null);
    const navigate = useNavigate();

    // ... fetchNextAnimal igual que antes

    const handleAction = (actionType) => {
        if (!animal || animal.message) return;

        const actionData = {
            mascota_id: animal.id,
            action: actionType === 'like' ? 'L' : 'D'
        };

        axios.post('/api/swipe/action/', actionData)
            .then(response => {
                const wasLike = response.data.is_like;
                const chatId = response.data.chat_id;
                
                if (wasLike && chatId) {
                    setMessage(`¡Te gusta ${animal.nombre}! Chat creado.`);
                    setChatCreated(chatId);
                    
                    // Opción: Mostrar botón para ir al chat
                    setTimeout(() => {
                        const goToChat = window.confirm(
                            `¿Quieres enviar un mensaje a la protectora sobre ${animal.nombre}?`
                        );
                        if (goToChat) {
                            navigate(`/chat/${chatId}`);
                        } else {
                            fetchNextAnimal();
                        }
                    }, 1000);
                } else {
                    setMessage(`Acción ${actionType.toUpperCase()} registrada`);
                    setTimeout(() => fetchNextAnimal(), 500);
                }
            })
            .catch(err => {
                console.error(`Error al registrar ${actionType}:`, err);
                setMessage(`Error: No se pudo registrar la acción.`);
            });
    };

    // ... resto del código igual
    
    return (
        <div style={{ /* ... */ }}>
            <h1>Mascota para TinderPet</h1>

            {/* Mensaje con enlace al chat si fue creado */}
            {message && (
                <div style={{ 
                    color: chatCreated ? '#28a745' : '#007bff',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    fontSize: '18px'
                }}>
                    {message}
                    {chatCreated && (
                        <div style={{ marginTop: '10px' }}>
                            <button
                                onClick={() => navigate(`/chat/${chatCreated}`)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                💬 Ir al Chat
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ... resto del componente igual */}
        </div>
    );
}

export default TinderPet;
```

### 3. Crear el Cliente API (si no existe)

Crea un archivo para centralizar las llamadas al API con autenticación:

```jsx
// src/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // URL de tu backend Django
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, redirigir al login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 4. Crear Componente de Lista de Chats

Para que los usuarios vean sus chats después de dar like:

```jsx
// src/components/Chat/ChatList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  CircularProgress
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await apiClient.get('/api/chat/chats/');
      setChats(response.data);
    } catch (error) {
      console.error('Error al cargar chats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Typography variant="h6" color="textSecondary">
          No tienes chats aún
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Da "me gusta" a una mascota para iniciar una conversación
        </Typography>
      </div>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {chats.map((chat) => (
        <ListItem
          key={chat.id}
          button
          onClick={() => navigate(`/chat/${chat.id}`)}
          sx={{
            '&:hover': { bgcolor: 'action.hover' },
            borderBottom: '1px solid #eee'
          }}
        >
          <ListItemAvatar>
            <Badge
              color="success"
              variant="dot"
              invisible={!chat.tiene_mensajes}
            >
              <Avatar src={chat.mascota_foto} alt={chat.mascota_nombre}>
                <PetsIcon />
              </Avatar>
            </Badge>
          </ListItemAvatar>
          
          <ListItemText
            primary={chat.mascota_nombre}
            secondary={
              <>
                <Typography component="span" variant="body2" color="text.primary">
                  {chat.ultimo_mensaje?.remitente_username || 'Sin mensajes'}
                </Typography>
                {chat.ultimo_mensaje?.contenido && (
                  <>
                    {' — '}
                    {chat.ultimo_mensaje.contenido.substring(0, 50)}
                    {chat.ultimo_mensaje.contenido.length > 50 ? '...' : ''}
                  </>
                )}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
```

### 5. Integrar el Componente de Chat

Usa el componente `ChatRoom` del `CHAT_IMPLEMENTATION_GUIDE.md`:

```jsx
// src/pages/ChatPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { ChatRoom } from '../components/Chat/ChatRoom';
import useAuth from '../hooks/useAuth';

export default function ChatPage() {
  const { chatId } = useParams();
  const { user } = useAuth(); // Hook que obtiene el usuario autenticado

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <ChatRoom 
        chatId={chatId}
        userId={user.id}
        username={user.username}
      />
    </div>
  );
}
```

## 🔀 Actualizar las Rutas

Añade las nuevas rutas en tu `App.jsx` o donde tengas el router:

```jsx
// App.jsx o router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatList from './components/Chat/ChatList';
import ChatPage from './pages/ChatPage';
// ... otros imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... otras rutas */}
        <Route path="/chats" element={<ChatList />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 🎯 Flujo Completo

### Usuario da "Me Gusta" desde la Galería:
1. Click en corazón → `CardAnimal.handleToggleFavorito()`
2. POST `/api/swipe/action/` con `action: "L"`
3. Backend crea el chat automáticamente
4. Frontend recibe `chat_id` en la respuesta
5. Mostrar notificación o redirigir al chat

### Usuario da "Me Gusta" desde Tinder:
1. Click en "✅ Me Gusta" → `PetTinder.handleAction('like')`
2. POST `/api/swipe/action/` con `action: "L"`
3. Backend crea el chat automáticamente
4. Frontend recibe `chat_id` en la respuesta
5. Preguntar si quiere ir al chat o continuar viendo mascotas

### Usuario envía mensaje:
1. Usuario va a `/chats` y ve su lista de chats
2. Click en un chat → `/chat/:chatId`
3. El componente `ChatRoom` se conecta al WebSocket
4. Usuario escribe y envía mensaje
5. **Ahora la protectora ve el chat en su bandeja**

## 📝 Notas Importantes

### Para Ambas Vistas:
- **Autenticación requerida**: Los usuarios deben estar logueados
- **Token JWT**: Asegúrate de incluir el token en las peticiones
- **Manejo de errores**: Muestra mensajes amigables si algo falla
- **UX**: Deshabilita el botón mientras se procesa para evitar clicks múltiples

### Diferencias de UX:
- **Galería**: El corazón se llena de color cuando es favorito
- **Tinder**: Pregunta si quiere ir al chat después del like
- **Ambas**: Crean el mismo chat en el backend

### Estado del Chat:
- **Adoptante**: Ve el chat inmediatamente después del like
- **Protectora**: Solo ve el chat después del primer mensaje
- **Persistencia**: Los likes se guardan en la base de datos

## 🚀 Próximos Pasos

1. Actualizar `CardAnimal.jsx` con la lógica de interacción
2. Actualizar `PetTinder.jsx` para mostrar el chat creado
3. Crear el componente `ChatList.jsx`
4. Añadir las rutas del chat
5. Probar el flujo completo:
   - Dar like desde galería → Ver chat en `/chats`
   - Dar like desde tinder → Ir al chat directamente
   - Enviar mensaje → Protectora ve el chat
   - Respuesta de protectora → Conversación en tiempo real
