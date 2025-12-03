// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Landpage from "./components/Landpage/Landpage";
import FormRol from "./components/Forms/FormRol";
import FormDialog from "./components/Forms/FormDialog";
import FormDialogProtectora from "./components/Forms/FormDialogProtectora";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ViewLogin from "./components/Login/ViewLogin";
import FormProtectora from "./components/Forms/FormProtectora";
import FormUsuari from "./components/Forms/FormUsuari";
import AddAnimalForm from "./components/Forms/AddAnimalForm";
import UserProfile from "./components/pages/UserProfile";
import ProfilePageProtectora from "./components/pages/ProfilePageProtectora";
import Footer from "./components/Footer/Footer";
import FooterLandpage from "./components/Footer/FooterLandpage.jsx";
import ProtectedRoute, { ProtectoraRoute, UsuarioRoute } from "./components/ProtectedRoute";
import PetTinder from "./components/MostraMascotes/PetTinder.jsx";
import IniciUsuari from "./components/Inici/IniciUsuari";
import IniciProtectora from "./components/Inici/IniciProtectora";
import ProfileMascota from "./components/pages/ProfileMascota.jsx";
import ChatRoom from "./components/Chat/Chat.jsx";
import ChatList from "./components/Chat/ChatList.jsx";

function App() {
  // const location = useLocation();
  // const isLandpage = location.pathname ==="/" ? : ; 


  return (
      <AuthProvider>
        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            overflow: "auto",
            flexDirection: "column",
          }}
        >
          <Navbar />
          <Routes>
            {/* Rutes públiques */}
            <Route path="/" element={<Landpage />} />
            <Route path="/formulari-dialog" element={
              <>
                <Landpage />
                <FormDialog />
              </>
            } />
            <Route path="/rol" element={<FormRol />} />
            <Route path="/formulari-acces" element={<ViewLogin />} />
            <Route path="/login-protectora" element={
              <>
                <ViewLogin />
                <FormDialogProtectora />
              </>
            } />

            {/* Rutes de registre (públiques però segons rol) */}
            <Route path="/formulari-protectora" element={<FormProtectora />} />
            <Route path="/formulari-usuari" element={<FormUsuari />} />

            {/* Rutes protegides - Només protectores */}
            <Route path="/afegir-mascota" element={
              <ProtectoraRoute>
                <AddAnimalForm />
              </ProtectoraRoute>
            } />
            <Route path="/perfil-protectora" element={
              <ProtectoraRoute>
                <ProfilePageProtectora />
              </ProtectoraRoute>
            } />
            <Route path="/inici-protectora" element={
              <ProtectoraRoute>
                <IniciProtectora />
              </ProtectoraRoute>
            } />

            {/* Rutes protegides - Només usuaris */}
            <Route path="/perfil-usuari" element={
              <UsuarioRoute>
                <UserProfile />
              </UsuarioRoute>
            } />
            <Route path="/inici-usuari-galeria" element={
              <UsuarioRoute>
                <IniciUsuari />
              </UsuarioRoute>
            } />
            <Route path="/inici-usuari-pettinder" element={
              <UsuarioRoute>
                <PetTinder />
              </UsuarioRoute>
            } />

            {/* Rutes protegides - Chat */}
            <Route path="/chats" element={
              <ProtectedRoute>
                <ChatList />
              </ProtectedRoute>
            } />
            <Route path="/chat/:chatId" element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            } />

            {/* Ruta protegida - Perfil d'una mascota per id */}
            <Route path="/mascotes/:id" element={
              <ProtectedRoute>
                <ProfileMascota/>
              </ProtectedRoute>
            } />
          </Routes>

          <Footer />
          {/* <FooterLandpage></FooterLandpage> */}
        </div>
      </AuthProvider>

  );
}
export default App;
