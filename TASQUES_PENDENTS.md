# Desglossament de Tasques Pendents - PetConnect

## 🔶 FUNCIONALITATS PARCIALS

### 1. Notificacions de Missatges Nous

#### 1.1 Backend (Django)
| Tasca | Descripció | Prioritat |
|-------|------------|-----------|
| 1.1.1 | Afegir camp `is_read` al model de missatges | Alta |
| 1.1.2 | Crear endpoint `GET /api/chat/unread-count/` que retorni el nombre de missatges no llegits | Alta |
| 1.1.3 | Crear endpoint `POST /api/chat/{id}/mark-read/` per marcar missatges com a llegits | Alta |
| 1.1.4 | Emetre event WebSocket quan arriba nou missatge | Mitjana |

#### 1.2 Frontend (React)
| Tasca | Descripció | Prioritat |
|-------|------------|-----------|
| 1.2.1 | Crear hook `useUnreadMessages()` que faci polling o escolti WebSocket | Alta |
| 1.2.2 | Afegir Badge al component `ChatMiniList` mostrant missatges no llegits per xat | Alta |
| 1.2.3 | Afegir Badge a la icona de xat de la navegació principal | Alta |
| 1.2.4 | Marcar missatges com a llegits quan s'obre el xat (`Chat.jsx`) | Alta |
| 1.2.5 | Notificació toast/snackbar quan arriba missatge nou (opcional) | Baixa |

---

### 2. Chatbot FAQ

#### 2.1 Base de Dades FAQ
| Tasca | Descripció | Prioritat |
|-------|------------|-----------|
| 2.1.1 | Crear model `FAQ` amb camps: `pregunta`, `resposta`, `categoria`, `keywords`, `rol_destinatari` (usuari/protectora/ambdós) | Alta |
| 2.1.2 | Crear fixture amb FAQs inicials (adopció, requisits, procés, contacte, etc.) | Alta |
| 2.1.3 | Crear panell admin per gestionar FAQs | Mitjana |

#### 2.2 Backend Chatbot
| Tasca | Descripció | Prioritat |
|-------|------------|-----------|
| 2.2.1 | Crear endpoint `POST /api/chatbot/ask/` que rebi pregunta i retorni resposta | Alta |
| 2.2.2 | Implementar cerca per keywords/similitud en les FAQs | Alta |
| 2.2.3 | Integrar IA (OpenAI/Claude) per millorar detecció d'intencions | Mitjana |
| 2.2.4 | Resposta per defecte si no es troba FAQ: "No entenc la pregunta, contacta amb suport" | Alta |

#### 2.3 Frontend Chatbot
| Tasca | Descripció | Prioritat |
|-------|------------|-----------|
| 2.3.1 | Crear component `ChatbotWidget.jsx` (botó flotant + finestra xat) | Alta |
| 2.3.2 | Dissenyar UI de conversa amb el bot (missatges usuari vs bot) | Alta |
| 2.3.3 | Mostrar suggeriments de preguntes freqüents al iniciar | Mitjana |
| 2.3.4 | Afegir botó "Parlar amb humà" que obri xat real amb suport | Baixa |

---

## ❌ FUNCIONALITATS PENDENTS

### 3. IA de Matching (Usuari ↔ Mascota)

#### 3.1 Backend - Algorisme de Matching
| Tasca | Descripció | Prioritat |
|-------|------------|-----------|
| 3.1.1 | Crear servei `matching_service.py` a `ai_service/` | Alta |
| 3.1.2 | Definir factors de compatibilitat i pesos: | Alta |
|       | - Tipus animal (gos/gat) vs preferència usuari | |
|       | - Tamany mascota vs tipus vivenda usuari | |
|       | - Nivell energia vs estil vida usuari | |
|       | - Edat mascota vs preferència usuari | |
|       | - Convivència amb nens/altres animals | |
| 3.1.3 | Implementar funció `calculate_match_score(usuario, mascota)` → retorna 0-100% | Alta |
| 3.1.4 | Crear endpoint `GET /api/mascotas/recommended/` ordenat per compatibilitat | Alta |
| 3.1.5 | Modificar endpoint `/pettinder/next/` per prioritzar mascotes amb més match | Mitjana |

#### 3.2 Frontend - Visualització de Matching
| Tasca | Descripció | Prioritat |
|-------|------------|-----------|
| 3.2.1 | Afegir badge de compatibilitat (%) a `CardPet.jsx` | Alta |
| 3.2.2 | Crear component `MatchIndicator.jsx` amb barra de progrés circular | Mitjana |
| 3.2.3 | Mostrar tooltip explicant per què hi ha aquest % de match | Mitjana |
| 3.2.4 | Afegir filtre "Ordenar per compatibilitat" a la galeria | Mitjana |

#### 3.3 Millora amb IA (Fase 2)
| Tasca | Descripció | Prioritat |
|-------|------------|-----------|
| 3.3.1 | Guardar històric d'adopcions exitoses | Baixa |
| 3.3.2 | Entrenar model que aprengui dels matchs exitosos | Baixa |
| 3.3.3 | Millorar recomanacions basant-se en comportament (likes/dislikes) | Baixa |

---

### 4. Cerca per Imatge (Similitud Visual)

#### 4.1 Backend - Processament d'Imatges
| Tasca | Descripció | Prioritat |
|-------|------------|-----------|
| 4.1.1 | Instal·lar dependències: `torch`, `torchvision`, `Pillow`, `faiss-cpu` | Alta |
| 4.1.2 | Crear servei `image_similarity_service.py` a `ai_service/` | Alta |
| 4.1.3 | Implementar funció per generar embeddings d'imatge (ResNet/CLIP) | Alta |
| 4.1.4 | Crear script per generar embeddings de totes les mascotes existents | Alta |
| 4.1.5 | Guardar embeddings a BD o fitxer (camp `image_embedding` al model Mascota) | Alta |
| 4.1.6 | Crear endpoint `POST /api/mascotas/search-by-image/` | Alta |
|       | - Rep imatge (multipart/form-data) | |
|       | - Genera embedding de la imatge | |
|       | - Cerca mascotes similars amb faiss/cosine similarity | |
|       | - Retorna llista ordenada per similitud | |
| 4.1.7 | Afegir task automàtica per generar embedding quan es puja nova mascota | Mitjana |

#### 4.2 Frontend - Pantalla de Cerca per Imatge
| Tasca | Descripció | Prioritat |
|-------|------------|-----------|
| 4.2.1 | Crear ruta `/search-by-image` al router | Alta |
| 4.2.2 | Crear pàgina `SearchByImage.jsx` | Alta |
| 4.2.3 | Implementar zona d'upload (drag & drop + botó) | Alta |
| 4.2.4 | Mostrar preview de la imatge pujada | Alta |
| 4.2.5 | Cridar API i mostrar loading mentre processa | Alta |
| 4.2.6 | Mostrar resultats en grid amb % similitud | Alta |
| 4.2.7 | Afegir enllaç a aquesta funcionalitat des de la navegació | Mitjana |

---

## 📋 Resum de Tasques per Prioritat

### ALTA PRIORITAT (Necessari per MVP)

#### Notificacions de Missatges
- [ ] 1.1.1 Camp is_read a missatges
- [ ] 1.1.2 Endpoint unread-count
- [ ] 1.1.3 Endpoint mark-read
- [ ] 1.2.1 Hook useUnreadMessages
- [ ] 1.2.2 Badge missatges no llegits a ChatMiniList
- [ ] 1.2.3 Badge a navegació principal
- [ ] 1.2.4 Marcar llegits al obrir xat

#### Chatbot FAQ
- [ ] 2.1.1 Model FAQ
- [ ] 2.1.2 Fixture FAQs inicials
- [ ] 2.2.1 Endpoint chatbot/ask
- [ ] 2.2.2 Cerca per keywords
- [ ] 2.2.4 Resposta per defecte
- [ ] 2.3.1 Component ChatbotWidget
- [ ] 2.3.2 UI conversa bot

#### IA de Matching
- [ ] 3.1.1 Servei matching_service.py
- [ ] 3.1.2 Definir factors i pesos
- [ ] 3.1.3 Funció calculate_match_score
- [ ] 3.1.4 Endpoint mascotas/recommended
- [ ] 3.2.1 Badge compatibilitat a CardPet

#### Cerca per Imatge
- [ ] 4.1.1 Instal·lar dependències IA imatge
- [ ] 4.1.2 Servei image_similarity_service.py
- [ ] 4.1.3 Funció generar embeddings
- [ ] 4.1.4 Script embeddings mascotes existents
- [ ] 4.1.5 Guardar embeddings a BD
- [ ] 4.1.6 Endpoint search-by-image
- [ ] 4.2.1 Ruta /search-by-image
- [ ] 4.2.2 Pàgina SearchByImage.jsx
- [ ] 4.2.3 Upload drag & drop
- [ ] 4.2.4 Preview imatge
- [ ] 4.2.5 Loading mentre processa
- [ ] 4.2.6 Resultats amb % similitud

### MITJANA PRIORITAT

- [ ] 1.1.4 Event WebSocket nou missatge
- [ ] 2.1.3 Panell admin FAQs
- [ ] 2.2.3 IA detecció intencions
- [ ] 2.3.3 Suggeriments preguntes
- [ ] 3.1.5 PetTinder prioritzar per match
- [ ] 3.2.2 Component MatchIndicator
- [ ] 3.2.3 Tooltip explicació match
- [ ] 3.2.4 Filtre ordenar per compatibilitat
- [ ] 4.1.7 Task automàtica embedding nova mascota
- [ ] 4.2.7 Enllaç navegació

### BAIXA PRIORITAT (Post-MVP)

- [ ] 1.2.5 Notificació toast nou missatge
- [ ] 2.3.4 Botó "Parlar amb humà"
- [ ] 3.3.1 Històric adopcions
- [ ] 3.3.2 Model ML matchs exitosos
- [ ] 3.3.3 Recomanacions per comportament

---

## ⏱️ Estimació de Temps

| Funcionalitat | Hores Estimades |
|---------------|-----------------|
| Notificacions missatges | 6-8h |
| Chatbot FAQ | 10-14h |
| IA de Matching | 12-16h |
| Cerca per Imatge | 14-20h |
| **TOTAL** | **42-58h** |

---

## 📊 Progrés General del Projecte

```
PROGRÉS ESTIMAT: ~75-80% complet

✅ Complet: Autenticació, Perfils, CRUD Mascotes, Galeria, 
           PetTinder, Xat amb creació automàtica, UI/UX

🔶 Parcial: Notificacions, Chatbot FAQ

❌ Pendent: IA Matching, Cerca per Imatge
```