import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import PetsIcon from '@mui/icons-material/Pets';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { colors } from '../../constants/colors';
import blackCatImg from '../../assets/black.png';
import nikaDogImg from '../../assets/nika.png';
import api from '../../api/client';

function PetTinder() {
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

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
            .then(() => {
                setMessage(`Acció ${actionType === 'like' ? 'M\'agrada' : 'No m\'agrada'} registrada per ${animal.nombre}!`);
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

    // Preparar datos del animal
    const cardColor = animal.especie === 'perro' ? colors.backgroundOrange : colors.backgroundBlue;
    const iconColor = animal.especie === 'perro' ? colors.darkOrange : colors.darkBlue;
    
    let imageSrc;
    if (!animal.foto) {
        imageSrc = animal.especie === 'gato' ? blackCatImg : nikaDogImg;
    } else {
        imageSrc = animal.foto;
    }

    const raza = animal.especie === 'perro' ? animal.raza_perro : animal.raza_gato;

    return (
        <Box sx={{ 
            maxWidth: '600px', 
            margin: '50px auto', 
            p: 3
        }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ color: colors.orange, fontWeight: 'bold', mb: 3 }}>
                Descobreix la teva mascota ideal
            </Typography>

            {/* Missatges de feedback */}
            {message && (
                <Alert 
                    severity="success" 
                    sx={{ mb: 2 }}
                    onClose={() => setMessage('')}
                >
                    {message}
                </Alert>
            )}

            {/* Card de la Mascota */}
            <Card sx={{
                backgroundColor: cardColor,
                borderRadius: 2,
                boxShadow: 6,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-4px)' }
            }}>
                {/* Imatge */}
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="350"
                        image={imageSrc}
                        alt={animal.nombre}
                        sx={{ objectFit: 'cover' }}
                    />
                    {/* Chip d'espècie */}
                    <Chip
                        icon={<PetsIcon />}
                        label={animal.especie === 'perro' ? 'Gos' : 'Gat'}
                        sx={{ 
                            position: 'absolute', 
                            top: 16, 
                            left: 16, 
                            backgroundColor: iconColor, 
                            color: 'white', 
                            fontWeight: 'bold' 
                        }}
                    />
                </Box>

                {/* Contingut */}
                <CardContent>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: colors.black, mb: 1, textAlign: 'center' }}>
                        {animal.nombre}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        {animal.genero === 'macho' ? (
                            <MaleIcon sx={{ color: colors.blue, mr: 0.5 }} />
                        ) : (
                            <FemaleIcon sx={{ color: 'pink', mr: 0.5 }} />
                        )}
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {raza || 'Raça no especificada'}
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 2, px: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Edat:</strong> {animal.edad} any{animal.edad !== 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Sexe:</strong> {animal.genero === 'macho' ? 'Mascle' : 'Femella'}
                        </Typography>
                        {animal.tamaño && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Mida:</strong> {animal.tamaño}
                            </Typography>
                        )}
                        {animal.historia_breve && (
                            <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    {animal.historia_breve}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Botons d'Acció */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4 }}>
                <Button 
                    variant="contained"
                    size="large"
                    startIcon={<CloseIcon />}
                    onClick={() => handleAction('dislike')}
                    sx={{
                        backgroundColor: colors.purple,
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        px: 4,
                        py: 1.5,
                        '&:hover': { 
                            backgroundColor: colors.darkBlue,
                            transform: 'scale(1.05)'
                        },
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
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        px: 4,
                        py: 1.5,
                        '&:hover': { 
                            backgroundColor: colors.darkOrange,
                            transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s'
                    }}
                >
                    M'agrada
                </Button>
            </Box>
        </Box>
    );
}

export default PetTinder;