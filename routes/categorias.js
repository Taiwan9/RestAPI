const express = require('express')
const router = express.Router()
const login = require('../middleware/login')
const categoriasControllers = require('../controllers/categorias-controllers')

router.get(
    '/',
   categoriasControllers.getCategorias
)

router.post(
    '/',
    login.obrigatorio,
    categoriasControllers.postCategorias
)

module.exports = router

