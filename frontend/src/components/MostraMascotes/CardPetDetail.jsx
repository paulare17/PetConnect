import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { useColors } from '../../hooks/useColors';

function CardPetDetail({ animal }) {
            // Mapeig de caràcters backend -> clau traducció
            const CHARACTER_TRANSLATION_MAP = {
                CARINOSO: 'affectionate',
                FALDERO: 'lapDog',
                DEPENDIENTE: 'dependent',
                DUO_INSEPARABLE: 'inseparableDuo',
                TIMIDO: 'shy',
                MIEDOSO: 'fearful',
                JUGUETON: 'playful',
                ACTIVO_ENERGICO: 'activeEnergetic',
                TRANQUILO: 'calm',
                TRABAJADOR: 'hardWorking',
                SOCIABLE: 'sociable',
                PROTECTOR_GUARDIAN: 'protectiveGuardian',
                DOMINANTE_PERROS: 'dominantWithDogs',
                REACTIVO: 'reactive',
                LIDERAZGO: 'leadership',
                DESCONFIADO_EXTRANOS: 'distrustfulOfStrangers',
                OBEDIENTE: 'obedient',
                OLAFATEADOR: 'sniffer',
                LADRADOR: 'barker',
                ESCAPISTA: 'escapist',
                EXCAVADOR: 'digger',
                GLOTON: 'glutton',
                CABEZOTA: 'stubborn',
                INTELIGENTE: 'intelligent',
                SENSIBLE: 'sensitive',
                LEAL: 'loyal',
                INDEPENDIENTE: 'independent',
                ASUSTADIZO: 'skittish',
                JUGUETON_INTENSO: 'intenselyPlayful',
                ACTIVO: 'active',
                CAZADOR: 'hunter',
                AFECTIVO_CONOCIDOS: 'affectionateWithFamiliar',
                TERRITORIAL: 'territorial',
                SEMIFERAL: 'semiFeral',
                OBSERVADOR: 'observer',
                ADAPTABLE: 'adaptable',
                DIVA: 'diva',
                LIMPIO: 'clean'
            };
    const { t } = useTranslation();
    const { colors } = useColors();
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
                    {t('cardPetDetail.selectPet')}
                </Typography>
            </Paper>
        );
    }

    // Normalitzar camps del backend (venen en majúscules)
    const especieLower = (animal.especie || '').toLowerCase();
    const generoLower = (animal.genero || '').toLowerCase();
    const raza = especieLower === 'perro' 
        ? (animal.raza_perro_display || animal.raza_perro) 
        : (animal.raza_gato_display || animal.raza_gato);
    const especieLabel = especieLower === 'perro' ? t('cardPetDetail.dog') : t('cardPetDetail.cat');
    const tamanoDisplay = animal.tamano_display || animal.tamano;
    
    // Camp de caràcter segons espècie
    const caracter = especieLower === 'perro' ? animal.caracter_perro : animal.caracter_gato;
    
    // Camps d'estat de salut (ara és un array estado_legal_salud)
    const estadoSalud = animal.estado_legal_salud || [];
    const vacunado = estadoSalud.includes('VACUNADO');
    const esterilizado = estadoSalud.includes('ESTERILIZADO');
    const desparasitado = estadoSalud.includes('DESPARASITADO');
    const con_microchip = estadoSalud.includes('MICROCHIP');
    
    // Condicions especials segons espècie
    const condicionEspecial = especieLower === 'perro' ? animal.condicion_especial_perro : animal.condicion_especial_gato;
    const tieneNecesidadesEspeciales = condicionEspecial && condicionEspecial.length > 0;

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
                    <Typography variant="h5" sx={{ color: colors.textDark, fontWeight: 'bold' }}>
                        {animal.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {generoLower === 'macho' ? (
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
                        label={`${animal.edad} ${animal.edad !== 1 ? t('cardPetDetail.years') : t('cardPetDetail.year')}`} 
                        size="small"
                        sx={{ backgroundColor: colors.purple, color: 'white' }} 
                    />
                    {tamanoDisplay && (
                        <Chip 
                            label={tamanoDisplay} 
                            size="small"
                            sx={{ backgroundColor: colors.darkBlue, color: 'white' }} 
                        />
                    )}
                </Box>

                {/* Raça */}
                <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {raza || t('cardPetDetail.breedNotSpecified')}
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
                    {t('cardPetDetail.characteristicsTitle')}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                                        <InfoItem 
                                            label={t('cardPetDetail.character')} 
                                            value={Array.isArray(caracter)
                                                ? caracter.map((c) => t(`character.${CHARACTER_TRANSLATION_MAP[c] || c.toLowerCase()}`)).join(', ')
                                                : caracter || '-'} 
                                        />
                    <InfoItem label={t('cardPetDetail.size')} value={tamanoDisplay} />
                </Box>

                {/* Salut */}
                <Typography variant="subtitle2" sx={{ color: colors.orange, mb: 1, fontWeight: 'bold' }}>
                    {t('cardPetDetail.healthTitle')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {vacunado && <MiniChip label={t('cardPetDetail.vaccinated')} />}
                    {esterilizado && <MiniChip label={t('cardPetDetail.sterilized')} />}
                    {desparasitado && <MiniChip label={t('cardPetDetail.dewormed')} />}
                    {con_microchip && <MiniChip label={t('cardPetDetail.microchip')} />}
                </Box>

                {/* Necessitats especials */}
                {tieneNecesidadesEspeciales && (
                    <Box sx={{ backgroundColor: '#fff3e0', p: 1.5, borderRadius: 2, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.darkOrange }}>
                            {t('cardPetDetail.specialNeeds')}
                        </Typography>
                        <Typography variant="body2">
                            {Array.isArray(condicionEspecial) ? condicionEspecial.join(', ') : t('cardPetDetail.consultShelter')}
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
                    {t('cardPetDetail.viewFullProfile')}
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