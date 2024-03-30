const mysql = require('../mysql')

exports.getProdutos = async (req, res, next) => {
    try {
        let name = ''
        if(req.query.nome){
            name = req.query.nome
        }
        const query=
      `
        SELECT * 
        FROM Produtos
        WHERE categoryId = ?
        AND(nome LIKE '${name}');
        `;
        const result = await mysql.execute(query, [req.query.categoryId])
        const response = {
            quantidade: result.length,
            produtos: result.map(prod => {
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

    } catch (error) {
        return res.status(500).send({ error: error })
    }

}

exports.getImagens = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM imagens_produtos WHERE id_produtos = ?;'
        const result = await mysql.execute(query, [req.params.id_produto])
        const response = {
            quantidade: result.length,
            imagens: result.map(img => {
                return {
                    id_produtos: parseInt(req.params.id_produto),
                    id_image: img.id_imagens,
                    caminho: img.caminho
                }
            })
        }
        return res.status(200).send(response)

    } catch (error) {
        return res.status(500).send({ error: error })
    }

}

exports.getProdutosId = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM Produtos WHERE id_produtos = ?;'
        const result = await mysql.execute(query, [req.params.id_produto])
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
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.postProdutos = async (req, res, next) => {
    try {
        const query = 'insert into Produtos (nome, preco, imagem_produtos, categoryId) values(?,?,?,?)'
        const result = await mysql.execute(query, [req.body.nome, req.body.preco, req.file.path, req.body.categoryId])
        const response = {
            mensagem: 'Produto inserido com sucesso !',
            pordutoCriado: {
                id_produto: result.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                imagem_produtos: req.file.path,
                categoryId: req.body.categoryId,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os produtos',
                    link: 'http://localhost:3100/produtos'
                }

            }
        }
        return res.status(201).send(response)

    } catch (error) {
        return res.status(500).send({ error: error })
    }

}
exports.postImagem = async (req, res, next) => {
    try {
        const query = 'insert into imagens_produtos (id_produtos, caminho) values(?,?)'
        const result = await mysql.execute(query, [req.params.id_produto, req.file.path])
        const response = {
            mensagem: 'Imagem inserida com sucesso !',
            imagemCriada: {
                id_produtos: req.params.id_produto,
                id_imagens: result.insertId,
                imagem_produtos: req.file.path,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todas as imagens',
                    link: 'http://localhost:3100/produtos'
                }

            }
        }
        return res.status(201).send(response)

    } catch (error) {
        return res.status(500).send({ error: error })
    }

}

exports.pathProdutos = async (req, res, next) => {
    try {
        const query = `
        UPDATE Produtos
            SET nome = ?,
                preco = ?
            WHERE id_produtos = ?
        `;
        await mysql.execute(query, [req.body.nome, req.body.preco, req.body.id_produto])
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

    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.deleteProdutos = async (req, res, next) => {
    try {
        const query = `DELETE FROM Produtos WHERE id_produtos = ?; `
        await mysql.execute(query, [req.body.id_produto])
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

    } catch (error) {
        return res.status(500).send({ error: error })
    }
}
