---
name: frontend-blog
description: Usa esta skill cuando el trabajo sea mejorar el diseño y la experiencia del frontend del blog sin comprometer SEO, rendimiento ni la estructura editorial. Sirve para trabajar home, listados, artículos, navegación, responsive y consistencia visual del sitio.
---

# Frontend Blog

Esta skill se usa para mejorar la capa visual del sitio una vez que migración y SEO están razonablemente estables.

## Objetivo

- Mejorar diseño, legibilidad y jerarquía visual.
- Mantener coherencia con la identidad de "Tu Asesor de Moda".
- No romper rendimiento ni arquitectura del contenido.

## Contexto del proyecto

- Títulos principales con Abril Fatface
- Blog editorial de moda
- Categorías principales: `hombre` y `mujer`
- Las galerías deben mostrar 3 columnas fijas salvo restricciones claras de mobile

## Cuándo usarla

- Cuando se trabaja home, listados o detalle de artículo
- Cuando se ajusta responsive o navegación
- Cuando se mejora tipografía, espaciado o composición visual
- Cuando se migra de una UI funcional a una UI más editorial

## Flujo

1. Identificar la pantalla o componente afectado.
2. Revisar el patrón visual existente.
3. Proponer una mejora concreta sin romper SEO ni navegación.
4. Validar:
   - responsive
   - legibilidad
   - contraste
   - peso de imágenes
   - compatibilidad con contenido real

## Reglas

- No tocar slugs ni redirects.
- No hacer rediseños que oculten contenido importante para SEO.
- Preservar patrones existentes cuando el cambio no justifique ruptura visual.
- Usar `next/image` y assets optimizados cuando aplique.

## Salidas esperadas

- Componentes mejorados
- Ajustes de layout y estilo
- Recomendaciones visuales de alto impacto y bajo riesgo

## Archivos clave

- `app/page.tsx`
- `app/[category]/page.tsx`
- `app/[category]/[post]/page.tsx`
- `app/components`
- `app/globals.css`

