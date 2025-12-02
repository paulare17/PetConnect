import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../constants/colors.jsx';
import api from '../../api/client.js';
import ChatMiniList from '../Chat/ChatMiniList.jsx';
import Chat from '../Chat/Chat.jsx';
import CardPet from './CardPet.jsx';
import CardPetDetail from './CardPetDetail.jsx';

function PetTinder() {
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [selectedChatId, setSelectedChatId] = useState(null);

    // Función que se encarga de cargar el siguiente animal
    const fetchNextAnimal = useCallback(() => {
        setLoading(true);
        setAnimal(null); // Limpiamos el animal anterior
        setMessage('');  // Limpiamos mensajes

        // Llama al endpoint de PetTinder Next
        api.get('/pettinder/next/')
            .then(response => {
                // Si la respuesta incluye un animal, lo mostramos
                if (response.data.id) {
                    setAnimal(response.data);
                } else {
                    // Si no hay más animales, mostramos el mensaje de "no quedan"
                    setAnimal({ message: response.data.message }); 
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al obtenir el següent animal:", err);
                setError("Error al carregar. Verifica el servidor de Django.");
                setLoading(false);
            });
    }, []);

    // Se ejecuta al montar el componente
    useEffect(() => {
        fetchNextAnimal();
    }, [fetchNextAnimal]);


    // Función genérica para manejar las acciones (Like/Dislike)
    const handleAction = (actionType) => {
        if (!animal || animal.message) return;

        const actionData = {
            animal_id: animal.id,
            action: actionType 
        };

        api.post('/pettinder/action/', actionData)
            .then((response) => {
                setMessage(`Acció ${actionType === 'like' ? 'M\'agrada' : 'No m\'agrada'} registrada per ${animal.nombre}!`);
                // Si és un like i el backend retorna chat_id, obrim el xat inline
                if (actionType === 'like' && response.data.is_like && response.data.chat_id) {
                    setSelectedChatId(response.data.chat_id);
                }
                // La card canvia a següent animal quan fem like/dislike
                setTimeout(() => fetchNextAnimal(), 500);
            })
            .catch(err => {
                console.error(`Error al registrar ${actionType}:`, err);
                setMessage(`Error: No s'ha pogut registrar l'acció.`);
            });
    };

    // --- Renderitzat ---
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    // Si no quedan animales disponibles
    if (animal && animal.message) {
        return (
            <Box textAlign="center" mt={10}>
                <Typography variant="h5" color="text.secondary">
                    {animal.message}
                </Typography>
            </Box>
        );
    }

    // --- Layout amb ChatMiniList, CardPet sempre visible i Chat a la dreta ---
    return (
        <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '260px 1fr 380px', 
            gap: 3, 
            maxWidth: '1400px', 
            margin: '50px auto', 
            p: 3,
            minHeight: 'calc(100vh - 150px)'
        }}>
            {/* Panell esquerre: mini llista o xat inline */}
            <Box sx={{ height: 'fit-content', maxHeight: '700px' }}>
                {selectedChatId ? (
                    <Chat chatId={selectedChatId} onClose={() => setSelectedChatId(null)} />
                ) : (
                    <ChatMiniList maxHeight={600} onSelectChat={setSelectedChatId} />
                )}
            </Box>

            {/* Columna central: Card de mascota sempre visible */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom textAlign="center" sx={{ color: colors.orange, mb: 3 }}>
                    Descobreix la teva mascota ideal
                </Typography>
                {message && (
                    <Alert 
                        severity="success" 
                        sx={{ mb: 2, width: '100%', maxWidth: 400 }}
                        onClose={() => setMessage('')}
                    >
                        {message}
                    </Alert>
                )}
                <Box sx={{ width: '100%', maxWidth: 400, minHeight: 500 }}>
                    <CardPet animal={animal} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
                    <Button 
                        variant="contained"
                        size="large"
                        startIcon={<CloseIcon />}
                        onClick={() => handleAction('dislike')}
                        sx={{
                            backgroundColor: colors.purple,
                            color: 'white',
                            borderRadius: '50px',
                            px: 4,
                            py: 1.5,
                            '&:hover': { backgroundColor: colors.darkBlue, transform: 'scale(1.05)' },
                            transition: 'all 0.2s'
                        }}
                    >
                        No m'agrada
                    </Button>
                    <Button 
                        variant="contained"
                        size="large"
                        startIcon={<FavoriteIcon />}
                        onClick={() => handleAction('like')}
                        sx={{
                            backgroundColor: colors.orange,
                            color: 'white',
                            borderRadius: '50px',
                            px: 4,
                            py: 1.5,
                            '&:hover': { backgroundColor: colors.darkOrange, transform: 'scale(1.05)' },
                            transition: 'all 0.2s'
                        }}
                    >
                        M'agrada
                    </Button>
                </Box>
            </Box>

            {/* Columna dreta: Detalls de la mascota */}
            <Box sx={{ height: 'fit-content', maxHeight: '700px' }}>
                <CardPetDetail animal={animal} />
            </Box>
        </Box>
    );
}

export default PetTinder;