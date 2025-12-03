import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getUserProfile } from "../../api/client";
import FormUsuari from "../Forms/FormUsuari";
import ProfilePageUser from "./ProfilePageUser";
import { useColors } from "../../hooks/useColors";

/**
 * Component contenidor que decideix si mostrar el formulari o el perfil
 * segons si l'usuari ja té un perfil creat
 */
export default function UserProfile() {
  const { colors } = useColors();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  const checkUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Carregant perfil d'usuari...");
      const response = await getUserProfile();
      console.log("Resposta del perfil:", response.data);
      
      // Comprova si hi ha perfils i si estan realment omplerts
      if (response.data && response.data.length > 0) {
        const profile = response.data[0];
        console.log("Perfil trobat:", profile);
        
        // SEMPRE guardem el profileData (fins i tot si està buit)
        setProfileData(profile);
        
        // Verificar si el perfil està realment omplert (té almenys telèfon o descripció)
        const isProfileFilled = profile.telefono || profile.descripcion || profile.fecha_nacimiento;
        
        if (isProfileFilled) {
          console.log("Perfil omplert, mostrant pàgina de perfil");
          setHasProfile(true);
        } else {
          console.log("Perfil buit (només creat per defecte), mostrant formulari");
          setHasProfile(false);
        }
      } else {
        console.log("No s'ha trobat perfil, mostrant formulari");
        setHasProfile(false);
        setProfileData(null);
      }
    } catch (err) {
      console.error("Error al comprovar el perfil:", err);
      console.error("Response error:", err.response);
      // Si retorna 404, 403 o array buit, no té perfil - mostrem el formulari
      if (err.response?.status === 404 || err.response?.status === 403 || err.response?.data?.length === 0) {
        console.log("Error 404/403 o sense dades, mostrant formulari");
        setHasProfile(false);
        setProfileData(null);
        setError(null); // No és un error real, només no té perfil
      } else {
        console.error("Error real de l'API");
        setError("Error al carregar el perfil: " + (err.message || "Unknown error"));
      }
    } finally {
      console.log("Càrrega finalitzada");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserProfile();
  }, [checkUserProfile]);

  const handleProfileCreated = () => {
    // Quan es crea el perfil, actualitzem l'estat
    checkUserProfile();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: colors.background,
        }}
      >
        <CircularProgress sx={{ color: colors.blue }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: colors.background,
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Si no té perfil omplert, mostrem el formulari
  // Però passem el profileData (buit) perquè el FormUsuari pugui actualitzar-lo
  if (!hasProfile) {
    return <FormUsuari onProfileCreated={handleProfileCreated} existingProfile={profileData} />;
  }

  // Si té perfil omplert, mostrem la pàgina de perfil
  return <ProfilePageUser profileData={profileData} />;
}
