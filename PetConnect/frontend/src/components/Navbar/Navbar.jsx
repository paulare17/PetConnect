import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import PetsIcon from "@mui/icons-material/Pets";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import TranslateIcon from "@mui/icons-material/Translate";
import { colors } from "../../constants/colors.jsx";
import { ROLES } from "../../constants/roles.jsx";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import { useDarkMode } from "../../context/darkModeContext";
import { Divider, useTheme } from "@mui/material";
import "flag-icons/css/flag-icons.min.css";
import { useTranslation } from "react-i18next";

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElLanguage, setAnchorElLanguage] = React.useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenLanguageMenu = (event) => {
    setAnchorElLanguage(event.currentTarget);
  };

  const handleCloseLanguageMenu = () => {
    setAnchorElLanguage(null);
  };

  const handleLanguageChange = (language) => {
    handleCloseLanguageMenu();
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  const handleUserMenuAction = (setting) => {
    handleCloseUserMenu();
    if (setting === "Perfil") {
      if (user?.role === ROLES.PROTECTORA) navigate("/perfil-protectora");
      else if (user?.role === ROLES.USUARIO) navigate("/perfil-usuari");
      else if (user?.role === ROLES.ADMIN) navigate("/admin");
    } else if (setting === "Inici") {
      navigate("/");
    } else if (setting === "Sortir") {
      logout();
      navigate("/");
    }
  };

  // Handler per a les pages
  const handlePageAction = (pageKey) => {
    handleCloseNavMenu();
    if (pageKey === "adopt" || pageKey === "giveAdoption") {
      if (user?.role === ROLES.PROTECTORA) {
        navigate("/afegir-mascota");
      } else {
        navigate("/inici-usuari-galeria");
      }
    } else if (pageKey === "chat") {
      navigate("/chats");
    } else {
      //  afegir més rutes aquí
      navigate("/");
    }
  };

  // Determinar les pàgines dinàmicament segons el rol
  const dynamicPages = user?.role === ROLES.PROTECTORA 
    ? [
        { key: "aboutUs", label: t('navbar.aboutUs') },
        { key: "lost", label: t('navbar.lost') },
        { key: "contact", label: t('navbar.contact') },
        { key: "giveAdoption", label: t('navbar.giveAdoption') },
        { key: "chat", label: t('navbar.chat') }
      ]
    : [
        { key: "aboutUs", label: t('navbar.aboutUs') },
        { key: "lost", label: t('navbar.lost') },
        { key: "contact", label: t('navbar.contact') },
        { key: "adopt", label: t('navbar.adopt') },
        { key: "chat", label: t('navbar.chat') }
      ];

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: isDarkMode ? theme.palette.background.paper : colors.orange,
        minHeight: { xs: 80, md: 90 },
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          maxWidth: "none !important",
          padding: "0 !important", // Elimina padding del container
          margin: "0 !important", // Elimina margin del container
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 80, md: 90 },
            alignItems: "center",
            display: "flex",
            px: { xs: 2, md: 4 },
          }}
        >
          {/* Secció esquerra: Logo + Títol */}
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <PetsIcon
              onClick={() =>
                navigate(
                  user?.role === ROLES.PROTECTORA
                    ? "/inici-protectora"
                    : "/inici-usuari-galeria"
                )
              }
              className="animation-nav"
              sx={{
                mr: 0.5,
                mb: 1,
                display: { xs: "none", md: "flex" },
                color: isDarkMode ? theme.palette.primary.light : colors.yellow,
                fontSize: { xs: "2rem", md: "2.5rem" },
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.1) rotate(10deg)",
                  transition: "all 0.3s ease-in-out",
                  color: colors.blue,
                },
              }}
            />
            <Typography
              onClick={() =>
                navigate(
                  user?.role === ROLES.PROTECTORA
                    ? "/inici-protectora"
                    : "/inici-usuari-galeria"
                )
              }
              className="animation-nav"
              variant="h6"
              noWrap
              component="a"
              sx={{
                display: { xs: "none", md: "flex" },
                fontFamily: "Rubik Bubbles",
                fontWeight: 700,
                color: isDarkMode ? theme.palette.primary.light : colors.yellow,
                textDecoration: "none",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              PetConnect
            </Typography>
          </Box>

          {/* Menú hamburguesa (mòbil) */}

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                color: colors.blue,
                display: "flex",
                alignItems: "center",
                height: "auto",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  minWidth: 220,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              }}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {/* Pages de navegació */}
              {dynamicPages.map((page) => (
                <MenuItem
                  key={page.key}
                  onClick={() => handlePageAction(page.key)}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    "&:hover": {
                      bgcolor: colors.lightBlue,
                    },
                  }}
                  >
                  <Typography
                    sx={{
                      color: isDarkMode ? colors.textLight : colors.textDark,
                      fontSize: "1rem",
                    }}
                  >
                    {page.label}
                  </Typography>
                </MenuItem>
              ))}

              {/* Divisor entre pages i accions */}
              <Divider
                sx={{ my: 1, borderColor: colors.orange, borderWidth: 1 }}
              />

              {/* Accions sempre visibles (DarkMode i Idioma) */}
              <MenuItem
                key="darkmode"
                onClick={() => {
                  handleCloseNavMenu();
                  toggleDarkMode();
                }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  "&:hover": {
                    bgcolor: colors.lightBlue,
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <DarkModeIcon
                    sx={{
                      fontSize: "1.2rem",
                      color: isDarkMode ? colors.textLight : colors.textDark,
                    }}
                  />
                  <Typography
                    sx={{ fontSize: "1rem", color: isDarkMode ? colors.textLight : colors.textDark }}
                  >
                    {isDarkMode ? t('navbar.lightMode') : t('navbar.darkMode')}
                  </Typography>
                </Box>
              </MenuItem>

              <MenuItem
                key="language"
                onClick={handleOpenLanguageMenu}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  "&:hover": {
                    bgcolor: colors.lightBlue,
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <TranslateIcon
                    sx={{
                      fontSize: "1.2rem",
                        color: isDarkMode ? colors.textLight : colors.textDark,
                        }}
                      />
                      <Typography
                        sx={{ fontSize: "1rem", color: isDarkMode ? colors.textLight : colors.textDark }}
                      >
                        {i18n.language === 'ca' ? 'Idioma: Català' : i18n.language === 'es' ? 'Idioma: Español' : 'Language: English'}
                      </Typography>
                    </Box>
                  </MenuItem>
            </Menu>
          </Box>

          {/* títol per a mòbil */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <PetsIcon
              sx={{
                display: { xs: "none" },
              }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "Rubik Bubbles",
                fontWeight: 700,
                color: isDarkMode ? theme.palette.primary.light : colors.yellow,
                textDecoration: "none",
                fontSize: { xs: "2rem", sm: "2.2rem" },
              }}
            >
              PetConnect
            </Typography>
          </Box>
          {/*  pages - centrades */}

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            {dynamicPages.map((page) => (
              <Button
                key={page.key}
                onClick={() => handlePageAction(page.key)}
                sx={{
                  ...(page.key === "chat" && {
                    color: "white",
                    fontSize: { xs: "1.05rem", md: "1.15rem" },
                    px: 3.5,
                    py: 1.2,
                    borderRadius: "25px",
                    bgcolor: colors.blue,
                    boxShadow: `0 4px 12px ${colors.blue}40`,
                    "&:hover": {
                      bgcolor: colors.darkBlue,
                      transform: "translateY(-5px)",
                      boxShadow: `0 8px 16px ${colors.blue}60`,
                    },
                  }),
                  ...(page.key !== "chat" && {
                    color: isDarkMode ? theme.palette.text.primary : colors.lightColor,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    px: 3,
                    py: 1,
                    borderRadius: "25px",
                    bgcolor: isDarkMode ? "rgba(168, 156, 248, 0.1)" : "rgba(255, 255, 255, 0.15)",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: isDarkMode ? "rgba(168, 156, 248, 0.2)" : "rgba(255, 255, 255, 0.3)",
                      color: isDarkMode ? theme.palette.primary.light : colors.darkBlue,
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                  }),
                  position: "relative",
                  transition: "all 0.3s ease",
                  textTransform: "none",
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
         {/* Secció dreta: DarkMode + Traducció + Avatar */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: { xs: 2, md: 1.5 },
    flexShrink: 0,
  }}
>
  {/* Botons sempre visibles (DarkMode i Traducció) - només en desktop */}
  <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, mr: user ? 3 : 0, }}>
    {/* Botó DarkMode */}
    <Tooltip title={isDarkMode ? t('navbar.lightMode') : t('navbar.darkMode')}>
      <IconButton
        onClick={() => {
          toggleDarkMode();
        }}
        sx={{
          color: isDarkMode ? theme.palette.primary.main : colors.yellow,
          bgcolor: isDarkMode ? theme.palette.background.paper : colors.darkBlue,
          width: 30,
          height: 30,
          '&:hover': {
            bgcolor: isDarkMode ? theme.palette.action.hover : colors.textDark,
            color: isDarkMode ? theme.palette.primary.light : colors.purple,
            transform: 'scale(1.05)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <DarkModeIcon sx={{ fontSize: '1.1rem' }} />
      </IconButton>
    </Tooltip>

    {/* Botó Traducció */}
    <Tooltip title={t('navbar.changeLanguage')}>
      <IconButton
        onClick={handleOpenLanguageMenu}
        sx={{
          color: isDarkMode ? theme.palette.primary.main : colors.yellow,
          bgcolor: isDarkMode ? theme.palette.background.paper : colors.darkBlue,
          width: 30,
          height: 30,
          '&:hover': {
            bgcolor: isDarkMode ? theme.palette.action.hover : colors.textDark,
            transform: 'scale(1.05)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <TranslateIcon sx={{ fontSize: '1.1rem' }} />
      </IconButton>
    </Tooltip>

    {/* Menú de idiomas */}
    <Menu
      anchorEl={anchorElLanguage}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorElLanguage)}
      onClose={handleCloseLanguageMenu}
      PaperProps={{
        sx: {
          minWidth: 80,
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          bgcolor: isDarkMode ? theme.palette.background.paper : 'white',
        },
      }}
    >
      <MenuItem
        onClick={() => handleLanguageChange('ca')}
        sx={{
          py: 1,
          px: 2,
          fontSize: '0.85rem',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          '&:hover': {
            bgcolor: isDarkMode ? theme.palette.action.hover : colors.lightBlue,
          },
        }}
      >
        <span className="fi fi-es-ct fis" style={{ fontSize: '1.2rem' }}></span>
        <span>CAT</span>
      </MenuItem>
      <MenuItem
        onClick={() => handleLanguageChange('es')}
        sx={{
          py: 1,
          px: 2,
          fontSize: '0.85rem',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          '&:hover': {
            bgcolor: isDarkMode ? theme.palette.action.hover : colors.lightBlue,
          },
        }}
      >
        <span className="fi fi-es fis" style={{ fontSize: '1.2rem' }}></span>
        <span>ESP</span>
      </MenuItem>
      <MenuItem
        onClick={() => handleLanguageChange('en')}
        sx={{
          py: 1,
          px: 2,
          fontSize: '0.85rem',
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          '&:hover': {
            bgcolor: isDarkMode ? theme.palette.action.hover : colors.lightBlue,
          },
        }}
      >
        <span className="fi fi-gb fis" style={{ fontSize: '1.2rem' }}></span>
        <span>ENG</span>
      </MenuItem>
    </Menu>
  </Box>

  {/* Avatar i menú d'usuari (només si està autenticat) */}
  {user && (
    <>
      {/* Avatar */}
      <Tooltip title="Perfil">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            sx={{
              bgcolor:
                user?.role === ROLES.PROTECTORA
                  ? isDarkMode ? theme.palette.primary.dark : colors.blue
                  : isDarkMode ? theme.palette.secondary.dark : colors.orange,
              width: { xs: 42, md: 48 },
              height: { xs: 42, md: 48 },
              border: `2px solid ${isDarkMode ? theme.palette.primary.light : colors.yellow}`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.08)",
                boxShadow: 3,
              },
            }}
          >
            <PetsIcon
              sx={{
                color: "white",
                fontSize: { xs: "1.3rem", md: "1.5rem" },
              }}
            />
          </Avatar>
        </IconButton>
      </Tooltip>

      {/* Menú de l'usuari */}
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        PaperProps={{
          sx: {
            minWidth: 220,
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        {/* Header amb info usuari */}
        <Box
          sx={{ px: 2, py: 1.5, bgcolor: isDarkMode ? theme.palette.background.default : colors.backgroundBlue}}
        >
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "0.95rem",
              color: isDarkMode ? theme.palette.text.primary : colors.textDark,
            }}
          >
            {user?.username || "Nom Usuari"}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: isDarkMode ? theme.palette.text.secondary : colors.textDark,
              opacity: 0.7,
            }}
          >
            {user?.email || "usuari@email.com"}
          </Typography>
        </Box>

        <Divider />

        {/* Opcions de menú */}

        <MenuItem
          onClick={() => handleUserMenuAction("Perfil")}
          sx={{
            py: 1.5,
            "&:hover": {
              bgcolor: colors.lightBlue,
            },
          }}
        >
          <Typography sx={{ fontSize: "0.95rem" }}>{t('menu.profile')}</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => handleUserMenuAction("Inici")}
          sx={{
            py: 1.5,
            "&:hover": {
              bgcolor: colors.lightBlue,
            },
          }}
        >
          <Typography sx={{ fontSize: "0.95rem" }}>{t('menu.home')}</Typography>
        </MenuItem>

        {/* Preferits: només per rol usuari */}
        {user?.role === ROLES.USUARIO && (
          <MenuItem
            onClick={() => {
              handleCloseUserMenu();
              navigate("/favoritos");
            }}
            sx={{
              py: 1.5,
              "&:hover": {
                bgcolor: colors.lightBlue,
              },
            }}
          >
            <Typography sx={{ fontSize: "0.95rem" }}>Preferits</Typography>
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5 }} />

        {/* Opció Sortir amb color diferent */}
        <MenuItem
          onClick={() => handleUserMenuAction("Sortir")}
          sx={{
            py: 1.5,
            "&:hover": {
              bgcolor: "#ffe0e0",
            },
          }}
        >
          <Typography sx={{ fontSize: "0.95rem", color: "#d32f2f" }}>
            {t('menu.logout')}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )}
</Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
