var TodosContract = artifacts.require("Todos");

module.exports = function(deployer) {
  deployer.deploy(TodosContract);
};
