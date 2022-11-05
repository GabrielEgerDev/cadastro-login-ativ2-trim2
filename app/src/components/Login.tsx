import { Dispatch, FormEventHandler, SetStateAction } from "react";
import Swal from 'sweetalert2'

export default function ({setRoute}: {setRoute: Dispatch<SetStateAction<string>>}) {
  const enviarDados: FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault()
    const { email, password } = ev.currentTarget

    const response = await fetch(`/api/login/`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const responseData = await response.json()

    if (response.status >= 200 && response.status <= 299) {
      localStorage.setItem("token", responseData.token)
      Swal.fire("Sucesso", "", "success")

      setRoute("main")
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
        <h1>Login</h1>
        <input name="email" placeholder="email" />
        <input name="password" type="password" placeholder="password" />
        <button onClick={() => {}}>Entrar</button>
        <button onClick={() => setRoute("cadastro")}>Cadastrar</button>
      </form>
  </>
}
