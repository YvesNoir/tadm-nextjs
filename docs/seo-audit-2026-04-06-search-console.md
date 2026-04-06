# Auditoría Search Console - 2026-04-06

Propiedad analizada:
- `sc-domain:tuasesordemoda.com`

Períodos comparados:
- actual: `2026-03-10` a `2026-04-06`
- anterior: `2026-02-10` a `2026-03-09`

Fuente:
- Search Console API

## Resumen ejecutivo

Sí hay una baja real en Search Console.

Comparativo del sitio:
- clics: `82` vs `132` (`-37.9%`)
- impresiones: `41,883` vs `74,476` (`-43.8%`)
- CTR: `0.196%` vs `0.177%` (`mejora leve`)
- posición media: `9.54` vs `8.33` (`empeora 1.21 posiciones`)

Conclusión principal:
- la caída no parece explicarse por CTR
- el problema principal es la baja de impresiones
- además hay una pérdida moderada de posiciones en varias URLs importantes

## URLs más afectadas

### 1. `/cara-diamante-hombre`

Datos:
- clics: `16` vs `37` (`-21`)
- impresiones: `3,878` vs `7,642` (`-3,764`)
- CTR: `0.41%` vs `0.48%`
- posición: `5.62` vs `4.25`

Lectura:
- sigue siendo una de las URLs más fuertes del sitio
- perdió mucha visibilidad y también empeoró ranking
- sigue teniendo CTR bajo para el volumen que mueve

### 2. `/outfit-hombre`

Datos:
- clics: `1` vs `9` (`-8`)
- impresiones: `3,536` vs `8,212` (`-4,676`)
- CTR: `0.028%` vs `0.11%`
- posición: `7.97` vs `6.00`

Lectura:
- es uno de los casos más delicados
- la página perdió mucha demanda visible y además empeoró snippet/rendimiento
- el CTR sigue siendo extremadamente bajo

### 3. `/como-vestir-para-una-boda`

Datos:
- clics: `3` vs `12` (`-9`)
- impresiones: `989` vs `4,173` (`-3,184`)
- CTR: `0.30%` vs `0.29%`
- posición: `7.33` vs `4.43`

Lectura:
- hay caída fuerte de visibilidad y pérdida clara de ranking
- acá puede haber mezcla de estacionalidad e intención menos satisfecha

### 4. `/como-combinar-pantalon-beige`

Datos:
- clics: `1` vs `4` (`-3`)
- impresiones: `1,893` vs `5,976` (`-4,083`)
- CTR: `0.053%` vs `0.067%`
- posición: `6.06` vs `7.50`

Lectura:
- la página no perdió posición; incluso mejora algo
- la baja parece venir mucho más por menor demanda visible o menor cobertura de queries

### 5. `/cara-cuadrada`

Datos:
- clics: `2` vs `6` (`-4`)
- impresiones: `1,042` vs `2,070` (`-1,028`)
- CTR: `0.19%` vs `0.29%`
- posición: `3.55` vs `3.74`

Lectura:
- la posición se sostiene
- el problema acá es más de CTR y de menor volumen de impresiones

## Patrón general detectado

### 1. La caída es sobre todo de impresiones

Observado:
- el sitio pierde `43.8%` de impresiones
- el CTR incluso sube levemente en agregado

Interpretación:
- no parece un problema aislado de titles/metas
- hay menos visibilidad total en búsquedas donde antes el sitio aparecía más

### 2. Hay deterioro leve pero consistente de posiciones en URLs clave

Observado:
- varias páginas importantes pierden entre 1 y 3 posiciones promedio
- los casos más claros son `cara-diamante-hombre`, `outfit-hombre` y `como-vestir-para-una-boda`

Interpretación:
- no parece una desindexación masiva
- sí parece una pérdida de competitividad en clusters concretos

### 3. El cluster de "rostros" sigue siendo fuerte, pero está cediendo

Observado:
- `cara-diamante-hombre`
- `cara-cuadrada`
- `rostro-ovalado`
- `tipos-de-rostros-de-hombre`

Interpretación:
- sigue siendo el principal activo SEO del sitio
- pero necesita una nueva pasada editorial para recuperar CTR, freshness y cobertura semántica

### 4. `outfit-hombre` está particularmente débil

Observado:
- mantiene volumen alto de impresiones
- CTR casi nulo
- empeora posición media

Interpretación:
- la intención dominante parece muy específica (`casual formal`, `formal casual`)
- la URL puede estar demasiado amplia o diluida para esa intención
- también puede estar compitiendo internamente con contenidos más recientes del cluster hombre

### 5. El frente técnico no muestra un bug crítico evidente, pero hay una señal para vigilar

Observado:
- `https://www.tuasesordemoda.com/cara-diamante-hombre` responde `200`
- `https://www.tuasesordemoda.com/cara-diamante-hombre/` redirige con `308`
- `https://www.tuasesordemoda.com/hombre/cara-diamante-hombre` redirige con `301`
- el canonical HTML apunta a la versión raíz sin slash

Interpretación:
- hoy la normalización de URL parece correcta
- aun así, en Search Console aparecen filas históricas separadas con y sin slash
- esto no parece la causa principal de la baja actual, pero conviene revisar cobertura/canonical en GSC

## Queries ilustrativas

No son suficientes por sí solas para explicar toda la caída, pero muestran el patrón:

- `cortes rostro diamante hombre`
  - impresiones: `342` vs `641`
  - posición: `4.03` vs `2.50`
- `outfit hombre casual formal`
  - en la ventana de 90 días sigue con muchas impresiones y CTR muy bajo
- `outfit formal casual hombre`
  - sigue posicionando, pero con CTR casi nulo
- `rostro redondo`
  - mucha impresión con CTR muy bajo

## Hipótesis de causa

Separadas entre observación e inferencia:

### Observado

- baja fuerte de impresiones sitio-wide
- pérdida moderada de posiciones en URLs líderes
- CTR muy bajo en varias páginas que rankean bien

### Inferencia

- parte de la baja puede venir de menor demanda estacional en algunos temas
- parte viene de snippets poco competitivos en queries de alto volumen
- parte viene de contenido que ya no está resolviendo tan fino la intención dominante
- en `outfit-hombre` puede haber canibalización o reparto de señales con piezas nuevas del cluster hombre

## Prioridad recomendada

### Alta

1. `cara-diamante-hombre`
2. `outfit-hombre`
3. `como-vestir-para-una-boda`
4. `cara-cuadrada`

### Media

5. `como-combinar-pantalon-beige`
6. `rostro-ovalado`
7. `color-de-unas-para-vestido-verde`
8. `unas-para-vestido-negro`

## Próximos pasos recomendados

1. Rehacer `title` y `meta description` de las 4 URLs prioritarias usando la query dominante exacta.
2. Revisar y reforzar el primer bloque de respuesta de esas páginas para atacar mejor intención y CTR.
3. Auditar interlinking interno del cluster hombre:
   - `outfit-hombre`
   - `smart-casual-hombre`
   - `outfit-oficina-hombre`
   - `looks-con-bermudas-hombre`
   - `como-vestir-para-una-boda`
4. Revisar en Search Console cobertura/canonical de URLs con y sin slash para confirmar que no haya residuos de indexación duplicada.
5. Hacer una segunda pasada editorial sobre el cluster de rostros para recuperar CTR y mejorar freshness percibida.

## Recomendación operativa

La mejor siguiente tarea no es tocar todo el sitio.

Conviene hacer un lote corto y medible:
- optimizar `cara-diamante-hombre`
- optimizar `outfit-hombre`
- optimizar `como-vestir-para-una-boda`
- proponer interlinking entre esas piezas y los artículos nuevos del cluster hombre
