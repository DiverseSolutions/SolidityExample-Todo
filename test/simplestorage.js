const TodoContract = artifacts.require("Todos");

contract("Testing Todo", accounts => {

  it("Adding Todo", async () => {
    const todoInstance = await TodoContract.new();

    await todoInstance.createTodo("milk");
    let todo = await todoInstance.todos(0);

    assert.equal(await todoInstance.lengthOfTodo(), 1, "Data wasnt added to todo.");
    assert.equal(await todo.content, "milk", "Data wasnt added to todo.");
  });

  it("Removing Todo", async () => {
    const todoInstance = await TodoContract.new();

    await todoInstance.createTodo("milk");
    await todoInstance.deleteTodo(0);

    assert.equal(await todoInstance.lengthOfTodo(), 0, "Data wasnt removed from todo list.");
  });

});
