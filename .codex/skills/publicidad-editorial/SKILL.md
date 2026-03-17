---
name: publicidad-editorial
description: Usa esta skill cuando el trabajo sea definir, revisar o implementar una estrategia manual de publicidad para el blog sin romper la experiencia editorial, el SEO ni el rendimiento. Sirve para decidir dónde insertar anuncios en home, listados y artículos según longitud, intención del contenido, densidad visual y experiencia mobile.
---

# Publicidad Editorial

Esta skill se usa para monetizar el blog de forma manual y controlada, evitando formatos invasivos y preservando la calidad editorial.

## Objetivo

- Insertar anuncios donde tengan sentido editorial y comercial.
- Evitar que el sitio se vea saturado o pierda legibilidad.
- Mantener una experiencia cuidada en mobile y desktop.
- No comprometer SEO, Core Web Vitals ni navegación.

## Cuándo usarla

- Cuando se quiera reemplazar Auto ads por ubicaciones manuales.
- Cuando se definan bloques publicitarios para artículos, home o listados.
- Cuando haya que revisar si un artículo está sobrecargado o submonetizado.
- Cuando se quiera adaptar la publicidad al tipo de contenido.

## Principios

- No colocar anuncios en el primer viewport de un artículo.
- No interrumpir el hero de la home ni la portada editorial.
- No poner anuncios entre título y excerpt.
- No cortar una galería o bloque visual importante con publicidad.
- Priorizar artículos largos y evergreen antes que home o categorías.
- En mobile, ser más conservador que en desktop.

## Estrategia base recomendada

### Artículos

- Cortos:
  - `0` o `1` anuncio máximo
- Medios:
  - `1` anuncio después de los primeros 2-3 bloques de contenido
- Largos:
  - `1` anuncio después de la introducción
  - `1` anuncio hacia la mitad
  - `1` anuncio antes de relacionados o footer del artículo

### Home

- No poner anuncios arriba del hero.
- Si se monetiza, hacerlo después del primer bloque fuerte de artículos.
- Mantener una densidad baja para no degradar percepción de marca.

### Listados y categorías

- Evitar anuncios antes del primer bloque de cards.
- Si se agregan, hacerlo cada cierto número de artículos y con spacing generoso.
- No mezclar demasiados bloques patrocinados con navegación principal.

## Criterios por contenido

- Moda / outfits / peinados / uñas / ideas:
  - suelen tolerar mejor anuncios dentro del artículo
- Contenido más premium o de marca:
  - usar menos anuncios
- Artículos cortos o visuales:
  - evitar saturación

## Flujo

1. Medir longitud y estructura del artículo.
2. Identificar zonas naturales de pausa.
3. Decidir cantidad máxima de anuncios según tipo de contenido.
4. Definir ubicaciones desktop y mobile.
5. Verificar que no se rompa la lectura ni el ritmo visual.
6. Validar impacto en rendimiento y UX.

## Reglas

- No insertar anuncios dentro del markdown del artículo salvo decisión explícita.
- Preferir componentes reutilizables de anuncio.
- Mantener separación clara entre contenido y publicidad.
- Si hay duda entre una ubicación agresiva y una más limpia, elegir la más limpia.

## Archivos clave

- `app/[category]/[post]/page.tsx`
- `app/page.tsx`
- `app/blog/page.tsx`
- `app/components`
- `app/globals.css`
