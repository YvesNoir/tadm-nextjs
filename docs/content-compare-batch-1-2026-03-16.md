# Comparacion de contenido visible - Lote 1

Fecha: 2026-03-16

## Metodo

Se comparo:

- HTML visible local renderizado en Next (`.blog-content`)
- HTML visible del sitio WordPress (`[data-elementor-type="wp-post"]`)

No se comparo el Markdown crudo como fuente final, sino el contenido realmente visible para el usuario.

## Lote auditado

- `outfit-hombre`
- `color-de-unas-para-vestido-verde`
- `outfit-primavera-mujer`
- `combinar-zapatos-marrones`
- `15-ideas-originales-a-buen-precio-para-regalar-esta-primavera`

## Resultados

### 1. 15-ideas-originales-a-buen-precio-para-regalar-esta-primavera

Estado: muy alineado

- Titulo visible: coincide
- Excerpt: coincide
- Imagenes: coincide
- H2: coincide
- Diferencia de texto: minima

Conclusion:
Este articulo esta practicamente migrado de forma fiel.

### 2. outfit-hombre

Estado: bastante alineado, con diferencias en assets

- Excerpt: coincide
- H2: coincide
- Texto visible: cercano
- Imagenes: local `73`, WordPress `77`

Conclusion:
La estructura principal y el contenido visible estan cerca. Hay que revisar faltantes o diferencias de algunas imagenes/galerias.

### 3. color-de-unas-para-vestido-verde

Estado: alineado

- Excerpt: coincide
- Imagenes: local `33`, WordPress `33`
- H2: coincide
- Texto visible: cercano, aunque con algo mas de contenido local

Conclusion:
Migracion muy aceptable. Conviene revisar solo diferencias de texto residual o bloques extra.

### 4. outfit-primavera-mujer

Estado: aceptable, con diferencias de estructura visual

- Excerpt: coincide
- Texto visible: muy cercano
- Imagenes: local `9`, WordPress `5`
- H2: local `2`, WordPress `3`

Conclusion:
El contenido esta cerca, pero este articulo fue retrabajado. Hay que revisar si las galerias y el orden de bloques siguen la misma logica que WordPress.

### 5. combinar-zapatos-marrones

Estado: bastante alineado, con leve diferencia de assets

- Excerpt: coincide
- H2: coincide
- Texto visible: cercano
- Imagenes: local `45`, WordPress `49`

Conclusion:
La migracion es buena, pero faltaria revisar algunas imagenes o bloques visuales para acercarlo mas al original.

## Nota sobre titulos

La comparacion de contenido visible es mejor referencia que el `title` SEO del documento.

En varios articulos:

- el `title` SEO de WordPress incluye mayusculas, emojis, keywords y anio
- pero el contenido visible del articulo esta mucho mas cerca de lo que hoy renderiza Next

Por eso no conviene usar el `title` del documento como unica referencia de fidelidad del contenido.

## Conclusiones del lote

- `1/5` articulos esta practicamente calcado
- `3/5` articulos estan bien migrados pero con diferencias de imagenes o bloques
- `1/5` articulo (`outfit-primavera-mujer`) merece revision manual de estructura porque fue retrabajado

## Siguiente lote recomendado

- `looks-bautizo`
- `cara-diamante-hombre`
- `zapatos-para-jeans-mujer`
- `disenadores-de-moda-milan`
- `piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer`

