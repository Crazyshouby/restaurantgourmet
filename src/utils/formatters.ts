
/**
 * Utilitaires de formatage pour l'application
 */

/**
 * Formate un numéro de téléphone au format (XXX) XXX-XXXX
 */
export const formatPhoneNumber = (value: string): string => {
  // Retire tous les caractères non numériques
  const digits = value.replace(/\D/g, '');
  
  // Formate sous la forme (XXX) XXX-XXXX
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};
