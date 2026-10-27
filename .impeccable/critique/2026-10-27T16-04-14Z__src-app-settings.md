---
target: module src/app/settings
total_score: 18
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 2
target_identity: "file:/Users/javier/Documents/angular/blood-app/src/app/settings"
timestamp: 2026-10-27T16-04-14Z
slug: src-app-settings
closed: true
---
Method: design review only (detector not applicable, native platform)

| # | Heurística | Puntos | Problema |
|---|---|---|---|
| 1 | Visibilidad | 2 | theme signal arranca en null; sin estado pulsado; versión no visible |
| 2 | Mundo real | 3 | — |
| 3 | Control | 2 | Borrar sin confirmación diseñada |
| 4 | Consistencia | 2 | Carmesí vs azul de pestañas; segmentado a mano; hover/focus-visible muertos |
| 5 | Prevención | 1 | Acción irreversible sin (press) ni peso |
| 6 | Reconocimiento | 3 | — |
| 7 | Flexibilidad | n/a | Dos ajustes |
| 8 | Estética | 3 | Jerarquía invertida |
| 9 | Recuperación | 1 | Sin deshacer ni copia |
| 10 | Ayuda | 1 | Nada sobre privacidad local |
| Total | | 18/36 | Aceptable |

Especificidad: intercambiable; falta la promesa "privado por defecto".

Prioridades:
- [P0] Borrar todos los datos: sin (press), sin confirmación nativa, sin accessibilityHint, texto no destructivo. /impeccable harden
- [P1] Jerarquía invertida: segmento carmesí lleno domina; usar segmentado nativo/neutro. /impeccable quieter
- [P1] Estado de tema no sincronizado ni persistido. /impeccable harden
- [P2] Falta pie de privacidad bajo "Datos y privacidad". /impeccable clarify
- [P2] Sin estado pulsado (solo hover:), h-12 fijo frágil con Dynamic Type. /impeccable adapt

Menores: clases hover/focus-visible muertas; mb-20 mágico oculta versión; sangría desalineada.
