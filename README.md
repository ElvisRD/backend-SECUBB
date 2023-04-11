# SECUBB backend

## Contruido con

- [NodeJs](https://nodejs.org/es)
- [Javascript](https://www.javascript.com/)
- [Socket.io](https://socket.io/)
- [Prisma](https://www.prisma.io/)

## Primeros pasos

A continuacion se encuentras las intrucciones que permitiran hacer correr el proyecto en su ordenador.

### Prerequisitos

- [Node v18.13.0](https://nodejs.org/es/)

### Instalación

Clonar el repositorio
```bash
git clone https://github.com/ElvisRD/backend-SECUBB.git
```
Ingresa a la carpeta
```bash
cd backend-SECUBB
```
Crear un archivo .env dentro de la carpeta prisma con las siguientes variables:
```bash
DATABASE_URL='' # url de conexión a la base de datos.
EMAIL='' # correo electronico del que se envian los correos.
PASSWORD='' # contraseña del correo electronico del que se envian los correos.
PORT='' # puerto abierto para la comunicación con el front.
```
Instalar dependencias
```bash
npm install
```
Crear tablas en la base de datos
```bash
npx prisma db push
```
Iniciar proyecto
```bash
npm run dev
```







