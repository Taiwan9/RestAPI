const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const rotasProdutos = require('./routes/produtos')
const rotasPedidos = require('./routes/pedidos')
const rotasUsuarios = require('./routes/usuarios')
const rotasImagens = require('./routes/imagens')


app.use(morgan('dev'))
app.use('/uploads/', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false })) //apenas dados simples
app.use(bodyParser.json()) //json de entrada no body

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*')
    res.header(
        'Acces-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    )

    if(req.method === 'OPTIONS'){
        res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).send({})
    }
    next()
})

app.use('/produtos', rotasProdutos)
app.use('/pedidos', rotasPedidos)
app.use('/usuarios', rotasUsuarios)
app.use('/imagens', rotasImagens)

//Quando nao encontra rota, entra aqui
app.use((req, res, next) => {
    const erro = new Error('Não encontrado')
    erro.status = 404
    next(erro)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app