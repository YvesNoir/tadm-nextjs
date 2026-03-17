# Configuración de Claude Code

## Idioma
- Responder siempre en español/castellano
- Usar terminología técnica en español cuando sea posible

## Proyecto
- Este es un blog de moda llamado "Tu Asesor de Moda"
- Migración de WordPress a Next.js
- Categorías principales: Hombre y Mujer
- Se utiliza TypeScript, Next.js 14, y Tailwind CSS

## Comandos útiles
- `npm run dev` - Servidor de desarrollo
- `node scripts/blog-extractor.js [URL]` - Extraer artículo de WordPress

## Notas importantes
- Siempre verificar categorías de artículos para evitar duplicados entre "hombre" y "mujer"
- Mantener consistencia en el estilo de código existente
- Usar fuente Abril Fatface para títulos principales
- Galerías de imágenes deben mostrar 3 columnas fijas

## Instrucciones para Claude futuro
- **SIEMPRE** revisar los commits recientes con `git log --oneline -10` y `git show --stat HEAD` al inicio de cada sesión
- Los commits contienen el historial completo de trabajo realizado y decisiones técnicas
- Usar `git show [commit-hash]` para ver detalles específicos de cambios importantes
- Los mensajes de commit incluyen contexto sobre las implementaciones y mejoras realizadas