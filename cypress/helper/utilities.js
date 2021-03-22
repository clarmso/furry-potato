import faker from "faker";

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

export {
  createName,
  createDescription,
  createImgUrl,
  createPrice,
  createInventory,
};
