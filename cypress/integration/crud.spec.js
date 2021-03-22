// <reference types="Cypress" />

import faker from "faker";
import StatusCodes from "http-status-codes";

context("CRUD operations", () => {
  const createName = () => {
    return faker.lorem.words(Cypress._.random(3, 5));
  };

  const createDescription = () => {
    return faker.lorem.words(Cypress._.random(4, 10));
  };

  const createImgUrl = () => {
    const category = [
      "abstract",
      "animals",
      "business",
      "cats",
      "city",
      "food",
      "nightlife",
      "fashion",
      "people",
      "nature",
      "sports",
      "technics",
      "transport",
    ];
    const randomIndex = Cypress._.random(0, category.length);
    return faker.image.imageUrl(400, 200, category[randomIndex]);
  };

  const createPrice = () => {
    return faker.random.number({ min: 0.1, max: 100, precision: 0.01 });
  };

  const createInventory = () => {
    return Cypress._.random(0, 100);
  };

  beforeEach(() => {
    cy.intercept("GET", "/products").as("getProducts");
    cy.intercept("DELETE", "/products/*").as("deleteProducts");
    cy.intercept("PATCH", "/products/*").as("patchProducts");
    cy.intercept("POST", "/products").as("postProducts");
  });

  context("Create", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.contains("h1", "Productotron 3000").should("be.visible");
      cy.contains("h2", "Product Catalog").should("be.visible");
      cy.findByTestId("create_product").scrollIntoView().click();
      cy.get("div.ant-modal")
        .contains("div", "Create Product")
        .should("be.visible");
    });

    it('click "Cancel" to close the modal without creating new product', () => {
      const name = createName();
      cy.fillCreateProductModal({ name });
      cy.get("div.ant-modal").contains("button", "Cancel").click();
      cy.get("div.ant-modal").should("not.be.visible");
      cy.contains(name).should("not.exist");
    });

    it('click "x" to close the modal without creating new product', () => {
      const name = createName();
      cy.fillCreateProductModal({ name });
      cy.get("div.ant-modal").get("button.ant-modal-close").click();
      cy.get("div.ant-modal").should("not.be.visible");
      cy.contains(name).should("not.exist");
    });

    it("cannot create product without name", () => {
      cy.get("div.ant-modal").contains("button", "Create").click();
      cy.findByText("No product").should("be.visible");
      cy.get("div.ant-modal").should("be.visible");
    });

    it("create product with name only", () => {
      const name = createName();
      cy.fillCreateProductModal({ name });
      cy.contains("button", "Create").click();
      cy.wait("@postProducts").should(({ request, response }) => {
        expect(request.body.name).equal(name);
        expect(response.statusCode).equal(StatusCodes.CREATED);
        expect(response.body).to.have.property("id");
        expect(response.body.name).equal(name);
      });
      cy.wait("@getProducts");
      cy.get("div.ant-modal").should("not.be.visible");
      cy.contains(`Created ${name} successfully`).should("be.visible");
      cy.verifyProductCard({ name });
    });

    it("create two products with same name", () => {
      const name = createName();
      [name, name].forEach((name) => {
        cy.fillCreateProductModal({ name });
        cy.contains("button", "Create").click();
        cy.wait("@postProducts").should(({ request, response }) => {
          expect(request.body.name).equal(name);
          expect(response.statusCode).equal(StatusCodes.CREATED);
          expect(response.body).to.have.property("id");
          expect(response.body.name).equal(name);
        });
        cy.wait("@getProducts");
        cy.get("div.ant-modal").should("not.be.visible");
        cy.contains(`Created ${name} successfully`).should("be.visible");
        cy.verifyProductCard({ name });
        cy.findByTestId("create_product").scrollIntoView().click();
      });
      cy.get("div.ant-modal").contains("button", "Cancel").click();
      cy.findAllByText(name).should("have.length", 2);
    });

    it("create product with name, description, image URL, price and inventory", () => {
      const name = createName();
      const description = createDescription();
      const imgUrl = createImgUrl();
      const price = createPrice();
      const inventory = createInventory();
      cy.fillCreateProductModal({
        name,
        description,
        imgUrl,
        price,
        inventory,
      });
      cy.contains("button", "Create").click();
      cy.wait("@postProducts").should(({ request, response }) => {
        expect(request.body.name).equal(name);
        expect(request.body.description).equal(description);
        expect(request.body.imgUrl).equal(imgUrl);
        expect(request.body.price).equal(price);
        expect(request.body.inventory).equal(inventory);
        expect(response.statusCode).equal(StatusCodes.CREATED);
        expect(response.body).to.have.property("id");
        expect(response.body.name).equal(name);
      });
      cy.wait("@getProducts");
      cy.get("div.ant-modal").should("not.be.visible");
      cy.contains(`Created ${name} successfully`).should("be.visible");
      cy.verifyProductCard({
        name,
        description,
        imgUrl,
        price,
        inventory,
      });
    });
  });

  context("Read", () => {
    beforeEach(() => {
      cy.fixture("getProducts1.json").as("getProducts1");
      cy.fixture("getProductsMany.json").as("getProductsMany");
    });

    it("display no products", () => {
      cy.intercept("GET", "/product", []);
      cy.visit("/");
      cy.contains("h1", "Productotron 3000").should("be.visible");
      cy.contains("h2", "Product Catalog").should("be.visible");
    });

    it("display 1 product", function () {
      const product = this.getProducts1[0];
      cy.intercept("GET", "/product", { fixture: "getProducts1.json" });
      cy.visit("/");
      cy.contains("h1", "Productotron 3000").should("be.visible");
      cy.contains("h2", "Product Catalog").should("be.visible");
      cy.verifyProductCard(product);
    });

    it("display multiple products", function () {
      cy.intercept("GET", "/product", { fixture: "getProductsMany.json" });
      cy.visit("/");
      cy.contains("h1", "Productotron 3000").should("be.visible");
      cy.contains("h2", "Product Catalog").should("be.visible");
      this.getProductsMany.forEach((product) => {
        cy.verifyProductCard(product);
      });
    });

    it("display product information on Edit Product modal", function () {
      const product = this.getProducts1[0];
      cy.intercept("GET", "/product", { fixture: "getProducts1.json" });
      cy.visit("/");
      cy.contains("h1", "Productotron 3000").should("be.visible");
      cy.contains("h2", "Product Catalog").should("be.visible");
      cy.verifyProductModal(product);
    });
  });

  context("Update", () => {
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
      cy.visit("/");
      cy.contains("h1", "Productotron 3000").should("be.visible");
      cy.clickPencilIcon(name);
    });

    it('click "Cancel" to close the modal without editing product', () => {
      const newname = createName();
      cy.fillEditProductModal({
        name: newname,
      });
      cy.get("div.ant-modal").contains("button", "Cancel").click();
      cy.get("div.ant-modal").should("not.be.visible");
      cy.verifyProductCard({
        name,
        description,
        imgUrl,
        price,
        inventory,
      });
      cy.contains(newname).should("not.exist");
    });

    it('click "x" to close the modal without editing product', () => {
      const newname = createName();
      cy.fillEditProductModal({
        name: newname,
      });
      cy.get("div.ant-modal").get("button.ant-modal-close").click();
      cy.get("div.ant-modal").should("not.be.visible");
      cy.verifyProductCard({
        name,
        description,
        imgUrl,
        price,
        inventory,
      });
      cy.contains(newname).should("not.exist");
    });

    it("update product name", () => {
      const newname = createName();
      cy.fillEditProductModal({
        name: newname,
      });
      cy.contains("button", "Edit").click();
      cy.wait("@patchProducts").should(({ request, response }) => {
        expect(request.url).to.include(id);
        expect(request.body.name).equal(newname);
        expect(response.statusCode).equal(StatusCodes.OK);
        expect(response.body.id).equal(id);
      });
      cy.get("div.ant-modal").should("not.be.visible");
      cy.contains(`Successfully edited ${newname}`).should("be.visible");
      cy.verifyProductCard({
        name: newname,
        description,
        imgUrl,
        price,
        inventory,
      });
      cy.findByText(name).should("not.exist");
    });

    it("update description, image URL, price and inventory", () => {
      const newDescription = createDescription();
      const newImgUrl = createImgUrl();
      const newPrice = createPrice();
      const newInventory = createInventory();
      cy.fillEditProductModal({
        description: newDescription,
        imgUrl: newImgUrl,
        price: newPrice,
        inventory: newInventory,
      });
      cy.contains("button", "Edit").click();
      cy.wait("@patchProducts").should(({ request, response }) => {
        expect(request.url).to.include(id);
        expect(request.body.description).equal(newDescription);
        expect(request.body.imgUrl).equal(newImgUrl);
        expect(request.body.price).equal(newPrice);
        expect(request.body.inventory).equal(newInventory);
        expect(response.statusCode).equal(StatusCodes.OK);
        expect(response.body.id).equal(id);
      });
      cy.get("div.ant-modal").should("not.be.visible");
      cy.contains(`Successfully edited ${name}`).should("be.visible");
      cy.verifyProductCard({
        name,
        description: newDescription,
        imgUrl: newImgUrl,
        price: newPrice,
        inventory: newInventory,
      });
    });
  });

  context("Delete", () => {
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
      cy.visit("/");
      cy.contains("h1", "Productotron 3000").should("be.visible");
    });

    it("delete a product", () => {
      cy.clickTrashCanIcon(name);
      cy.contains("Are you sure you'd like to delete this product?").should(
        "be.visible"
      );
      cy.contains("button", "Yes").click();
      cy.wait("@deleteProducts").should(({ request, response }) => {
        expect(request.url).to.include(id);
        expect(response.statusCode).equal(StatusCodes.OK);
      });
      cy.wait("@getProducts");
      cy.contains(name).should("not.exist");
    });

    it("cancel deleting a product", () => {
      cy.clickTrashCanIcon(name);
      cy.contains("Are you sure you'd like to delete this product?").should(
        "be.visible"
      );
      cy.contains("button", "No").click();
      cy.verifyProductCard({
        name,
        description,
        imgUrl,
        price,
        inventory,
      });
    });
  });
});
