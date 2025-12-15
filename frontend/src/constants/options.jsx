
export const generoOptions = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "O", label: "Otros" },
  { value: "N", label: "Prefiero no decirlo" },
];

export const especieOptions = [
  { value: "perro", label: "Perro" },
  { value: "gato", label: "Gato" },
];

export const actividadOptions = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];

export const tamanoOptions = [
  { value: "pequeno", label: "Pequeño" },
  { value: "mediano", label: "Mediano" },
  { value: "grande", label: "Grande" },
];

export const edadOptions = [
  { value: "cachorro", label: "Cachorro" },
  { value: "joven", label: "Joven" },
  { value: "adulto", label: "Adulto" },
  { value: "senior", label: "Senior" },
];

export const sexoOptions = [
  { value: "macho", label: "Macho" },
  { value: "hembra", label: "Hembra" },
];

export const tipoViviendaOptions = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa_pequeña", label: "Casa pequeña" },
  { value: "casa_grande", label: "Casa grande" },
  { value: "casa_con_jardin", label: "Casa con jardín" },
  { value: "finca", label: "Finca/Casa rural" },
];

// Protectora-specific options
export const tipusAnimalsOptions = [
  { value: "gats", label: "Gats" },
  { value: "gossos", label: "Gossos" },
  { value: "altres", label: "Altres" },
];

export const serveisOptions = [
  { value: "adopcio", label: "Adopció" },
  { value: "acollida_temporal", label: "Acollida temporal" },
  { value: "veterinari", label: "Veterinari" },
  { value: "educacio", label: "Educació" },
  { value: "rehabilitacio", label: "Rehabilitació" },
  { value: "transport", label: "Transport" },
  { value: "castracio", label: "Castració/Esterilització" },
  { value: "recollida", label: "Recollida" },
];

// Helper: return the label for a given option value (case-insensitive match).
export function labelForValue(optionsArray, value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  const vStr = String(value).toLowerCase();
  const found = optionsArray.find((o) => String(o.value).toLowerCase() === vStr);
  return found ? found.label : String(value);
}

// Helper: map an array of values to their labels
export function labelsForValues(optionsArray, valuesArray) {
  if (!Array.isArray(valuesArray)) return [];
  return valuesArray.map((v) => labelForValue(optionsArray, v));
}

export default {
  generoOptions,
  especieOptions,
  actividadOptions,
  tamanoOptions,
  edadOptions,
  sexoOptions,
  tipoViviendaOptions,
  labelForValue,
  labelsForValues,
};
