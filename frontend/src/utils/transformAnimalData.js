/**
 * Utilitat per transformar les dades del formulari (AddAnimalForm) 
 * al format que esperen els components de visualització (CardPet, CardPetDetail, 
 * ProfileMascotaView, PreviewDialog) i el backend.
 * 
 * Aquesta funció resol el problema de mapeig entre:
 * - Camps del formulari (tamaño, caracter, raza, etc.)
 * - Camps del backend (tamano, caracter_perro/gato, raza_perro/gato, etc.)
 * - Camps de display per mostrar etiquetes traduïdes (_display)
 */

// Mapa per convertir mides del formulari a valors del backend
export const TAMANO_MAP = {
  'pequeño': 'PEQUENO',
  'pequeno': 'PEQUENO',
  'mediano': 'MEDIANO',
  'grande': 'GRANDE',
  'gigante': 'GIGANTE',
  // També acceptar valors ja en majúscules
  'PEQUENO': 'PEQUENO',
  'MEDIANO': 'MEDIANO',
  'GRANDE': 'GRANDE',
  'GIGANTE': 'GIGANTE',
};

// Mapa invers per obtenir el valor del formulari des del backend
export const TAMANO_REVERSE_MAP = {
  'PEQUENO': 'pequeño',
  'MEDIANO': 'mediano',
  'GRANDE': 'grande',
  'GIGANTE': 'gigante',
  // Versions en minúscules
  'pequeno': 'pequeño',
  'mediano': 'mediano',
  'grande': 'grande',
  'gigante': 'gigante',
};

// Mapa per convertir caràcters backend a claus de traducció
export const CHARACTER_TRANSLATION_MAP = {
  CARINOSO: 'affectionate',
  FALDERO: 'lapDog',
  DEPENDIENTE: 'dependent',
  DUO_INSEPARABLE: 'inseparableDuo',
  TIMIDO: 'shy',
  MIEDOSO: 'fearful',
  JUGUETON: 'playful',
  ACTIVO_ENERGICO: 'activeEnergetic',
  TRANQUILO: 'calm',
  TRABAJADOR: 'hardWorking',
  SOCIABLE: 'sociable',
  PROTECTOR_GUARDIAN: 'protectiveGuardian',
  DOMINANTE_PERROS: 'dominantWithDogs',
  REACTIVO: 'reactive',
  LIDERAZGO: 'leadership',
  DESCONFIADO_EXTRANOS: 'distrustfulOfStrangers',
  OBEDIENTE: 'obedient',
  OLAFATEADOR: 'sniffer',
  LADRADOR: 'barker',
  ESCAPISTA: 'escapist',
  EXCAVADOR: 'digger',
  GLOTON: 'glutton',
  CABEZOTA: 'stubborn',
  INTELIGENTE: 'intelligent',
  SENSIBLE: 'sensitive',
  LEAL: 'loyal',
  INDEPENDIENTE: 'independent',
  ASUSTADIZO: 'skittish',
  JUGUETON_INTENSO: 'intenselyPlayful',
  ACTIVO: 'active',
  CAZADOR: 'hunter',
  AFECTIVO_CONOCIDOS: 'affectionateWithFamiliar',
  TERRITORIAL: 'territorial',
  SEMIFERAL: 'semiFeral',
  OBSERVADOR: 'observer',
  ADAPTABLE: 'adaptable',
  DIVA: 'diva',
  LIMPIO: 'clean'
};

// Mapa de races de gos backend -> clau traducció
export const RAZA_PERRO_MAP = {
  MESTIZO: 'mixed',
  LABRADOR: 'labrador',
  GOLDEN_RETRIEVER: 'goldenRetriever',
  PASTOR_ALEMAN: 'germanShepherd',
  HUSKY: 'husky',
  BEAGLE: 'beagle',
  BORDER_COLLIE: 'borderCollie',
  ROTTWEILER: 'rottweiler',
  PITBULL: 'pitbull',
  TECKEL: 'teckel',
  POODLE: 'poodle',
  BICHON: 'bichon',
  CHIHUAHUA: 'chihuahua',
  YORKSHIRE_TERRIER: 'yorkshireTerrier',
  POMERANIA: 'pomeranian',
  MASTIN: 'mastiff',
  BULLDOG_FRANCES: 'frenchBulldog',
  AKITA_INU: 'akitaInu',
  DOBERMAN: 'doberman',
  BOXER: 'boxer',
  COCKER_SPANIEL: 'cockerSpaniel',
  GALGO: 'greyhound',
  DOGO_ARGENTINO: 'dogoArgentino',
  SAN_BERNARDO: 'saintBernard',
  CAREA: 'carea',
  PODENCO: 'podenco',
  GRAN_DANES: 'greatDane',
  CORGI: 'corgi',
  SHIH_TZU: 'shihTzu',
  SAMOYEDO: 'samoyed',
  MALINOIS: 'malinois',
  JACK_RUSSELL: 'jackRussell',
  SETTER_INGLES: 'englishSetter',
  PEKINES: 'pekingese',
};

// Mapa de races de gat backend -> clau traducció
export const RAZA_GATO_MAP = {
  MESTIZO: 'mixed',
  SPHYNX: 'sphynx',
  EUROPEO: 'european',
  ANGORA_TURCO: 'turkishAngora',
  SIAMES: 'siamese',
  PERSA: 'persian',
  BENGAL: 'bengal',
  SIBERIANO: 'siberian',
  SCOTTISH_FOLD: 'scottishFold',
  AZUL_RUSO: 'russianBlue',
  MAINE_COON: 'maineCoon',
  BOSQUE_NORUEGA: 'norwegianForest',
  TAILANDES: 'thai',
  DEVON_REX: 'devonRex',
  RAGDOLL: 'ragdoll',
  ORIENTAL: 'oriental',
  ABISINIO: 'abyssinian',
};

// Mapa de mides backend -> clau traducció
export const TAMANO_TRANSLATION_MAP = {
  PEQUENO: 'small',
  MEDIANO: 'medium',
  GRANDE: 'large',
  GIGANTE: 'giant',
};

/**
 * Transforma les dades del formulari al format que esperen els components
 * de visualització i el backend.
 * 
 * @param {object} formData - Dades del formulari AddAnimalForm
 * @param {array} previewUrls - URLs de preview de les imatges [url1, url2, url3]
 * @param {function} t - Funció de traducció i18n (opcional, per generar _display)
 * @returns {object} - Objecte animal transformat
 */
export function transformFormDataToAnimal(formData, previewUrls = ['', '', ''], t = null) {
  const especieLower = (formData.especie || '').toLowerCase();
  const isPerro = especieLower === 'perro' || formData.especie === 'PERRO';

  // Construir estado_legal_salud
  const estadoLegalSalud = [];
  if (formData.desparasitado) estadoLegalSalud.push('DESPARASITADO');
  if (formData.esterilizado) estadoLegalSalud.push('ESTERILIZADO');
  if (formData.vacunado) estadoLegalSalud.push('VACUNADO');
  if (formData.con_microchip) estadoLegalSalud.push('MICROCHIP');

  // Construir apto_con des de convivència
  const aptoCon = [];
  if (formData.convivencia_ninos === true) aptoCon.push('NINOS');
  if (formData.convivencia_ninos === false) aptoCon.push('SIN_NINOS');
  if (formData.convivencia_animales === 'misma_especie') {
    aptoCon.push(isPerro ? 'PERROS' : 'GATOS');
  }
  if (formData.convivencia_animales === 'cualquier_especie') {
    aptoCon.push('PERROS');
    aptoCon.push('GATOS');
  }
  if (formData.convivencia_animales === 'no') aptoCon.push('SOLO_EL');

  // Determinar raça segons espècie
  const razaValue = formData.raza || (isPerro ? formData.raza_perro : formData.raza_gato) || 'MESTIZO';
  const razaUpperCase = razaValue.toUpperCase();

  // Obtenir el mapa de races corresponent
  const razaMap = isPerro ? RAZA_PERRO_MAP : RAZA_GATO_MAP;
  
  // Generar el display de la raça
  let razaDisplay = razaValue;
  if (t && razaMap[razaUpperCase]) {
    razaDisplay = t(`breeds.${razaMap[razaUpperCase]}`);
  }

  // Convertir mida - normalitzar el valor d'entrada
  const tamanoInput = (formData.tamaño || formData.tamano || '').toLowerCase().trim();
  // Buscar al mapa, primer intentant amb el valor normalitzat, després amb majúscules
  const tamanoValue = TAMANO_MAP[tamanoInput] || TAMANO_MAP[tamanoInput.toUpperCase()] || 'MEDIANO';
  
  // Generar el display de la mida - SEMPRE usar traducció si està disponible
  let tamanoDisplay = tamanoValue; // Valor per defecte
  if (t && TAMANO_TRANSLATION_MAP[tamanoValue]) {
    tamanoDisplay = t(`sizes.${TAMANO_TRANSLATION_MAP[tamanoValue]}`);
  } else if (formData.tamano_display) {
    // Fallback al display existent
    tamanoDisplay = formData.tamano_display;
  }

  // Obtenir el caràcter (pot venir com array o com camps separats)
  let caracterArray = formData.caracter || [];
  if (!Array.isArray(caracterArray)) {
    caracterArray = caracterArray ? [caracterArray] : [];
  }
  // Si ve del backend amb camps específics
  if (caracterArray.length === 0) {
    caracterArray = isPerro 
      ? (formData.caracter_perro || []) 
      : (formData.caracter_gato || []);
  }

  // Construir objecte transformat
  const transformed = {
    // Camps bàsics
    id: formData.id || null,
    nombre: formData.nombre || '',
    especie: (formData.especie || '').toUpperCase(),
    genero: (formData.genero || '').toUpperCase(),
    edad: formData.edad ? parseInt(formData.edad, 10) : 0,
    descripcion: formData.descripcion || '',
    adoptado: formData.adoptado || false,
    oculto: formData.oculto || false,

    // Mida
    tamano: tamanoValue,
    tamano_display: tamanoDisplay,

    // Raça segons espècie
    raza_perro: isPerro ? razaUpperCase : '',
    raza_gato: !isPerro ? razaUpperCase : '',
    raza_perro_display: isPerro ? razaDisplay : '',
    raza_gato_display: !isPerro ? razaDisplay : '',

    // Caràcter segons espècie
    caracter_perro: isPerro ? caracterArray : [],
    caracter_gato: !isPerro ? caracterArray : [],

    // Estat legal/salut
    estado_legal_salud: estadoLegalSalud,

    // Apto con
    apto_con: aptoCon,

    // Condicions especials
    condicion_especial_perro: isPerro && formData.necesidades_especiales && formData.descripcion_necesidades
      ? [formData.descripcion_necesidades]
      : (formData.condicion_especial_perro || []),
    condicion_especial_gato: !isPerro && formData.necesidades_especiales && formData.descripcion_necesidades
      ? [formData.descripcion_necesidades]
      : (formData.condicion_especial_gato || []),

    // Fotos - usar URLs de preview si existeixen
    foto: previewUrls[0] || (typeof formData.foto === 'string' ? formData.foto : ''),
    foto2: previewUrls[1] || (typeof formData.foto2 === 'string' ? formData.foto2 : ''),
    foto3: previewUrls[2] || (typeof formData.foto3 === 'string' ? formData.foto3 : ''),

    // Camps addicionals del backend (si existeixen)
    protectora: formData.protectora || null,
    protectora_nombre: formData.protectora_nombre || '',
    ubicacion: formData.ubicacion || '',
    fecha_registro: formData.fecha_registro || null,
  };

  return transformed;
}

/**
 * Transforma les dades del backend al format del formulari (invers)
 * Útil per editar un animal existent
 * 
 * @param {object} animal - Dades de l'animal del backend
 * @returns {object} - Dades en format formulari
 */
export function transformAnimalToFormData(animal) {
  if (!animal) return null;

  const especieLower = (animal.especie || '').toLowerCase();
  const isPerro = especieLower === 'perro';

  // Extreure estat de salut
  const estadoSalud = animal.estado_legal_salud || [];

  // Extreure caràcter
  const caracter = isPerro 
    ? (animal.caracter_perro || []) 
    : (animal.caracter_gato || []);

  // Extreure condicions especials
  const condicionEspecial = isPerro 
    ? (animal.condicion_especial_perro || []) 
    : (animal.condicion_especial_gato || []);

  // Determinar convivència amb nens
  let convivenciaNinos = '';
  if (animal.apto_con?.includes('NINOS')) convivenciaNinos = true;
  if (animal.apto_con?.includes('SIN_NINOS')) convivenciaNinos = false;

  // Determinar convivència amb animals
  let convivenciaAnimales = '';
  if (animal.apto_con?.includes('SOLO_EL')) {
    convivenciaAnimales = 'no';
  } else if (animal.apto_con?.includes('PERROS') && animal.apto_con?.includes('GATOS')) {
    convivenciaAnimales = 'cualquier_especie';
  } else if (animal.apto_con?.includes('PERROS') || animal.apto_con?.includes('GATOS')) {
    convivenciaAnimales = 'misma_especie';
  }

  return {
    id: animal.id,
    nombre: animal.nombre || '',
    especie: (animal.especie || '').toUpperCase(),
    raza: isPerro ? animal.raza_perro : animal.raza_gato,
    raza_perro: animal.raza_perro || '',
    raza_gato: animal.raza_gato || '',
    genero: animal.genero || '',
    edad: animal.edad || '',
    tamaño: TAMANO_REVERSE_MAP[animal.tamano] || animal.tamano || '',
    color: animal.color || '',
    foto: animal.foto || '',
    foto2: animal.foto2 || '',
    foto3: animal.foto3 || '',
    caracter: caracter,
    convivencia_animales: convivenciaAnimales,
    convivencia_ninos: convivenciaNinos,
    desparasitado: estadoSalud.includes('DESPARASITADO'),
    esterilizado: estadoSalud.includes('ESTERILIZADO'),
    con_microchip: estadoSalud.includes('MICROCHIP'),
    vacunado: estadoSalud.includes('VACUNADO'),
    necesidades_especiales: condicionEspecial.length > 0,
    descripcion_necesidades: condicionEspecial.join(', '),
    descripcion: animal.descripcion || '',
    adoptado: animal.adoptado || false,
    oculto: animal.oculto || false,
  };
}

export default transformFormDataToAnimal;
