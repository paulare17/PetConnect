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
import {colors} from '../../constants/colors.jsx'
import { ROLES } from '../../constants/roles.jsx';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../context/AuthProvider';


const pages = ["Sobre nosaltres", "Perduts", "Contacte", "Adopta"];
const settings = ["Perfil", "Inici", "Sortir"];


function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate()
  const { user, logout } = useAuthContext();

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
  const handlePageAction = (page) => {
    handleCloseNavMenu();
    if (page === "Adopta") {
      navigate("/inici-usuari-galeria");
    } else {
      //  afegir més rutes aquí 
      navigate("/");
    }
  };

  const renderUserMenuItems = () =>
    settings.map((setting) => (
      <MenuItem key={setting} onClick={() => handleUserMenuAction(setting)}>
        <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
      </MenuItem>
    ));
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: colors.orange,
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
           onClick={()=> navigate('/')}
           className="animation-nav"
            sx={{
              mr:0.5, 
              mb: 1,
              display: { xs: "none", md: "flex" },
              color: colors.yellow,
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
          onClick={()=> navigate('/')}
          className="animation-nav"
          variant="h6"
            noWrap
            component="a"
            
            sx={{
              display: { xs: "none", md: "flex" },
              fontFamily: "Rubik Bubbles",
              fontWeight: 700,
              color: colors.yellow,
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
              sx={{ display: { xs: "block", md: "none" }}}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu} >
                  <Typography
                    // className="menu-item-text"
                    sx={{ textAlign: "center",  }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
              
            </Menu>
          </Box>

          {/* títol per a mòbil */}
          <Box sx={{ display: { xs: "flex", md: "none" }, 
  alignItems: "center", 
  justifyContent: "center",
  flexGrow: 1, 
  position: "absolute", 
  left: "50%",
  transform: "translateX(-50%)", 
  }}>


          <PetsIcon
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              color: colors.yellow, 
              cursor: "pointer",
              fontSize: { xs: "1.8rem", sm: "2rem" },
              "&:hover": {
                transform: "scale(1.2)",
                transition: "transform 0.3s ease-in-out",
              },
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
              letterSpacing: ".3rem",
              color: colors.yellow,
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
              gap: 1
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageAction(page)}
                sx={{
                  color: colors.purple,
                  fontSize: { xs: "1.2rem", md: "1.5rem" }, 
                  px: 2,
                  py: 1,
                  "&:hover": {
                    color: colors.darkBlue,
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
           {/* Secció dreta: Icona xats + Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, md: 2.5 }, flexShrink: 0 }}>
            {user && (
              <>
                <Tooltip title="Els meus xats">
                  <Button
                    onClick={() => navigate('/chats')}
                    sx={{
                      borderRadius: 5,
                      bgcolor: colors.yellow,
                      width: { xs: 42, md: 48 },
                      height: { xs: 42, md: 48 },
                      '&:hover': {
                        bgcolor: colors.lightColor,
                        transform: 'scale(1.08)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    <ChatBubbleOutlineIcon sx={{ fontSize: { xs: '1.3rem', md: '1.5rem' }, color: colors.darkBlue }} />
                  </Button>
                </Tooltip>

                <Tooltip title="Perfil">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: user?.role === ROLES.PROTECTORA ? colors.blue : colors.orange,
                        width: { xs: 42, md: 48 },
                        height: { xs: 42, md: 48 },
                        border: `2px solid ${colors.yellow}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.08)',
                          boxShadow: 3
                        }
                      }}
                    >
                      <PetsIcon sx={{ color: 'white', fontSize: { xs: '1.3rem', md: '1.5rem' } }} />
                    </Avatar>
                  </IconButton>
                </Tooltip>

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
                >
                  {renderUserMenuItems()}
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
