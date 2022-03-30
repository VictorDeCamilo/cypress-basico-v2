/// <reference types = "Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {

    beforeEach(() => {
        cy.visit('./src/index.html')
    });

    it('verifica o título da aplicação', () => {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')     
    });

    it('preenche os campos obrigatórios e envia o formulário', () => {
        cy.get("input[name='firstName']").type('Victor')
        cy.get("input[name='lastName']").type('Camilo')
        cy.get('#email').type("victor@victor.com")
        cy.get("#open-text-area").type('Gostaria de solicitar informações sobre os cursos')
        cy.get("button[type='submit']").click()
        cy.get(".success").should('be.visible')
    });

    it('preenche os campos obrigatórios e envia o formulário sem delay na escrita do formulário', () => {
        cy.get("input[name='firstName']").type('Victor')
        cy.get("input[name='lastName']").type('Camilo')
        cy.get('#email').type("victor@victor.com")
        cy.get("#open-text-area").type('Gostaria de solicitar informações sobre os cursos de eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', { delay: 0})
        cy.get("button[type='submit']").click()
        cy.get(".success").should('be.visible')
    });

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get("input[name='firstName']").type('Victor')
        cy.get("input[name='lastName']").type('Camilo')
        cy.get('#email').type("victor,victor.com")
        cy.get("#open-text-area").type('teste')
        cy.get("button[type='submit']").click()
        cy.get(".error").should('be.visible')
    });

    it('campo telefone não aceita valores não-numéricos', () => {
        cy.get('#phone').type('Olá, Mundo!')
        cy.get('#phone').should('be.empty')
    });

    it('exibe mensagem de erro quando o telefone se torna obrigatório, mas não é preenchido antes do envio do formulário', () => {
        cy.get("input[name='firstName']").type('Victor')
        cy.get("input[name='lastName']").type('Camilo')
        cy.get('#email').type("victor@victor.com")
        cy.get("#open-text-area").type('Gostaria de solicitar informações sobre os cursos de eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', { delay: 0})
        cy.get('#phone-checkbox').click()
        cy.get("button[type='submit']").click()
        cy.get(".error").should('be.visible')
    });

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get("input[name='firstName']").type('Victor').should('have.value', 'Victor').clear().should('have.value', '')
        cy.get("input[name='lastName']").type('Camilo').should('have.value', 'Camilo').clear().should('have.value', '')
        cy.get('#email').type("victor@victor.com").should('have.value', 'victor@victor.com').clear().should('have.value', '')
        cy.get('#phone').type('91121222').should('have.value', '91121222').clear().should('have.value', '')
    });

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.get("button[type='submit']").click()
        cy.get(".error").should('be.visible')
    });

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.preencherCamposObrigatoriosESubmeter()
        cy.get('.success').should('be.visible')
    });

    it('seleciona um produto (YouTube) por seu texto usando select', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    });

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    });

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    });

    it('marca um tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    });

    //essa função wrap é muito boa para otimizar e limpar código, importantíssimo.
    /*o each faz o get passar por cada um dos itens e recebe uma função que recebe como argumentos cada um dos elementos que foi retornado por esse cy.get.
    Então, na primeira iteração, vai pegar o primeiro elemento, na segunda, o segundo e assim em diante. Daí usamos o cy.wrap para empacotar cada um deles e mandar comandos do cypress,
    como check, should...*/
    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function($radio){
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })

    });

     it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
     });

     it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('input[id="phone-checkbox"]')
            .check()        
        cy.preencherCamposObrigatoriosESubmeter()
        cy.get(".error").should('be.visible')
     })

     it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json')
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
     })
     
     it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json', { action : "drag-drop"})
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
     });

     it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('@sampleFile')
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
     });


     /*Se um elemento do tipo âncora (a) possui o atributo target com o valor _blank, quando clicado, 
     obrigatóriamente o valor do atributo href será aberto em uma nova aba. Este é o compartamento padrão em qualquer navegador.*/
     it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
     });

     it('acessa a página da política de privacidade removendo o target e então clicanco no link', () => {
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
       cy.contains('Talking About Testing').should('be.visible')
     });
   
});

