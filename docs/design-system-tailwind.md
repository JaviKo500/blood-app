# Sistema de diseño con Tailwind CSS — Blood App

> **Estado:** propuesta documentada y verificada contra el proyecto. El único cambio en el código
> es una línea en `src/styles.css` (`@source not '../docs'`, ver 9.2). Este documento describe qué
> clases usar, dónde y por qué. Las secciones marcadas
> como **[medido]** salen de píxeles de la imagen; las marcadas como **[estimado]** son
> aproximaciones visuales; las marcadas como **[propuesto]** son decisiones de implementación que
> la imagen no muestra (por ejemplo, todo el modo oscuro).

## Índice

1. [Introducción y objetivo](#1-introducción-y-objetivo)
2. [Referencia de la imagen analizada](#2-referencia-de-la-imagen-analizada)
3. [Resumen del diseño visual](#3-resumen-del-diseño-visual)
4. [Paleta de colores y muestras HEX](#4-paleta-de-colores-y-muestras-hex)
5. [Tokens semánticos](#5-tokens-semánticos)
6. [Tipografía](#6-tipografía)
7. [Espaciados y dimensiones](#7-espaciados-y-dimensiones)
8. [Bordes, radios y sombras](#8-bordes-radios-y-sombras)
9. [Configuración global de Tailwind CSS](#9-configuración-global-de-tailwind-css)
10. [Pantalla 1: bienvenida y autenticación](#10-pantalla-1-bienvenida-y-autenticación)
11. [Pantalla 2: selección del tipo de sangre](#11-pantalla-2-selección-del-tipo-de-sangre)
12. [Pantalla 3: dashboard](#12-pantalla-3-dashboard)
13. [Inventario de componentes](#13-inventario-de-componentes)
14. [Clases Tailwind por componente](#14-clases-tailwind-por-componente)
15. [Explicación individual de cada clase](#15-explicación-individual-de-cada-clase)
16. [Ubicación de cada clase en cada pantalla](#16-ubicación-de-cada-clase-en-cada-pantalla)
17. [Comparativa de Light Mode y Dark Mode](#17-comparativa-de-light-mode-y-dark-mode)
18. [Explicación individual de las clases `dark:`](#18-explicación-individual-de-las-clases-dark)
19. [Configuración del selector de tema](#19-configuración-del-selector-de-tema)
20. [Estados interactivos](#20-estados-interactivos)
21. [Diseño responsive](#21-diseño-responsive)
22. [Accesibilidad](#22-accesibilidad)
23. [Iconos e ilustraciones](#23-iconos-e-ilustraciones)
24. [Archivos reales del proyecto](#24-archivos-reales-del-proyecto)
25. [Ejemplos de código](#25-ejemplos-de-código)
26. [Diferencias entre la referencia y la implementación](#26-diferencias-entre-la-referencia-y-la-implementación)
27. [Referencias oficiales](#27-referencias-oficiales)
28. [Lista de verificación final](#28-lista-de-verificación-final)

---

## 1. Introducción y objetivo

Este documento define el sistema de diseño de **Blood App** a partir de una imagen de referencia
con tres pantallas móviles, y explica cómo construir cada elemento con Tailwind CSS en **Light
Mode** y **Dark Mode**.

### 1.1. Lo más importante: esto no es una app web con Vite

La tarea pedía seguir la guía de [Tailwind con Vite](https://tailwindcss.com/docs/installation/using-vite).
Al inspeccionar el repositorio, **el proyecto no usa Vite ni el DOM**:

| Aspecto | Lo que hay en el proyecto (verificado) |
|---|---|
| Framework | Angular 22 sobre **Angular Native** (`@ng-native/*` 0.16.0): componentes Angular que dibujan vistas nativas de iOS y Android a través del renderizador Fabric de React Native, dentro de una app Expo 57. |
| Bundler | **Metro** (`metro.config.js`), no Vite. Vite solo aparece de forma indirecta en Vitest. |
| Tailwind | `tailwindcss@4.3.3` + `@tailwindcss/cli@4.3.3` + `@ng-native/tailwind@0.16.0`. |
| Cómo llega Tailwind a la app | `withTailwind()` ejecuta el CLI de Tailwind, convierte el CSS a lo que puede expresar una vista nativa y genera `.angular-native/app.tailwind.js`, que se pasa a `mount()` como `globalStyles`. |
| Plataformas | Solo `ios` y `android` (`app.json`). `npm run web` falla a propósito. |

Por eso **no se aplican** los pasos de la guía de Vite (`@tailwindcss/vite`, `vite.config.ts`,
`@import "tailwindcss"`). Todo lo demás de Tailwind v4 sí aplica (`@theme`, utilidades, variantes,
`@custom-variant`), con las diferencias que explica la sección 9.

### 1.2. Objetivo

Que otro desarrollador pueda:

- identificar cualquier elemento de las tres pantallas;
- conocer todas las clases que lo estilizan y para qué sirve cada una;
- saber dónde se usa cada clase;
- saber cómo cambia en modo oscuro, al pulsar, al recibir foco y en tablet.

### 1.3. Cómo se verificó

| Verificación | Resultado |
|---|---|
| Colores | Muestreo de píxeles con Python/PIL sobre la imagen original (2048×1536). |
| Contraste | Fórmula WCAG 2.x calculada para cada par texto/fondo propuesto. |
| Clases | Todas las clases de este documento se compilaron con el pipeline real del proyecto (`withTailwind` → Tailwind 4.3.3 → compilador CSS de Angular Native). **Ninguna se descartó.** Solo `grid` y `grid-cols-2`, añadidas a propósito como control, se descartaron con aviso. |
| Variantes en ejecución | Una prueba temporal con `@ng-native/testing` confirmó que `aria-checked:`, `group-aria-checked:`, `dark:` y la herencia del color de texto se resuelven como se documenta. La prueba se borró después. |

---

## 2. Referencia de la imagen analizada

| Campo | Valor |
|---|---|
| Archivo | `/Users/javier/Desktop/original-d948dbc7774495039244f4a3c5d81873.webp` |
| Tamaño | 2048 × 1536 px |
| Contenido | Tres maquetas de teléfono sobre un lienzo gris con patrones de puntos. |

### 2.1. Escala de conversión de píxeles a puntos

La imagen es una presentación, no una exportación a escala 1:1. Para convertir medidas se tomó como
referencia el ancho de la pantalla 1: **≈ 517 px de imagen ↔ 375 pt** (ancho lógico de un iPhone
estándar).

> **1 pt ≈ 1,38 px de la imagen original.** Todas las dimensiones en pt de este documento son
> **[estimado]**, con un margen de ±2–4 pt. La comprobación cruzada cuadra: el botón principal
> mide ≈ 328 pt, que es exactamente 375 − 2 × 24 pt de margen.

### 2.2. Qué es parte de la app y qué es presentación

| Elemento de la imagen | ¿Se implementa? | Motivo |
|---|---|---|
| Lienzo gris `#E4E4E4` | No | Es el fondo de la lámina, no de la app. |
| Patrones de puntos `#9EACB5` | No | Decoración de la lámina. |
| Radio y sombra de los marcos de teléfono | No | Las esquinas las pone el dispositivo. |
| Todo lo que hay dentro de cada marco | Sí | Es la interfaz. |

---

## 3. Resumen del diseño visual

| Rasgo | Observación [medido/estimado] |
|---|---|
| Estilo | Minimalista, plano, con un único color de marca (carmesí) sobre blanco. |
| Color | Un solo rojo `#D70032` para fondo de marca, botones, enlaces e iconos. Grises neutros para controles. |
| Tipografía | Geométrica sin serifa (probablemente **Poppins**). Títulos grandes en peso ligero; botones en semibold. |
| Forma | Rectángulos con radio pequeño (4–8 pt) en controles y algo mayor (≈ 12 pt) en tarjetas. Círculos decorativos en la esquina superior izquierda. |
| Profundidad | Casi plano. Solo las tarjetas del dashboard tienen una sombra muy suave y difusa, con un tinte azulado. |
| Composición | Una columna centrada, márgenes laterales de 24 pt, mucho espacio en blanco, acciones principales abajo. |
| Iconos | De línea fina en rojo (bolsa de sangre, megáfono) y glifos negros (menú, búsqueda). La gota del logotipo es una forma rellena con un auricular recortado. |

**Jerarquía común a las tres pantallas:** logotipo/encabezado arriba → título grande y ligero →
contenido → acción principal anclada abajo.

---

## 4. Paleta de colores y muestras HEX

### 4.1. Colores observados en la imagen

Valores **[medido]**: color del píxel en una zona plana. En el texto, los bordes suavizados no
permiten un valor exacto, así que se indica el píxel más oscuro del glifo y el valor queda
**[estimado]**.

| | Nombre | HEX | Origen | Dónde aparece |
|---|---|---|---|---|
| ![](https://placehold.co/20x20/D70032/D70032.png) | Rojo de marca | `#D70032` | [medido] zona plana | Fondo P1, gota P2, botón B, botón +, checkbox, Finish, gotas P3 |
| ![](https://placehold.co/20x20/DE2652/DE2652.png) | Círculo decorativo P1 | `#DE2652` | [medido] | Esquina superior izquierda de P1. Equivale a blanco al ≈15 % sobre el rojo. |
| ![](https://placehold.co/20x20/FFFFFF/FFFFFF.png) | Blanco | `#FFFFFF` | [medido] | Fondo de P2 y P3, botón Sign in, texto sobre rojo, tarjetas |
| ![](https://placehold.co/20x20/F2F2F2/F2F2F2.png) | Gris de control | `#F2F2F2` | [medido] | Botones A, O, AB y botón − sin seleccionar |
| ![](https://placehold.co/20x20/F9F9F9/F9F9F9.png) | Círculo decorativo P3 | `#F9F9F9` | [medido] | Esquina superior izquierda de P3 |
| ![](https://placehold.co/20x20/000000/000000.png) | Texto principal | `#000000` | [estimado] píxel más oscuro | Títulos, "Dashboard", menú, búsqueda, texto del checkbox |
| ![](https://placehold.co/20x20/484848/484848.png) | Texto secundario | `#484848` | [estimado] | Letras A/O/AB, signo − |
| ![](https://placehold.co/20x20/323232/323232.png) | Etiqueta de tarjeta | `#323232` | [estimado] | "Donate Now", "Campaign". Se unifica con `#484848`; ver sección 26. |
| ![](https://placehold.co/20x20/F4F6FA/F4F6FA.png) | Halo de la sombra | `#F4F6FA` | [medido] borde de la tarjeta | Sombra de las tarjetas de P3, con tinte azul pizarra |
| ![](https://placehold.co/20x20/E4E4E4/E4E4E4.png) | Lienzo | `#E4E4E4` | [medido] | Solo presentación (no se implementa) |
| ![](https://placehold.co/20x20/9EACB5/9EACB5.png) | Puntos | `#9EACB5` | [medido] | Solo presentación (no se implementa) |

**Enlaces y texto rojo:** los glifos rojos ("Don't know about your blood type?", "Can I give
blood?", "Sign in") miden entre `#CA0035` y `#DB0031` en su píxel más saturado. Es el mismo rojo de
marca suavizado por el antialiasing, así que se usa `#D70032`.

### 4.2. Por qué no se usa un rojo estándar de Tailwind

| Candidato Tailwind v4 | HEX | Diferencia con `#D70032` |
|---|---|---|
| `red-600` | `#E7000B` | Más anaranjado y más claro |
| `rose-600` | `#EC003F` | Más claro y más rosado |
| `rose-700` | `#C70036` | Más oscuro |

Ninguno coincide, y el rojo es la identidad de la marca. Por eso se define como **color
personalizado** en `@theme` (sección 9).

Los grises, en cambio, sí se resuelven bien con `neutral-*`: es una escala sin tinte, igual que los
grises de la imagen. La excepción es `#F2F2F2`, que cae entre `neutral-100` (`#F5F5F5`) y
`neutral-200` (`#E5E5E5`). Se define como token porque aparece en seis controles.

### 4.3. Tabla de tokens de color (Light y Dark)

| Token | HEX Light | Clase Tailwind | Clase Dark Mode | HEX Dark | Uso | Tipo |
|---|---|---|---|---|---|---|
| Primario | `#D70032` [medido] | `bg-brand` | (sin cambio) | `#D70032` | Botones principales, selección, checkbox | Personalizado |
| Primario pulsado | `#B0002A` [propuesto] | `hover:bg-brand-pressed` | (sin cambio) | `#B0002A` | Botón rojo mientras se pulsa | Personalizado |
| Fondo de marca | `#D70032` | `bg-brand` | `dark:bg-brand-deep` | `#8E0022` [propuesto] | Fondo de la pantalla 1 | Personalizado |
| Texto/acento rojo | `#D70032` | `text-brand` | `dark:text-brand-light` | `#FF5C7A` [propuesto] | Enlaces, iconos de línea, insignias | Personalizado |
| Fondo de pantalla | `#FFFFFF` | `bg-white` | `dark:bg-neutral-950` | `#0A0A0A` | Pantallas 2 y 3 | Estándar |
| Superficie (tarjeta) | `#FFFFFF` | `bg-white` | `dark:bg-neutral-900` | `#171717` | Tarjetas del dashboard | Estándar |
| Control | `#F2F2F2` [medido] | `bg-control` | `dark:bg-neutral-800` | `#262626` | Botones de grupo y Rh sin seleccionar | Personalizado + estándar |
| Control pulsado | `#E5E5E5` | `hover:bg-neutral-200` | `dark:hover:bg-neutral-700` | `#404040` | Control mientras se pulsa | Estándar |
| Texto principal | `#000000` | `text-black` | `dark:text-neutral-50` | `#FAFAFA` | Títulos, barra superior | Estándar |
| Texto secundario | `#484848` [estimado] | `text-ink-muted` | `dark:text-neutral-300` | `#D4D4D4` | Letras de grupo, etiquetas de tarjeta | Personalizado + estándar |
| Texto de párrafo | `#000000` | `text-black` | `dark:text-neutral-200` | `#E5E5E5` | Texto del checkbox | Estándar |
| Borde de checkbox | `#A1A1A1` [propuesto] | `border-neutral-400` | `dark:border-neutral-500` | `#737373` | Casilla sin marcar | Estándar |
| Borde de tarjeta | — | — | `dark:border-neutral-800` | `#262626` | Sustituye a la sombra en oscuro | Estándar |
| Sombra de tarjeta | slate-900 al 5 % | `shadow-lg shadow-slate-900/5` | `dark:shadow-none` | — | Profundidad de tarjetas | Estándar |
| Decoración P1 | blanco 15 % | `bg-white/15` | `dark:bg-white/10` | blanco 10 % | Círculo superior | Estándar |
| Decoración P3 | `#FAFAFA` | `bg-neutral-50` | `dark:bg-neutral-900` | `#171717` | Círculo superior | Estándar |

### 4.4. Justificación de los colores propuestos (que la imagen no muestra)

| Token | Motivo |
|---|---|
| `brand-pressed` `#B0002A` | Un rojo más oscuro da respuesta visible al pulsar. El texto blanco encima sube de 5,34:1 a 7,29:1. |
| `brand-deep` `#8E0022` | Un fondo rojo saturado a pantalla completa deslumbra de noche. Oscurecerlo conserva la marca y reduce el brillo. Blanco encima: 9,66:1. |
| `brand-light` `#FF5C7A` | `#D70032` sobre `neutral-950` da solo **3,71:1**, por debajo del mínimo AA para texto (4,5:1). Esta variante clara da 6,66:1 sobre `neutral-950` y 6,03:1 sobre `neutral-900`. |

---

## 5. Tokens semánticos

Hay dos capas:

1. **Tokens de tema** (`@theme`): valores que no existen en la paleta de Tailwind. Generan
   utilidades nuevas (`bg-brand`, `text-ink-muted`…).
2. **Roles semánticos**: qué utilidad usar para cada función. Es una convención del equipo, no
   CSS.

### 5.1. Tokens de tema

| Variable `@theme` | Valor | Utilidades que genera | Rol |
|---|---|---|---|
| `--color-brand` | `#d70032` | `bg-brand`, `text-brand`, `border-brand`, `ring-brand`, `ring-offset-brand`… | Color de marca |
| `--color-brand-pressed` | `#b0002a` | `bg-brand-pressed` | Estado pulsado del primario |
| `--color-brand-deep` | `#8e0022` | `bg-brand-deep`, `text-brand-deep`, `ring-offset-brand-deep` | Marca en oscuro (fondos) y texto rojo sobre blanco en oscuro |
| `--color-brand-light` | `#ff5c7a` | `text-brand-light`, `border-brand-light` | Rojo legible sobre fondos oscuros |
| `--color-control` | `#f2f2f2` | `bg-control` | Fondo de controles seleccionables |
| `--color-ink-muted` | `#484848` | `text-ink-muted` | Texto secundario sobre claro |
| `--font-sans` | `Poppins` | `font-sans` (y la fuente por defecto, ver 6.4) | Familia tipográfica |

### 5.2. Roles semánticos (Light → Dark)

| Rol | Light | Dark |
|---|---|---|
| `surface.screen` | `bg-white` | `dark:bg-neutral-950` |
| `surface.card` | `bg-white shadow-lg shadow-slate-900/5` | `dark:bg-neutral-900 dark:shadow-none dark:border-hairline dark:border-neutral-800` |
| `surface.control` | `bg-control` | `dark:bg-neutral-800` |
| `surface.brand` | `bg-brand` | `dark:bg-brand-deep` |
| `text.primary` | `text-black` | `dark:text-neutral-50` |
| `text.secondary` | `text-ink-muted` | `dark:text-neutral-300` |
| `text.accent` | `text-brand` | `dark:text-brand-light` |
| `text.on-brand` | `text-white` | (sin cambio) |
| `action.primary` | `bg-brand hover:bg-brand-pressed` | (sin cambio) |
| `state.selected` | `aria-checked:bg-brand aria-checked:text-white` | (sin cambio: el rojo con texto blanco funciona en ambos modos) |

### 5.3. Jerarquía de superficies en oscuro

No todos los fondos oscuros son iguales. Cada nivel sube un paso en la escala `neutral`:

```
neutral-950 #0A0A0A  ← fondo de pantalla
neutral-900 #171717  ← tarjetas, círculo decorativo
neutral-800 #262626  ← controles (grupo sanguíneo, Rh), borde de tarjeta
neutral-700 #404040  ← control pulsado
```

### 5.4. Por qué `dark:` explícito y no variables que cambian solas

Hay dos formas válidas de hacer el modo oscuro en este motor:

| Estrategia | Ejemplo | Ventaja | Inconveniente |
|---|---|---|---|
| **A. Clases `dark:` explícitas** (elegida) | `bg-white dark:bg-neutral-950` | Cada elemento dice en su plantilla cómo se ve en ambos modos. Es fácil de revisar y de documentar clase a clase. | Más clases por elemento. |
| B. Variables redefinidas bajo `.dark` | `:root{--surface:#fff} .dark{--surface:#0a0a0a}` + `bg-(--surface)` | Plantillas más cortas. El motor lo soporta: una variable declarada dos veces se resuelve por nodo. | La adaptación queda oculta en el CSS y cuesta más seguirla. |

Se elige **A** porque el objetivo del documento es que cada clase sea trazable. Si en el futuro se
añaden muchas pantallas, B es una migración directa: los roles de 5.2 pasan a ser variables.

---

## 6. Tipografía

### 6.1. Familia

| Aspecto | Valor |
|---|---|
| Familia observada | Geométrica sin serifa: `a` de dos pisos, `y` recta, `g` de un piso, puntos redondos. Coincide con **Poppins**. **[estimado]**: no se puede confirmar solo con la imagen. |
| Instalada en el proyecto | **No.** No hay archivos de fuente ni `expo-font` / `@ng-native/expo` en `package.json`. Hoy se usa la fuente del sistema (San Francisco / Roboto). |
| Alternativa sin instalar nada | La fuente del sistema. Funciona bien, aunque es menos redonda que la referencia. |
| Licencia | Poppins es SIL Open Font License (Google Fonts). Se puede incluir en la app. |

### 6.2. Escala tipográfica

Tamaños en pt **[estimado]** a partir de la escala de 2.1.

| Elemento | Pantalla | Tamaño medido | Clases | Resultado |
|---|---|---|---|---|
| Título de pantalla ("Please pick your blood type", "Blood bank stock near you!") | P2, P3 | ≈ 30 pt, interlineado ≈ 50 pt | `text-3xl leading-12 font-light text-center` | 30/48 pt, peso 300, centrado |
| Título de barra ("Dashboard") | P3 | ≈ 20 pt | `text-xl font-normal` | 20/28 pt, peso 400 |
| Letra de grupo (A, B, O, AB) | P2 | ≈ 24 pt | `text-2xl font-normal` | 24/32 pt |
| Botón principal ("Sign in", "Finish") | P1, P2 | ≈ 18 pt | `text-lg font-semibold` | 18/28 pt, peso 600 |
| Botón secundario ("Create Account") | P1 | ≈ 18 pt | `text-lg font-medium` | 18/28 pt, peso 500 |
| Enlace ("Don't know…", "Can I give blood?") | P2, P3 | ≈ 16 pt | `text-base font-normal` | 16/24 pt |
| Enlace inferior ("Learn more", "Skip now") | P1 | ≈ 16 pt | `text-base font-normal` | 16/24 pt |
| Etiqueta de tarjeta ("Donate Now") | P3 | ≈ 16 pt | `text-base font-normal` | 16/24 pt |
| Texto del checkbox | P2 | ≈ 14 pt, interlineado ≈ 21 pt | `text-sm leading-5` | 14/20 pt |
| Insignia de gota (A+, AB−) | P3 | ≈ 10 pt | `text-[10px] font-medium` | 10 pt, peso 500 |

**Altura de línea:** cada `text-*` de Tailwind v4 trae su propio `line-height` como ratio sin
unidad (por ejemplo, `text-base` = 16 px y 1,5). Angular Native lo resuelve contra el tamaño final
del texto, igual que un navegador. `leading-12` (48 px) sustituye al 36 px que trae `text-3xl`,
porque los títulos de la referencia tienen mucho aire entre líneas.

**Espaciado entre letras:** normal (`tracking-normal`, el valor por defecto; no hace falta clase).
**Transformación:** ninguna; los textos van en mayúsculas y minúsculas normales.
**Alineación:** los títulos y enlaces centrales van centrados (`text-center`); el texto del checkbox
y los enlaces de P1 van a la izquierda (valor por defecto).

### 6.3. Por qué `text-[10px]` es un valor arbitrario

La escala de Tailwind empieza en `text-xs` (12 px). Las insignias de las gotas miden ≈ 10 pt y a
12 pt "AB+" no cabe en un círculo de 28 pt. Es la única excepción tipográfica.

### 6.4. Cómo cargar Poppins [propuesto]

No está instalado. Pasos según la guía de [fuentes de Angular Native](https://ng-native.com/packages/expo/fonts):

```sh
npx expo install expo-font
npm install @ng-native/expo
```

Copiar los TTF de Google Fonts a `src/assets/fonts/` y declararlos en `src/styles.css` (las rutas
`url()` son relativas a ese archivo):

```css
@font-face { font-family: Poppins; src: url('./assets/fonts/Poppins-Light.ttf');    font-weight: 300; }
@font-face { font-family: Poppins; src: url('./assets/fonts/Poppins-Regular.ttf');  font-weight: 400; }
@font-face { font-family: Poppins; src: url('./assets/fonts/Poppins-Medium.ttf');   font-weight: 500; }
@font-face { font-family: Poppins; src: url('./assets/fonts/Poppins-SemiBold.ttf'); font-weight: 600; }
```

Registrar las fuentes antes de montar, en `src/main.ts`:

```ts
import { loadFonts } from '@ng-native/expo/fonts';
import tailwind from '../.angular-native/app.tailwind.js';

await loadFonts(tailwind); // o sin await: el texto se recoloca cuando llega la fuente
```

**Advertencia:** en nativo, `font-family` solo admite **un** nombre, sin lista de respaldo. Si se
pone `--font-sans: Poppins` sin haber registrado la fuente, el texto cae en silencio a la fuente del
sistema. Por eso el bloque `--font-sans` de la sección 9 va acompañado de este paso.

Hay otro detalle: Tailwind aplica `font-sans` mediante preflight, y este proyecto no lo importa (a
propósito). Para que Poppins sea la fuente por defecto hay que poner `font-sans` en la raíz:
`app.ts` → `host: { '[class]': 'platformClass + " font-sans"' }`. La familia se hereda a todos los
`<text>`.

---

## 7. Espaciados y dimensiones

Todas las medidas son **[estimado]** (escala de 2.1) y se ajustan a la escala de 4 pt de Tailwind
(`--spacing: 0.25rem` = 4 px = 4 pt en nativo).

### 7.1. Medidas comunes

| Medida | Imagen (≈ pt) | Clase | Valor de la clase |
|---|---|---|---|
| Margen lateral de pantalla | 22 | `px-6` | 24 pt |
| Ancho de botón de ancho completo | 328 | `w-full` (dentro de `px-6`) | 375 − 48 = 327 pt |
| Alto de botón principal | 59–60 | `h-15` | 60 pt |
| Separación entre botones (P1) | 21 | `gap-5` | 20 pt |
| Alto de la barra superior (P3) | ≈ 56 | `h-14` | 56 pt |
| Zona táctil de icono | — | `size-11` | 44 pt (mínimo de Apple HIG) |
| Ancho máximo del contenido | — | `max-w-sm` (P1) / `max-w-md` (P2, P3) | 384 / 448 pt |

### 7.2. Pantalla 1

| Medida | ≈ pt | Clase |
|---|---|---|
| Gota del logotipo | 59 × 93 | `[size]="96"` |
| Radio del círculo decorativo | ≈ 170 | `size-88` (352 pt, radio 176) |
| Posición del círculo | centro en la esquina | `-left-44 -top-44` (−176 pt) |
| De los botones a los enlaces | 55 | `mt-14` (56) |
| Enlaces → borde inferior | 31 | `min-pb-safe-8` (32 pt o la zona segura, el mayor) |
| Flecha "Skip now" | 32 × 14 | `[size]="28"` |
| Texto ↔ flecha | 12 | `gap-3` |

### 7.3. Pantalla 2

| Medida | ≈ pt | Clase |
|---|---|---|
| Borde superior → gota | 59 | `min-pt-safe-12` |
| Gota → título | 31 | `mt-8` |
| Título → enlace | 20 | `mt-5` |
| Enlace → botones | 20 | `mt-5` |
| Botón de grupo | 153 × 75 | `flex-1 h-19` (76) |
| Separación entre botones de grupo | 20–21 | `gap-5` |
| Botones de grupo → Rh | 27 | `mt-8` |
| Botón Rh (+/−) | 50 × 50 | `size-12` (48) |
| Separación + ↔ − | 63 | `gap-16` (64) |
| Casilla | 16–17 | `size-4.5` (18) |
| Casilla ↔ texto | 10 | `gap-3` (12) |
| Texto del checkbox → Finish | 30 | `mt-8` |
| Finish → borde inferior | 30 | `min-pb-safe-8` |

### 7.4. Pantalla 3

| Medida | ≈ pt | Clase |
|---|---|---|
| Barra superior: padding lateral | 21 hasta el icono | `px-3` + `size-11` (12 + 10 = 22) |
| Iconos de la barra | 22 | `[size]="24"` |
| Barra → título | 27 | `mt-6` |
| Título → gotas | 41 | `mt-10` |
| Gota con insignia | 39 × 63 | `h-16 w-12` (48 × 64) |
| Insignia | 28 | `size-7` |
| Paso vertical entre filas de gotas | 105 | `h-16` + `gap-y-10` (64 + 40 = 104) |
| Gotas → tarjetas | 54 | `mt-12` |
| Tarjeta | 153 × 160 | `flex-1 h-40` (160) |
| Separación entre tarjetas | 22 | `gap-5` |
| Icono de tarjeta | 44 × 63 | `[size]="56"` |
| Icono → etiqueta | 22 | `gap-4` (más el interlineado) |
| Paso entre enlaces inferiores | 44 | `gap-5` + 24 de línea |

### 7.5. Valores arbitrarios y escalones no habituales

| Clase | Por qué |
|---|---|
| `text-[10px]` | Ver 6.3. Único valor arbitrario. |
| `h-15`, `h-19`, `size-4.5`, `size-88` | **No son arbitrarios.** En Tailwind v4 cualquier múltiplo de `--spacing` genera la utilidad, así que `h-15` = 60 pt sin corchetes. Se eligieron porque coinciden con la medida y evitan `h-[60px]`. |

---

## 8. Bordes, radios y sombras

| Elemento | Imagen (≈) | Clase | Valor (Tailwind v4) |
|---|---|---|---|
| Botones de ancho completo (P1, P2) | 6–7 pt | `rounded-lg` | 8 pt |
| Botones de grupo y Rh (P2) | 4–5 pt | `rounded-md` | 6 pt |
| Casilla | ≈ 3 pt | `rounded-sm` | 4 pt |
| Tarjetas (P3) | ≈ 9–12 pt | `rounded-xl` | 12 pt |
| Círculos decorativos, insignias, botones de icono | círculo | `rounded-full` | — |
| Borde "Create Account" | ≈ 2 pt blanco | `border-2 border-white` | 2 pt |
| Borde de la casilla | ≈ 2 pt | `border-2` | 2 pt |
| Anillo de la insignia | ≈ 1 pt rojo | `border border-brand` | 1 pt |
| Borde de tarjeta en oscuro | — | `dark:border-hairline` | 1 píxel físico (≈ 0,33 pt en 3x) |
| Sombra de tarjeta | Muy difusa, ≈ 5 % de opacidad, tinte azulado | `shadow-lg shadow-slate-900/5` | `0 10px 15px -3px` + `0 4px 6px -4px` con color slate-900 al 5 % |

**Por qué `shadow-slate-900/5`:** el halo junto a la tarjeta mide `#F4F6FA`, que es azulado. Una
sombra negra quedaría gris sucia. `slate` es la escala neutra con tinte azul de Tailwind y el 5 %
reproduce su suavidad.

**Por qué no hay sombra en oscuro:** una sombra oscura sobre un fondo casi negro no se ve. La
separación la dan el cambio de superficie (`neutral-950` → `neutral-900`) y un borde de un píxel.

---

## 9. Configuración global de Tailwind CSS

### 9.1. Versión y compatibilidad

| Paquete | Versión instalada (verificada con `npm ls`) |
|---|---|
| `tailwindcss` | 4.3.3 |
| `@tailwindcss/cli` | 4.3.3 |
| `@ng-native/tailwind` | 0.16.0 |

Es Tailwind **v4**: la configuración es CSS-first (`@theme`, `@custom-variant`). **No** debe
añadirse `tailwind.config.js`, `@tailwind base` ni ninguna otra sintaxis de v3.

### 9.2. Archivos que intervienen (verificados)

| Archivo | Función |
|---|---|
| `src/styles.css` | Entrada de Tailwind. Importa `theme.css`, `utilities.css` y el preset `native.css`, y excluye `docs/` del escaneo (ver abajo). Aquí se añadirían los tokens. |
| `metro.config.js` | `withTailwind(..., { input: './src/styles.css' })` ejecuta el CLI de Tailwind y vigila cambios en desarrollo. |
| `.angular-native/app.tailwind.js` | Hoja generada (no se edita a mano). La compila el CLI y la aplana el compilador nativo. |
| `src/app/app.config.ts` | `globalStyles: tailwind`: pasa la hoja a `mount()`. |
| `src/main.ts` | `conditions: currentConditions()` (sin esto, los `@media` y `md:` nunca se cumplen) y `watchConditions(app.engine)` (mantiene la clase `dark` en la raíz). |
| `src/app/app.ts` | Añade `platform-ios` / `platform-android` a la raíz (variantes `ios:` / `android:`). |

**Por qué `@source not '../docs'` (único cambio aplicado):** Tailwind v4 escanea todo el
repositorio buscando nombres de clase, Markdown incluido. Al crear este documento, la hoja de la
app pasó de 58 a 710 líneas y aparecieron avisos por palabras como "grid" o "visible", que en este
texto son prosa. Excluir `docs/` devolvió la hoja a 58 líneas, sin avisos (verificado).

**Por qué `theme.css` + `utilities.css` y no `@import "tailwindcss"`:** la entrada completa trae
preflight, un reset de navegador que no significa nada en un teléfono. Es la configuración
correcta para Angular Native y **no debe cambiarse**.

### 9.3. Qué aporta el preset `@ng-native/tailwind/native.css` (verificado en `node_modules`)

| Variante | Significado en nativo |
|---|---|
| `dark:` | `&:where(.dark, .dark *)`: sigue a una **clase** `dark` en la raíz, que el sistema mantiene sincronizada. **Ya existe.** No hay que añadir `@custom-variant dark`. |
| `hover:` | **Estado pulsado** (`:active`) o hover real con trackpad de iPad (`data-hover`). `:hover` no existe en nativo. |
| `focus-visible:` / `focus:` | Foco (teclado, mando, tecnologías de asistencia) o `data-focus`. |
| `disabled:` | `[data-disabled]` que publican los controles con `[disabled]`. |
| `ios:`, `android:`, `native:` | Según la clase de plataforma de la raíz. |
| `aria-checked:`, `aria-selected:`… | Atributos aria del nodo; ver sección 20. |
| Utilidades | `pt-safe`, `min-pb-safe-*`, `mt-safe`… (zona segura) y `border-hairline`, `h-hairline`… (línea de 1 píxel físico). |

### 9.4. Bloque de tokens propuesto para `src/styles.css`

```css
@import 'tailwindcss/theme.css';
@import 'tailwindcss/utilities.css';
@import '@ng-native/tailwind/native.css';

/* Documentation prose would otherwise be scanned for class names. */
@source not '../docs';

/*
 * Tokens de Blood App. Solo lo que la paleta de Tailwind no tiene:
 * los grises se usan directamente de la escala neutral.
 */
@theme {
  /* Marca. #d70032 medido en la referencia; el resto, propuestos. */
  --color-brand: #d70032;
  --color-brand-pressed: #b0002a;
  --color-brand-deep: #8e0022;
  --color-brand-light: #ff5c7a;

  /* Controles y texto secundario, medidos en la referencia. */
  --color-control: #f2f2f2;
  --color-ink-muted: #484848;

  /* Solo después de registrar Poppins (sección 6.4): en nativo no hay fuente de respaldo. */
  --font-sans: Poppins;
}
```

**Por qué `@theme` y no `:root`:** `@theme` le dice a Tailwind que genere utilidades (`bg-brand`,
`text-brand`, `ring-brand`…). Una variable en `:root` no generaría ninguna. El compilador de Angular
Native sustituye estos valores en tiempo de compilación, así que no tienen coste en ejecución.

### 9.5. Relación entre los estilos globales y los componentes

- Las utilidades de Tailwind viven en la hoja **global**: cualquier `class="..."` de cualquier
  componente se resuelve contra ella.
- Los `styles` propios de un componente son CSS real con encapsulación emulada. Se reservan para lo
  que no es una utilidad, como `:host { flex: 1 }`.
- Todo componente de pantalla debe declarar `host: { class: 'flex-1' }` (o `style: 'flex: 1'`): el
  host es un elemento flex propio y, sin `flex: 1`, un `scroll-view` dentro mide 0 de alto.

---

## 10. Pantalla 1: bienvenida y autenticación

### 10.1. Distribución y jerarquía

```
┌──────────────────────────────┐  ← bg-brand, overflow-hidden
│◜‾‾‾◝ (círculo bg-white/15)    │
│                              │
│            💧 logo           │  ← flex-1, centrado vertical y horizontal
│                              │
│ ┌──────────────────────────┐ │
│ │         Sign in          │ │  ← bg-white, text-brand, h-15
│ └──────────────────────────┘ │      gap-5
│ ┌──────────────────────────┐ │
│ │      Create Account      │ │  ← border-2 border-white, text-white
│ └──────────────────────────┘ │      mt-14
│ Learn more        Skip now ⟶ │  ← flex-row justify-between
└──────────────────────────────┘  ← min-pb-safe-8
```

Jerarquía: 1) logotipo (identidad), 2) **Sign in**, la acción de mayor contraste (blanco sobre rojo),
3) Create Account (contorno: misma forma, menos peso), 4) enlaces de texto.

### 10.2. Elementos

#### 10.2.1. Contenedor de pantalla — `WelcomeScreen` (raíz)

```html
<view class="flex-1 overflow-hidden bg-brand px-6 pt-safe min-pb-safe-8 dark:bg-brand-deep">
```

| Clase | Propiedad | Valor | Por qué |
|---|---|---|---|
| `flex-1` | `flex: 1` | Ocupa todo el alto | La pantalla llena el espacio del stack. |
| `overflow-hidden` | `overflow: hidden` | Recorta hijos | Recorta el círculo decorativo, que se sale por arriba a la izquierda. |
| `bg-brand` | `background-color` | `#D70032` | Fondo de marca [medido]. |
| `px-6` | `padding-left/right` | 24 pt | Margen lateral [estimado 22 pt]. |
| `pt-safe` | `padding-top` | Inset superior | Evita la isla dinámica o el notch. |
| `min-pb-safe-8` | `padding-bottom` | máx(inset inferior, 32 pt) | 32 pt en teléfonos sin indicador de inicio; la zona segura donde la hay. |
| `dark:bg-brand-deep` | `background-color` en oscuro | `#8E0022` | Reduce el deslumbramiento (4.4). |

**Responsive:** `w-full max-w-sm self-center` en los hijos evita que los botones se estiren en iPad.
**Resultado:** pantalla roja a sangre de borde a borde, con el contenido respetando las zonas seguras.

#### 10.2.2. Círculo decorativo superior

```html
<view aria-hidden="true" class="absolute -left-44 -top-44 size-88 rounded-full bg-white/15 dark:bg-white/10"></view>
```

| Clase | Propiedad | Valor | Por qué |
|---|---|---|---|
| `absolute` | `position: absolute` | Fuera del flujo | No empuja al resto del contenido. |
| `-left-44` | `left` | −176 pt | Centra el círculo en la esquina izquierda. |
| `-top-44` | `top` | −176 pt | Centra el círculo en la esquina superior. |
| `size-88` | `width` y `height` | 352 pt | Radio de 176 pt [estimado ≈ 170]. |
| `rounded-full` | `border-radius` | 9999 | Lo convierte en círculo. |
| `bg-white/15` | `background-color` | blanco al 15 % | Sobre `#D70032` da `#DE2652` [medido]. Con transparencia en lugar de un HEX fijo, sigue funcionando sobre `brand-deep`. |
| `dark:bg-white/10` | `background-color` en oscuro | blanco al 10 % | Sobre un rojo más oscuro el 15 % destaca demasiado; el 10 % mantiene la sutileza. |

`aria-hidden="true"` saca la decoración del árbol de accesibilidad. Va **primero** en la plantilla
para quedar detrás del resto.

#### 10.2.3. Logotipo (gota)

```html
<view class="flex-1 items-center justify-center">
  <ng-icon [svg]="logoDrop" [size]="96" class="text-white" accessibilityLabel="Blood App" />
</view>
```

| Clase | Propiedad | Por qué |
|---|---|---|
| `flex-1` | `flex: 1` | Ocupa el espacio libre sobre los botones, de modo que el logotipo queda centrado en esa zona. |
| `items-center` | `align-items: center` | Centrado horizontal. |
| `justify-center` | `justify-content: center` | Centrado vertical. |
| `text-white` (en `ng-icon`) | `color` → `currentColor` del SVG | Gota blanca. El auricular es un hueco recortado (`fill-rule="evenodd"`), así que muestra el fondo rojo, como en la referencia. |

Modo oscuro: sin cambio (blanco sobre `brand-deep`).

#### 10.2.4. Grupo de acciones

```html
<view class="w-full max-w-sm gap-5 self-center">
```

| Clase | Propiedad | Valor | Por qué |
|---|---|---|---|
| `w-full` | `width` | 100 % | Ancho completo en el teléfono. |
| `max-w-sm` | `max-width` | 384 pt | En iPad no se estira a 700 pt o más. |
| `gap-5` | `gap` | 20 pt | Separación entre Sign in y Create Account [≈ 21]. |
| `self-center` | `align-self: center` | — | Centrado cuando se aplica `max-w-sm`. |

#### 10.2.5. Botón "Sign in" (primario sobre marca)

```html
<pressable accessibilityRole="button" (press)="signIn()"
  class="h-15 items-center justify-center rounded-lg bg-white transition-colors
         hover:bg-neutral-100
         focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand
         dark:hover:bg-neutral-200 dark:focus-visible:ring-offset-brand-deep">
  <text class="text-lg font-semibold text-brand dark:text-brand-deep">Sign in</text>
</pressable>
```

| Clase | Elemento | Propiedad | Valor | Por qué |
|---|---|---|---|---|
| `h-15` | pressable | `height` | 60 pt | Alto medido ≈ 60. |
| `items-center` | pressable | `align-items` | center | Centra el texto horizontalmente. |
| `justify-center` | pressable | `justify-content` | center | Centra el texto verticalmente. |
| `rounded-lg` | pressable | `border-radius` | 8 pt | Esquinas suaves [≈ 6–7]. |
| `bg-white` | pressable | `background-color` | `#FFFFFF` | Máximo contraste sobre el rojo: es la acción principal. |
| `transition-colors` | pressable | `transition-property` (colores) | 150 ms | Suaviza el cambio a pulsado. |
| `hover:bg-neutral-100` | pressable | `background-color` al pulsar | `#F5F5F5` | Respuesta táctil. En nativo `hover:` = pulsado. |
| `focus-visible:ring-2` | pressable | anillo (`box-shadow`) | 2 pt | Indicador de foco con teclado o switch control. |
| `focus-visible:ring-white` | pressable | color del anillo | blanco | Visible sobre el rojo. |
| `focus-visible:ring-offset-2` | pressable | separación del anillo | 2 pt | Separa el anillo del botón blanco. |
| `focus-visible:ring-offset-brand` | pressable | color de la separación | `#D70032` | La separación se funde con el fondo. |
| `dark:hover:bg-neutral-200` | pressable | pulsado en oscuro | `#E5E5E5` | Sobre `brand-deep` hace falta un paso más para notar la pulsación. |
| `dark:focus-visible:ring-offset-brand-deep` | pressable | separación en oscuro | `#8E0022` | La separación sigue al fondo oscuro. |
| `text-lg` | text | `font-size` / `line-height` | 18 / 28 pt | Medido ≈ 18. |
| `font-semibold` | text | `font-weight` | 600 | Peso de la referencia. |
| `text-brand` | text | `color` | `#D70032` | Texto rojo sobre blanco: 5,34:1 (AA). |
| `dark:text-brand-deep` | text | `color` en oscuro | `#8E0022` | Coincide con el fondo oscuro de la pantalla: 9,66:1. |

**Resultado:** botón blanco de ancho completo y 60 pt de alto, con texto rojo en semibold; se
oscurece ligeramente al pulsarlo.

#### 10.2.6. Botón "Create Account" (secundario con contorno)

```html
<pressable accessibilityRole="button" (press)="createAccount()"
  class="h-15 items-center justify-center rounded-lg border-2 border-white transition-colors
         hover:bg-white/10
         focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand">
  <text class="text-lg font-medium text-white">Create Account</text>
</pressable>
```

| Clase | Elemento | Propiedad | Valor | Por qué |
|---|---|---|---|---|
| `h-15` | pressable | `height` | 60 pt | Mismo alto que el primario. |
| `items-center`, `justify-center` | pressable | alineación | — | Texto centrado. |
| `rounded-lg` | pressable | `border-radius` | 8 pt | Misma forma que el primario. |
| `border-2` | pressable | `border-width` | 2 pt | Contorno [medido ≈ 2]. |
| `border-white` | pressable | `border-color` | blanco | Contorno blanco sobre el rojo. |
| `transition-colors` | pressable | transición | 150 ms | Suaviza la pulsación. |
| `hover:bg-white/10` | pressable | fondo al pulsar | blanco 10 % | Un velo translúcido funciona igual sobre `brand` y `brand-deep`, así que no necesita `dark:`. |
| `focus-visible:*` | pressable | anillo de foco | — | Igual que en Sign in. |
| `text-lg` | text | tamaño | 18 pt | Igual que Sign in. |
| `font-medium` | text | peso | 500 | Algo más ligero que el primario [estimado]. |
| `text-white` | text | color | blanco | 5,34:1 sobre `brand` y 9,66:1 sobre `brand-deep`. |

#### 10.2.7. Enlaces inferiores y flecha

```html
<view class="mt-14 w-full max-w-sm flex-row items-center justify-between self-center">
  <text pressable accessibilityRole="link" class="text-base text-white hover:opacity-70" (press)="learnMore()">
    Learn more
  </text>
  <pressable accessibilityRole="link" accessibilityLabel="Skip now"
    class="flex-row items-center gap-3 hover:opacity-70" (press)="skip()">
    <text class="text-base text-white">Skip now</text>
    <ng-icon name="lucideMoveRight" [size]="28" class="text-white" />
  </pressable>
</view>
```

| Clase | Elemento | Propiedad | Por qué |
|---|---|---|---|
| `mt-14` | fila | `margin-top` 56 pt | Separación medida ≈ 55 pt desde Create Account. |
| `w-full`, `max-w-sm`, `self-center` | fila | ancho | Se alinea con los botones de encima. |
| `flex-row` | fila | `flex-direction: row` | Enlaces en la misma línea. |
| `items-center` | fila | `align-items` | Alinea el texto con la flecha. |
| `justify-between` | fila | `justify-content` | Un enlace a cada extremo. |
| `text-base` | textos | 16/24 pt | Tamaño medido. |
| `text-white` | textos y flecha | `color` | Blanco sobre rojo. |
| `hover:opacity-70` | enlaces | `opacity` al pulsar | Respuesta táctil que no depende del modo (no necesita `dark:`). |
| `flex-row items-center gap-3` | "Skip now" | fila, centrado y 12 pt | Texto y flecha juntos. |

La flecha es `lucideMoveRight`: flecha larga y fina, igual que la referencia. Es decorativa (el
pressable ya tiene etiqueta).

### 10.3. Contraste en P1

| Par | Light | Dark |
|---|---|---|
| Texto blanco / fondo | 5,34:1 sobre `#D70032` ✅ AA | 9,66:1 sobre `#8E0022` ✅ AAA |
| Texto rojo / botón blanco | 5,34:1 ✅ | `brand-deep` sobre blanco: 9,66:1 ✅ |
| Blanco / círculo decorativo | 4,66:1 (si un texto lo cruzara) ✅ | — |

---

## 11. Pantalla 2: selección del tipo de sangre

### 11.1. Distribución

```
┌──────────────────────────────┐  bg-white / dark:bg-neutral-950
│              💧               │  min-pt-safe-12
│      Please pick your        │  mt-8 · text-3xl leading-12 font-light
│         blood type           │
│ Don't know about your blood… │  mt-5 · text-brand
│ ┌────────────┐ ┌────────────┐│  mt-5 · fila gap-5
│ │     A      │ │  ■ B ✓     ││  ← seleccionado: bg-brand text-white
│ └────────────┘ └────────────┘│  gap-5
│ ┌────────────┐ ┌────────────┐│
│ │     O      │ │     AB     ││  bg-control text-ink-muted
│ └────────────┘ └────────────┘│
│        [ + ]      [ − ]      │  mt-8 · gap-16
│                              │  (espacio flexible: mt-auto)
│ ☑ I want to receive notif…   │  checkbox
│ ┌──────────────────────────┐ │
│ │          Finish          │ │  mt-8 · bg-brand
│ └──────────────────────────┘ │  min-pb-safe-8
└──────────────────────────────┘
```

### 11.2. Elementos

#### 11.2.1. Contenedor y desplazamiento

```html
<scroll-view class="flex-1 bg-white dark:bg-neutral-950"
             contentContainerClass="grow px-6 min-pt-safe-12 min-pb-safe-8">
  <view class="w-full max-w-md grow self-center"> … </view>
</scroll-view>
```

| Clase | Elemento | Propiedad | Por qué |
|---|---|---|---|
| `flex-1` | scroll-view | `flex: 1` | Ocupa la pantalla. |
| `bg-white` | scroll-view | fondo | Fondo blanco [medido]. |
| `dark:bg-neutral-950` | scroll-view | fondo en oscuro | Base de la jerarquía de superficies (5.3). |
| `grow` | contenedor de contenido | `flex-grow: 1` | El contenido llena al menos la pantalla, así que `mt-auto` puede empujar el checkbox y Finish hacia abajo. En pantallas pequeñas, todo se desplaza. |
| `px-6` | contenedor | 24 pt | Margen lateral. |
| `min-pt-safe-12` | contenedor | máx(inset superior, 48 pt) | La referencia no tiene barra de estado: 48 pt donde no hay notch y la zona segura donde sí. |
| `min-pb-safe-8` | contenedor | máx(inset inferior, 32 pt) | Espacio bajo Finish. |
| `w-full max-w-md self-center` | columna | 100 % hasta 448 pt, centrada | Legible en iPad. |
| `grow` | columna | `flex-grow: 1` | Transmite el alto al hijo, para que funcione `mt-auto`. |

Se usa `<scroll-view>` y no `<view>` porque en un iPhone SE (667 pt de alto) el contenido no cabe.
`contentContainerClass` es la forma de aplicar clases al contenedor interno.

#### 11.2.2. Icono de gota

```html
<ng-icon [svg]="logoDrop" [size]="96" class="self-center text-brand" aria-hidden="true" />
```

| Clase | Propiedad | Por qué |
|---|---|---|
| `self-center` | `align-self: center` | Centrado horizontal. |
| `text-brand` | `color` → relleno `currentColor` | Gota roja; el auricular recortado deja ver el blanco. Es el mismo SVG que en P1. |

En oscuro se mantiene `text-brand`: como gráfico necesita 3:1 y tiene 3,71:1 sobre `neutral-950`.
Así se conserva el rojo de marca exacto en el logotipo.

#### 11.2.3. Título

```html
<text accessibilityRole="header"
  class="mt-8 text-center text-3xl leading-12 font-light text-black dark:text-neutral-50 md:text-4xl md:leading-14">
  Please pick your blood type
</text>
```

| Clase | Propiedad | Valor | Por qué |
|---|---|---|---|
| `mt-8` | `margin-top` | 32 pt | Gota → título [≈ 31]. |
| `text-center` | `text-align` | center | Composición centrada. |
| `text-3xl` | `font-size` | 30 pt | Tamaño medido. |
| `leading-12` | `line-height` | 48 pt | Interlineado amplio [≈ 50]. |
| `font-light` | `font-weight` | 300 | Trazo fino de la referencia. |
| `text-black` | `color` | `#000000` | 21:1. |
| `dark:text-neutral-50` | `color` en oscuro | `#FAFAFA` | 18,97:1 sobre `neutral-950`. Se evita el blanco puro para no deslumbrar. |
| `md:text-4xl` | `font-size` ≥ 768 pt | 36 pt | Algo mayor en iPad. |
| `md:leading-14` | `line-height` ≥ 768 pt | 56 pt | Mantiene la proporción. |

`accessibilityRole="header"` permite a VoiceOver/TalkBack saltar entre encabezados.

#### 11.2.4. Enlace "Don't know about your blood type?"

```html
<text pressable accessibilityRole="link" (press)="openHelp()"
  class="mt-5 text-center text-base text-brand hover:opacity-70 dark:text-brand-light">
  Don't know about your blood type?
</text>
```

| Clase | Propiedad | Valor | Por qué |
|---|---|---|---|
| `mt-5` | `margin-top` | 20 pt | Medido ≈ 20. |
| `text-center` | `text-align` | center | — |
| `text-base` | tamaño | 16/24 pt | — |
| `text-brand` | `color` | `#D70032` | 5,34:1 sobre blanco ✅. |
| `hover:opacity-70` | `opacity` al pulsar | 0,7 | Respuesta táctil válida en ambos modos. |
| `dark:text-brand-light` | `color` en oscuro | `#FF5C7A` | `brand` daría 3,71:1 ❌; `brand-light` da 6,66:1 ✅. |

#### 11.2.5. Botones de grupo sanguíneo (A, B, O, AB)

Funcionan como un grupo de **opción única**, así que son radios (`accessibilityRole="radio"`)
dentro de un `radiogroup`.

```html
<view class="mt-5 gap-5" accessibilityRole="radiogroup" accessibilityLabel="Blood group">
  @for (row of groupRows; track $index) {
    <view class="flex-row gap-5">
      @for (group of row; track group) {
        <pressable accessibilityRole="radio" [aria-checked]="group === selectedGroup()"
          (press)="selectedGroup.set(group)"
          class="relative h-19 flex-1 items-center justify-center rounded-md bg-control text-ink-muted transition-colors
                 hover:bg-neutral-200
                 aria-checked:bg-brand aria-checked:text-white aria-checked:hover:bg-brand-pressed
                 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
                 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700
                 dark:focus-visible:ring-offset-neutral-950 md:h-24">
          <text class="text-2xl">{{ group }}</text>
          @if (group === selectedGroup()) {
            <ng-icon name="lucideCheck" [size]="16" [strokeWidth]="3" class="absolute right-2 top-2" />
          }
        </pressable>
      }
    </view>
  }
</view>
```

**Contenedores:**

| Clase | Elemento | Por qué |
|---|---|---|
| `mt-5` | grupo | 20 pt bajo el enlace. |
| `gap-5` | grupo | 20 pt entre filas. |
| `flex-row gap-5` | fila | Dos botones por fila con 20 pt entre ellos. |

**Estado no seleccionado** (A, O, AB en la referencia):

| Clase | Propiedad | Light | Dark | Por qué |
|---|---|---|---|---|
| `relative` | `position` | — | — | Ancla la marca de verificación absoluta. |
| `h-19` | `height` | 76 pt | — | Medido ≈ 75. |
| `flex-1` | `flex` | ½ de la fila | — | Dos columnas iguales. |
| `items-center justify-center` | alineación | — | — | Letra centrada. |
| `rounded-md` | radio | 6 pt | — | Medido ≈ 4–5. |
| `bg-control` / `dark:bg-neutral-800` | fondo | `#F2F2F2` | `#262626` | Superficie de control. |
| `text-ink-muted` / `dark:text-neutral-300` | `color` (lo hereda el `<text>`) | `#484848` | `#D4D4D4` | 8,17:1 y 10,21:1. |
| `transition-colors` | transición | 150 ms | — | Cambio suave al seleccionar. |
| `hover:bg-neutral-200` / `dark:hover:bg-neutral-700` | fondo al pulsar | `#E5E5E5` | `#404040` | Respuesta táctil. |
| `focus-visible:ring-2 ring-brand ring-offset-2` | anillo de foco | rojo con separación blanca | — | Foco visible. |
| `dark:focus-visible:ring-offset-neutral-950` | separación en oscuro | — | `#0A0A0A` | Sin ella, la separación sería un aro blanco. |
| `md:h-24` | `height` en iPad | 96 pt | — | Proporción en pantallas anchas. |

**Estado seleccionado** (B en la referencia). Se activa con `[aria-checked]="true"`:

| Clase | Propiedad | Light | Dark | Por qué |
|---|---|---|---|---|
| `aria-checked:bg-brand` | fondo | `#D70032` | `#D70032` | Medido. Especificidad (0,2,0): gana a `dark:bg-neutral-800` (0,1,0), así que no hace falta `dark:aria-checked:`. |
| `aria-checked:text-white` | `color` | blanco | blanco | 5,34:1. Gana a `dark:text-neutral-300` por la misma razón. |
| `aria-checked:hover:bg-brand-pressed` | fondo al pulsar | `#B0002A` | `#B0002A` | **Necesaria:** sin ella, al pulsar un botón ya seleccionado en oscuro ganaría `dark:hover:bg-neutral-700` (misma especificidad, aparece después en la hoja) y el botón se volvería gris. Con (0,3,0) gana siempre. |
| marca `lucideCheck` | icono | blanco (heredado) | blanco | **Indicador que no depende del color** (WCAG 1.4.1). Es un añadido respecto a la referencia. |

**Texto de la letra:**

| Clase | Propiedad | Por qué |
|---|---|---|
| `text-2xl` | 24/32 pt | Medido ≈ 24. Sin clase de color: **hereda** el del pressable (Angular Native emula la herencia de `color`), así que basta un único cambio de estado en el padre. |

**Por qué `aria-checked` y no clases condicionales:** el mismo atributo que lee el lector de
pantalla ("seleccionado") es el que dibuja el estado. Así, lo que se ve y lo que se anuncia no
pueden desincronizarse. Verificado en ejecución: `accessibilityState` = `{ checked: true }`.

#### 11.2.6. Controles Rh (+ / −)

```html
<view class="mt-8 flex-row justify-center gap-16" accessibilityRole="radiogroup" accessibilityLabel="Rh factor">
  <pressable accessibilityRole="radio" accessibilityLabel="Positive" [aria-checked]="rh() === '+'" (press)="rh.set('+')"
    class="size-12 items-center justify-center rounded-md bg-control text-ink-muted transition-colors
           hover:bg-neutral-200 aria-checked:bg-brand aria-checked:text-white aria-checked:hover:bg-brand-pressed
           focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
           dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus-visible:ring-offset-neutral-950">
    <ng-icon name="lucidePlus" [size]="24" />
  </pressable>
  <!-- igual con lucideMinus, accessibilityLabel="Negative" y rh() === '-' -->
</view>
```

| Clase | Elemento | Propiedad | Por qué |
|---|---|---|---|
| `mt-8` | fila | 32 pt | Separación ≈ 27–30 pt bajo la cuadrícula. |
| `flex-row justify-center` | fila | fila centrada | Pareja centrada como en la referencia. |
| `gap-16` | fila | 64 pt | Separación medida ≈ 63. |
| `size-12` | botón | 48 × 48 pt | Medido ≈ 50. Supera el mínimo táctil de 44 pt. |
| resto | botón | — | **Las mismas clases de estado** que los botones de grupo (11.2.5): son el mismo componente con otro tamaño. |

El icono no tiene clase de color: `ng-icon` pinta `currentColor` con el color heredado del
pressable, así que se vuelve blanco al seleccionarse. Se usan iconos y no los caracteres "+" y
"−" porque un glifo de texto no queda centrado ópticamente.

#### 11.2.7. Checkbox de notificaciones

```html
<pressable accessibilityRole="checkbox" [aria-checked]="notify()" (press)="notify.set(!notify())"
  class="group mt-auto flex-row items-start gap-3 pt-8">
  <view class="mt-0.5 size-4.5 items-center justify-center rounded-sm border-2 border-neutral-400
               group-aria-checked:border-brand group-aria-checked:bg-brand dark:border-neutral-500">
    @if (notify()) {
      <ng-icon name="lucideCheck" [size]="12" [strokeWidth]="3" class="text-white" />
    }
  </view>
  <text class="flex-1 text-sm leading-5 text-black dark:text-neutral-200">
    I want to receive notification about blood donation campaigns
  </text>
</pressable>
```

| Clase | Elemento | Propiedad | Light | Dark | Por qué |
|---|---|---|---|---|---|
| `group` | pressable | marcador | — | — | Permite a la casilla reaccionar al `aria-checked` del padre. |
| `mt-auto` | pressable | `margin-top: auto` | — | — | Empuja checkbox y Finish al final cuando sobra espacio. |
| `flex-row` | pressable | fila | — | — | Casilla a la izquierda y texto a la derecha. |
| `items-start` | pressable | `align-items` | — | — | La casilla se alinea con la primera línea, no con el centro de dos. |
| `gap-3` | pressable | 12 pt | — | — | Medido ≈ 10. |
| `pt-8` | pressable | 32 pt | — | — | Espacio mínimo sobre el checkbox cuando no sobra altura. |
| `mt-0.5` | casilla | 2 pt | — | — | Centra ópticamente la casilla de 18 pt en la línea de 20 pt. |
| `size-4.5` | casilla | 18 × 18 pt | — | — | Medido ≈ 16–17. |
| `items-center justify-center` | casilla | centrado | — | — | Centra la marca. |
| `rounded-sm` | casilla | 4 pt | — | — | Esquinas suaves. |
| `border-2` | casilla | 2 pt | — | — | Contorno de la casilla vacía. |
| `border-neutral-400` / `dark:border-neutral-500` | casilla | `border-color` | `#A1A1A1` | `#737373` | La referencia solo muestra el estado marcado; el contorno sin marcar es una propuesta. |
| `group-aria-checked:border-brand` | casilla | borde marcado | `#D70032` | igual | Estado marcado. |
| `group-aria-checked:bg-brand` | casilla | fondo marcado | `#D70032` | igual | Relleno rojo [medido `#D7032F`]. |
| `text-white` | marca | color | blanco | blanco | La marca dibujada es el indicador no cromático. |
| `flex-1` | texto | `flex: 1` | — | — | Ocupa el resto y salta de línea. |
| `text-sm leading-5` | texto | 14/20 pt | — | — | Medido. |
| `text-black` / `dark:text-neutral-200` | texto | `color` | `#000` | `#E5E5E5` | Párrafo un paso por debajo del título en oscuro. |

Toda la fila es el área táctil (casilla + texto), no solo la casilla de 18 pt.

> **Alternativa nativa:** `<switch [(checked)]="notify">` es el control nativo de iOS/Android y
> funciona con Signal Forms sin adaptadores. La referencia dibuja una casilla, así que se documenta
> la casilla; el interruptor queda como opción si se prefiere el aspecto de la plataforma.

#### 11.2.8. Botón "Finish" (primario sobre blanco)

```html
<pressable accessibilityRole="button" [disabled]="!selectedGroup()" (press)="finish()"
  class="mt-8 h-15 items-center justify-center rounded-lg bg-brand transition-colors
         hover:bg-brand-pressed disabled:opacity-50
         focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950">
  <text class="text-lg font-semibold text-white">Finish</text>
</pressable>
```

| Clase | Propiedad | Valor | Por qué |
|---|---|---|---|
| `mt-8` | `margin-top` | 32 pt | Medido ≈ 30. |
| `h-15`, `items-center`, `justify-center`, `rounded-lg` | forma | 60 pt, radio 8 | Igual que en P1: un único botón primario en toda la app. |
| `bg-brand` | fondo | `#D70032` | Medido. |
| `transition-colors` | transición | 150 ms | — |
| `hover:bg-brand-pressed` | fondo al pulsar | `#B0002A` | Respuesta táctil. Igual en ambos modos. |
| `disabled:opacity-50` | `opacity` | 0,5 | Atenuado mientras no se ha elegido grupo [propuesto]. Coincide con `[data-disabled]`. |
| `focus-visible:ring-2 ring-brand ring-offset-2` | anillo | rojo con separación blanca | Foco. |
| `dark:focus-visible:ring-offset-neutral-950` | separación en oscuro | `#0A0A0A` | Sin aro blanco en oscuro. |
| `text-lg font-semibold text-white` | texto | 18 pt, 600, blanco | 5,34:1. |

Sin `dark:`: el rojo de marca con texto blanco es correcto sobre `neutral-950` (los botones rellenos
no necesitan el 4,5:1 de un texto suelto; su texto blanco sí lo cumple sobre el rojo).

---

## 12. Pantalla 3: dashboard

### 12.1. Distribución

```
┌──────────────────────────────┐ bg-white / dark:bg-neutral-950
│◜◝ ☰        Dashboard       🔍 │ barra h-14 · círculo bg-neutral-50
│                              │
│      Blood bank stock        │ mt-6 · text-3xl leading-12 font-light
│         near you!            │
│  💧A+   💧A−   💧B+   💧B−     │ mt-10 · flex-row flex-wrap · w-1/4
│  💧AB+  💧AB−  💧O+   💧O−     │ gap-y-10
│ ┌────────────┐ ┌────────────┐│ mt-12 · flex-row gap-5
│ │  [bolsa]   │ │ [megáfono] ││ h-40 rounded-xl shadow-lg
│ │ Donate Now │ │  Campaign  ││
│ └────────────┘ └────────────┘│
│                              │ (mt-auto)
│      Can I give blood?       │ gap-5 · text-brand
│   Share on social media!     │
└──────────────────────────────┘
```

### 12.2. Elementos

#### 12.2.1. Contenedor general y círculo decorativo

```html
<view class="flex-1 overflow-hidden bg-white dark:bg-neutral-950">
  <view aria-hidden="true" class="absolute -left-24 -top-24 size-48 rounded-full bg-neutral-50 dark:bg-neutral-900"></view>
  …
</view>
```

| Clase | Elemento | Propiedad | Light | Dark | Por qué |
|---|---|---|---|---|---|
| `flex-1` | raíz | `flex: 1` | — | — | Llena la pestaña. |
| `overflow-hidden` | raíz | recorte | — | — | Recorta el círculo. |
| `bg-white` / `dark:bg-neutral-950` | raíz | fondo | `#FFF` | `#0A0A0A` | Superficie de pantalla. |
| `absolute -left-24 -top-24` | círculo | posición | −96 pt | — | Centrado en la esquina. |
| `size-48` | círculo | 192 pt (radio 96) | — | — | Radio [estimado ≈ 85–95]. |
| `rounded-full` | círculo | círculo | — | — | — |
| `bg-neutral-50` / `dark:bg-neutral-900` | círculo | fondo | `#FAFAFA` | `#171717` | Medido `#F9F9F9`: un eco apenas visible del círculo de P1. |

#### 12.2.2. Barra superior: menú, título y búsqueda

```html
<view class="mt-safe h-14 flex-row items-center justify-between px-3">
  <pressable accessibilityRole="button" accessibilityLabel="Menu" (press)="openMenu()"
    class="size-11 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10">
    <ng-icon name="lucideMenu" [size]="24" class="text-black dark:text-neutral-50" />
  </pressable>
  <text accessibilityRole="header" class="text-xl text-black dark:text-neutral-50">Dashboard</text>
  <pressable accessibilityRole="button" accessibilityLabel="Search" (press)="openSearch()"
    class="size-11 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10">
    <ng-icon name="lucideSearch" [size]="24" class="text-black dark:text-neutral-50" />
  </pressable>
</view>
```

| Clase | Elemento | Propiedad | Light | Dark | Por qué |
|---|---|---|---|---|---|
| `mt-safe` | barra | `margin-top` = inset superior | — | — | Debajo de la barra de estado. |
| `h-14` | barra | 56 pt | — | — | Alto estándar de barra. |
| `flex-row items-center justify-between` | barra | fila | — | — | Icono, título e icono distribuidos. |
| `px-3` | barra | 12 pt | — | — | Con el botón de 44 pt, el glifo queda a ≈ 22 pt del borde, como en la referencia. |
| `size-11` | botón de icono | 44 × 44 pt | — | — | Tamaño táctil mínimo. |
| `items-center justify-center` | botón | centrado | — | — | — |
| `rounded-full` | botón | círculo | — | — | Forma del resaltado al pulsar. |
| `transition-colors` | botón | transición | — | — | — |
| `hover:bg-black/5` / `dark:hover:bg-white/10` | botón al pulsar | fondo | negro 5 % | blanco 10 % | Velo de pulsación adecuado a cada fondo. |
| `text-black` / `dark:text-neutral-50` | glifos | `color` | `#000` | `#FAFAFA` | Glifos negros de la referencia. |
| `text-xl` | título | 20/28 pt | — | — | Medido ≈ 20. |
| `text-black` / `dark:text-neutral-50` | título | `color` | — | — | — |

#### 12.2.3. Título principal

Mismas clases que el título de P2 (11.2.3), con `mt-6` (≈ 27 pt bajo la barra):

```html
<text accessibilityRole="header"
  class="mt-6 text-center text-3xl leading-12 font-light text-black dark:text-neutral-50 md:text-4xl md:leading-14">
  Blood bank stock near you!
</text>
```

#### 12.2.4. Cuadrícula de grupos sanguíneos

```html
<view class="mt-10 flex-row flex-wrap gap-y-10" accessibilityRole="list">
  @for (stock of stocks(); track stock.group) {
    <view class="w-1/4 items-center" accessible
          [accessibilityLabel]="stock.group + ', ' + stock.level + ' percent available'">
      <view class="relative h-16 w-12">
        <ng-icon [svg]="stockDrop(stock.level)" [size]="64" class="text-brand" />
        <view class="absolute -right-3 -top-1 size-7 items-center justify-center rounded-full
                     border border-brand bg-white dark:border-brand-light dark:bg-neutral-950">
          <text class="text-[10px] font-medium text-brand dark:text-brand-light">{{ stock.group }}</text>
        </view>
      </view>
    </view>
  }
</view>
```

**Por qué Flexbox y no Grid:** Grid **no existe en nativo**. Al compilar, `grid` y
`grid-cols-*` se descartan con un aviso (verificado):

```
[angular-native] .grid (Tailwind): dropped 'display': display: grid does not exist on native; only flex, block (read as flex), contents and none do
[angular-native] .grid-cols-2 (Tailwind): dropped 'grid-template-columns': 'grid-template-columns' has no React Native equivalent
```

`flex-row flex-wrap` con hijos de `w-1/4` reproduce una cuadrícula de 4 columnas y pasa a la
fila siguiente cada cuatro elementos.

| Clase | Elemento | Propiedad | Light | Dark | Por qué |
|---|---|---|---|---|---|
| `mt-10` | cuadrícula | 40 pt | — | — | Medido ≈ 41. |
| `flex-row` | cuadrícula | fila | — | — | Elementos en horizontal. |
| `flex-wrap` | cuadrícula | `flex-wrap: wrap` | — | — | Salto de fila cada 4. |
| `gap-y-10` | cuadrícula | `row-gap` 40 pt | — | — | Paso de fila de 104 pt (medido ≈ 105). |
| `w-1/4` | celda | 25 % | — | — | Cuatro columnas iguales. |
| `items-center` | celda | centrado | — | — | Gota centrada en su columna. |
| `relative h-16 w-12` | caja de gota | 48 × 64 pt | — | — | Medido ≈ 39 × 63; ancla la insignia. |
| `text-brand` | gota | `color` | `#D70032` | igual | Gráfico: 3,71:1 sobre `neutral-950` ≥ 3:1 ✅. Conserva la marca. |
| `absolute -right-3 -top-1` | insignia | posición | −12 / −4 pt | — | Asoma por la esquina superior derecha, como en la referencia. |
| `size-7` | insignia | 28 pt | — | — | Medido ≈ 28. |
| `items-center justify-center` | insignia | centrado | — | — | — |
| `rounded-full` | insignia | círculo | — | — | — |
| `border` | insignia | 1 pt | — | — | Anillo fino. |
| `border-brand` / `dark:border-brand-light` | insignia | `border-color` | `#D70032` | `#FF5C7A` | Anillo visible en ambos fondos. |
| `bg-white` / `dark:bg-neutral-950` | insignia | fondo | `#FFF` | `#0A0A0A` | Tapa el contorno de la gota bajo la insignia y se funde con el fondo. |
| `text-[10px]` | texto de insignia | 10 pt | — | — | Ver 6.3. |
| `font-medium` | texto de insignia | 500 | — | — | Legibilidad a 10 pt. |
| `text-brand` / `dark:text-brand-light` | texto de insignia | `color` | 5,34:1 | 6,66:1 | Un texto de 10 pt necesita 4,5:1. |

**Desviación respecto a la referencia:** en la imagen las gotas tienen un paso de ≈ 93 pt
(alineadas a los extremos); `w-1/4` da 82 pt. Se prefieren columnas iguales porque se adaptan a
cualquier ancho.

**Nivel de llenado:** la referencia muestra cada gota llena a distinta altura. Representa el nivel
de existencias y es lo único que distingue un grupo escaso. Se dibuja con un SVG generado (sección
23) y **se anuncia como texto** en `accessibilityLabel`, porque una altura de relleno no la percibe
un lector de pantalla.

#### 12.2.5. Tarjetas "Donate Now" y "Campaign"

```html
<view class="mt-12 flex-row gap-5">
  <pressable accessibilityRole="button" (press)="donate()"
    class="h-40 flex-1 items-center justify-center gap-4 rounded-xl bg-white shadow-lg shadow-slate-900/5 transition-colors
           hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-brand
           dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:bg-neutral-800 md:h-48">
    <ng-icon [svg]="bloodBagIcon" [size]="56" class="text-brand dark:text-brand-light" />
    <text class="text-base text-ink-muted dark:text-neutral-300">Donate Now</text>
  </pressable>
  <!-- "Campaign": mismas clases, con name="lucideMegaphone" -->
</view>
```

**Por qué Flexbox (`flex-row` + `flex-1`):** son dos tarjetas del mismo ancho en una sola fila;
`flex-1` reparte el espacio sobrante a partes iguales sin calcular porcentajes.

| Clase | Elemento | Propiedad | Light | Dark | Por qué |
|---|---|---|---|---|---|
| `mt-12` | fila | 48 pt | — | — | Medido ≈ 54 (las insignias añaden aire). |
| `flex-row gap-5` | fila | fila, 20 pt | — | — | Medido ≈ 22. |
| `h-40` | tarjeta | 160 pt | — | — | Medido ≈ 160. |
| `flex-1` | tarjeta | mitad de la fila | — | — | Dos tarjetas iguales. |
| `items-center justify-center` | tarjeta | centrado | — | — | Icono y etiqueta centrados. |
| `gap-4` | tarjeta | 16 pt | — | — | Icono → etiqueta. |
| `rounded-xl` | tarjeta | 12 pt | — | — | Radio de tarjeta. |
| `bg-white` / `dark:bg-neutral-900` | tarjeta | fondo | `#FFF` | `#171717` | Superficie elevada (un paso sobre el fondo en oscuro). |
| `shadow-lg` | tarjeta | `box-shadow` | sombra difusa | — | Profundidad suave. |
| `shadow-slate-900/5` | tarjeta | color de sombra | slate 5 % | — | Halo azulado medido `#F4F6FA`. |
| `dark:shadow-none` | tarjeta | sin sombra | — | ninguna | Una sombra no se ve sobre negro. |
| `dark:border-hairline` | tarjeta | borde de 1 píxel físico | — | 1 px | Sustituye a la sombra como límite. |
| `dark:border-neutral-800` | tarjeta | `border-color` | — | `#262626` | Borde discreto. |
| `transition-colors` | tarjeta | transición | — | — | — |
| `hover:bg-neutral-50` / `dark:hover:bg-neutral-800` | tarjeta al pulsar | fondo | `#FAFAFA` | `#262626` | Respuesta táctil. |
| `focus-visible:ring-2 focus-visible:ring-brand` | tarjeta | anillo de foco | rojo | rojo | Foco visible. |
| `md:h-48` | tarjeta | 192 pt en iPad | — | — | Proporción en pantallas anchas. |
| `text-brand` / `dark:text-brand-light` | icono | trazo | `#D70032` | `#FF5C7A` | Los trazos finos de 1,5 pt necesitan más luminosidad sobre oscuro. |
| `text-base` | etiqueta | 16/24 pt | — | — | — |
| `text-ink-muted` / `dark:text-neutral-300` | etiqueta | `color` | `#484848` | `#D4D4D4` | 9,15:1 y ≈ 11:1. |

#### 12.2.6. Enlaces inferiores

```html
<view class="mt-auto items-center gap-5 pt-16">
  <text pressable accessibilityRole="link" class="text-base text-brand hover:opacity-70 dark:text-brand-light" (press)="openEligibility()">
    Can I give blood?
  </text>
  <text pressable accessibilityRole="link" class="text-base text-brand hover:opacity-70 dark:text-brand-light" (press)="share()">
    Share on social media!
  </text>
</view>
```

| Clase | Elemento | Propiedad | Por qué |
|---|---|---|---|
| `mt-auto` | grupo | `margin-top: auto` | Lleva los enlaces al fondo cuando sobra espacio (requiere `grow` en el contenedor del scroll). |
| `items-center` | grupo | centrado | Enlaces centrados. |
| `gap-5` | grupo | 20 pt | Paso medido ≈ 44 pt (20 + 24 de línea). |
| `pt-16` | grupo | 64 pt | Espacio mínimo bajo las tarjetas cuando no sobra. |
| `text-base text-brand hover:opacity-70 dark:text-brand-light` | enlaces | — | Idénticas al enlace de P2 (11.2.4). |

#### 12.2.7. Desplazamiento

```html
<scroll-view class="flex-1" contentContainerClass="grow px-6 min-pb-safe-6">
  <view class="w-full max-w-md grow self-center"> título · cuadrícula · tarjetas · enlaces </view>
</scroll-view>
```

`min-pb-safe-6` deja 24 pt sobre la barra de pestañas nativa (que ya respeta la zona segura). El
resto de clases son las de 11.2.1.

---

## 13. Inventario de componentes

Componentes reutilizables propuestos. Ninguno existe todavía en el código.

| Componente | Selector propuesto | Pantallas | Variantes / estados | Sección |
|---|---|---|---|---|
| Logotipo de gota | `<ng-icon [svg]="logoDrop">` | P1 (blanco), P2 (rojo) | color por `text-*` | 10.2.3, 11.2.2 |
| Botón primario | `app-button variant="primary"` | P2 (Finish) | normal, pulsado, foco, deshabilitado | 11.2.8 |
| Botón primario inverso | `app-button variant="inverse"` | P1 (Sign in) | normal, pulsado, foco | 10.2.5 |
| Botón de contorno | `app-button variant="outline"` | P1 (Create Account) | normal, pulsado, foco | 10.2.6 |
| Enlace de texto | `<text pressable accessibilityRole="link">` | P1, P2, P3 | normal, pulsado; claro sobre marca | 10.2.7, 11.2.4, 12.2.6 |
| Botón de elección | `app-choice` | P2 (A/B/O/AB, +/−) | no seleccionado, seleccionado, pulsado, foco; tamaños `h-19 flex-1` y `size-12` | 11.2.5, 11.2.6 |
| Casilla | `app-checkbox` | P2 | desmarcada, marcada, foco | 11.2.7 |
| Botón de icono | `app-icon-button` | P3 (menú, búsqueda) | normal, pulsado | 12.2.2 |
| Gota de existencias | `app-stock-drop` | P3 | nivel 0–100 %, insignia | 12.2.4 |
| Tarjeta de acción | `app-action-card` | P3 | normal, pulsado, foco | 12.2.5 |
| Círculo decorativo | `<view aria-hidden>` | P1, P3 | sobre marca / sobre superficie | 10.2.2, 12.2.1 |
| Título de pantalla | `<text accessibilityRole="header">` | P2, P3 | — | 11.2.3 |

---

## 14. Clases Tailwind por componente

Cadena completa de cada componente compartido. La explicación clase a clase está en las secciones
10–12 (en su contexto) y en la 15 (diccionario).

| Componente | Elemento | Clases |
|---|---|---|
| Botón primario | pressable | `h-15 items-center justify-center rounded-lg bg-brand transition-colors hover:bg-brand-pressed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950` |
| | texto | `text-lg font-semibold text-white` |
| Botón inverso | pressable | `h-15 items-center justify-center rounded-lg bg-white transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand dark:hover:bg-neutral-200 dark:focus-visible:ring-offset-brand-deep` |
| | texto | `text-lg font-semibold text-brand dark:text-brand-deep` |
| Botón de contorno | pressable | `h-15 items-center justify-center rounded-lg border-2 border-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand` |
| | texto | `text-lg font-medium text-white` |
| Enlace sobre superficie | text | `text-base text-brand hover:opacity-70 dark:text-brand-light` |
| Enlace sobre marca | text | `text-base text-white hover:opacity-70` |
| Botón de elección | pressable | `items-center justify-center rounded-md bg-control text-ink-muted transition-colors hover:bg-neutral-200 aria-checked:bg-brand aria-checked:text-white aria-checked:hover:bg-brand-pressed focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus-visible:ring-offset-neutral-950` + tamaño (`relative h-19 flex-1 md:h-24` o `size-12`) |
| Casilla | pressable | `group mt-auto flex-row items-start gap-3 pt-8` |
| | caja | `mt-0.5 size-4.5 items-center justify-center rounded-sm border-2 border-neutral-400 group-aria-checked:border-brand group-aria-checked:bg-brand dark:border-neutral-500` |
| | etiqueta | `flex-1 text-sm leading-5 text-black dark:text-neutral-200` |
| Botón de icono | pressable | `size-11 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10` |
| | icono | `text-black dark:text-neutral-50` |
| Gota de existencias | celda | `w-1/4 items-center` |
| | caja | `relative h-16 w-12` |
| | insignia | `absolute -right-3 -top-1 size-7 items-center justify-center rounded-full border border-brand bg-white dark:border-brand-light dark:bg-neutral-950` |
| | texto | `text-[10px] font-medium text-brand dark:text-brand-light` |
| Tarjeta de acción | pressable | `h-40 flex-1 items-center justify-center gap-4 rounded-xl bg-white shadow-lg shadow-slate-900/5 transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-brand dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:bg-neutral-800 md:h-48` |
| | icono | `text-brand dark:text-brand-light` |
| | etiqueta | `text-base text-ink-muted dark:text-neutral-300` |
| Título de pantalla | text | `text-center text-3xl leading-12 font-light text-black dark:text-neutral-50 md:text-4xl md:leading-14` |

---

## 15. Explicación individual de cada clase

Diccionario de todas las clases del sistema. **CSS** es lo que genera Tailwind v4.3.3; **Nativo**
es la prop de estilo que recibe la vista tras compilar. Los valores en px equivalen a pt en el
dispositivo.

### 15.1. Layout (Flexbox)

| Clase | CSS | Nativo | Efecto |
|---|---|---|---|
| `flex-1` | `flex: 1` | `flex: 1` | Crece para llenar el espacio del padre. |
| `grow` | `flex-grow: 1` | `flexGrow: 1` | Crece sin fijar la base. Se usa en contenedores de scroll. |
| `flex-row` | `flex-direction: row` | `flexDirection: 'row'` | Hijos en horizontal (por defecto es columna). |
| `flex-wrap` | `flex-wrap: wrap` | `flexWrap: 'wrap'` | Salta de línea al llenarse. |
| `items-center` | `align-items: center` | `alignItems` | Centra en el eje cruzado. |
| `items-start` | `align-items: flex-start` | `alignItems` | Alinea al inicio en el eje cruzado. |
| `justify-center` | `justify-content: center` | `justifyContent` | Centra en el eje principal. |
| `justify-between` | `justify-content: space-between` | `justifyContent` | Extremos y reparto del espacio. |
| `self-center` | `align-self: center` | `alignSelf` | Centra un hijo concreto. |
| `gap-3` / `gap-4` / `gap-5` / `gap-16` | `gap` | `gap` | 12 / 16 / 20 / 64 pt entre hijos. |
| `gap-y-10` | `row-gap` | `rowGap` | 40 pt entre filas. |
| `relative` | `position: relative` | `position` | Ancla los hijos absolutos. |
| `absolute` | `position: absolute` | `position` | Fuera del flujo. |
| `overflow-hidden` | `overflow: hidden` | `overflow` | Recorta lo que sobresale. |
| `mt-auto` | `margin-top: auto` | `marginTop: 'auto'` | Empuja el elemento al final de la columna. |
| `group` | (marcador) | — | Permite variantes `group-*` en los descendientes. |

### 15.2. Tamaño y posición

| Clase | Valor | Uso |
|---|---|---|
| `w-full` | 100 % | Ancho completo. |
| `w-1/4` | 25 % | Columna de cuadrícula. |
| `w-12` | 48 pt | Ancho de la gota de existencias. |
| `max-w-sm` | 384 pt (24 rem) | Límite de ancho en P1. |
| `max-w-md` | 448 pt (28 rem) | Límite de ancho en P2 y P3. |
| `h-14` | 56 pt | Barra superior. |
| `h-15` | 60 pt | Botones de ancho completo. |
| `h-16` | 64 pt | Gota de existencias. |
| `h-19` | 76 pt | Botón de grupo. |
| `h-40` | 160 pt | Tarjeta. |
| `md:h-24` / `md:h-48` | 96 / 192 pt | Botón de grupo / tarjeta en iPad. |
| `size-4.5` | 18 × 18 pt | Casilla. |
| `size-7` | 28 × 28 pt | Insignia. |
| `size-11` | 44 × 44 pt | Botón de icono. |
| `size-12` | 48 × 48 pt | Botón Rh. |
| `size-48` | 192 × 192 pt | Círculo de P3. |
| `size-88` | 352 × 352 pt | Círculo de P1. |
| `-left-44` / `-top-44` | −176 pt | Posición del círculo de P1. |
| `-left-24` / `-top-24` | −96 pt | Posición del círculo de P3. |
| `-right-3` / `-top-1` | −12 / −4 pt | Posición de la insignia. |
| `right-2` / `top-2` | 8 pt | Marca de verificación en el botón seleccionado. |

### 15.3. Espaciado

| Clase | Propiedad | Valor |
|---|---|---|
| `px-3` | `padding-left/right` | 12 pt |
| `px-6` | `padding-left/right` | 24 pt |
| `pt-8` / `pt-16` | `padding-top` | 32 / 64 pt |
| `mt-0.5` | `margin-top` | 2 pt |
| `mt-5` / `mt-6` / `mt-8` / `mt-10` / `mt-12` / `mt-14` | `margin-top` | 20 / 24 / 32 / 40 / 48 / 56 pt |
| `pt-safe` | `padding-top` | Inset superior del dispositivo (preset). |
| `mt-safe` | `margin-top` | Inset superior del dispositivo (preset). |
| `min-pt-safe-12` | `padding-top` | máx(inset superior, 48 pt) (preset). |
| `min-pb-safe-6` / `min-pb-safe-8` | `padding-bottom` | máx(inset inferior, 24 / 32 pt) (preset). |

### 15.4. Color

| Clase | Propiedad | Valor |
|---|---|---|
| `bg-brand` | `background-color` | `#D70032` |
| `bg-brand-deep` (vía `dark:`) | `background-color` | `#8E0022` |
| `bg-white` | `background-color` | `#FFFFFF` |
| `bg-white/15` / `bg-white/10` | `background-color` | blanco al 15 % / 10 % |
| `bg-black/5` | `background-color` | negro al 5 % |
| `bg-control` | `background-color` | `#F2F2F2` |
| `bg-neutral-50` … `bg-neutral-950` | `background-color` | `#FAFAFA`, `#F5F5F5`, `#E5E5E5`, `#404040`, `#262626`, `#171717`, `#0A0A0A` |
| `text-white` / `text-black` | `color` | `#FFF` / `#000` |
| `text-brand` / `text-brand-deep` / `text-brand-light` | `color` | `#D70032` / `#8E0022` / `#FF5C7A` |
| `text-ink-muted` | `color` | `#484848` |
| `text-neutral-50` / `-200` / `-300` | `color` | `#FAFAFA` / `#E5E5E5` / `#D4D4D4` |
| `border-white` / `border-brand` / `border-brand-light` | `border-color` | — |
| `border-neutral-400` / `-500` / `-800` | `border-color` | `#A1A1A1` / `#737373` / `#262626` |

En `<text>`, `color` se hereda a los `<text>` descendientes. En `ng-icon`, el `color` (propio o
heredado) pinta los trazos y rellenos `currentColor` del SVG.

### 15.5. Tipografía

| Clase | Propiedad | Valor |
|---|---|---|
| `text-[10px]` | `font-size` | 10 pt (arbitrario, ver 6.3) |
| `text-sm` | `font-size` / `line-height` | 14 / 20 pt |
| `text-base` | `font-size` / `line-height` | 16 / 24 pt |
| `text-lg` | `font-size` / `line-height` | 18 / 28 pt |
| `text-xl` | `font-size` / `line-height` | 20 / 28 pt |
| `text-2xl` | `font-size` / `line-height` | 24 / 32 pt |
| `text-3xl` | `font-size` / `line-height` | 30 / 36 pt |
| `md:text-4xl` | `font-size` / `line-height` | 36 / 40 pt |
| `leading-5` / `leading-12` / `md:leading-14` | `line-height` | 20 / 48 / 56 pt |
| `font-light` / `font-normal` / `font-medium` / `font-semibold` | `font-weight` | 300 / 400 / 500 / 600 |
| `text-center` | `text-align` | center |

### 15.6. Bordes, radios, sombras y anillos

| Clase | Propiedad | Valor |
|---|---|---|
| `border` | `border-width` | 1 pt |
| `border-2` | `border-width` | 2 pt |
| `border-hairline` | `border-width` | 1 píxel físico (preset) |
| `rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-xl` / `rounded-full` | `border-radius` | 4 / 6 / 8 / 12 / círculo |
| `shadow-lg` | `box-shadow` | `0 10px 15px -3px`, `0 4px 6px -4px` |
| `shadow-slate-900/5` | color de la sombra | slate-900 al 5 % |
| `shadow-none` | `box-shadow` | ninguna |
| `ring-2` | `box-shadow` de anillo | 2 pt |
| `ring-brand` / `ring-white` | color del anillo | — |
| `ring-offset-2` | separación del anillo | 2 pt |
| `ring-offset-brand` / `-brand-deep` / `-neutral-950` | color de la separación | — |

### 15.7. Efectos y transiciones

| Clase | Propiedad | Valor |
|---|---|---|
| `transition-colors` | `transition-property` (colores), duración y curva | 150 ms, `cubic-bezier(0.4, 0, 0.2, 1)` |
| `opacity-70` (vía `hover:`) | `opacity` | 0,7 |
| `opacity-50` (vía `disabled:`) | `opacity` | 0,5 |

### 15.8. Variantes

| Variante | Selector generado (verificado) | Cuándo se aplica |
|---|---|---|
| `hover:` | `:active, [data-hover]` | Mientras se pulsa (o con hover de trackpad en iPad). |
| `focus-visible:` | `:focus, [data-focus]` | Al recibir foco (teclado, Switch Control, mando). |
| `disabled:` | `[data-disabled], :disabled` | Con `[disabled]="true"` en el control. |
| `aria-checked:` | `[aria-checked="true"]` | Con `[aria-checked]="true"`. |
| `group-aria-checked:` | `:is(:where(.group)[aria-checked="true"] *)` | Si un ancestro `group` tiene `aria-checked`. |
| `dark:` | `:where(.dark, .dark *)` | Con la clase `dark` en un ancestro (la raíz). Especificidad añadida: 0. |
| `md:` | `@media (width >= 48rem)` | Con 768 pt de ancho o más (iPad). |

---

## 16. Ubicación de cada clase en cada pantalla

Índice inverso: dónde aparece cada clase. P1 = bienvenida, P2 = tipo de sangre, P3 = dashboard.

| Clase | P1 | P2 | P3 |
|---|---|---|---|
| `flex-1` | raíz, zona del logotipo | scroll-view, botones de grupo, texto del checkbox | raíz, scroll-view, tarjetas |
| `grow` | — | contenedor del scroll, columna | contenedor del scroll, columna |
| `flex-row` | fila de enlaces, "Skip now" | filas de grupo, fila Rh, checkbox | barra, cuadrícula, fila de tarjetas |
| `flex-wrap` | — | — | cuadrícula |
| `items-center` | logotipo, fila de enlaces, "Skip now", botones | botones, casilla | barra, botones de icono, celdas, insignia, tarjetas, enlaces |
| `items-start` | — | checkbox | — |
| `justify-center` | logotipo, botones | botones, fila Rh, casilla | botones de icono, insignia, tarjetas |
| `justify-between` | fila de enlaces | — | barra |
| `self-center` | grupo de acciones, fila de enlaces | gota, columna | columna |
| `gap-3` | "Skip now" | checkbox | — |
| `gap-4` | — | — | tarjetas |
| `gap-5` | grupo de acciones | grupo y filas de grupo | fila de tarjetas, enlaces |
| `gap-16` | — | fila Rh | — |
| `gap-y-10` | — | — | cuadrícula |
| `relative` | — | botón de grupo | caja de gota |
| `absolute` | círculo | marca de verificación | círculo, insignia |
| `overflow-hidden` | raíz | — | raíz |
| `mt-auto` | — | checkbox | enlaces |
| `group` | — | checkbox | — |
| `w-full` | grupo de acciones, enlaces | columna | columna |
| `w-1/4` | — | — | celdas |
| `max-w-sm` | grupo de acciones, enlaces | — | — |
| `max-w-md` | — | columna | columna |
| `h-14` | — | — | barra |
| `h-15` | Sign in, Create Account | Finish | — |
| `h-16 w-12` | — | — | caja de gota |
| `h-19` / `md:h-24` | — | botón de grupo | — |
| `h-40` / `md:h-48` | — | — | tarjetas |
| `size-4.5` | — | casilla | — |
| `size-7` | — | — | insignia |
| `size-11` | — | — | botones de icono |
| `size-12` | — | botones Rh | — |
| `size-48` | — | — | círculo |
| `size-88` | círculo | — | — |
| `px-3` | — | — | barra |
| `px-6` | raíz | contenedor del scroll | contenedor del scroll |
| `pt-safe` | raíz | — | — |
| `mt-safe` | — | — | barra |
| `min-pt-safe-12` | — | contenedor del scroll | — |
| `min-pb-safe-8` | raíz | contenedor del scroll | — |
| `min-pb-safe-6` | — | — | contenedor del scroll |
| `pt-8` / `pt-16` | — | checkbox | enlaces |
| `mt-0.5` | — | casilla | — |
| `mt-5` | — | enlace, grupo | — |
| `mt-6` | — | — | título |
| `mt-8` | — | título, fila Rh, Finish | — |
| `mt-10` / `mt-12` | — | — | cuadrícula / tarjetas |
| `mt-14` | fila de enlaces | — | — |
| `bg-brand` | raíz | botón seleccionado, casilla marcada, Finish | — |
| `bg-white` | Sign in | scroll-view | raíz, insignia, tarjetas |
| `bg-white/15` | círculo | — | — |
| `bg-control` | — | botones de grupo y Rh | — |
| `bg-neutral-50` | — | — | círculo |
| `text-brand` | texto de Sign in | gota, enlace | gotas, insignia, enlaces, iconos de tarjeta |
| `text-white` | Create Account, enlaces, flecha, logotipo | Finish, marca de casilla | — |
| `text-black` | — | título, texto del checkbox | barra, título |
| `text-ink-muted` | — | botones de grupo y Rh | etiquetas de tarjeta |
| `border-2` | Create Account | casilla | — |
| `border` | — | — | insignia |
| `rounded-sm` | — | casilla | — |
| `rounded-md` | — | botones de grupo y Rh | — |
| `rounded-lg` | Sign in, Create Account | Finish | — |
| `rounded-xl` | — | — | tarjetas |
| `rounded-full` | círculo | — | círculo, botones de icono, insignia |
| `shadow-lg shadow-slate-900/5` | — | — | tarjetas |
| `text-3xl leading-12 font-light` | — | título | título |
| `text-2xl` | — | letras de grupo | — |
| `text-xl` | — | — | "Dashboard" |
| `text-lg` | botones | Finish | — |
| `text-base` | enlaces | enlace | enlaces, etiquetas |
| `text-sm leading-5` | — | texto del checkbox | — |
| `text-[10px]` | — | — | insignia |
| `font-semibold` | Sign in | Finish | — |
| `font-medium` | Create Account | — | insignia |
| `text-center` | — | título, enlace | título |
| `transition-colors` | botones | botones de elección, Finish | botones de icono, tarjetas |
| `hover:*` | botones, enlaces | botones, enlace | botones de icono, tarjetas, enlaces |
| `focus-visible:*` | botones | botones de elección, Finish | tarjetas |
| `aria-checked:*` | — | botones de grupo y Rh | — |
| `group-aria-checked:*` | — | casilla | — |
| `disabled:opacity-50` | — | Finish | — |
| `dark:*` | ver tabla 17.1 | ver tabla 17.2 | ver tabla 17.3 |

---

## 17. Comparativa de Light Mode y Dark Mode

### 17.1. Pantalla 1

| Elemento | Light Mode | Dark Mode | Explicación |
|---|---|---|---|
| Fondo | `bg-brand` | `dark:bg-brand-deep` | Menos deslumbramiento; sigue siendo rojo de marca. |
| Círculo decorativo | `bg-white/15` | `dark:bg-white/10` | Más sutil sobre el rojo oscuro. |
| Logotipo | `text-white` | (igual) | Contraste alto en ambos. |
| Sign in: fondo | `bg-white` | (igual) | Sigue siendo la acción principal. |
| Sign in: texto | `text-brand` | `dark:text-brand-deep` | Coincide con el fondo de la pantalla. |
| Sign in: pulsado | `hover:bg-neutral-100` | `dark:hover:bg-neutral-200` | Cambio más perceptible. |
| Sign in: separación del foco | `focus-visible:ring-offset-brand` | `dark:focus-visible:ring-offset-brand-deep` | Sigue al fondo. |
| Create Account | `border-white text-white hover:bg-white/10` | (igual) | La transparencia se adapta sola. |
| Enlaces | `text-white hover:opacity-70` | (igual) | — |

### 17.2. Pantalla 2

| Elemento | Light Mode | Dark Mode | Explicación |
|---|---|---|---|
| Fondo | `bg-white` | `dark:bg-neutral-950` | Base de superficies. |
| Gota | `text-brand` | (igual) | Gráfico con 3,71:1 ≥ 3:1. |
| Título | `text-black` | `dark:text-neutral-50` | 18,97:1. |
| Enlace | `text-brand` | `dark:text-brand-light` | 3,71 → 6,66:1. |
| Botón de grupo: fondo | `bg-control` | `dark:bg-neutral-800` | Un nivel sobre el fondo. |
| Botón de grupo: texto | `text-ink-muted` | `dark:text-neutral-300` | 10,21:1. |
| Botón de grupo: pulsado | `hover:bg-neutral-200` | `dark:hover:bg-neutral-700` | Un nivel más. |
| Seleccionado | `aria-checked:bg-brand aria-checked:text-white` | (igual) | Identidad de marca en ambos modos. |
| Seleccionado pulsado | `aria-checked:hover:bg-brand-pressed` | (igual) | Evita el gris de `dark:hover:` (ver 11.2.5). |
| Separación del foco | `ring-offset-2` (blanco) | `dark:focus-visible:ring-offset-neutral-950` | Sin aro blanco. |
| Casilla vacía | `border-neutral-400` | `dark:border-neutral-500` | Visible sobre negro. |
| Casilla marcada | `group-aria-checked:bg-brand border-brand` | (igual) | — |
| Texto del checkbox | `text-black` | `dark:text-neutral-200` | Párrafo un paso por debajo del título. |
| Finish | `bg-brand text-white` | (igual) | — |

### 17.3. Pantalla 3

| Elemento | Light Mode | Dark Mode | Explicación |
|---|---|---|---|
| Fondo | `bg-white` | `dark:bg-neutral-950` | — |
| Círculo | `bg-neutral-50` | `dark:bg-neutral-900` | Un paso sobre el fondo, igual de sutil. |
| Iconos y título de la barra | `text-black` | `dark:text-neutral-50` | — |
| Pulsado de iconos | `hover:bg-black/5` | `dark:hover:bg-white/10` | Velo invertido. |
| Título | `text-black` | `dark:text-neutral-50` | — |
| Gotas | `text-brand` | (igual) | Gráfico. |
| Insignia: anillo / texto | `border-brand` / `text-brand` | `dark:border-brand-light` / `dark:text-brand-light` | Texto de 10 pt: necesita 4,5:1. |
| Insignia: fondo | `bg-white` | `dark:bg-neutral-950` | Se funde con la pantalla. |
| Tarjeta: fondo | `bg-white` | `dark:bg-neutral-900` | Superficie elevada. |
| Tarjeta: límite | `shadow-lg shadow-slate-900/5` | `dark:shadow-none dark:border-hairline dark:border-neutral-800` | De sombra a borde. |
| Tarjeta: pulsado | `hover:bg-neutral-50` | `dark:hover:bg-neutral-800` | — |
| Icono de tarjeta | `text-brand` | `dark:text-brand-light` | Trazos finos. |
| Etiqueta de tarjeta | `text-ink-muted` | `dark:text-neutral-300` | — |
| Enlaces | `text-brand` | `dark:text-brand-light` | — |

### 17.4. Tabla global

| Elemento | Light Mode | Dark Mode | Explicación |
|---|---|---|---|
| Fondo principal | `bg-white` | `dark:bg-neutral-950` | Fondo general. |
| Tarjetas | `bg-white` + sombra | `dark:bg-neutral-900` + borde | Separa superficies. |
| Controles | `bg-control` | `dark:bg-neutral-800` | Tercer nivel. |
| Texto principal | `text-black` | `dark:text-neutral-50` | Legibilidad. |
| Texto secundario | `text-ink-muted` | `dark:text-neutral-300` | Información secundaria. |
| Texto rojo | `text-brand` | `dark:text-brand-light` | Contraste AA. |
| Bordes | `border-neutral-400` | `dark:border-neutral-500` / `-800` | Límites visibles. |
| Botón principal | `bg-brand` | (igual) | Conserva la identidad. |
| Fondo de marca | `bg-brand` | `dark:bg-brand-deep` | Menos brillo a pantalla completa. |

---

## 18. Explicación individual de las clases `dark:`

**Cómo funcionan:** `dark:X` genera `.dark\:X:where(.dark, .dark *) { … }`. Se aplica cuando el
elemento o un ancestro tiene la clase `dark`. En este proyecto, `watchConditions(app.engine)` pone
esa clase en la raíz cuando el sistema está en oscuro. `:where()` no suma especificidad: un
`dark:bg-*` (0,1,0) **pierde** contra un `aria-checked:bg-*` o un `hover:bg-*` (0,2,0). Por eso
algunas combinaciones necesitan su propia clase `dark:hover:`.

| Clase `dark:` | Clase base que sustituye | Propiedad | Ubicación | Razón | Resultado |
|---|---|---|---|---|---|
| `dark:bg-brand-deep` | `bg-brand` | `background-color` | P1 raíz | Un rojo saturado a pantalla completa deslumbra de noche. | Rojo granate `#8E0022`. |
| `dark:bg-white/10` | `bg-white/15` | `background-color` | P1 círculo | Sobre un fondo más oscuro el 15 % se nota demasiado. | Círculo igual de sutil. |
| `dark:text-brand-deep` | `text-brand` | `color` | P1 texto de Sign in | Coherencia con el fondo oscuro. | Texto granate, 9,66:1. |
| `dark:hover:bg-neutral-200` | `hover:bg-neutral-100` | `background-color` al pulsar | P1 Sign in | Más contraste en la respuesta. | Gris claro al pulsar. |
| `dark:focus-visible:ring-offset-brand-deep` | `focus-visible:ring-offset-brand` | color de la separación del anillo | P1 Sign in | La separación debe fundirse con el fondo. | Anillo blanco limpio. |
| `dark:bg-neutral-950` | `bg-white` | `background-color` | P2 y P3 raíz; P3 insignia | Fondo base oscuro. | Casi negro `#0A0A0A`. |
| `dark:text-neutral-50` | `text-black` | `color` | P2 y P3 títulos; P3 barra | Texto principal claro sin blanco puro. | 18,97:1. |
| `dark:text-brand-light` | `text-brand` | `color` | P2 enlace; P3 enlaces, insignias, iconos de tarjeta | `brand` da 3,71:1, por debajo de AA. | Rojo claro, 6,66:1. |
| `dark:border-brand-light` | `border-brand` | `border-color` | P3 insignia | Anillo visible. | — |
| `dark:bg-neutral-800` | `bg-control` | `background-color` | P2 botones de elección | Tercer nivel de superficie. | `#262626`. |
| `dark:text-neutral-300` | `text-ink-muted` | `color` | P2 letras; P3 etiquetas | Texto secundario claro. | 10,21:1 sobre `neutral-800`. |
| `dark:hover:bg-neutral-700` | `hover:bg-neutral-200` | `background-color` al pulsar | P2 botones de elección | Un nivel más al pulsar. | `#404040`. |
| `dark:focus-visible:ring-offset-neutral-950` | `ring-offset-2` (blanco por defecto) | color de la separación | P2 botones, Finish | Evita un aro blanco alrededor del anillo. | — |
| `dark:border-neutral-500` | `border-neutral-400` | `border-color` | P2 casilla | Contorno visible sobre negro. | — |
| `dark:text-neutral-200` | `text-black` | `color` | P2 texto del checkbox | Párrafo un paso por debajo del título. | — |
| `dark:bg-neutral-900` | `bg-neutral-50` / `bg-white` | `background-color` | P3 círculo, tarjetas | Superficie elevada. | `#171717`. |
| `dark:hover:bg-white/10` | `hover:bg-black/5` | `background-color` al pulsar | P3 botones de icono | Un velo negro no se ve sobre negro. | Velo claro. |
| `dark:shadow-none` | `shadow-lg` | `box-shadow` | P3 tarjetas | La sombra es invisible en oscuro. | Sin sombra. |
| `dark:border-hairline` | (ninguna) | `border-width` | P3 tarjetas | Sustituye a la sombra como límite. | Borde de 1 píxel. |
| `dark:border-neutral-800` | (ninguna) | `border-color` | P3 tarjetas | Color del borde. | — |
| `dark:hover:bg-neutral-800` | `hover:bg-neutral-50` | `background-color` al pulsar | P3 tarjetas | Sin ella, la tarjeta se volvería casi blanca al pulsarla en oscuro. | — |

**Clases sin variante `dark:` a propósito:** `bg-brand` (botones), `text-white` sobre rojo,
`aria-checked:*`, `group-aria-checked:*`, `hover:opacity-70`, `hover:bg-white/10` y `text-brand`
en gráficos. O funcionan en ambos modos o son transparencias que se adaptan solas.

---

## 19. Configuración del selector de tema

### 19.1. Estado actual (verificado)

| Pieza | Archivo | Qué hace |
|---|---|---|
| Variante `dark:` | `node_modules/@ng-native/tailwind/shared.css` (importado por `native.css`) | `@custom-variant dark (&:where(.dark, .dark *));` **Ya declarada: no hay que añadirla a `src/styles.css`.** |
| Clase `dark` en la raíz | `src/main.ts:32` → `watchConditions(app.engine)` | Pone o quita `dark` en la raíz según el sistema y la actualiza al cambiar. |
| Condiciones iniciales | `src/main.ts:20` → `conditions: currentConditions()` | Esquema de color y tamaño al arrancar. |
| Seguir al sistema | `app.json:12` → `"userInterfaceStyle": "automatic"` | Sin esto, iOS/Android forzarían el modo claro. |
| Selector manual | — | **No existe.** |

**Estrategia actual:** preferencia del sistema reflejada en una clase. Esto da `prefers-color-scheme`
y clase `.dark` a la vez, sin mecanismos redundantes. Para cumplir este diseño **no hace falta
cambiar nada**.

### 19.2. Si se necesita un selector Claro / Oscuro / Sistema [propuesto]

Solo si el producto lo pide (la imagen no muestra ninguno):

1. `src/main.ts`: `watchConditions(app.engine, { darkClass: false })`, para que el sistema no
   imponga la clase.
2. Un servicio `Theme` que calcula la clase:

```ts
import { computed, inject, signal, Service } from '@angular/core';
import { ColorScheme } from '@ng-native/device';

type Preference = 'light' | 'dark' | 'system';

@Service()
export class Theme {
  private readonly system = inject(ColorScheme);
  private readonly preference = signal<Preference>('system');

  readonly className = computed(() => {
    const chosen = this.preference() === 'system' ? this.system.current() : this.preference();
    return chosen === 'dark' ? 'dark' : '';
  });

  choose(preference: Preference): void {
    this.preference.set(preference);
    // Cabeceras, pestañas, teclado e interruptores nativos siguen al esquema de la ventana:
    this.system.set(preference === 'system' ? null : preference);
  }
}
```

3. `src/app/app.ts`: añadir `theme.className()` a la clase del host, junto a `platformClass`.
4. **Persistencia:** guardar `preference` en el almacenamiento de ajustes de la app y restaurarla
   al arrancar. El ejemplo oficial no lo hace.
5. **Relación con el sistema:** en modo `system` sigue a `ColorScheme.current`, que cambia en vivo.

Afecta a los componentes así: todas las clases `dark:` dependen de esa clase en un ancestro, así que
cambiarla en la raíz cambia toda la app en el siguiente render, sin tocar ningún componente.

---

## 20. Estados interactivos

### 20.1. Qué significa cada variante en nativo

| Variante | Web | Angular Native (este proyecto) |
|---|---|---|
| `hover:` | Cursor encima | **Mientras se pulsa** (`:active`) + hover de trackpad en iPad |
| `active:` | Mientras se pulsa | Igual que `hover:` |
| `focus:` / `focus-visible:` | Foco / foco de teclado | Ambas = foco (teclado externo, Switch Control, D-pad, TalkBack). `:focus-visible` como tal se descarta. |
| `disabled:` | `:disabled` | `[data-disabled]`, publicado por `[disabled]` en `<pressable>` |
| Seleccionado | `aria-checked:` / `aria-selected:` | Igual que en web: lee el atributo aria del nodo |

Se usa `hover:` y no `active:` por convención del preset: así las cadenas de clases funcionan igual
si algún día se comparten con la web.

### 20.2. Matriz de estados

| Componente | Normal | Pulsado (`hover:`) | Foco | Seleccionado | Deshabilitado |
|---|---|---|---|---|---|
| Primario | `bg-brand` | `bg-brand-pressed` | anillo `brand` + separación | — | `opacity-50` |
| Inverso | `bg-white` | `bg-neutral-100` (oscuro: `-200`) | anillo blanco + separación de marca | — | — |
| Contorno | transparente | `bg-white/10` | anillo blanco | — | — |
| Enlace | — | `opacity-70` | (foco nativo del sistema) | — | — |
| Elección | `bg-control` (oscuro: `neutral-800`) | `bg-neutral-200` (oscuro: `-700`) | anillo `brand` | `bg-brand text-white` + ✓ | — |
| Elección seleccionada | `bg-brand` | `bg-brand-pressed` | anillo `brand` | — | — |
| Casilla | borde gris | — | — | `bg-brand border-brand` + ✓ | — |
| Botón de icono | transparente | `bg-black/5` (oscuro: `white/10`) | — | — | — |
| Tarjeta | `bg-white` (oscuro: `neutral-900`) | `bg-neutral-50` (oscuro: `-800`) | anillo `brand` | — | — |

### 20.3. Conflictos resueltos

| Conflicto | Solución |
|---|---|
| `dark:hover:bg-neutral-700` gana a `aria-checked:bg-brand` (misma especificidad, aparece después) | `aria-checked:hover:bg-brand-pressed` (0,3,0) |
| `hover:bg-neutral-50` gana a `dark:bg-neutral-900` en tarjetas | `dark:hover:bg-neutral-800` |
| `hover:text-*` en enlaces chocaría con `dark:text-*` | Pulsado por opacidad (`hover:opacity-70`), que no depende del modo |

### 20.4. Transiciones

`transition-colors` (150 ms) en todo lo que cambia de color. Angular Native compila las
transiciones CSS a animación nativa. Recomendación: respetar "Reducir movimiento" con
`motion-reduce:transition-none` en los mismos elementos. **[propuesto; compila sin avisos]**

### 20.5. Observado frente a propuesto

| Observado en la imagen | Propuesto |
|---|---|
| Un grupo seleccionado (B), en rojo | Rh "+" seleccionado, en rojo |
| Casilla marcada en rojo | Casilla desmarcada con borde gris |
| — | Todos los estados de pulsado, foco y deshabilitado, la marca ✓ y el modo oscuro |

---

## 21. Diseño responsive

### 21.1. Contexto del proyecto (verificado)

- `app.json`: `"orientation": "portrait"` y `"supportsTablet": true`. Teléfonos y iPad, solo en
  vertical.
- `md:` = `@media (width >= 48rem)` = 768 pt. Coincide con `COMPACT_WIDTH` de `@ng-native/device`
  (iPad en vertical ≥ 768 pt).
- `lg:` (1024) y `xl:` (1280) solo los alcanzaría un iPad grande. **No se usan**: con `max-w-*` la
  columna ya está limitada.
- `sm:` (640) cae entre teléfonos grandes (430 pt) y iPad mini (744 pt) y no aporta nada. **No se
  usa.**

### 21.2. Estrategia por tamaño

| Tamaño | Ancho | Comportamiento |
|---|---|---|
| Teléfono pequeño (iPhone SE) | 375 × 667 | Todo en columna. P2 y P3 se desplazan porque no caben. |
| Teléfono estándar/grande | 390–430 | Diseño de referencia. `max-w-*` no actúa. |
| iPad mini (vertical) | 744 | Columna centrada de 448 pt (P2, P3) o 384 pt (P1). Todavía no aplica `md:`. |
| iPad (vertical) | 768–1024 | Columna centrada; `md:` agranda títulos, botones de grupo y tarjetas. |
| Escritorio | — | No aplica: la app no tiene destino web (`npm run web` falla a propósito). |

### 21.3. Clases responsive

| Clase | Elemento | Efecto en ≥ 768 pt |
|---|---|---|
| `md:text-4xl` | Títulos P2, P3 | 30 → 36 pt |
| `md:leading-14` | Títulos P2, P3 | 48 → 56 pt de interlineado |
| `md:h-24` | Botones de grupo | 76 → 96 pt |
| `md:h-48` | Tarjetas | 160 → 192 pt |

### 21.4. Clases que evitan que el diseño se estire

| Clase | Efecto |
|---|---|
| `max-w-sm` + `self-center` (P1) | Los botones no pasan de 384 pt. El fondo rojo sí ocupa toda la pantalla. |
| `max-w-md` + `self-center` (P2, P3) | El contenido no pasa de 448 pt y queda centrado. |
| `flex-1` en botones de grupo y tarjetas | Se reparten el ancho de la columna limitada, no el de la pantalla. |
| `w-1/4` en la cuadrícula | Cuatro columnas proporcionales a la columna. |

**Desbordamiento horizontal:** no hay anchos fijos mayores de 352 pt, salvo el círculo decorativo,
que es absoluto y queda recortado por `overflow-hidden`. Los textos largos saltan de línea (el texto
del checkbox tiene `flex-1`).

---

## 22. Accesibilidad

### 22.1. Contraste (WCAG 2.x, calculado)

| Par | Ratio | Requisito | Resultado |
|---|---|---|---|
| Blanco / `brand` `#D70032` | 5,34:1 | 4,5 (texto) | ✅ AA |
| `brand` / blanco | 5,34:1 | 4,5 | ✅ AA |
| Negro / blanco | 21:1 | 4,5 | ✅ AAA |
| `ink-muted` / `control` | 8,17:1 | 4,5 | ✅ AAA |
| `ink-muted` / blanco | 9,15:1 | 4,5 | ✅ AAA |
| Blanco / `brand-pressed` | 7,29:1 | 4,5 | ✅ AAA |
| Blanco / `brand-deep` | 9,66:1 | 4,5 | ✅ AAA |
| `neutral-50` / `neutral-950` | 18,97:1 | 4,5 | ✅ AAA |
| `neutral-300` / `neutral-800` | 10,21:1 | 4,5 | ✅ AAA |
| **`brand` / `neutral-950`** | **3,71:1** | 4,5 (texto) | ❌ como texto, ✅ como gráfico (3:1) → en texto se usa `brand-light` |
| `brand-light` / `neutral-950` | 6,66:1 | 4,5 | ✅ AA |
| `brand-light` / `neutral-900` | 6,03:1 | 4,5 | ✅ AA |
| **`control` / blanco** | **1,12:1** | 3 (límite de componente, 1.4.11) | ⚠️ Ver 22.2 |
| `neutral-800` / `neutral-950` | 1,31:1 | 3 | ⚠️ Ver 22.2 |

### 22.2. Problemas detectados y recomendaciones

| Problema | Origen | Recomendación |
|---|---|---|
| Rojo de marca como texto en oscuro: 3,71:1 | Propagar el color de la referencia al modo oscuro | `dark:text-brand-light` en todo texto rojo (ya aplicado). |
| Botones grises sin seleccionar casi invisibles como forma (1,12:1) | Referencia | La letra (8,17:1) identifica el control, así que no es un fallo estricto. Si se quiere reforzar: `border-hairline border-neutral-300 dark:border-neutral-700`. Se deja como opción para no alejarse de la referencia. |
| Selección indicada solo por color | Referencia | Marca ✓ en el botón seleccionado + `aria-checked` anunciado. |
| Casilla de 18 pt: objetivo táctil pequeño | Referencia | Toda la fila (casilla + texto) es el pressable. |
| Iconos de la barra de 24 pt | Referencia | Zona táctil de 44 pt (`size-11`). |
| Nivel de las gotas solo visual | Referencia | `accessibilityLabel` con el porcentaje. |

### 22.3. Semántica

| Elemento | Prop |
|---|---|
| Títulos | `accessibilityRole="header"` |
| Botones | `accessibilityRole="button"` |
| Enlaces | `accessibilityRole="link"` |
| Grupo sanguíneo y Rh | `accessibilityRole="radiogroup"` + `radio` con `[aria-checked]` |
| Notificaciones | `accessibilityRole="checkbox"` con `[aria-checked]` |
| Botones de solo icono | `accessibilityLabel` ("Menu", "Search", "Positive", "Negative") |
| Decoración (círculos, flecha, gotas de logotipo en P2) | `aria-hidden="true"` o `ng-icon` sin etiqueta (decorativo por defecto) |

### 22.4. Texto dinámico

Los tamaños en pt siguen la escala de texto del sistema. Con tamaños grandes, los títulos saltan de
línea y P2 y P3 se desplazan. Las alturas fijas de botones (`h-15`, `h-19`) contienen una sola
línea; si la accesibilidad lo exige, se pueden cambiar por `min-h-15` (recomendación).

---

## 23. Iconos e ilustraciones

### 23.1. Biblioteca existente (verificada)

- `@ng-native/icons` (`NgIcon`), que dibuja SVG como vistas nativas con `react-native-svg`.
- `@ng-icons/lucide` y `@ng-icons/heroicons` instalados. **Lucide** ya se usa en
  `src/app/shared/tabs.shared.ts`, así que se sigue con Lucide por coherencia.
- Los iconos se registran con `provideIcons({...})` en `src/app/app.config.ts:14`.
- Color: el `color` de una clase (`text-*`), propio o heredado, pinta los trazos `currentColor`.

### 23.2. Inventario

| Icono | Pantalla | Recurso | Tamaño | Light | Dark |
|---|---|---|---|---|---|
| Menú | P3 | `lucideMenu` | 24 | `text-black` | `dark:text-neutral-50` |
| Búsqueda | P3 | `lucideSearch` | 24 | `text-black` | `dark:text-neutral-50` |
| Flecha "Skip now" | P1 | `lucideMoveRight` | 28 | `text-white` | igual |
| Más / menos | P2 | `lucidePlus` / `lucideMinus` | 24 | heredado (`ink-muted` / blanco) | heredado (`neutral-300` / blanco) |
| Verificación | P2 | `lucideCheck` (`strokeWidth` 3) | 12 / 16 | blanco | igual |
| Megáfono (Campaign) | P3 | `lucideMegaphone` | 56 | `text-brand` | `dark:text-brand-light` |
| Bolsa de sangre (Donate Now) | P3 | **SVG propio** `bloodBagIcon` | 56 | `text-brand` | `dark:text-brand-light` |
| Gota con auricular (logotipo) | P1, P2 | **SVG propio** `logoDrop` | 96 | blanco (P1) / `text-brand` (P2) | igual |
| Gota de existencias | P3 | **SVG generado** `stockDrop(level)` | 64 | `text-brand` | igual |

Se verificó que todos los nombres de Lucide existen en `@ng-icons/lucide` 36.1.0. Habría que
añadirlos a `provideIcons`.

### 23.3. Recursos gráficos que hay que crear

| Recurso | Por qué no sirve una biblioteca | Especificación |
|---|---|---|
| `logoDrop` | Es el logotipo. | Una ruta `fill="currentColor"` con `fill-rule="evenodd"` para recortar el auricular. Así, un solo SVG sirve para P1 (blanco sobre rojo) y P2 (rojo sobre blanco) y se adapta al modo oscuro sin cambios. Proporción ≈ 5:8. |
| `bloodBagIcon` | Lucide no tiene bolsa de sangre. | Trazo `stroke="currentColor"`, `stroke-width="1.5"`, `fill="none"`, al estilo de Lucide (el megáfono de la referencia comparte trazo). |
| `stockDrop(level)` | Depende del nivel de existencias. | Contorno `stroke="currentColor"` + relleno `fill="currentColor"` recortado con un `<clipPath>` cuyo `<rect>` sube según `level`. `react-native-svg` y el parser de `NgIcon` admiten `clipPath`. El hueco interior es transparente, así que se ve el fondo en ambos modos. |

Ejemplo de la gota de existencias:

```ts
protected stockDrop(level: number): string {
  const top = 60 - (52 * level) / 100; // 0 % → vacía, 100 % → llena
  const drop = 'M24 4 C24 4 6 28 6 42 a18 18 0 0 0 36 0 C42 28 24 4 24 4Z';
  return (
    '<svg viewBox="0 0 48 64">' +
    '<defs><clipPath id="lvl"><rect x="0" y="' + top + '" width="48" height="64"/></clipPath></defs>' +
    '<path d="' + drop + '" fill="currentColor" clip-path="url(#lvl)"/>' +
    '<path d="' + drop + '" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '</svg>'
  );
}
```

Ningún icono se simula con caracteres de texto ("+", "−", "→", "✓").

---

## 24. Archivos reales del proyecto

### 24.1. Analizados (leídos)

| Archivo | Contenido relevante | Clases existentes |
|---|---|---|
| `package.json` | Dependencias y versiones (sección 1) | — |
| `metro.config.js` | `withTailwind(..., { input: './src/styles.css' })` | — |
| `app.json` | `orientation: portrait`, `userInterfaceStyle: automatic`, `supportsTablet: true` | — |
| `src/styles.css` | Tres `@import`; **sin tokens propios**. Se le añadió `@source not '../docs'` | — |
| `src/main.ts` | `mount` con `conditions`, `tokens`; `watchConditions` | — |
| `src/app/app.ts` | Raíz: `safe-area-provider`, `native-stack-outlet`; clase `platform-*` | — |
| `src/app/app.config.ts` | `globalStyles: tailwind`, router nativo, `provideIcons({ lucideHome, lucideSettings })` | — |
| `src/app/app.routes.ts` | `''` → `TabsMenu` → `home`, `settings` | — |
| `src/app/shared/tabs.shared.ts` | Pestañas nativas Home/Settings con iconos Lucide; cabecera oculta | — |
| `src/app/home/screens/home.screen.ts` | Marcador de posición | `text-2xl font-bold text-red-500` (**verificada**) |
| `src/app/settings/screens/settings.screen.ts` | Marcador de posición | `class=""` vacío |
| `src/app/user/screens/user.screen.ts` | Marcador de posición, **sin ruta** | `class=""` vacío |
| `src/app/app.test.ts` | Prueba de plantilla obsoleta | — |

No existen componentes reutilizables, tokens, fuentes ni selector de tema.

### 24.2. Correspondencia pantalla → archivo [propuesto]

| Pantalla | Ruta | Componente | Archivo | Acción |
|---|---|---|---|---|
| P1 Bienvenida | `/welcome` (fuera de las pestañas) | `WelcomeScreen` | `src/app/auth/screens/welcome.screen.ts` | Crear |
| P2 Tipo de sangre | `/onboarding/blood-type` (fuera de las pestañas) | `BloodTypeScreen` | `src/app/onboarding/screens/blood-type.screen.ts` | Crear |
| P3 Dashboard | `/home` (pestaña existente) | `HomeScreen` | `src/app/home/screens/home.screen.ts` | **Sustituir** el marcador de posición. `text-2xl font-bold text-red-500` se elimina: no forma parte del diseño, y `red-500` no es el rojo de marca. |
| Componentes compartidos | — | `Button`, `Choice`, `Checkbox`, `IconButton`, `StockDrop`, `ActionCard` | `src/app/shared/ui/*.ts` | Crear |
| Tokens | — | — | `src/styles.css` | Añadir el bloque `@theme` (9.4) |
| Iconos | — | — | `src/app/app.config.ts` | Añadir los iconos Lucide de 23.2 a `provideIcons` |

### 24.3. Dónde viven los estilos Light y Dark

Ambos modos están **en la misma cadena `class`** de cada elemento: la clase base es Light y la
`dark:` es Dark. No hay hoja de estilos separada para el modo oscuro. Los valores de color de los
tokens propios están en `src/styles.css` (`@theme`); los de `neutral-*` vienen de
`tailwindcss/theme.css`.

### 24.4. Tipos de clase

| Tipo | Ejemplos |
|---|---|
| Existentes y verificadas en el código | `text-2xl`, `font-bold`, `text-red-500` (home, a eliminar) |
| Estándar de Tailwind propuestas | `flex-1`, `px-6`, `rounded-lg`, `bg-neutral-950`, `shadow-lg`… |
| Personalizadas (tokens `@theme`) | `bg-brand`, `bg-brand-pressed`, `bg-brand-deep`, `text-brand-light`, `bg-control`, `text-ink-muted` |
| Del preset `@ng-native/tailwind` | `pt-safe`, `mt-safe`, `min-pt-safe-12`, `min-pb-safe-*`, `border-hairline` y las variantes `hover:`, `focus-visible:`, `disabled:`, `dark:` |
| Reutilizadas desde componentes compartidos | Las cadenas de la sección 14 |

---

## 25. Ejemplos de código

### 25.1. Pantalla 2 completa (`src/app/onboarding/screens/blood-type.screen.ts`)

```ts
import { Component, signal } from '@angular/core';
import { Pressable, ScrollView, Text, View } from '@ng-native/components';
import { NgIcon } from '@ng-native/icons';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { logoDrop } from '../../shared/ui/brand-art';

type Group = 'A' | 'B' | 'O' | 'AB';

const CHOICE =
  'items-center justify-center rounded-md bg-control text-ink-muted transition-colors ' +
  'hover:bg-neutral-200 aria-checked:bg-brand aria-checked:text-white aria-checked:hover:bg-brand-pressed ' +
  'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ' +
  'dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus-visible:ring-offset-neutral-950';

@Component({
  selector: 'blood-type-screen',
  imports: [NgIcon, Pressable, ScrollView, Text, View],
  providers: [provideIcons({ lucideCheck, lucideMinus, lucidePlus })],
  host: { class: 'flex-1' },
  template: `
    <scroll-view class="flex-1 bg-white dark:bg-neutral-950"
                 contentContainerClass="grow px-6 min-pt-safe-12 min-pb-safe-8">
      <view class="w-full max-w-md grow self-center">
        <ng-icon [svg]="logoDrop" [size]="96" class="self-center text-brand" />

        <text accessibilityRole="header"
          class="mt-8 text-center text-3xl leading-12 font-light text-black dark:text-neutral-50 md:text-4xl md:leading-14">
          Please pick your blood type
        </text>

        <text pressable accessibilityRole="link" (press)="openHelp()"
          class="mt-5 text-center text-base text-brand hover:opacity-70 dark:text-brand-light">
          Don't know about your blood type?
        </text>

        <view class="mt-5 gap-5" accessibilityRole="radiogroup" accessibilityLabel="Blood group">
          @for (row of rows; track $index) {
            <view class="flex-row gap-5">
              @for (group of row; track group) {
                <pressable accessibilityRole="radio" [aria-checked]="group === selected()"
                  (press)="selected.set(group)" [class]="choice + ' relative h-19 flex-1 md:h-24'">
                  <text class="text-2xl">{{ group }}</text>
                  @if (group === selected()) {
                    <ng-icon name="lucideCheck" [size]="16" [strokeWidth]="3" class="absolute right-2 top-2" />
                  }
                </pressable>
              }
            </view>
          }
        </view>

        <view class="mt-8 flex-row justify-center gap-16" accessibilityRole="radiogroup" accessibilityLabel="Rh factor">
          <pressable accessibilityRole="radio" accessibilityLabel="Positive" [aria-checked]="rh() === '+'"
            (press)="rh.set('+')" [class]="choice + ' size-12'">
            <ng-icon name="lucidePlus" [size]="24" />
          </pressable>
          <pressable accessibilityRole="radio" accessibilityLabel="Negative" [aria-checked]="rh() === '-'"
            (press)="rh.set('-')" [class]="choice + ' size-12'">
            <ng-icon name="lucideMinus" [size]="24" />
          </pressable>
        </view>

        <pressable accessibilityRole="checkbox" [aria-checked]="notify()" (press)="notify.set(!notify())"
          class="group mt-auto flex-row items-start gap-3 pt-8">
          <view class="mt-0.5 size-4.5 items-center justify-center rounded-sm border-2 border-neutral-400
                       group-aria-checked:border-brand group-aria-checked:bg-brand dark:border-neutral-500">
            @if (notify()) {
              <ng-icon name="lucideCheck" [size]="12" [strokeWidth]="3" class="text-white" />
            }
          </view>
          <text class="flex-1 text-sm leading-5 text-black dark:text-neutral-200">
            I want to receive notification about blood donation campaigns
          </text>
        </pressable>

        <pressable accessibilityRole="button" [disabled]="!selected()" (press)="finish()"
          class="mt-8 h-15 items-center justify-center rounded-lg bg-brand transition-colors hover:bg-brand-pressed
                 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
                 dark:focus-visible:ring-offset-neutral-950">
          <text class="text-lg font-semibold text-white">Finish</text>
        </pressable>
      </view>
    </scroll-view>
  `,
})
export class BloodTypeScreen {
  protected readonly logoDrop = logoDrop;
  protected readonly choice = CHOICE;
  protected readonly rows: Group[][] = [['A', 'B'], ['O', 'AB']];
  protected readonly selected = signal<Group | null>('B');
  protected readonly rh = signal<'+' | '-'>('+');
  protected readonly notify = signal(true);

  protected openHelp(): void {}
  protected finish(): void {}
}
```

> **Detección de clases:** Tailwind solo genera las clases que encuentra **literalmente** en el
> código. La constante `CHOICE` es un literal completo en el `.ts`, así que se detecta. **Nunca**
> se deben construir nombres de clase concatenando trozos (`'bg-' + color`).

### 25.2. Prueba (patrón de `@ng-native/testing`)

```ts
import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { BloodTypeScreen } from './blood-type.screen';

test('selecting a blood group marks it as checked', async () => {
  await render(BloodTypeScreen);
  const a = screen.getByRole('radio', { name: 'A' });

  await userEvent.setup().press(a);

  expect(a.props['accessibilityState']).toMatchObject({ checked: true });
});
```

### 25.3. Resto de pantallas

Los fragmentos de las secciones 10.2 (P1) y 12.2 (P3) son plantillas completas de cada bloque y
se montan dentro de un componente con la misma estructura que 25.1:
`host: { class: 'flex-1' }`, `imports` con los primitivos usados y `provideIcons` con los iconos
de Lucide.

---

## 26. Diferencias entre la referencia y la implementación

| # | Referencia | Implementación | Motivo |
|---|---|---|---|
| 1 | Guía de Tailwind con Vite | Tailwind v4 vía Metro + `@ng-native/tailwind` | El proyecto no usa Vite ni DOM. |
| 2 | Cuadrícula visual | Flexbox (`flex-row flex-wrap`, `flex-1`) | Grid no existe en nativo (se descarta al compilar). |
| 3 | Solo modo claro | Light + Dark completos | Requisito; `app.json` ya sigue al sistema. |
| 4 | Selección solo por color | Marca ✓ + `aria-checked` | WCAG 1.4.1. |
| 5 | Casilla desmarcada no mostrada | Borde `neutral-400` | Estado necesario. |
| 6 | Sin estados de pulsado o foco | `hover:` (pulsado), `focus-visible:` (anillo), `disabled:` | Usabilidad y accesibilidad. |
| 7 | Etiquetas de tarjeta `#323232` | `ink-muted` `#484848` | Un único gris secundario; la diferencia apenas se aprecia (9,15:1 frente a 12,6:1). |
| 8 | Texto principal `#000` | `text-black` | Coincide; en oscuro, `neutral-50`. |
| 9 | Gotas con paso de ≈ 93 pt | `w-1/4` (≈ 82 pt) | Columnas iguales que se adaptan a cualquier ancho. |
| 10 | Medidas exactas | Escala de 4 pt (±2–4 pt) | Las medidas de la imagen son estimaciones. |
| 11 | Poppins (probable) | Fuente del sistema hasta instalar Poppins | No está en el proyecto (6.4). |
| 12 | Sin barra de estado ni zonas seguras | `pt-safe`, `mt-safe`, `min-p*-safe-*` | Dispositivos reales con notch o isla dinámica e indicador de inicio. |
| 13 | Sin barra de pestañas | La pestaña Home ya existe | `tabs.shared.ts` envuelve el dashboard en pestañas nativas. Decidir si se mantienen o se sustituyen por el menú ☰. |
| 14 | Bolsa de sangre e ilustraciones propias | SVG a crear (23.3) | No hay equivalente en Lucide. |
| 15 | Marco, sombra y lienzo de la lámina | No se implementan | Son presentación. |

---

## 27. Referencias oficiales

### Tailwind CSS

- Instalación con Vite (no aplica aquí, ver 1.1): https://tailwindcss.com/docs/installation/using-vite
- Tema y `@theme`: https://tailwindcss.com/docs/theme
- Colores: https://tailwindcss.com/docs/colors
- Color de fondo: https://tailwindcss.com/docs/background-color
- Color del texto: https://tailwindcss.com/docs/text-color
- Tamaño de fuente: https://tailwindcss.com/docs/font-size
- Peso tipográfico: https://tailwindcss.com/docs/font-weight
- Altura de línea: https://tailwindcss.com/docs/line-height
- Padding: https://tailwindcss.com/docs/padding
- Margin: https://tailwindcss.com/docs/margin
- Ancho: https://tailwindcss.com/docs/width
- Ancho máximo: https://tailwindcss.com/docs/max-width
- Radio de borde: https://tailwindcss.com/docs/border-radius
- Grosor de borde: https://tailwindcss.com/docs/border-width
- Sombras: https://tailwindcss.com/docs/box-shadow
- Flex: https://tailwindcss.com/docs/flex
- Gap: https://tailwindcss.com/docs/gap
- Grid (no disponible en nativo): https://tailwindcss.com/docs/grid-template-columns
- Diseño responsive: https://tailwindcss.com/docs/responsive-design
- Modo oscuro: https://tailwindcss.com/docs/dark-mode
- Estados (hover, focus, aria, group): https://tailwindcss.com/docs/hover-focus-and-other-states
- Transiciones: https://tailwindcss.com/docs/transition-property
- Valores arbitrarios: https://tailwindcss.com/docs/adding-custom-styles

### Angular Native (prevalece sobre la de Tailwind en este proyecto)

- Documentación completa: https://ng-native.com/llms-full.txt
- Theming y Tailwind: https://ng-native.com/guide/theming
- Paquete Tailwind: https://ng-native.com/packages/tailwind
- Variantes (`dark:`, `hover:`, `focus-visible:`, `aria-*`, `group-*`): https://ng-native.com/packages/tailwind/variants
- Zona segura y hairlines: https://ng-native.com/packages/tailwind/utilities
- CSS soportado en nativo: https://ng-native.com/packages/fabric/supported-css
- Iconos: https://ng-native.com/packages/icons
- Fuentes: https://ng-native.com/packages/expo/fonts
- Esquema de color: https://ng-native.com/packages/device/color-scheme
- Pantalla y breakpoint `compact`: https://ng-native.com/packages/device/screen
- Scroll view: https://ng-native.com/packages/components/scroll-view
- Pressable: https://ng-native.com/packages/components/pressable
- Switch: https://ng-native.com/packages/components/switch
- Animación: https://ng-native.com/packages/components/animation
- Barra de estado: https://ng-native.com/packages/device/status-bar

### Accesibilidad

- WCAG 2.2, contraste mínimo 1.4.3: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
- WCAG 2.2, contraste sin texto 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast
- WCAG 2.2, uso del color 1.4.1: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color

---

## 28. Lista de verificación final

- [x] Se han analizado las tres pantallas (secciones 10, 11, 12).
- [x] Se han identificado los colores y sus HEX: medidos en zonas planas, estimados en texto (4.1).
- [x] Se ha documentado la tipografía (6), señalando que la familia es estimada.
- [x] Se han documentado dimensiones, espaciados, bordes y sombras (7, 8).
- [x] Cada componente tiene sus clases documentadas (10–12, 14).
- [x] Cada clase relevante tiene explicación individual (tablas en 10–12 y diccionario en 15).
- [x] Se indica la pantalla y el elemento de cada clase (16).
- [x] Estilos Light Mode documentados.
- [x] Estilos Dark Mode documentados (17).
- [x] Clases `dark:` explicadas individualmente (18).
- [x] Estrategia de activación del tema documentada; la actual está verificada (19).
- [x] Estados interactivos documentados, con sus conflictos de especificidad (20).
- [x] Comportamiento responsive incluido (21).
- [x] Accesibilidad revisada, con ratios calculados (22).
- [x] Compatibilidad con Tailwind 4.3.3 comprobada **compilando** todas las clases con el pipeline del proyecto.
- [x] Enlaces oficiales incluidos (27).
- [x] El archivo contiene las 28 secciones.
- [x] Guardado en `docs/design-system-tailwind.md`.

### Limitaciones del análisis

| Limitación | Impacto |
|---|---|
| Medidas obtenidas de una imagen de presentación | Dimensiones con ±2–4 pt; colores de texto aproximados por el antialiasing y la compresión WebP. |
| La familia tipográfica no se puede confirmar | Poppins es una estimación. |
| El modo oscuro no aparece en la referencia | Toda la paleta oscura es una propuesta. |
| Nada se ha probado en un simulador o dispositivo | La compilación de clases y la resolución de variantes se verificaron en Node. El aspecto final en iOS/Android (sombras, fuentes) no se ha visto. |
| `npm test` ya fallaba antes de este trabajo | `src/app/app.test.ts` renderiza `App` sin el router y busca un botón "Tapped 0 times" que no existe. No se ha modificado. `npm run typecheck` pasa. |
