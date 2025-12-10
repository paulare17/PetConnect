import { useContext } from "react";
import { DarkModeContext } from "../context/darkModeContext";
import { colors as lightColors, darkColors } from "../constants/colors";

/**
 * Hook per obtenir els colors correctes segons el mode (clar/fosc)
 * 
 * @returns {Object} - Objecte amb `colors` (adaptat al mode actual) i `isDarkMode`
 * 
 * Ús:
 * const { colors, isDarkMode } = useColors();
 * <Box bgcolor={colors.background}>...</Box>
 * 
 * Així NO cal canviar el codi existent - segueix usant colors.xxx!
 */
export const useColors = () => {
  // Usa useContext directament amb fallback si no hi ha provider
  const context = useContext(DarkModeContext);
  
  // Si no hi ha context (component fora del provider), usa valors per defecte
  const isDarkMode = context?.isDarkMode ?? false;
  const toggleDarkMode = context?.toggleDarkMode ?? (() => {});
  
  // Retorna "colors" amb els valors correctes segons el mode
  const colors = isDarkMode ? darkColors : lightColors;
  
  return { 
    colors,              // Colors actuals (light o dark) - USA AQUEST!
    lightColors,         // Colors light (sempre disponibles)
    darkColors,          // Colors dark (sempre disponibles)
    isDarkMode, 
    toggleDarkMode 
  };
};

export default useColors;
