const mysql = require('../mysql').pool

exports.getPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT pedidos.id_pedidos,
                    pedidos.quantidade,
                    Produtos.id_produtos,
                    Produtos.nome,
                    Produtos.preco
                FROM pedidos
            INNER JOIN Produtos
                ON Produtos.id_produtos = pedidos.id_produtos;`,
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    pedidos: resultado.map(pedido => {
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
            }
        )
    })
}

exports.postPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM Produtos WHERE id_produtos = ?',
            [req.body.id_produto],
            (error, result, field) => {
                if (error) { res.status(500).send({ error: error }) }
                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrada produtos com esse registro'
                    })
                }
                conn.query(
                    'insert into pedidos (id_produtos, quantidade) values(?,?)',
                    [req.body.id_produto, req.body.quantidade],
                    (error, result, field) => {
                        conn.release();
                        if (error) { res.status(500).send({ error: error }) }
                        if (result.length === 0) {
                            return res.status(404).send({
                                mensagem: 'Não foi encontrada pedidos com esse registro'
                            })
                        }
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
                    }
                )
            }
        )
    })
}

exports.getPedidosId = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedidos = ?;',
            [req.params.id_pedido],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrada pedidos com esse registro'
                    })
                }
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
            }
        )
    })

}

exports.deletePedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM pedidos WHERE id_pedidos = ?; `,
            [req.body.id_pedido],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({ error: error })
                }
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
            }
        )
    })
}