describe("R8 - Todo GUI Testing", () => {
  let task;
  let uid;

  beforeEach(() => {
    cy.fixture("task").then((taskdata) => {
      task = taskdata;

      cy.visit("/");

      const uniqueEmail = `test${Date.now()}@gmail.com`;

      cy.contains("Have no account yet? Click here to sign up.").click();

      cy.get("#email").type(uniqueEmail);
      cy.get("#firstname").type("Mon");
      cy.get("#lastname").type("Doe");

      cy.contains("Sign Up").click();

      cy.contains("Your tasks", { timeout: 10000 }).should("exist");

      cy.url().then((url) => {
        uid = url.split("/").pop();
      });
    });
  });

  after(() => {
    if (uid) {
      cy.request({
        method: "DELETE",
        url: `http://localhost:5000/users/${uid}`,
      });
    }
  });

  const createAndOpenTask = () => {
    cy.get("#title").type(task.title);

    const videoKey = task.url.includes("watch?v=")
      ? task.url.split("watch?v=")[1]
      : "dQw4w9WgXcQ";

    cy.get("#url").type(videoKey);

    cy.contains("Create new Task").click();

    cy.contains(task.title, { timeout: 10000 }).should("exist");

    cy.contains(task.title).click();

    cy.get('input[placeholder="Add a new todo item"]', {
      timeout: 10000,
    }).should("exist");
  };

  it("R8UC1 - should create a todo item", () => {
    createAndOpenTask();

    cy.get('input[placeholder="Add a new todo item"]').type("Todo 1");

    cy.contains("Add").click();

    cy.contains("Todo 1").should("exist");
  });

  it("R8UC1 - should keep Add button disabled for empty todo input", () => {
    createAndOpenTask();

    cy.get('input[placeholder="Add a new todo item"]').should("have.value", "");

    cy.contains("Add").should("be.disabled");
  });

  it("R8UC2 - should toggle an unchecked todo item to checked", () => {
    createAndOpenTask();

    cy.get('input[placeholder="Add a new todo item"]').type("Toggle todo");

    cy.contains("Add").click();

    cy.contains("Toggle todo")
      .parents(".todo-item")
      .find(".checker")
      .should("have.class", "unchecked");

    cy.contains("Toggle todo").parents(".todo-item").find(".checker").click();

    cy.contains("Toggle todo")
      .parents(".todo-item")
      .find(".checker")
      .should("have.class", "checked");
  });

  it("TC4 - should toggle a completed todo item back to unchecked", () => {
    createAndOpenTask();

    cy.get('input[placeholder="Add a new todo item"]').type("Toggle back todo");

    cy.contains("Add").click();

    cy.contains("Toggle back todo")
      .parents(".todo-item")
      .find(".checker")
      .click();

    cy.contains("Toggle back todo")
      .parents(".todo-item")
      .find(".checker")
      .should("have.class", "checked");

    cy.contains("Toggle back todo")
      .parents(".todo-item")
      .find(".checker")
      .click();

    cy.contains("Toggle back todo")
      .parents(".todo-item")
      .find(".checker")
      .should("have.class", "unchecked");
  });

  it("R8UC3 - should send delete request for a todo item", () => {
    createAndOpenTask();

    cy.get('input[placeholder="Add a new todo item"]').type("Delete me");

    cy.contains("Add").click();

    cy.contains("Delete me").should("exist");

    cy.contains("Delete me").parents(".todo-item").find(".remover").click();

    cy.wait(1000);
  });
});
