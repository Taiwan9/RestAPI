const mysql = require('../mysql')

exports.getPedidos = async (req, res, next) => {
    try {
        const query = `SELECT pedidos.id_pedidos,
        pedidos.quantidade,
        Produtos.id_produtos,
        Produtos.nome,
        Produtos.preco
        FROM pedidos
        INNER JOIN Produtos
        ON Produtos.id_produtos = pedidos.id_produtos;`;
        const result = await mysql.execute(query)
        const response = {
            pedidos: result.map(pedido => {
                return {
                    id_pedidos: pedido.id_pedidos,
                    produto: {
                        id_produtos: pedido.id_produtos,
                        nome: pedido.nome,
                        preco: pedido.preco
                    },
                    quantidade: pedido.quantidade,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um pedido especifico',
                        link: 'http://localhost:3100/pedidos/' + pedido.id_pedidos
                    }
                }
            })
        }
        return res.status(200).send(response)

    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.postPedidos = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM Produtos WHERE id_produtos = ?'
        const result = await mysql.execute(query, [req.body.id_produto])
        const response = {
            mensagem: 'Pedido inserido com sucesso !',
            pedidoCriado: {
                id_pedido: result.id_pedido,
                id_produto: req.body.id_produto,
                quantidade: req.body.quantidade,
                produtoCriado: {
                    id_produtos: result.id_produtos,
                    nome: result.nome,
                    preco: result.preco,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os pedidos',
                        link: 'http://localhost:3100/pedidos'
                    }
                }
            }
        }
        return res.status(201).send(response)

    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.getPedidosId = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM pedidos WHERE id_pedidos = ?;'
        const result = await mysql.execute(query, [req.params.id_pedido])
        const response = {
            pedido: {
                id_pedido: result[0].id_pedido,
                id_produto: result[0].id_produto,
                quantidade: result[0].quantidade,
                pedidoCriado: {
                    id_pedido: result.id_pedido,
                    id_produto: result.id_produto,
                    quantidade: result.quantidade,
                    request: {
                        tipo: 'POST',
                        descricao: 'Retorna todos os pedidos',
                        link: 'http://localhost:3100/pedidos'
                    }
                }
            }
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.deletePedidos = async (req, res, next) => {
    try {
        const query = `DELETE FROM pedidos WHERE id_pedidos = ?;`;
        await mysql.execute(query, [req.body.id_pedido])
        const response = {
            mensagem: 'Pedido removido com sucesso',
            request: {
                tipo: 'POST',
                descricao: 'Insere um pedido Novo',
                url: 'http://localhost:3100/pedido',
                body: {
                    id_produtos: 'Number',
                    quantidade: 'Number'
                }
            }
        }
        res.status(202).send(response)

    } catch (error) {
        return res.status(500).send({ error: error })
    }
}