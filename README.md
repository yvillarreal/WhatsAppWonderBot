# WhatsAppWonderBot 🤖

WhatsAppWonderBot es un bot de WhatsApp automatizado que te permite programar mensajes y realizar diversas tareas automáticamente. ¡Simplifica tus comunicaciones!

## Autor
- Autor: [Yamil Villarreal](https://github.com/yvillarreal)

## Características

- 📋 Lista de comandos disponibles.
- 📅 Programa mensajes con frecuencias diarias o semanales.
- 📜 Visualiza mensajes programados.
- ✏️ Edita mensajes programados.
- ❌ Elimina mensajes programados.
- 🖼️ Guarda archivos multimedia del host.

## Uso

### Comandos Disponibles
- 📋 `/comandos` - Muestra una lista de comandos disponibles.
- 📜 `/ver_programados` - Muestra mensajes programados.
- 📅 `/programar [frecuencia] [HH:mm] [dd-MM-yyyy] [número] [mensaje]` - Programa un mensaje. Ejemplo: `/programar daily 13:45 05-12-2023 505XXXXXX Hola, soy un mensaje :)`.
- ✏️ `/editar_programado [ID] [HH:mm] [mm]` - Edita un mensaje programado. Ejemplo: `/editar_programado 1 14:30 Nuevo mensaje`.
- ❌ `/eliminar_programado [ID]` - Elimina un mensaje programado por ID. Ejemplo: `/eliminar_programado 1`.

### Mensajes de Bienvenida
- El bot enviará un mensaje de bienvenida cuando te comuniques con él por primera vez o envíes palabras clave como "hola" o "comandos".

## Instalación

1. Clona este repositorio.
2. Instala las dependencias usando `npm install`.
3. Ejecuta la aplicación con `npm start`.

## Requisitos

- Node.js
- Cuenta de WhatsApp Business API

## Contribuciones

¡Contribuciones son bienvenidas! Si deseas mejorar este proyecto, por favor crea un PR y estaré encantado de revisarlo.

## Licencia

Este proyecto está bajo la Licencia MIT. Puedes ver los detalles en el archivo [LICENSE](LICENSE).
