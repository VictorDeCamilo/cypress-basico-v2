Cypress.Commands.add('preencherCamposObrigatoriosESubmeter', function() {
    cy.get("input[name='firstName']").type('Victor')
    cy.get("input[name='lastName']").type('Camilo')
    cy.get('#email').type('victor@victor.com')
    cy.get("#open-text-area").type('Quero informações', { delay: 0})
    cy.get("button[type='submit']").click()
}) 