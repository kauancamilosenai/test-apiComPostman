import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())


//simulação de uma lista de alunos
const alunos = [
    {
        id: 1,
        nome: "Ana Souza",
        email: "ana@gmail.com",
        idade: 16,
        curso: "Multimídia"
    },
    {
        id: 2,
        nome: "Lucas Martins",
        email: "lucas@gmail.com",
        idade: 18,
        curso: "Desenvolvimento de Sistemas"
    },
    {
        id: 3,
        nome: "Kauan Camilo",
        email: "kauan@gmail.com",
        idade: 17,
        curso: "Desenvolvimento de Sistemas"
    },
    {
        id: 4,
        nome: "Silabas na Bola",
        email: "silabas@gmail.com",
        idade: 20,
        curso: "Robótica"
    }
]

//get - buscar os recursos
app.get("/alunos", (req, res) => {
    res.status(200).json(alunos)
})

app.get("/alunos/:id", (req, res) => {
    const id = Number(req.params.id)

    const aluno = alunos.find((i) => i.id === id)

    if(!aluno){
        return res.status(404).json({"mensagem":"Aluno não encontrado"})
    }

    return res.status(200).json(aluno)
})


//get em cursos
app.get("/alunos/curso/:curso", (req, res) => {
    const curso = req.params.curso.toLowerCase()

    const resultado = alunos.filter((aluno) => aluno.curso.toLowerCase().includes(curso))

    return res.status(200).json(resultado)
})

//POST = cadastrar aluno
app.post("/alunos", (req, res) => {
    const {nome, email, idade, curso} = req.body

    //validando o email
    if(typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        return res.status(400).json({mensagem: "E-mail inválido"})
    }

    //validando a idade
    if(typeof !Number(idade) || idade < 0 || idade > 100){
        return res.status(400).json({mensagem:('idade precisa ser numérica, maior que 0 e menor que 100')})
    }

    const novoAluno = {
        id: alunos.length + 1,
        nome: req.body.nome,
        email: req.body.email,
        idade: req.body.idade,
        curso: req.body.curso
    }

    alunos.push(novoAluno)
    res.status(201).json(novoAluno)

})

app.listen(3000, () => {console.log("Api rodando em http://localhost:3000")})