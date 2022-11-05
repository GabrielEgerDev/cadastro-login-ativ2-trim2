import { Dispatch, FormEventHandler, SetStateAction } from "react";
import Swal from 'sweetalert2'

export default function ({ setRoute }: { setRoute: Dispatch<SetStateAction<string>> }) {
  const enviarDados: FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault()
    const {nome, email, password } = ev.currentTarget

    const response = await fetch(`/api/user/`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nome.value,
        email: email.value,
        password: password.value
      })
    })
    const responseData = await response.json()

    if (response.status >= 200 && response.status <= 299) {
      Swal.fire("Sucesso!", `id: ${responseData.id}`, "success")
      setRoute("login")
      return
    }


    if (responseData.error) {
      Swal.fire("Erro", responseData.error, "error")
      return
    }

    Swal.fire("Erro inesperado", "", "error")
  }

  return <>
    <form onSubmit={enviarDados}>
      <h1>Cadastro</h1>
      <input name="nome" placeholder="name"/>
      <input name="email" placeholder="email" />
      <input name="password" type="password" placeholder="password" />
      <button>Cadastrar</button>
      <button onClick={() => setRoute("login")}>Voltar</button>
    </form>
  </>
}
