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
import { AuthProvider, useAuthContext } from "./context/AuthProvider";
import ViewLogin from "./components/Login/ViewLogin";
import ForgotPassword from "./components/Login/ForgotPassword";
import ResetPassword from "./components/Login/ResetPassword";
import FormProtectora from "./components/Forms/FormProtectora";
import FormUsuari from "./components/Forms/FormUsuari";
import AddAnimalForm from "./components/Forms/AddAnimalForm.jsx";
import UserProfile from "./components/pages/UserProfile";
import ProfilePageProtectora from "./components/pages/ProfilePageProtectora";
import Footer from "./components/Footer/Footer";
import ProtectedRoute, { ProtectoraRoute, UsuarioRoute } from "./components/ProtectedRoute";
import PetTinder from "./components/MostraMascotes/PetTinder.jsx";
import IniciUsuari from "./components/Inici/IniciUsuari.jsx";
import IniciProtectora from "./components/Inici/IniciProtectora.jsx";
import ProfileMascota from "./components/pages/ProfileMascota.jsx";
import ChatRoom from "./components/Chat/Chat.jsx";
import ChatList from "./components/Chat/ChatList.jsx";
import ChatbotWidget from "./components/ChatBot/ChatBot.jsx";
import Favs from "./components/Favs/Favs.jsx";

// Component que conté l'aplicació i pot accedir al context d'autenticació
function AppContent() {
  const { user } = useAuthContext();

  return (
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
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
        <Route path="/inici-usuari-petmatch" element={
          <UsuarioRoute>
            <PetTinder />
          </UsuarioRoute>
        } />
        <Route path="/favoritos" element={
          <UsuarioRoute>
            <Favs />
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
      
      {/* Chatbot Widget - només visible si l'usuari ha iniciat sessió */}
      {user && <ChatbotWidget />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
export default App;
