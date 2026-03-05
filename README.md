# Ev. técnica CN

Proyecto fullstack con backend en .NET y frontend en Angular. Incluye dos APIs (Productos y Transacciones) que se conectan a una base de datos MySQL.

---

## Requisitos

Para poder ejecutar el proyecto en tu máquina necesitas tener instalado lo siguiente:

- **.NET 8 SDK** 
- **Node.js** 
- **MySQL** 


---

## Ejecución del backend

El backend está formado por dos proyectos que deben ejecutarse por separado (cada uno en su propia terminal o proceso).

### 1. Base de datos

MySQL  en ejecución y de que exista la base de datos `inventorydb`.

### 2. ProductsAPI 

1. Abre una terminal y entra en la carpeta del proyecto de productos:
   ```bash
   cd backend/ProductsAPI
   ```
2. Ejecuta la API:
   ```bash
   dotnet run
   ```
   Por defecto quedará disponible en **http://localhost:5134**. 

### 3. TransactionsAPI 

1. En **otra** terminal, entra en la carpeta de transacciones:
   ```bash
   cd backend/TransactionsAPI
   ```
2. Ejecuta la API:
   ```bash
   dotnet run
   ```
   Por defecto quedará disponible en **http://localhost:5045**. 
---

## Ejecución del frontend

1. Abrir una terminal y entra en la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instalar las dependencias 
   ```bash
   npm install
   ```
3. Arrancar el servidor de desarrollo:
   ```bash
   npm start
   ```
4. Abre el navegador en la URL que indique la consola (normalmente **http://localhost:4200**).

Para que la aplicación funcione bien, las dos APIs del backend (ProductsAPI y TransactionsAPI) deben estar ejecutándose en los puertos 5134 y 5045 respectivamente.
---
