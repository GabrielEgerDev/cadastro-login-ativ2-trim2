import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Swal from 'sweetalert2'

export default function ({ setRoute }: { setRoute: Dispatch<SetStateAction<string>> }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() =>{
    buscarDados()
  }, [])

  const buscarDados = async () => {
    const response = await fetch(`/api/logged/${localStorage.getItem('token')}`)
    if (response.status >= 200 && response.status <= 299) {
      const user = await response.json()
      setName(user.name)
      setEmail(user.email)
      return
    }

    Swal.fire("Erro inesperado ao buscar os dados do usuário", "", "error")
  }

  const handleSair = async () => {
    const response = await fetch(`/api/logout/${localStorage.getItem('token')}`)

    if(response.status >= 200 && response.status <= 299){
      Swal.fire("Saindo", "", "info")
      localStorage.setItem('token', '')
      setRoute("login")
      return
    }

    Swal.fire("Erro inesperado", "", "error")
  }

  return <>
    <div className="main">
      <h1>Home</h1>
      <h2>Dados do usuário</h2>
      <div className="data">
        <label>Nome: </label>{name}
      </div>
      <div className="data">
        <label>Email: </label>{email}
      </div>
      <button onClick={() => setRoute("editar")}>Editar conta</button>
      <button onClick={handleSair}>Sair</button>
      </div>
  </>
}
