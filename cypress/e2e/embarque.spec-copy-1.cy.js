describe('Validación de filtro "Embarque" en la solicitud', () => {
  const url = 'https://www.selaski.com/public/reports/shared?token=cdeadfd7a31da5257e1d5f7af8hyuc5f0dfe94';  // URL de la página
  const embarqueValido = 'Prueba 1-01';  // Nombre del embarque válido
  const embarqueInvalido = 'Inexistente 123';  // Nombre del embarque no válido

  beforeEach(() => {
    cy.clearCookies();  // Limpiar cookies
    cy.clearLocalStorage();  // Limpiar almacenamiento local
    cy.visit(url);
  });

  it('Verificar PIN correcto', () => {
    const pinValido = '5569';  // PIN correcto para acceder a la plataforma

    // Asegurarnos de que los campos del PIN estén visibles antes de interactuar con ellos
    cy.get('#digit1').should('be.visible');  // Verifica que el primer campo del PIN esté visible
    cy.get('#digit2').should('be.visible');  // Verifica que el segundo campo del PIN esté visible
    cy.get('#digit3').should('be.visible');  // Verifica que el tercer campo del PIN esté visible
    cy.get('#digit4').should('be.visible');  // Verifica que el cuarto campo del PIN esté visible

    // Ingresar el PIN válido
    cy.get('#digit1').type(pinValido[0]);
    cy.get('#digit2').type(pinValido[1]);
    cy.get('#digit3').type(pinValido[2]);
    cy.get('#digit4').type(pinValido[3]);
    cy.contains('Ingresar').click();

    // Esperar que desaparezca el mensaje de "Cargando..."
    cy.get('span', { timeout: 20000 }).should('not.have.text', 'Cargando...');

    // Interceptamos la solicitud que envía los filtros
    cy.intercept('POST', '/api/reports/public/2/*').as('sendRequest'); // Cambia la URL según corresponda
    
    // Activar el panel de filtros
    cy.contains('Filtros').click();

    // ------------------------ 1. Desplegar el dropdown correcto "Embarque" ------------------------
    cy.get('div')
      .contains('Seleccionar', { timeout: 10000 })  // Busca el dropdown con "Seleccionar"
      .parent()  // Asegura que estamos dentro del contenedor correcto
      .find('button')  // Encontramos el botón dentro del contenedor
      .click({ force: true });  // Hacemos clic para abrir el dropdown

    // Esperamos que el dropdown se despliegue correctamente
    cy.get('div.select-menu', { timeout: 10000 }).should('be.visible');

    // Esperar un poco más para que se cargue todo el contenido del dropdown
    cy.wait(1000);

    // ------------------------ 2. Seleccionar "Embarque" ------------------------
    cy.get('p')
      .contains('Embarque', { timeout: 10000 })  // Buscamos el texto "Embarque" dentro de <p>
      .should('be.visible')  // Verificamos que "Embarque" es visible
      .click({ force: true });  // Hacemos clic en la opción "Embarque"

    // ------------------------ 3. Escribir "Prueba 1-01" en el campo de búsqueda y presionar Enter ------------------------
    cy.get('input[type="text"]') // Asegurando que seleccionamos el campo de texto adecuado
      .first() // Selecciona el primer campo de texto
      .type(`${embarqueValido}{enter}`, { timeout: 10000 });  // Escribe "Prueba 1-01" y presiona Enter

    // ------------------------ 4. Validar si "Prueba 1-01" aparece en los resultados ------------------------
    cy.contains(embarqueValido, { timeout: 10000 })  // Buscamos el nombre del embarque válido
      .should('be.visible')  // Verificamos que el embarque válido es visible
      .then(($embarcque) => {
        if ($embarcque.length > 0) {
          cy.log(`El embarque "${embarqueValido}" fue encontrado en los resultados.`);
        } else {
          cy.log(`El embarque "${embarqueValido}" NO fue encontrado en los resultados.`);
        }
      });

    // ------------------------ 5. Escribir un embarque no válido en el campo de búsqueda y presionar Enter ------------------------
    cy.get('input[type="text"]') // Asegurando que seleccionamos el campo de texto adecuado
      .first() // Selecciona el primer campo de texto
      .clear()  // Limpiar el campo de búsqueda
      .type(`${embarqueInvalido}{enter}`, { timeout: 10000 });  // Escribe el embarque no válido y presiona Enter

    // ------------------------ 6. Intentar encontrar el embarque no válido y mostrar un mensaje si no existe ------------------------
    try {
      cy.contains(embarqueInvalido, { timeout: 10000 }).should('be.visible');
    } catch (error) {
      cy.log(`El embarque "${embarqueInvalido}" NO existe en los resultados.`);
    }

    // Limpiar cache y datos de sesión después de la prueba
    cy.clearCookies();  // Limpiar cookies
    cy.clearLocalStorage();  // Limpiar almacenamiento local
  });
});
