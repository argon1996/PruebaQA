Prueba Técnica QA - Cypress
Descripción
Automatización de pruebas con Cypress para validar el proceso de autenticación con PIN y búsqueda de embarques. El flujo incluye la autenticación, filtrado por 'Embarque' y validación de los datos.
Requisitos
- **Node.js**: Instalar desde [nodejs.org](https://nodejs.org/).
- **Cypress**: Herramienta para la automatización de pruebas.
Instalación
1. Clonar el repositorio:
   ```bash
   git clone <url_del_repositorio>
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
Ejecución de pruebas
Para abrir Cypress y ejecutar los tests:
```bash
npx cypress open
```
O para ejecutarlas en modo headless:
```bash
npx cypress run
```
Archivos importantes
- **cypress/e2e/embarque.spec.cy.js**: Test automatizado.
- **cypress/fixtures/datos.json**: Datos de prueba (PIN, URL, embarque).
