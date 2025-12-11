import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../../PetConnect/frontend/src/context/AuthProvider';
import { ROLES } from '../constants/roles';

/**
 * Component per protegir rutes que requereixen autenticació
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Component a mostrar si està autoritzat
 * @param {string[]} props.allowedRoles - Rols permesos (opcional, per defecte tots els autenticats)
 * @param {string} props.redirectTo - Ruta de redirecció si no autoritzat (per defecte '/formulari-acces')
 */
export default function ProtectedRoute({ 
  children, 
  allowedRoles = null, 
  redirectTo = '/formulari-acces' 
}) {
  const { user, isAuthenticated } = useAuthContext();

  // Si no està autenticat, redirigeix al login
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si hi ha rols específics requerits, comprova'ls
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user?.role);
    if (!hasRequiredRole) {
      // Redirigeix segons el rol que té
      if (user?.role === ROLES.PROTECTORA) {
        return <Navigate to="/perfil-protectora" replace />;
      } else if (user?.role === ROLES.USUARIO) {
        return <Navigate to="/perfil-usuari" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  // Autoritzat, mostra el component
  return children;
}

/**
 * Ruta només per protectores
 */
export function ProtectoraRoute({ children, redirectTo = '/formulari-acces' }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.PROTECTORA]} redirectTo={redirectTo}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Ruta només per usuaris (adoptants)
 */
export function UsuarioRoute({ children, redirectTo = '/formulari-acces' }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.USUARIO]} redirectTo={redirectTo}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Ruta només per admins
 */
export function AdminRoute({ children, redirectTo = '/' }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]} redirectTo={redirectTo}>
      {children}
    </ProtectedRoute>
  );
}
