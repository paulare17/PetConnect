import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { colors } from "../../constants/colors.jsx";
import { IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { ROLES } from "../../constants/roles.jsx";
import { useAuthContext } from "../../context/AuthProvider.jsx";

export default function FormDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(true); // Sempre obert quan es carrega el component
  const [codigoPostal, setCodigoPostal] = React.useState("");
  const navigate = useNavigate();
  const { getMe } = useAuthContext();

  const handleClose = () => {
    setOpen(false);
    // Navega de tornada a la pàgina principal
    navigate('/');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      username: formData.get("user"),
      email: formData.get("email"),
      password: formData.get("password"),
      city: formData.get("codigoPostal"),
      // Rol per defecte: usuari (adoptant)
      role: ROLES.USUARIO,
    };

    try {
      const res = await api.post("/usuarios/", payload);
      // El backend retorna access/refresh/user; guardem-los per fer login automàtic
      if (res?.data?.access) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        // Actualitzar l'estat del context
        await getMe();
      }
      handleClose();
    } catch (err) {
      console.error("Error creant usuari:", err);
      const msg =
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        t('formDialog.errorCreating');
      alert(msg);
    }
  };
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Utilitzem l'API de Nominatim (OpenStreetMap) per geocoding invers
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
              {
                headers: {
                  'Accept-Language': 'ca,es,en'
                }
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              const address = data.address;
              
              // Obtenim el codi postal de la resposta
              const postcode = address.postcode || "";
              setCodigoPostal(postcode);
            } else {
              // Si falla l'API, deixem el camp buit
              console.warn("No s'ha pogut obtenir el codi postal");
            }
          } catch (error) {
            console.error("Error obtenint adreça:", error);
            alert(t('formDialog.locationError'));
          }
        },
        (error) => {
          console.error("Error obtenint ubicació:", error);
          alert(t('formDialog.locationError'));
        }
      );
    } else {
      alert(t('formDialog.locationNotSupported'));
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('formDialog.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('formDialog.subtitle')}
          </DialogContentText>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              required
              margin="dense"
              id="user"
              name="user"
              label={t('formDialog.username')}
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="email"
              name="email"
              label={t('formDialog.email')}
              type="email"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              id="password"
              name="password"
              label={t('formDialog.password')}
              type="password"
              fullWidth
              variant="standard"
            />

            <TextField
              required
              margin="dense"
              id="codigoPostal"
              name="codigoPostal"
              label={t('formDialog.postalCode')}
              type="text"
              fullWidth
              variant="standard"
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
              placeholder="08001"
              inputProps={{ maxLength: 10 }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleGetLocation}
                    size="small"
                    title={t('formDialog.detectLocation')}
                    sx={{
                      color: colors.blue,
                      "&:hover": {
                        color: colors.darkBlue,
                        backgroundColor: "rgba(102, 197, 189, 0.1)",
                      },
                    }}
                  >
                    <LocationOnIcon />
                  </IconButton>
                ),
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
          onClick={()=>navigate('/formulari-protectora')}
            variant="contained"
            sx={{
              bgcolor: colors.yellow,
              color: colors.black,
              "&:hover": {
                bgcolor: colors.purple,
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(245, 132, 43, 0.3)",
              },
              borderRadius: 5,
              // px: 4,
              mb: 2,
              mr: 2,
              fontSize: "0.7rem",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {t('formDialog.shelterButton')}
          </Button>
          <Button
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
              mb: 2,
              mr: 2,
              fontSize: "1.1rem",
              transition: "all 0.3s ease-in-out",
            }}
            onClick={handleClose}
          >
            {t('formDialog.cancelButton')}
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: colors.blue,
              "&:hover": {
                bgcolor: colors.darkBlue,
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(102, 197, 189, 0.3)",
              },
              width: "40%",
              borderRadius: 5,
              px: 1,
              mb: 2,
              mr: 1,
              fontSize: "1.1rem",
              transition: "all 0.3s ease-in-out",
            }}
            type="submit"
            form="subscription-form"
          >
            {t('formDialog.subscribeButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
