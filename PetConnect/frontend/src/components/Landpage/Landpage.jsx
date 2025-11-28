import React from "react";
import { Box, Button, Typography } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import gatImatgeInfEsq from "../../assets/gat-cantonada.png"; // ✅ Import la imatge
import gatImatgeSupDreta from "../../assets/gat-superior.png";
import gosImatgeCentre from "../../assets/gos-baix.png";
import './petjades.css'
import {colors} from '../../constants/colors.jsx'
import { useNavigate } from "react-router-dom";


export default function Landpage() {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 90px)',
        width: "100%", // Usa 100% en lloc de 100vw
        flex: 1, // Ocupa l'espai restant després de la navbar
        bgcolor: colors.backgroundOrange,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", 
        position: "relative", 
        // overflow: "auto", 
      //  minHeight: 0, // Permet que el flex item es redueixi
        padding: { xs: 1, sm: 2, md: 3 }, // Menys padding
        gap: { xs: 1, sm: 1.5, md: 2 }, // Menys gap
      }}
    >

<div className="petjades-container">
        <PetsIcon className="petjada petjada-1" />
        <PetsIcon className="petjada petjada-2" />
        <PetsIcon className="petjada petjada-3" />
        <PetsIcon className="petjada petjada-4" />
        <PetsIcon className="petjada petjada-5" />
        <PetsIcon className="petjada petjada-6" />
        <PetsIcon className="petjada petjada-7" />
        <PetsIcon className="petjada petjada-8" />
      </div>

      <Box
        component="img"
        src={gatImatgeSupDreta}
        alt="Gato siamés"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 250,
          height: "auto",
          //   borderRadius: 2,
          objectFit: "cover",
        }}
      />
      {/* Títol principal amb icona */}
      <Box
        display="flex"
        alignItems="center"
        gap={{ xs: 0.5, sm: 1, md: 1.5 }}
        sx={{ zIndex: 2 }}
  
      >
        <PetsIcon
          sx={{
            mb: 2,
            display: { xs: "none", sm: "flex" },
            color: colors.orange,
            fontSize: { xs: 80, sm: 100, md: 120 },
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.1) rotate(10deg)",
              transition: "all 0.3s ease-in-out",
              color: colors.blue,
            },
          }}
        />
        <Typography
          className="custom-title"
          variant="h1"
          sx={{
            fontFamily: "'Rubik Bubbles', sans-serif",
            fontSize: { xs: '3.5rem', sm:'4.5rem', md: '6rem', lg: '7rem', xl:'8rem'

          }}}
        >
          PetConnect
        </Typography>
      </Box>

      {/* Botons */}
      <Box
        display="flex"
        flexDirection="column" 
        gap={{ xs: 2, sm: 2.5, md: 3 }} 
        sx={{ zIndex: 2 }}
      >
        <Button
        onClick={()=> navigate('/formulari-acces')}
          variant="contained"
          sx={{
            bgcolor: colors.blue,
            "&:hover": {
              bgcolor: colors.darkBlue,
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(102, 197, 189, 0.3)",
            },
            borderRadius: 5,
            px: 4,
            fontSize: "1.1rem",
            transition: "all 0.3s ease-in-out",
          }}
        >
          Iniciar sessió
        </Button>

        <Button
        onClick={()=> navigate('/formulari-dialog')}
          variant="contained"
          sx={{
            bgcolor: colors.orange,
            "&:hover": {
              bgcolor: colors.darkOrange,
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(245, 132, 43, 0.3)",
            },
            borderRadius: 5,
            px: 4,
            fontSize: "1.1rem",
            transition: "all 0.3s ease-in-out",
          }}
        >
          Registrar-se
        </Button>
      </Box>
      <Box
        component="img"
        src={gatImatgeInfEsq} 
        alt="Gato siamés"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 300,
          height: "auto",
          //   borderRadius: 2,
          objectFit: "cover",
        }}
      />
      <Box
        component="img"
        src={gosImatgeCentre} 
        alt="Perro"
        sx={{
          position: "absolute",
          bottom: 0,
          left: "50",
          width: 250,
          height: "auto",
          //   borderRadius: 2,
          objectFit: "cover",
        }}
      />
    </Box>
  );
}
