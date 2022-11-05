import { Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from "react";
import Swal from 'sweetalert2'

export default function ({setRoute}: {setRoute: Dispatch<SetStateAction<string>>}) {
  const [id, setId] = useState(0);
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() =>{
    buscarDados()
  }, [])

  const buscarDados = async () => {
    const response = await fetch(`/api/logged/${localStorage.getItem('token')}`)
    if (response.status >= 200 && response.status <= 299) {
      const user = await response.json()
      setId(user.id)
      setNome(user.name)
      setEmail(user.email)

      return
    }
    Swal.fire("Erro inesperado ao buscar os dados do usuário", "", "error")
  }

  const enviarDados: FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault()
    const { nome, email, password } = ev.currentTarget

    const response = await fetch(`/api/user/${id}/${localStorage.getItem('token')}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nome.value,
        email: email.value,
        password: password.value
      })
    })

    const responseData = await response.json()

    if (response.status >= 200 && response.status <= 299) {
      Swal.fire("Sucesso!", `Registros alterados: ${responseData.changes}`, "success")
      setRoute("main")
      return
    }

    if (responseData.error) {
      Swal.fire("Erro", responseData.error, "error")
      return
    }

    Swal.fire("Erro inesperado", "", "error")
  }

  const excluir = async () =>{
    const response = await fetch(`/api/user/${id}/${localStorage.getItem('token')}`, {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' }
    })

    const responseData = await response.json()

    if (response.status >= 200 && response.status <= 299) {
      await fetch(`/api/logout/${localStorage.getItem('token')}`)
      localStorage.setItem('token', '')
      Swal.fire("Sucesso!", `Id excluído: ${responseData.id}`, "success")

      setRoute("login")
      return
    }

  }

  return <>
      <form onSubmit={enviarDados}>
        <h1>Editar</h1>
        <input name="nome" placeholder="nome" value={nome} onChange={event => setNome(event.currentTarget.value)}/>
        <input name="email" placeholder="email" value={email} onChange={event => setEmail(event.currentTarget.value)}/>
        <input name="password" type="password" placeholder="password" />
        <button onClick={ev => enviarDados}>Salvar</button>
        <button onClick={excluir}>Excluir</button>
        <button onClick={() => setRoute("main")}>Voltar</button>
      </form>
  </>
}
