# Fondos WebP para el Header

Coloca los siguientes archivos WebP en esta carpeta (`public/svg/header/`) con **exactamente** estos nombres:

| Archivo WebP requerido | Menú dropdown |
|------------------------|---------------|
| `bgtiendadaluz.webp` | Tienda |
| `bg manifiesto.webp` | Alkimya |
| `bg filosofia y rpoposito.webp` | Raices Da Luz (Filosofía) |
| `bg origen.webp` | Raices Da Luz (Raíces) |
| `bg procesos holisticos.webp` | Procesos |
| `bgBlog.webp` | Blog |
| `bg programa7.webp` | Membresía |

## Cómo convertir

1. Extrae la imagen PNG embebida de cada SVG (Illustrator, Inkscape o script).
2. Convierte a WebP con [Squoosh](https://squoosh.app/) o ImageMagick:
   ```bash
   magick input.png -resize 1200x800 -quality 85 output.webp
   ```
3. Guarda cada WebP con el nombre exacto de la tabla arriba.

## Nota

Si no existen los archivos WebP, el navegador mostrará un fondo vacío hasta que los añadas.
