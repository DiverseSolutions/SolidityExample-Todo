import React, { useState,useEffect } from "react";
import { ethers,BigNumber } from 'ethers'
import TodosContract from "./contracts/Todos.json";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'


import "./App.css";

function App() {
  const [state, setMyState] = useState({
    contractAddress: "0x6e935F66E6DC64c059b3d76Dc233070aD2a141d6",
    provider: null,
    contact: null,
    signer: null,
    hasMetamask: false,
  })

  const [todoLength, setTodoLength] = useState(0)
  const [todos, setTodos] = useState([])

  const [formContentInput, setFormContentInput] = useState("")
  const [formCompletedToggle, setFormCompletedToggle] = useState(false)

  useEffect(() => {
    getAllTodos()
  },[todoLength])

  useEffect(() => {
    if(window.ethereum){
      const _provider = new ethers.providers.Web3Provider(window.ethereum)
      connect(_provider)
      const _signer = _provider.getSigner()
      const _todoContract = new ethers.Contract(state.contractAddress, TodosContract.abi, _provider);
      setLength(_todoContract) 

      setMyState({
        ...state,
        provider: _provider,
        signer: _signer,
        contract: _todoContract,
        hasMetamask: true,
      })


      _todoContract.on("AddedTodo",(content) => {
        setLength(_todoContract)
      })

      _todoContract.on("DeletedTodo",(content) => {
        console.log(content)
      })

      _todoContract.on("ChangedTodoState",(todo) => {
        console.log(todo)
      })

    }
  },[])

  async function setLength(_contract){
    let value = await _contract.lengthOfTodo()
    setTodoLength(BigNumber.from(value).toNumber())
  }

  async function connect(_provider){
    await _provider.send("eth_requestAccounts",[])
  }

  async function addTodoButtonHandler(){
    let signerContract = state.contract.connect(state.signer)
    await signerContract.createTodo(formContentInput)
    setFormContentInput("")
  }

  async function getAllTodos(){
    if(todos.length == todoLength) return

    let _todos = []
    for(let x=0; x < todoLength; x++){
      let todo = await state.contract.todos(x);
      _todos.push(todo)
    }

    setTodos(_todos)
  }

  if(state.hasMetamask){
    return (
      <div className="w-full h-screen flex flex-col justify-content-center align-items-center">
        <div className="w-2/12">

          <h1 className="text-center">My Todo Length : { todoLength }</h1>

          <ListGroup className="w-full my-5 text-center">
            <h4 className="mb-2">My Todo's</h4>
            {
              todos.map((todo,id) => {
                return (
                  <ListGroup.Item key={id} className="text-sm">{todo.content}</ListGroup.Item>
                )
              })
            }
          </ListGroup>

          <div className="border-1 border-blue-300 p-6 rounded-lg">
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control value={formContentInput} onChange={(e) => { setFormContentInput(e.target.value) }} className="text-center" type="text" placeholder="Enter Content" />
              </Form.Group>

              <Button onClick={() => { addTodoButtonHandler() }} className="w-full" variant="outline-primary">Add Todo</Button>
            </Form>

          </div>

        </div>
      </div>

    )
  }

  if(state.contract == null){
    return (
      <div className="w-full h-screen flex justify-content-center align-items-center">
        <h5>Problem With Connecting To The Contract</h5>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex justify-content-center align-items-center">
      <h5>Metamask Not Detected</h5>
    </div>
  )
}

export default App;
