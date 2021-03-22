// <reference types="Cypress" />

import StatusCodes from "http-status-codes";
import {
  createName,
  createDescription,
  createImgUrl,
  createPrice,
  createInventory,
} from "../helper/utilities";

context("REST API /products", () => {
  let numProducts;

  beforeEach(() => {
    cy.request("GET", "/products").should((response) => {
      numProducts = response.body.length;
    });
  });

  context("GET", () => {
    it("get a list of products", () => {
      cy.request("GET", "/products").should((response) => {
        expect(response.status).equal(StatusCodes.OK);
        expect(response.body).to.be.a("array");
        const product = response.body[0];
        expect(product).to.have.keys([
          "id",
          "name",
          "description",
          "imgUrl",
          "price",
          "inventory",
        ]);
        [product.id, product.price, product.inventory].forEach((value) => {
          expect(value).to.be.a("number");
        });
        [product.name, product.description, product.imgUrl].forEach((value) => {
          expect(value).to.be.a("string");
        });
      });
    });
  });

  context("PATCH", () => {
    it("update a product", () => {
      const id = 1;
      const name = createName();
      const description = createDescription();
      const imgUrl = createImgUrl();
      const price = createPrice();
      const inventory = createInventory();
      cy.request("PATCH", `/products/${id}`, {
        name,
        description,
        imgUrl,
        price,
        inventory,
      }).should((response) => {
        expect(response.status).equal(StatusCodes.OK);
        expect(response.body.id).equal(id);
        expect(response.body.name).equal(name);
        expect(response.body.description).equal(description);
        expect(response.body.imgUrl).equal(imgUrl);
        expect(response.body.price).equal(price);
        expect(response.body.inventory).equal(inventory);
      });
      // No new product is added. The existing product is updated to the new values.
      cy.request("GET", "/products").should((response) => {
        expect(response.body.length).equal(numProducts);
        expect(Cypress._.find(response.body, { id })).to.deep.include({
          id,
          name,
          description,
          imgUrl,
          price,
          inventory,
        });
      });
    });
  });

  context("POST", () => {
    it("create a new product", () => {
      const name = createName();
      const description = createDescription();
      const imgUrl = createImgUrl();
      const price = createPrice();
      const inventory = createInventory();
      cy.request("POST", "/products", {
        name,
        description,
        imgUrl,
        price,
        inventory,
      }).should((response) => {
        expect(response.status).equal(StatusCodes.CREATED);
        expect(response.body).to.have.property("id");
        expect(response.body.name).equal(name);
        expect(response.body.description).equal(description);
        expect(response.body.imgUrl).equal(imgUrl);
        expect(response.body.price).equal(price);
        expect(response.body.inventory).equal(inventory);
      });
      // A new product is added with the values specified.
      cy.request("GET", "/products").should((response) => {
        expect(response.body.length).equal(numProducts + 1);
        expect(Cypress._.find(response.body, { name })).to.deep.include({
          name,
          description,
          imgUrl,
          price,
          inventory,
        });
      });
    });
  });

  context("DELETE", () => {
    let name, description, imgUrl, price, inventory, id;
    beforeEach(() => {
      name = createName();
      description = createDescription();
      imgUrl = createImgUrl();
      price = createPrice();
      inventory = createInventory();
      cy.request("POST", "/products", {
        description,
        imgUrl,
        inventory,
        name: name,
        price,
      }).then((response) => {
        id = response.body.id;
      });
      cy.request("GET", "/products").should((response) => {
        numProducts = response.body.length;
      });
    });

    it("delete a product", () => {
      cy.request("DELETE", `/products/${id}`).should((response) => {
        expect(response.status).equal(StatusCodes.OK);
        expect(response.body).equal("");
      });
      // A product is actually deleted.
      cy.request("GET", "/products").should((response) => {
        expect(response.body.length).equal(numProducts - 1);
        expect(Cypress._.find(response.body, { id })).to.be.undefined;
      });
    });
  });
});
