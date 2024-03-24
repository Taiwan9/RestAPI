const mysql = require('../mysql').pool

exports.getProdutos = (req, res, next) => {

    // res.status(200).send({
    //     mensagem:'Retorna todos os produtos'
    // })
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM Produtos;',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: resultado.length,
                    produtos: resultado.map(prod => {
                        return {
                            id_produtos: prod.id_produtos,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produtos: prod.imagem_produtos,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto especifico',
                                link: 'http://localhost:3100/produtos/' + prod.id_produtos
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
}

exports.getProdutosId = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM Produtos WHERE id_produtos = ?;',
            [req.params.id_produto],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrada Produto com esse registro'
                    })
                }
                const response = {
                    porduto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem_produtos: result[0].imagem_produtos,
                        produtoCriado: {
                            id_produtos: result.id_produtos,
                            nome: result.nome,
                            preco: result.preco,
                            request: {
                                tipo: 'POST',
                                descricao: 'Retorna todos os produtos',
                                link: 'http://localhost:3100/produtos'
                            }
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
}

exports.postProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'insert into Produtos (nome, preco, imagem_produtos) values(?,?,?)',
            [req.body.nome, req.body.preco, req.file.path],
            (error, result, field) => {
                conn.release();
                if (error) { res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto inserido com sucesso !',
                    pordutoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produtos: req.file.path,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            link: 'http://localhost:3100/produtos'
                        }

                    }
                }
                return res.status(201).send(response)
            }
        )
    })
}

exports.pathProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `
            UPDATE Produtos
                SET nome = ?,
                    preco = ?
                WHERE id_produtos = ?
            `,
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error, result, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({ error: error })
                }
                const response = {
                    mensagem: 'Produto atualizado com sucesso !',
                    pordutoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        produtoCriado: {
                            id_produtos: req.body.id_produtos,
                            nome: req.body.nome,
                            preco: req.body.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos',
                                link: 'http://localhost:3100/produtos/' + req.body.id_produto
                            }
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
}

exports.deleteProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM Produtos WHERE id_produtos = ?; `,
            [req.body.id_produto],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({ error: error })
                }
                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um Produto Novo',
                        url: 'http://localhost:3100/produtos',
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
                res.status(202).send(response)
            }
        )
    })
}
