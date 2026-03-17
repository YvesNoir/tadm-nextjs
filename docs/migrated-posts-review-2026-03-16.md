# Revision inicial de posts migrados

Fecha: 2026-03-16

## Base auditada

- Posts locales auditados: `74`

## Hallazgos automaticos

### Cobertura general

- Sin `seoTitle`: `0`
- Sin `seoDescription`: `0`
- Sin `excerpt`: `0`
- Sin categorias: `0`
- Con categorias invalidas: `0`
- Covers rotas: `0`

### Problemas detectados

1. Post sin `coverImage`
- `15-ideas-originales-a-buen-precio-para-regalar-esta-primavera`

2. Slug sospechoso por codificacion
- `piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer-ef-bf-bc`

3. Post mezclado entre categorias principales
- `como-vestir-para-una-boda`
  Categorias actuales: `mujer`, `hombre`

## Distribucion actual por categorias

- `mujer`: `35`
- `hombre`: `10`
- `recomendaciones`: `29`
- `zapatos`: `15`
- `belleza`: `7`
- `salud`: `2`

## Riesgos

- La mezcla `mujer` + `hombre` puede generar ambiguedad de ruta y canibalizacion.
- El slug con basura de codificacion debe normalizarse si se quiere preservar la URL historica.
- Falta al menos una `coverImage` en contenido ya migrado.

## Proximo paso recomendado

1. Revisar el post `como-vestir-para-una-boda`
2. Normalizar el slug de `piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer`
3. Completar la cover faltante
4. Empezar comparacion literal de contenido contra WordPress para los articulos mas importantes

