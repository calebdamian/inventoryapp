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
- Productos
<img width="1234" height="531" alt="image" src="https://github.com/user-attachments/assets/b8c6b2fa-4c09-4aa4-ba23-10f61bad9914" />
<img width="1240" height="468" alt="image" src="https://github.com/user-attachments/assets/98a61899-fbd8-413c-85e2-4685dd7731b6" />
<img width="1257" height="590" alt="image" src="https://github.com/user-attachments/assets/20c203a1-c2fe-4bb9-9950-7cfafe2c1eb1" />

- Transacciones
- <img width="1256" height="623" alt="image" src="https://github.com/user-attachments/assets/ed726450-e738-476f-a5aa-c3c3f66300d9" />
<img width="1233" height="490" alt="image" src="https://github.com/user-attachments/assets/12af8c91-2da9-452a-9ff3-0bc1108eddb2" />

