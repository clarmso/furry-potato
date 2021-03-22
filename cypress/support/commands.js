// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "@testing-library/cypress/add-commands";

Cypress.Commands.add(
  "fillInfo",
  ({
    header = "Create Product",
    name,
    description,
    imgUrl,
    price,
    inventory,
  } = {}) => {
    cy.contains("div:visible", header).should("exist");
    cy.contains("div:visible", header)
      .parentsUntil("div.ant-modal")
      .last()
      .within(() => {
        {
          name ? cy.findByTestId("name").clear().type(name) : null;
        }
        {
          description
            ? cy.findByTestId("description").clear().type(description)
            : null;
        }
        {
          imgUrl ? cy.findByTestId("imgUrl").clear().type(imgUrl) : null;
        }
        {
          price !== undefined
            ? cy.findByTestId("price").clear().type(price)
            : null;
        }
        {
          inventory !== undefined
            ? cy.findByTestId("inventory").clear().type(inventory)
            : null;
        }
      });
  }
);

Cypress.Commands.add(
  "fillCreateProductModal",
  ({ name, description, imgUrl, price, inventory } = {}) => {
    cy.fillInfo({
      header: "Create Product",
      name,
      description,
      imgUrl,
      price,
      inventory,
    });
  }
);

Cypress.Commands.add(
  "fillEditProductModal",
  ({ name, description, imgUrl, price, inventory } = {}) => {
    cy.fillInfo({
      header: "Edit Product",
      name,
      description,
      imgUrl,
      price,
      inventory,
    });
  }
);

Cypress.Commands.add(
  "verifyProductCard",
  ({ name, description, imgUrl, price, inventory } = {}) => {
    cy.contains("div.ant-card-meta-title", name)
      .parentsUntil("div.ant-card")
      .last()
      .parent()
      .scrollIntoView()
      .within(() => {
        {
          name ? cy.contains(name).should("be.visible") : null;
        }
        {
          description ? cy.contains(description).should("be.visible") : null;
        }
        {
          imgUrl
            ? cy
                .get("img[alt='Product image']")
                .should("be.visible")
                .should("have.attr", "src")
                .should("include", imgUrl)
            : null;
        }
        {
          price !== undefined
            ? cy.contains(`Price: \$${price}`).should("be.visible")
            : null;
        }
        {
          inventory !== undefined
            ? cy.contains(`Inventory: ${inventory}`).should("be.visible")
            : null;
        }
      });
  }
);

Cypress.Commands.add("clickPencilIcon", (name) => {
  cy.contains("div.ant-card-meta-title", name)
    .parentsUntil("div.ant-card")
    .parent()
    .first()
    .find("svg[data-icon='edit']")
    .scrollIntoView()
    .click();
  cy.get("div.ant-modal").contains("div", "Edit Product").should("be.visible");
});

Cypress.Commands.add(
  "verifyProductModal",
  ({ name, description, imgUrl, price, inventory } = {}) => {
    cy.clickPencilIcon(name);
    cy.contains("div:visible", "Edit Product")
      .parentsUntil("div.ant-modal")
      .last()
      .within(() => {
        {
          name ? cy.findByTestId("name").should("have.value", name) : null;
        }
        {
          description
            ? cy.findByTestId("description").should("have.value", description)
            : null;
        }
        {
          imgUrl
            ? cy.findByTestId("imgUrl").should("have.value", imgUrl)
            : null;
        }
        {
          price !== undefined
            ? cy.findByTestId("price").should("have.value", `\$${price}`)
            : null;
        }
        {
          inventory !== undefined
            ? cy.findByTestId("inventory").should("have.value", inventory)
            : null;
        }
      });
    cy.contains("button", "Cancel").click();
  }
);

Cypress.Commands.add("clickTrashCanIcon", (name) => {
  cy.contains("div.ant-card-meta-title", name)
    .parentsUntil("div.ant-card")
    .parent()
    .find("svg[data-icon='delete']")
    .scrollIntoView()
    .click();
});
