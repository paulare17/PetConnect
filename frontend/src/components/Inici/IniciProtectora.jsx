import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Button, Avatar, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PetsIcon from "@mui/icons-material/Pets";
import { colors } from "../../constants/colors.jsx";
import api from "../../api/client.js";
import nikaImg from "../../assets/nika.png";
import blackImg from "../../assets/black.png";

export default function IniciProtectora() {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMisMascotas = async () => {
      try {
        setLoading(true);
        const res = await api.get("/mascota/mis_mascotas/");
        setMascotas(res.data);
      } catch (err) {
        console.error("Error carregant les mascotes:", err);
        setError(err.response?.data?.detail || "Error carregant les teves mascotes");
      } finally {
        setLoading(false);
      }
    };
    fetchMisMascotas();
  }, []);

  // Imatge per defecte segons espècie
  const getDefaultImage = (especie) => {
    return especie === "perro" ? nikaImg : blackImg;
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.backgroundOrange }}>
      <Box sx={{ pt: 8, px: { xs: 2, md: 8 }, pb: 8, maxWidth: 1400, mx: 'auto' }}>
        {/* Botó afegir animal a la part superior */}
        
        <Grid container spacing={{ xs:4, md:6 }} justifyContent="space-around" alignItems="flex-start">
          {/* Columna esquerra: Botó + Adopcions (ordre 2 en mòbil) */}
          <Grid item xs={12} md={3} order={{ xs: 2, md: 1 }}>
            {/* Botó dins la graella, a dalt a l'esquerra */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
              <Button
                variant="contained"
                size="medium"
                sx={{
                  bgcolor: colors.yellow,
                  color: colors.black,
                  fontWeight: 'bold',
                  fontSize: { xs: 20, md: 25 },
                  px: { xs: 2.5, md: 3.5 },
                  py: 1,
                  minWidth: 447,
                  minHeight: 80,
                  borderRadius: 3,
                  boxShadow: 2,
                  '&:hover': { bgcolor: colors.orange, color: 'white' }
                }}
                onClick={() => navigate('/afegir-animal')}
              >
                Afegeix els teus animals
              </Button>
            </Box>
            <Card sx={{ borderRadius: 4, maxWidth: 520, boxShadow: 3, p: 2, bgcolor: colors.lightColor, border: `2px dashed ${colors.orange}`, minHeight:{ md:440 } }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center", color: colors.black }}>
                  Les teves adopcions
                </Typography>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress sx={{ color: colors.orange }} />
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                ) : mascotas.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <PetsIcon sx={{ fontSize: 48, color: colors.orange, mb: 1 }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Encara no tens cap mascota penjada.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
                    gap: { xs: 2, md: 2 },
                    alignItems: 'start'
                  }}>
                    {mascotas.map((animal) => (
                      <Box
                        key={animal.id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          p: { xs: 1, md: 2 },
                          borderRadius: 2,
                          transition: 'background 0.2s',
                          '&:hover': { bgcolor: colors.backgroundOrange }
                        }}
                        onClick={() => navigate(`/mascotes/${animal.id}`)}
                      >
                        <Avatar
                          src={animal.foto || getDefaultImage(animal.especie)}
                          alt={animal.nombre}
                          sx={{
                            width: { xs: 95, sm: 120, md: 150 },
                            height: { xs: 95, sm: 120, md: 150 },
                            mb: 1,
                            border: `3px solid ${colors.orange}`,
                            boxShadow: 3,
                            transition: 'transform 0.25s',
                            '&:hover': { transform: 'scale(1.04)' }
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: { xs: 12, md: 16 } }}>
                          {animal.nombre}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Xats actius (només visual) */}
          <Grid item xs={12} md={9} order={{ xs: 1, md: 2 }} sx={{ display:'flex' }}>
            <Card sx={{ flexGrow:1, minWidth: '650px', borderRadius:4, boxShadow:3, p:3, bgcolor:colors.lightColor, border:`3px solid ${colors.purple}`, minHeight:{ md:685 }, display:'flex', flexDirection:'column' }}>
              <CardContent sx={{ flexGrow:1, display:'flex', flexDirection:'column' }}>
                <Typography variant="h6" sx={{ fontWeight:'bold', mb:3, textAlign:'center', color:colors.black, fontSize:{ xs:18, md:22 } }}>
                  Xats actius
                </Typography>
                <Box sx={{ display:'flex', flexDirection:'column', gap:{ xs:2, md:2.5 }, flexGrow:1 }}>
                  {[...Array(5)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        bgcolor: colors.blue,
                        borderRadius: 2,
                        height: { xs: 56, md: 80 },
                        display: 'flex',
                        alignItems: 'center',
                        px: { xs: 2, md: 4 },
                        boxShadow: 3,
                        position:'relative',
                        transition:'all .25s',
                        '&:hover': { boxShadow:6, transform:'translateY(-3px)' }
                      }}
                    >
                      <Box sx={{ flex:1, bgcolor:colors.lightBlue, height:{ xs:18, md:24 }, borderRadius:1, mx:{ xs:1, md:2 } }} />
                      {i < 2 && (
                        <Box sx={{ ml: 2 }}>
                          <NotificationsIcon sx={{ color:'red', fontSize:{ xs:28, md:34 } }} />
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        
      </Box>
    </Box>
  );
}
