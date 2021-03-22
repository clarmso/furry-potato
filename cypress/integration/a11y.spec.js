// <reference types="Cypress" />

context("A11y", () => {
  before(() => {
    cy.visit("/");
  });

  it("has no critical accessibility violations on load", () => {
    cy.injectAxe();
    cy.checkA11y(null, {
      includedImpacts: ["critical"],
    });
  });
});
