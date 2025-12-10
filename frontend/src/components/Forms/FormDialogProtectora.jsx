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
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import { Box, Alert } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";

export default function FormDialogProtectora() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(true);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    // Validació bàsica
    if (!payload.username || !payload.password) {
      setError(t('formDialogProtectora.allFieldsRequired'));
      setLoading(false);
      return;
    }

    try {
      await login(payload);
      handleClose();
    } catch (err) {
      console.error("Error en el login:", err);
      setError(t('formDialogProtectora.authError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: colors.backgroundBlue, // Fons diferent per protectores
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: colors.blue,
   
          }}
        >
          <BusinessIcon /> {t('formDialogProtectora.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('formDialogProtectora.subtitle')}
          </DialogContentText>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} id="protectora-login-form">
            <TextField
              required
              margin="dense"
              id="username"
              name="username"
              label={t('formDialogProtectora.username')}
              type="text"
              fullWidth
              variant="standard"
              autoFocus
              disabled={loading}
            />
            <TextField
              required
              margin="dense"
              id="password"
              name="password"
              label={t('formDialogProtectora.password')}
              type="password"
              fullWidth
              variant="standard"
              disabled={loading}
            />
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: "flex-end", gap: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{
              color: colors.orange,
              borderColor: colors.orange,
              "&:hover": {
                borderColor: colors.darkOrange,
                bgcolor: "rgba(245, 132, 43, 0.1)",
              },
              borderRadius: 2,
              px: 3,
            }}
          >
            {t('formDialogProtectora.cancelButton')}
          </Button>
          <Button
            type="submit"
            form="protectora-login-form"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: colors.blue,
              "&:hover": {
                bgcolor: colors.darkBlue,
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(102, 197, 189, 0.3)",
              },
              borderRadius: 2,
              px: 3,
              transition: "all 0.3s ease-in-out",
            }}
          >
            {loading ? t('formDialogProtectora.loggingIn') : t('formDialogProtectora.loginButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
