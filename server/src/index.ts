import express from "express"
import database from "./database"
import { randomBytes } from "crypto"
import { RunResult } from "sqlite3"

type TSession = {
  [key: string]: {
    id: number,
    nome: string,
    email: string,
  } | undefined
}

const port = 8080
const app = express()
const session: TSession = {}

app.use(express.json())
app.use("/", express.static("../app/dist"))

// CREATE
app.post("/api/user/", (req, res) => {
  const errors: string[] = []

  if (!req.body.name)
    errors.push("No name specified")

  if (!req.body.password)
    errors.push("No password specified")

  if (!req.body.email)
    errors.push("No email specified")

  if (errors.length) {
    res.status(400).json({ "error": errors.join() })
    return
  }

  const { name, email, password } = req.body
  const sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
  const params = [name, email, password]

  database.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message })
      return
    }

    res.status(200).json({
      "message": "success",
      "data": { name, email, password },
      "id": this.lastID
    })
  })
})

app.patch("/api/user/:id/:token", (req, res) => {

  if (!session[req.params.token]) {
    res.status(400).json({ "error": "usuário não logado" })

    return
  }

  const { name, password, email } = req.body
  const sql = `
    UPDATE user SET
       name = COALESCE(?,name),
       password = COALESCE(?,password),
       email = COALESCE(?,email)
    WHERE
       id = ?
       `
  database.run(sql, [name, password, email, req.params.id],
    function (this: RunResult, err) {
      if (err) {
        res.status(400).json({ "error": err.message })
        return
      }
      res.json({
        "message": "success",
        "data": { name, password, email },
        "changes": this.changes
      })
    }
  )
})

app.post("/api/login/", (req, res) => {
  const sql = "SELECT id, name, email FROM user WHERE email=? AND password=?"
  const { email, password } = req.body

  database.get(sql, [email, password], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }

    if (!row?.id) {
      res.status(404).json({ "error": "usuário não encontrado" })
      return
    }

    randomBytes(48, (err: any, buffer: any) => {
      const token = buffer.toString('hex')
      session[token] = row
      res.status(200).json({ "message": "sucesso", token })
    })
  })
})

app.get("/api/logged/:token", (req, res) => {
  const user = session[req.params.token]

  if (!user) {
    res.status(400).json({ "error": "usuário não está logado" })
    return
  }

  res.json(user)
})

app.get("/api/logout/:token", (req, res) => {
  const deleted = delete session[req.params.token]

  if (deleted) {
    res.status(200).send()
    return
  }

  res.status(400).send()
})

app.delete("/api/user/:id/:token", (req, res) => {
  const user = session[req.params.token]

  if (!user) {
    res.status(400).json({ "error": "Usuário não está logado" })
    return
  }

  const sql = "DELETE FROM user WHERE id=?"
  database.run(sql, [req.params.id], function (this: RunResult, err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    delete session[req.params.token]

    res.json({
      "message": "sucesso",
      "id": this.lastID
    })
  })
})

app.listen(port, () => console.log(`⚡ servidor online ${port}`))
