// <reference types="Cypress" />

context("Snapshots", () => {
  beforeEach(() => {
    cy.fixture("getProducts1.json").as("getProducts1");
    cy.fixture("getProductsMany.json").as("getProductsMany");
  });

  it("display no products", () => {
    cy.intercept("GET", "/product", []);
    cy.visit("/");
    cy.matchImageSnapshot("no_products");
  });

  it("display multiple products", function () {
    cy.intercept("GET", "/product", { fixture: "getProductsMany.json" });
    cy.visit("/");
    cy.contains("h1", "Productotron 3000").should("be.visible");
    cy.contains("h2", "Product Catalog").should("be.visible");
    cy.matchImageSnapshot("multiple_products");
  });
});
