const express = require('express')
const router = express.Router()

const pedidosContollers = require('../controllers/pedidos-controllers')

router.get('/', pedidosContollers.getPedidos)

router.post('/', pedidosContollers.postPedidos)

router.get('/:id_pedido', pedidosContollers.getPedidosId)

router.delete('/', pedidosContollers.deletePedidos)

module.exports = router