import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

function validarEmailIdade(email, idade){
    //validando o email
    if(typeof(email) !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        return false
    }

    //validando a idade
    if(typeof(idade) !== 'number' || idade < 0 || idade > 100){
        return false
    }
    return true
}

//simulação de uma lista de alunos
let LETidsequencial = 4
function idsequencial(){
    LETidsequencial = LETidsequencial + 1
    return LETidsequencial
}



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

    if(resultado.length === 0){
        return res.status(400).json({mensagem: `Nenhum aluco com o curso '${curso}' encontrado.`})
    }

    return res.status(200).json(resultado)
})

//POST = cadastrar aluno
app.post("/alunos", (req, res) => {
    const {nome, email, idade, curso} = req.body
    
    if(!nome || !email || !idade || !curso){
        return res.status(400).json({mensagem: "Para fazer o cadastro é necessario que as seguintes informações sejam preenchidas: NOME, EMAIL, IDADE, CURSO"})
    }

    const validacao = validarEmailIdade(email,idade)
    if(validacao === false){
        return res.status(400).json({mensagem:"email deve ter @ e idade deve ser 0-100 e numerica"})
    }

    const novoAluno = {
        id: idsequencial(),
        nome: req.body.nome,
        email: req.body.email,
        idade: req.body.idade,
        curso: req.body.curso
    }

    alunos.push(novoAluno)
    return res.status(201).json(novoAluno)
})

// PUT atualiza todas as informações do aluno
app.put("/alunos/:id", (req, res) => {
    const id = req.params.id
    const {nome, email, idade, curso} = req.body
    
    const checkid = alunos.filter(aluno => aluno.id == id)
    if(checkid.length == 0){
        return res.status(400).json({mensagem:`ID: ${id} não encontrado`})
    }

    if(!nome || !email || !idade || !curso){
        return res.status(400).json({mensagem:"por favor preencha todas as informações: nome, email, idade, curso"})
    }

    // criei uma função pois já havia repetido isso antes
    const validacao = validarEmailIdade(email,idade)
    if(validacao === false){
        return res.status(400).json({mensagem:"email deve ter @ e idade deve ser 0-100 e numerica"})
    }

    alunos[id-1] = {
        nome: nome,
        email: email,
        idade: idade,
        curso: curso
    }
    return res.json({mensagem:`ID: ${id} alterado com sucesso`, "aluno atualizado": alunos[id-1]})
})

app.patch("/alunos/:id", (req, res) => {
    const id = req.params.id
    const idade = Number(req.query.idade)
    console.log(idade)
    
    const checkid = alunos.filter(aluno => aluno.id == id)
    if(checkid.length == 0){
        return res.status(400).json({mensagem:`ID: ${id} não encontrado`})
    }
    
    if(isNaN(idade) || idade>100 || idade<0){
        return res.status(400).json({mensagem:'idade precisa ser numérica, maior que 0 e menor que 100'})
    }

    alunos[id-1].idade = idade
    return res.json({mensagem:`Idade do aluno: ${alunos[id-1].nome}, atualizada para: ${idade} anos`})
})

app.delete("/alunos/deletar/:id", (req, res) => {
    const id = req.params.id

    if(!id){
        return res.status(400).json({mensagem:"por favor digite o ID para excluir"})
    }

    const checkid = alunos.find((alunoID) => alunoID.id == id)
    if(!checkid){
        return res.status(400).json(({mensagem:`ID: '${id}' não encontrado dentro da lista alunos`}))
    }

    alunos.splice((id-1), 1)
    return res.status(200).json({mensagem:`ID: '${id}' deletado com sucesso`, lista:alunos})
})

app.listen(3000, () => {console.log("Api rodando em http://localhost:3000")})