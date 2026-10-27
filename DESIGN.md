---
name: Blood App
description: Registro familiar privado de tipos de sangre y cédulas, legible de un vistazo.
colors:
  brand: "#d70032"
  brand-pressed: "#b0002a"
  brand-deep: "#8e0022"
  brand-light: "#ff5c7a"
  control: "#f2f2f2"
  ink-muted: "#484848"
  ink: "#000000"
  ink-subtle: "#737373"
  screen: "#f5f5f5"
  surface: "#ffffff"
  avatar: "#e5e5e5"
  blood-chip-bg: "#ffe2e2"
  blood-chip-text: "#c10007"
  ink-dark: "#fafafa"
  ink-muted-dark: "#d4d4d4"
  screen-dark: "#0a0a0a"
  surface-dark: "#171717"
  control-dark: "#262626"
  control-pressed-dark: "#404040"
  blood-chip-text-dark: "#ffa2a2"
typography:
  title:
    fontFamily: "System (San Francisco en iOS, Roboto en Android)"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "System (San Francisco en iOS, Roboto en Android)"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "System (San Francisco en iOS, Roboto en Android)"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: 1.43
  label:
    fontFamily: "System (San Francisco en iOS, Roboto en Android)"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.43
  section:
    fontFamily: "System (San Francisco en iOS, Roboto en Android)"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0.025em"
  chip:
    fontFamily: "System (San Francisco en iOS, Roboto en Android)"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.33
rounded:
  md: "6px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  gutter: "24px"
  section: "32px"
components:
  user-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "16px"
  user-row-pressed:
    backgroundColor: "#f5f5f5"
  avatar:
    backgroundColor: "{colors.avatar}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: "48px"
  blood-chip:
    backgroundColor: "{colors.blood-chip-bg}"
    textColor: "{colors.blood-chip-text}"
    typography: "{typography.chip}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  grouped-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "8px"
  settings-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: "56px"
    padding: "8px 16px"
  icon-button:
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: "44px"
---

# Design System: Blood App

## Overview

**Creative North Star: "The Wallet Card"**

Blood App se diseña como la tarjeta de emergencia que se lleva en la cartera: un dato impreso grande, en el que se confía a primera vista. Cada pantalla responde a una persona con prisa (en urgencias, frente a un formulario, con una mano) que necesita leer un tipo de sangre y una cédula en segundos. Todo lo demás calla para que ese dato hable.

La densidad es baja y ordenada: filas blancas sobre un fondo gris muy claro, una columna con margen lateral de 24 pt y el cromo nativo de cada sistema (barra de título grande, pestañas, pila de navegación). La marca no es un decorado; es un solo carmesí (#d70032) que aparece solo donde algo importa: la acción destructiva y el foco. La selección la dibujan los controles nativos de cada sistema. El tipo de sangre lleva su propio tono rojo suave en un bloque al inicio de la fila, y es el único dato de la fila que tiene color.

La tipografía es la del sistema (San Francisco en iOS, Roboto en Android) porque la app sigue las convenciones de cada plataforma. El documento de referencia `docs/design-system-tailwind.md` proponía Poppins; no está instalada y queda como decisión abierta, no como parte del sistema.

**Key Characteristics:**
- Un dato protagonista por fila: el tipo de sangre, grande, en un bloque rojo suave al inicio.
- Un solo carmesí de marca, escaso, para foco y acciones destructivas.
- Cromo nativo de iOS y Android; nada de barras ni pestañas dibujadas a mano.
- Profundidad tonal casi plana: sombra mínima en claro, borde de un píxel en oscuro.
- Claro y oscuro completos, siguiendo al sistema por defecto.

## Colors

Neutros sin tinte más un único carmesí de marca; el rojo suave de la pastilla de sangre es la única otra nota de color.

### Primary
- **Carmesí de cartera** (brand): anillo de foco, texto, icono y tinte de la acción destructiva (al 10 % como fondo de su icono). Contraste con blanco 5,3:1.
- **Carmesí pulsado** (brand-pressed): un control de marca mientras se pulsa.
- **Carmesí nocturno** (brand-deep): fondos de marca a pantalla completa en oscuro, para no deslumbrar de noche.
- **Carmesí legible** (brand-light): texto o icono rojo sobre fondos oscuros, donde el carmesí de marca solo da 3,7:1.

### Secondary
- **Pastilla de sangre** (blood-chip-bg / blood-chip-text, oscuro: blood-chip-text-dark sobre rojo 900 al 40 %): exclusiva del tipo de sangre. Es un rojo de la escala de Tailwind, distinto a propósito del carmesí de marca: informa, no acciona.

### Neutral
- **Gris de sala** (screen / screen-dark): fondo de toda pantalla.
- **Papel** (surface / surface-dark): filas, tarjetas agrupadas.
- **Gris de control** (control / control-dark): controles propios en reposo; pulsado pasa a neutral 200 en claro y control-pressed-dark en oscuro.
- **Tinta** (ink / ink-dark): títulos y texto principal.
- **Tinta apagada** (ink-muted / ink-muted-dark): encabezados de sección, etiquetas de controles.
- **Tinta suave** (ink-subtle): cédula y metadatos de la fila, el chevron.

### Named Rules
**The One Red Rule.** El carmesí de marca solo marca foco o peligro. Si un elemento es rojo y no es ninguna de las dos cosas, sobra. Una preferencia, como el tema, nunca se pinta de carmesí.

**The Blood Speaks Rule.** El tipo de sangre es el único dato de una fila con color propio, y nunca se comunica solo por color: el texto (A+, O-) siempre está escrito y anunciado.

## Typography

**Body Font:** fuente del sistema (San Francisco en iOS, Roboto en Android), sin respaldo declarado: en nativo `font-family` admite un solo nombre.

**Character:** neutra y nativa; la jerarquía sale del peso y del tamaño, no de una voz tipográfica propia.

### Hierarchy
- **Título de pantalla:** lo dibuja la barra nativa con título grande (`largeTitle`). No se reproduce en la plantilla.
- **Title** (500, 16 pt, 1,5): nombre y apellidos en la fila, una línea con elipsis.
- **Body** (400, 16 pt, 1,5): texto de filas de ajustes.
- **Label** (500, 14 pt): etiquetas de botones.
- **Meta** (300, 14 pt): cédula y datos secundarios de la fila.
- **Section** (500, 12 pt, mayúsculas, tracking 0,025 em): encabezados de grupo en ajustes, al estilo de las listas agrupadas de iOS.
- **Tipo de sangre** (600, 20 pt): el grupo y su signo en el bloque de sangre, al mismo tamaño.

### Named Rules
**The Dynamic Type Rule.** Ningún tamaño fijo impide que el texto escale con la configuración del sistema; una fila crece en alto antes que recortar el tipo de sangre.

## Layout

Una sola columna con margen lateral de 24 pt en todas las pantallas. Los títulos, pestañas y navegación son nativos (`<app-bar>`, `native-tabs-outlet`, `native-stack-outlet`); las pantallas empujadas ocultan la barra de pestañas.

Ritmo en escala de 4 pt: 12 pt entre filas de la lista, 16 pt dentro de la fila y entre el bloque de sangre y el texto, 4 pt entre nombre y cédula, 8 pt entre encabezado de sección y su tarjeta, 32 pt entre secciones. Una pantalla con título grande tiene su `<scroll-view>` como primer elemento, sin nada alrededor, con `contentInsetAdjustmentBehavior="automatic"`: así el contenido empieza bajo la barra y el título se pliega al desplazar. El margen de 24 pt va en `contentContainerClass`.

Las listas cortas usan `<scroll-view>`; si el registro crece, la lista pasa a `<virtual-list>`. En iPad la columna se mantiene; no hay todavía un diseño de dos paneles.

## Elevation & Depth

Profundidad tonal, casi plana. En claro, las superficies blancas se separan del fondo gris por el tono, y las tarjetas agrupadas de ajustes añaden una sombra muy difusa con tinte pizarra. En oscuro no hay sombra: cada nivel sube un paso en la escala neutral (pantalla → tarjeta → control → pulsado) y las tarjetas llevan un borde de un píxel físico.

### Shadow Vocabulary
- **Halo de tarjeta** (`0 10px 15px -3px rgb(15 23 42 / 0.05), 0 4px 6px -4px rgb(15 23 42 / 0.05)`): tarjetas agrupadas de ajustes en claro. Nada más lleva sombra.

### Named Rules
**The Tone-Not-Shadow Rule.** En oscuro la separación la dan el tono y el borde hairline, nunca una sombra.

## Shapes

Esquinas suaves y pocas formas: 12 pt en filas y tarjetas, 6 pt en iconos de fila, 12 pt en el bloque de sangre, círculo completo en botones de icono. Los divisores son de un píxel físico (`hairline`), sangrados para alinearse con el texto de la fila.

## Components

### User Row (componente característico)
Firme y escaneable: una fila es una persona.
- **Forma:** tarjeta blanca de esquinas suaves (12 pt), padding 16 pt.
- **Contenido:** bloque de tipo de sangre a la izquierda (mínimo 64 × 56 pt, 12 pt de radio, colores de la pastilla de sangre, grupo y signo en 20 pt semibold, negativo con el signo menos `−` y no un guion), nombre en Title, debajo la cédula en Meta con cifras tabulares, chevron a la derecha. El tipo de sangre es lo primero que se lee: no hay avatar de iniciales.
- **Texto grande:** el nombre ocupa hasta dos líneas. Desde los tamaños de accesibilidad (`fontScale` ≥ 1,6) la fila se apila: bloque de sangre y chevron arriba, nombre sin límite de líneas y cédula a todo el ancho debajo, para que los 10 dígitos no se corten nunca.
- **Oscuro:** superficie neutral 900 con borde hairline neutral 800, como las tarjetas agrupadas.
- **Pulsado:** el fondo baja a neutral 100 (oscuro: neutral 800).
- **Accesibilidad:** rol botón con el hint «Abre la ficha»; la etiqueta dice nombre y apellidos, el tipo de sangre en palabras («tipo de sangre A B negativo», letras separadas y signo como «positivo» o «negativo») y la cédula dígito a dígito.
- **Vacío:** texto centrado "No hay usuarios todavía" en Tinta suave.

### Chips
- **Bloque de sangre:** el tipo de sangre en la fila de persona; fondo rojo suave con texto rojo oscuro, en oscuro rojo 900 al 40 % con texto rojo 300. Solo para el tipo de sangre.

### Segmented Control
- **Nativo:** el `Picker` de `@expo/ui` con `pickerStyle="segmented"` (`UISegmentedControl` en iOS, botones segmentados de Material en Android), dentro de un `<ui-host>` en una tarjeta agrupada con padding de 12 pt. Nunca uno dibujado a mano.
- **Contenido:** solo etiquetas de texto, sin iconos; colores, selección, tamaño y anuncio del lector de pantalla los pone el sistema.
- **Valor:** un `UiPickerOption` por opción; seguir al sistema es `'system'` en el picker y `null` en `ThemePreference`.
- **Android:** la fila de Material se dibuja con `ui-single-choice-segmented-button-row` a todo el ancho (`fillMaxWidth`) y segmentos de peso igual, porque la de `ui-picker` se queda corta.
- **Paleta en Android:** el `ui-host` recibe `seedColor` = brand, y Material genera sus tonos a partir de él: el segmento seleccionado es un rosa pálido de la marca, no el carmesí lleno, así que la Regla del Rojo Único se mantiene. Sin semilla, Android usaría el color del fondo de pantalla (Material You) y el control no pertenecería a la app.
- **Tema del control:** el `ui-host` recibe `colorScheme` con el esquema que muestra la app; sin él, Compose sigue al dispositivo y, con "Oscuro" forzado, pinta segmentos claros ilegibles sobre la tarjeta oscura.

### Cards / Containers
- **Tarjeta agrupada:** papel, 12 pt, halo de tarjeta en claro; en oscuro, superficie neutral 900 con borde hairline neutral 800.
- **Encabezado de grupo:** Section en tinta apagada, sangrado 16 pt.
- **Pie de grupo:** texto de 14 pt en tinta apagada (oscuro: neutral 300), sangrado 16 pt, 8 pt bajo la tarjeta; explica qué hace el grupo o qué promete. No usa tinta suave: a 14 pt sobre gris de sala no llega a 4,5:1.

### Settings Row
- **Forma:** mínimo 56 pt de alto, padding 8 × 16 pt, icono en baldosa de 32 pt y 6 pt de radio.
- **Destructiva:** baldosa con carmesí al 10 % e icono carmesí; texto en Body y carmesí (oscuro: carmesí legible), como las filas destructivas de iOS. Siempre pide confirmación con el diálogo nativo (`Dialogs.confirm` con `destructive`) y lleva un `accessibilityHint` que dice que no se puede deshacer.

### Navigation
- **Barra:** nativa, título grande; acciones a la derecha como botones de icono de 44 pt, circulares, con fondo negro al 5 % (oscuro: blanco al 10 %) al pulsar.
- **Pestañas:** nativas de cada sistema, con iconos Lucide: Personas (Users) y Ajustes (Settings).

## Do's and Don'ts

### Do:
- **Do** usar los tokens `brand`, `control` e `ink-muted` de `src/styles.css`, no rojos ni grises de la escala de Tailwind que se le parezcan.
- **Do** declarar cada superficie en ambos modos en la misma lista de clases (`bg-white dark:bg-neutral-900`).
- **Do** mantener las zonas táctiles en 44 pt como mínimo.
- **Do** dejar que la barra, las pestañas y la pila sean las nativas de cada plataforma.
- **Do** usar iconos Lucide con un trazo coherente, a 18–24 pt.

### Don't:
- **Don't** usar `red-500` o `red-600` en lugar de `brand`, ni pintar una selección de carmesí: la selección es del control nativo.
- **Don't** poner `--font-sans: Poppins` sin registrar antes la fuente: en nativo cae en silencio a la del sistema.
- **Don't** usar sombras en modo oscuro.
- **Don't** usar el carmesí de marca para decorar; ni para el tipo de sangre, que tiene su bloque propio.
- **Don't** comunicar el tipo de sangre o la selección solo con color.
