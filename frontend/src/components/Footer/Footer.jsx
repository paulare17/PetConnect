import PetsIcon from "@mui/icons-material/Pets";
import { useColors } from "../../../../PetConnect/frontend/src/hooks/useColors";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { colors } = useColors();
  const { t } = useTranslation();
  
  return (
<footer
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ backgroundColor: colors.orange, width: "100%", transition: 'background-color 0.3s ease' }}
    >
      <div className="container d-flex justify-content-center align-items-center py-4">
        <a href="https://facebook.com" className="footer-link mx-3" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
          {t('footer.facebook')}
        </a>

        <a href="https://youtube.com" className="footer-link mx-3" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
          {t('footer.youtube')}
        </a>

        <a href="https://instagram.com" className="footer-link mx-3" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
          {t('footer.instagram')}
        </a>

        <a href="https://mdbootstrap.com" className="footer-link mx-3" aria-label="MDBootstrap" target="_blank" rel="noopener noreferrer">
          {t('footer.mdbootstrap')}
        </a>
      </div>

      <div
        className="w-100 text-center text-white p-3 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        <p className="mb-0">
          {t('footer.madeWith')} <PetsIcon fontSize="16px" />
        </p>
      </div>
    </footer>
    
  );
}