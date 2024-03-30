const express = require('express')
const router = express.Router()
const login = require('../middleware/login')
const imagensControllers = require('../controllers/imagens-conrtollers')

router.delete('/:id_imagens',
    login.obrigatorio,
    imagensControllers.deleteImagem
)

module.exports = router



