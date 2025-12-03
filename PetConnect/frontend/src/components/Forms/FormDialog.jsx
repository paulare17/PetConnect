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
  const [ubicacion, setUbicacion] = React.useState("");
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
      city: formData.get("ciutat"),
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
        (position) => {
          const { latitude, longitude } = position.coords;
          // Aquí pots usar una API de geocoding per convertir coordenades a adreça
          // Per simplicitat, mostrem les coordenades
          setUbicacion(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
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

            {/* la de la ubi s'ha de comentar com ho fem */}
            <TextField
              required
              margin="dense"
              id="ciutat"
              name="ciutat"
              label={t('formDialog.city')}
              type="text"
              fullWidth
              variant="standard"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            />
            <Button
              startIcon={<LocationOnIcon />}
              onClick={handleGetLocation}
              sx={{
                color: colors.blue,
                textTransform: "none",
                fontSize: "0.875rem",
                lineHeight: 1.2,
                mt: 1,
                "&:hover": {
                  color: colors.darkBlue,
                  backgroundColor: "transparent",
                },
              }}
            >
              {t('formDialog.locationButton')}
            </Button>
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
              mr: 5.5,
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
              borderRadius: 5,
              px: 4,
              mb: 2,
              mr: 4,
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
