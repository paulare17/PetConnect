// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Landpage from "./components/Landpage/Landpage";
import FormRol from "./components/Forms/FormRol";
import FormDialog from "./components/Forms/FormDialog";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ViewLogin from "./components/Login/ViewLogin";
import FormProtectora from "./components/Forms/FormProtectora";
import FormUsuari from "./components/Forms/FormUsuari";
import AddAnimalForm from "./components/Forms/AddAnimalForm";
import ProfilePageUser from "./components/pages/ProfilePageUser";
import ProfilePageProtectora from "./components/pages/ProfilePageProtectora";
import Footer from "./components/Footer/Footer";
import FooterLandpage from "./components/Footer/FooterLandpage.jsx";
import ProtectedRoute, { ProtectoraRoute, UsuarioRoute } from "./components/ProtectedRoute";
import PetList from "./components/dashboard/PetList";

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

            {/* Rutes de registre (públiques però segons rol) */}
            <Route path="/formulari-protectora" element={<FormProtectora />} />
            <Route path="/formulari-usuari" element={<FormUsuari />} />

            {/* Rutes protegides - Només protectores */}
            <Route path="/afegir-animal" element={
              <ProtectoraRoute>
                <AddAnimalForm />
              </ProtectoraRoute>
            } />
            <Route path="/perfil-protectora" element={
              <ProtectoraRoute>
                <ProfilePageProtectora />
              </ProtectoraRoute>
            } />

            {/* Rutes protegides - Només usuaris */}
            <Route path="/perfil-usuari" element={
              <UsuarioRoute>
                <ProfilePageUser />
              </UsuarioRoute>
            } />

            {/* Ruta protegida - Qualsevol autenticat pot veure mascotes */}
            <Route path="/mascotes" element={
              <ProtectedRoute>
                <PetList />
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
