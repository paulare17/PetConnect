import PetsIcon from "@mui/icons-material/Pets";
import { colors } from "../../constants/colors.jsx";

export default function Footer() {
  return (
<footer
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ backgroundColor: colors.orange, width: "100%" }}
    >
      <div className="container d-flex justify-content-center align-items-center py-4">
        <a href="https://facebook.com" className="footer-link mx-3" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
      Facebook
        </a>

        <a href="https://youtube.com" className="footer-link mx-3" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
          YouTube
        </a>

        <a href="https://instagram.com" className="footer-link mx-3" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>

        <a href="https://mdbootstrap.com" className="footer-link mx-3" aria-label="MDBootstrap" target="_blank" rel="noopener noreferrer">
          MDBootstrap
        </a>
      </div>

      <div
        className="w-100 text-center text-white p-3 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        <p className="mb-0">
          © Made with love in Barcelona <PetsIcon fontSize="small" />
        </p>
      </div>
    </footer>
    
  );
}