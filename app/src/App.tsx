import { useState } from "react";
import Cadastro from "./components/Cadastro";
import Login from "./components/Login";
import Home from "./components/Home";
import "./App.css"
import Editar from "./components/Editar";

export default function () {
  const [route, setRoute] = useState("login")

  return <>
    {route == "login" ? <Login setRoute={setRoute} /> : ""}
    {route == "cadastro" ? <Cadastro setRoute={setRoute} /> : ""}
    {route == "main" ? <Home setRoute={setRoute}/> : ""}
    {route == "editar" ? <Editar setRoute={setRoute}/> : ""}
  </>
}
