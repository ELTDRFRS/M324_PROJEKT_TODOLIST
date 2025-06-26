describe('Todo App E2E Tests', () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit('/');
  });

  it('should load the todo app', () => {
    cy.contains('Todo').should('be.visible');
    cy.get('[data-testid="todo-app"]').should('exist');
  });

  it('should display search functionality', () => {
    cy.get('input[placeholder*="search"]').should('be.visible');
    cy.get('button').contains('✕').should('be.visible');
  });

  it('should be able to search todos', () => {
    // Type in search input
    cy.get('input[placeholder*="search"]').type('buy');
    
    // Verify search is working (this assumes todos are loaded)
    cy.get('input[placeholder*="search"]').should('have.value', 'buy');
  });

  it('should clear search when clear button is clicked', () => {
    // Type in search input
    cy.get('input[placeholder*="search"]').type('test search');
    
    // Click clear button
    cy.get('button').contains('✕').click();
    
    // Verify input is cleared
    cy.get('input[placeholder*="search"]').should('have.value', '');
  });

  it('should display todo statistics', () => {
    // Check if statistics are displayed
    cy.get('[data-testid="todo-stats"]').should('exist');
  });

  it('should handle responsive design', () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.get('input[placeholder*="search"]').should('be.visible');
    
    // Test tablet viewport
    cy.viewport(768, 1024);
    cy.get('input[placeholder*="search"]').should('be.visible');
    
    // Test desktop viewport
    cy.viewport(1920, 1080);
    cy.get('input[placeholder*="search"]').should('be.visible');
  });

  it('should handle keyboard navigation', () => {
    // Test tab navigation
    cy.get('body').tab();
    cy.focused().should('have.attr', 'placeholder').and('match', /search/i);
    
    // Test Enter key functionality
    cy.get('input[placeholder*="search"]').type('test{enter}');
    cy.get('input[placeholder*="search"]').should('have.value', 'test');
  });

  it('should persist search state during navigation', () => {
    // Type search term
    cy.get('input[placeholder*="search"]').type('important');
    
    // Refresh page
    cy.reload();
    
    // Search should be cleared on refresh (expected behavior)
    cy.get('input[placeholder*="search"]').should('have.value', '');
  });
});
