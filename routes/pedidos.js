const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Usando GET dentro de rota de pedidos'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando Post dentro da rota pedidos'
    })
})

router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedidos
    res.status(200).send({
        mensagem: 'Detalhes do Pedido',
        id_pedido: id
    })

})


router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Pedido excluido'
    })
})

module.exports = router