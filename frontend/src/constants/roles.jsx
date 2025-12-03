/* eslint-disable react-refresh/only-export-components */
/**
 * Constants per als rols d'usuari
 * Han de coincidir amb els ROLE_CHOICES del backend (usuarios/models.py)
 */

export const ROLES = {
  ADMIN: 'admin',
  USUARIO: 'usuario',
  PROTECTORA: 'protectora',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.USUARIO]: 'Usuario',
  [ROLES.PROTECTORA]: 'Protectora',
};

// Helper per validar si un rol és vàlid
export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role);
};

export default ROLES;
