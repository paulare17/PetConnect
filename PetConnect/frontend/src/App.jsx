// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Landpage from "./components/Landpage/Landpage";
import FormRol from "./components/Forms/FormRol";
import FormDialog from "./components/Forms/FormDialog";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ViewLogin from "./components/Login/ViewLogin";
import FormProtectora from "./components/Forms/FormProtectora";
import FormUsuari from "./components/Forms/FormUsuari";
import AddAnimalForm from "./components/Forms/AddAnimalForm";
import ProfilePageUser from "./components/pages/ProfilePageUser";
import ProfilePageProtectora from "./components/pages/ProfilePageProtectora";
import Footer from "./components/Footer/Footer";
// import FooterLandpage from "./components/Footer/FooterLandpage";
// import {colors} from './constants/colors.jsx'
import FooterLandpage from "./components/Footer/FooterLandpage.jsx";

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
          <Route path="/" element={
        
          <Landpage/>
            
          
          }
           />
          <Route
            path="/formulari-dialog"
            element={
              <>
                <Landpage />
                <FormDialog />
              </>
            }
          />
           <Route path="/rol" element={<FormRol />} />
           <Route path="/formulari-acces" element={<ViewLogin />} />
           <Route path="/formulari-protectora" element={<FormProtectora/> }/>
           <Route path="/formulari-usuari" element={<FormUsuari/>}/>
           <Route path="/afegir-animal" element={<AddAnimalForm/>}/>
           <Route path="/perfil-usuari" element={<ProfilePageUser/>}/>
           <Route path="/perfil-protectora" element={<ProfilePageProtectora/>}/>

           
          </Routes>

          <Footer />
          {/* <FooterLandpage></FooterLandpage> */}
        </div>
      </AuthProvider>

  );
}
export default App;
