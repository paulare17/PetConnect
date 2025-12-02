import React from 'react';
import {
    Box,
    Typography,
    Chip,
    Divider,
    Paper,
    Button,
} from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { colors } from '../../constants/colors';

function CardPetDetail({ animal }) {
    if (!animal || animal.message) {
        return (
            <Paper 
                elevation={2} 
                sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    background: colors.lightColor,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography variant="body1" color="text.secondary" textAlign="center">
                    Selecciona una mascota per veure els detalls
                </Typography>
            </Paper>
        );
    }

    const raza = animal.especie === 'perro' ? animal.raza_perro : animal.raza_gato;
    const especieLabel = animal.especie === 'perro' ? 'Gos' : 'Gat';

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                borderRadius: 4, 
                background: colors.lightColor,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
         

            {/* Contingut */}
            <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
                {/* Nom i badges */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" sx={{ color: colors.black, fontWeight: 'bold' }}>
                        {animal.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {animal.genero === 'macho' ? (
                            <MaleIcon sx={{ color: colors.blue, fontSize: 28 }} />
                        ) : (
                            <FemaleIcon sx={{ color: 'pink', fontSize: 28 }} />
                        )}
                    </Box>
                </Box>

                {/* Chips d'informació bàsica */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip 
                        icon={<PetsIcon />} 
                        label={especieLabel} 
                        size="small"
                        sx={{ backgroundColor: colors.orange, color: 'white' }} 
                    />
                    <Chip 
                        label={`${animal.edad} any${animal.edad !== 1 ? 's' : ''}`} 
                        size="small"
                        sx={{ backgroundColor: colors.purple, color: 'white' }} 
                    />
                    {animal.tamaño && (
                        <Chip 
                            label={animal.tamaño} 
                            size="small"
                            sx={{ backgroundColor: colors.darkBlue, color: 'white' }} 
                        />
                    )}
                </Box>

                {/* Raça */}
                <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {raza || 'Raça no especificada'}
                </Typography>

                {/* Ubicació */}
                {animal.ubicacion && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LocationOnIcon sx={{ color: colors.orange, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                            {animal.ubicacion}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />


                <Divider sx={{ my: 2 }} />

                {/* Característiques */}
                <Typography variant="subtitle2" sx={{ color: colors.orange, mb: 1, fontWeight: 'bold' }}>
                    Característiques
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                    <InfoItem label="Color" value={animal.color} />
                    <InfoItem label="Pes" value={animal.peso ? `${animal.peso} kg` : null} />
                    <InfoItem label="Caràcter" value={animal.caracter} />
                    <InfoItem label="Amb nens" value={animal.convivencia_ninos ? 'Sí' : 'No'} />
                </Box>

                {/* Salut */}
                <Typography variant="subtitle2" sx={{ color: colors.orange, mb: 1, fontWeight: 'bold' }}>
                    Salut
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {animal.vacunado && <MiniChip label="Vacunat" />}
                    {animal.esterilizado && <MiniChip label="Esterilitzat" />}
                    {animal.desparasitado && <MiniChip label="Desparasitat" />}
                    {animal.con_microchip && <MiniChip label="Microxip" />}
                </Box>

                {/* Necessitats especials */}
                {animal.necesidades_especiales && (
                    <Box sx={{ backgroundColor: '#fff3e0', p: 1.5, borderRadius: 2, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.darkOrange }}>
                            ⚠️ Necessitats especials
                        </Typography>
                        <Typography variant="body2">
                            {animal.descripcion_necesidades || 'Consultar amb la protectora'}
                        </Typography>
                    </Box>
                )}

                {/* Botó per veure perfil complet */}
                <Button
                    variant="outlined"
                    fullWidth
                    href={`/mascotes/${animal.id}`}
                    sx={{
                        mt: 'auto',
                        borderColor: colors.orange,
                        color: colors.orange,
                        '&:hover': {
                            backgroundColor: colors.orange,
                            color: 'white',
                        }
                    }}
                >
                    Veure perfil complet
                </Button>
            </Box>
        </Paper>
    );
}

// Components auxiliars
function InfoItem({ label, value }) {
    if (!value) return null;
    return (
        <Typography variant="body2">
            <strong>{label}:</strong> {value}
        </Typography>
    );
}

function MiniChip({ label }) {
    return (
        <Chip 
            label={label} 
            size="small" 
            sx={{ 
                backgroundColor: '#e8f5e9', 
                color: '#2e7d32',
                fontSize: '0.75rem'
            }} 
        />
    );
}

export default CardPetDetail;