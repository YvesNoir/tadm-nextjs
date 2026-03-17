# Auditoría de imágenes migradas

Fecha: 2026-03-17

## Resumen

- Posts con referencias remotas iniciales a `wp-content/uploads`: `68`
- Imágenes copiadas desde `images-downloaded` a `public/images/posts`: `93`
- Posts actualizados para usar rutas locales: `29`
- Posts que todavía conservan referencias remotas por falta de archivo local: `41`

## Posts corregidos en esta pasada

- `5-chanclas-para-hombre-para-disfrutar-del-verano`
- `adios-a-la-celulitis-descubre-los-secretos-para-combatirla`
- `botines-de-mujer-como-combinar-unos-botines-con-estilo`
- `boxers-masculinos`
- `cara-diamante-hombre`
- `combinar-zapatos-marrones`
- `como-elegir-un-centro-ideal-para-tus-unas-de-gel`
- `como-vestir-de-forma-elegante-y-sostenible`
- `como-vestir-para-una-boda-sin-traje`
- `como-vestirse-de-azul-mujer`
- `cosmetica-ecologica-coherente`
- `descubre-como-funciona-efimero-club-bolsos-de-lujo-por-suscripcion`
- `disenadores-de-moda-milan`
- `la-moda-sostenible-esta-en-pleno-auge`
- `la-rutina-de-limpieza-facial-que-mas-notara-tu-rostro`
- `los-tratamientos-de-estetica-mas-habituales-en-primavera`
- `metodo-curly-que-es`
- `mipelazo-com`
- `outfit-primavera-mujer`
- `perfumes-nicho-descubre-la-esencia-exclusiva-de-la-elegancia`
- `que-tipo-de-anteojos-de-sol-usar-segun-rostro`
- `recomendaciones-de-moda-para-la-noche-de-halloween`
- `ropa-deportiva-sostenible-un-compromiso-con-la-moda-y-el-planeta`
- `rostro-redondo-mujer`
- `serum-minimizador-de-poros`
- `tatuajes-para-mujer-en-el-brazo`
- `tatuajes-para-mujeres-en-la-espalda`
- `zapatillas-de-casa-que-son`
- `zapatillas-sin-cordones-como-combinar-sin-morir-en-el-intento`

## Posts que siguen con referencias remotas

- `cara-cuadrada`
- `coleccion-de-relojes-precision-y-estilo-en-bizzarro`
- `color-de-unas-para-vestido-verde`
- `combinar-pantalon-marron-hombre`
- `como-combinar-pantalon-beige`
- `como-combinar-pantalon-blanco`
- `como-combinar-pantalon-celeste`
- `como-combinar-pantalon-verde`
- `como-evitar-que-el-perfume-manche-la-ropa`
- `como-vestir-para-una-boda`
- `cortes-y-peinados-de-hombre`
- `cuales-son-los-tipos-de-plata-que-existen`
- `esclavas-de-oro-tradicion-y-estilo-que-perduran`
- `las-zapatillas-de-las-que-todo-el-mundo-habla-cetti`
- `look-de-invierno-de-mujer`
- `look-para-ano-nuevo`
- `looks-bautizo`
- `looks-con-bermudas-hombre`
- `looks-para-embarazadas`
- `manual-de-estilo-el-vestido-midi-cortefiel`
- `marcas-de-ropa-interior-de-mujer`
- `outfit-hombre`
- `outfit-pantalon-gris`
- `outfit-verano-hombre`
- `outfits-con-zapatillas`
- `pantalon-engomado`
- `perfume-carolina-herrera`
- `piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer-ef-bf-bc`
- `prendas-basicas-para-mujer`
- `psicologia-de-la-ropa`
- `rostro-ovalado`
- `tipos-de-cuerpo-de-mujer`
- `tipos-de-zapatos-para-mujeres-bajitas`
- `tips-de-moda-para-mujeres-gorditas`
- `traje-de-bano-mujer`
- `unas-para-vestido-negro`
- `vender-cosas-que-no-utilizas-o-ya-no-te-pones-y-ganar-dinero`
- `zapatos-para-jeans-mujer`
- `zapatos-para-vestidos`

## Nota

Los posts pendientes no fallaron por lógica de render, sino porque no existe todavía el archivo correspondiente en `images-downloaded` ni en `public/images/posts` con el nombre exacto referenciado por el Markdown.
