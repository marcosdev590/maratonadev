// Configurando o servidor
const express = require("express")
const server = express()

//Configurando o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//Habilitar o corpo(body) do formulário
server.use(express.urlencoded({ extended: true }))

//Configurando a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'kronos2020',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//Configurando a apresentação da página
server.get("/", function (req, res) {
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de banco de dados")

        const donors = result.rows
        return res.render("index.html", { donors })
    })

    
})

//Tratamento dos dados do formulário
server.post("/", function (req, res) {
    //Pegando os dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //Verificando se há algum campo vazio
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }

    //Adicionando os dados ao banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`
    const values = [name, email, blood]
    db.query(query, values, function(err) {
        if (err) return res.send("Erro no banco de dados")

        return res.redirect("/")
    })
})

// Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("Iniciei o servidor")
})