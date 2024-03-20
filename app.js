const express = require('express')
const app = express()

const rotasProdutos = require('./routes/produtos')
const rotasPedidos = require('./routes/pedidos')

app.use('/produtos', rotasProdutos)
app.use('/pedidos', rotasPedidos)

module.exports = app