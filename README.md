API Rest con Express, proyecto desarrollado con motivos de aprendizaje, seguimiento del curso de [Node.js](https://www.youtube.com/playlist?list=PLUofhDIg_38qm2oPOV-IRTTEKyrVBBaU7) dictado por midudev. A continuación se encuentra un resumen de los pasos para ejecutar correctamente este proyecto, dependencias e información sobre REST y CORS.

### Fundamentos REST (arquitectura de software):
  - Recursos (resources): Todo es considerado un recurso (entidades o colecciones) y cada recurso es identificado con una URL
  - Verbos HTTP: Definen las operaciones que se pueden realizar con los recursos (CRUD)
  - Representaciones: El cliente debería poder decidir la representación del recurso (JSON, XML, HTML, etc.), la representación debe estar separada del recurso.
  - StateLess: El cliente debe enviar toda la información necesaria para procesar la request, el servidor no debe mantener ningún estado sobre el cliente entre solicitudes. Ej: El servidor no debe guardar información sobre cuántas llamadas se han hecho, paginación, etc. (esa info debe ir en la URL)
  - Interfaz uniforme: la interfaz entre cliente y servidor debe ser consistente y uniforme para todas las interacciones.
  - Separación de conceptos: Permite que cliente y servidor evolucionen de forma separada.

### Diferencias entre POST, PUT y PATCH:
  - La diferencia principal radica en la dempotencia (propiedad de realizar una acción varias veces con el mismo resultado de haberlo hecho una vez)
  - POST: Crea un nuevo elemento/recurso en el servidor (url: /recurso) (no es idempotente, siempre se crea un nuevo recurso)
  - PUT: Actualizar totalmente un elemento ya existente o crearlo si no existe. (url: /recurso/:id) (es idempotente)
  - PATCH: Actualizar parcialmente un elemento/recurso (url: /recurso/:id) (es idempotente)
  - Normalmente PUT y PATCH son idempotentes, en principio se "pierde" esto cuando se incluye en el recurso alguna propiedad como updatedAt, que cambia cada vez que se actualiza el recurso

### CORS (Cross Origin Resource Sharing):
  - Es un mecanismo de seguridad del navegador que restringe las solicitudes HTTP entre diferentes dominios
  - Esto no funciona en los servidores, solo en navegadores
  - Esto se arregla desde el backend agregando la cabecera correcta
  - El error de CORS también puede presentarse en métodos simples (GET/HEAD/POST) complejos (PUT/PATCH/DELETE) (CORS PRE-Flight), para arreglarlo se le debe agregar "options" con los métodos permitidos, que es una petición previa al servidor para saber si puede realizar dichas operaciones
  - Una solución también es instalar el middleware cors (pnpm install cors -E), pero hay que ser cuidadoso con esto ya que por defecto permite todos los orígenes (*) y eso no puede tener sentido para algunas cosas de nuestra app.

### Instalaciones:
  - pnpm init (inicia proyecto de Node.js)
  - pnpm install express -E (instala una versión exacta de express, remueve ^)
  - pnpm install standard -D (eslint como dependencia de desarrollo)
  - pnpm install zod -E (para validaciones)

### Otras dependencias:
  - const crypto = require('node:crypto'): crypto.randomUUID para la creación de id (Universal Unique Identifier)

### Configuraciones package.json_
  - Agregar "eslintConfig": {
    "extends": "standard"
  }
  - Remover los "^" al inicio de las versiones

### Ejecución:
  - node --watch ./app.js

### Extensiones:
 - REST Client (Huachao Mao): se pueden hacer solicitudes por medio de una archivo con extensión .http (en este caso es api.http), para evitar usar otras aplicaciones fuera de VSC como postman, bruno, etc.

### Otros:
  - npx servor ./web (accede a la carpeta web y sirve las páginas dentro en una url)