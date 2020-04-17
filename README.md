# Express Boilerplate

Este proyecto lo puedes utilizar como base para construir tus sistemas.

El proyecto ya viene configurado con algunos paquetes comunes que utilizamos.

## Instalación

1. Descarga las dependencias del proyecto
```shell
npm install

npm i knex
npm install lo que haga falta
mssql, mysql, mysql2, pg, etc

tener una base de datos

```

2. Copia el `template` de las variables de entorno y configuralas según tu ambiente.
```shell
cp .env.example .env
```

3. Ejecuta las migraciones del sistema
```shell
knex migrate:latest
```


## Ejecución
```
node server.js
```
