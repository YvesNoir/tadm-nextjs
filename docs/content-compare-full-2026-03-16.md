# Auditoria completa de contenido visible

Fecha: 2026-03-16

## Metodo

Se compararon los `74` articulos migrados usando:

- HTML visible local renderizado en Next (`.blog-content`)
- HTML visible del sitio WordPress (`[data-elementor-type="wp-post"]`)

Esto permite medir diferencias reales para el usuario final, no solo diferencias en el Markdown fuente.

## Resultado global

- `excelente`: `12`
- `muy_bien`: `49`
- `bien`: `10`
- `revision_manual`: `3`

## Conclusion ejecutiva

La migracion ya esta muy avanzada y es consistente.

- `61/74` articulos quedaron en estado `excelente` o `muy_bien`
- `10/74` estan `bien` y parecen requerir sobre todo ajustes de imagenes o bloques
- solo `3/74` requieren revision manual prioritaria

Esto indica que la mayor parte del contenido visible ya esta bien migrado.

## Articulos que requieren revision manual

### 1. `aesthetic`

- Diferencia fuerte de imagenes: `+45` en local respecto del remoto
- Diferencia de excerpt
- Diferencia visible de estructura

Interpretacion:
Este articulo fue retrabajado de forma importante y merece revision manual para decidir si se busca fidelidad al original o se mantiene la version nueva.

### 2. `tatuajes-para-mujeres-en-la-espalda`

- Diferencia de imagenes: `+20` en local
- H2 casi alineados
- Texto visible cercano

Interpretacion:
El problema principal parece ser visual y de assets, no de texto.

### 3. `piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer`

- Contenido visible muy cercano
- Titulo visible alineado
- La diferencia real esta en metadata/excerpt local, que fue limpiado a proposito

Interpretacion:
No es un problema estructural grave. Requiere decidir si se prioriza fidelidad literal del excerpt o limpieza editorial.

## Lectura del resultado

### Excelente

Articulos que quedaron practicamente calcados o con diferencias minimas.

### Muy bien

Articulos claramente aptos para migracion productiva, con diferencias menores de longitud, imagenes o formato.

### Bien

Articulos aceptables, pero con algun desvio visible que conviene revisar luego.
En general, estos casos parecen estar vinculados a:

- cantidad de imagenes
- orden de galerias
- pequenas diferencias de estructura o bloques

### Revision manual

Casos que merecen inspeccion individual antes de considerar cerrada la migracion.

## Estado de la capa de URLs

En paralelo a esta auditoria se valido que:

- `74/74` URLs raiz publicadas responden `200`
- las rutas viejas con categoria redirigen a la URL canonica raiz
- el alias historico raro de `piel-seca...` tambien responde correctamente

## Siguiente prioridad recomendada

1. Revisar manualmente:
   - `aesthetic`
   - `tatuajes-para-mujeres-en-la-espalda`
   - `piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer`
2. Hacer una pasada visual de articulos clasificados como `bien`
3. Despues de eso, pasar a frontend/diseno con bastante tranquilidad sobre la base editorial

