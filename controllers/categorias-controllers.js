const mysql = require('../mysql')

exports.getCategorias = async (req, res, next) => {
    try {
        const result = await mysql.execute('SELECT * FROM categorias;')
        const response = {
            quantidade: result.length,
            produtos: result.map(categorias => {
                return {
                    id_produtos: categorias.id_produtos,
                    categoryId: categorias.categoryId,
                    nome: categorias.name,
                }
            })
        }
        return res.status(200).send(response)

    } catch (error) {
        return res.status(500).send({ error: error })
    }

}

exports.postCategorias = async (req, res, next) => {
    try {
        const query = 'insert into categorias (name) values(?)'
        const result = await mysql.execute(query, [req.body.name])
        const response = {
            mensagem: 'Categoria inserido com sucesso !',
            categoriaCriada: {
                categorias_id: result.insertId,
                nome: req.body.name,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos as Categorias',
                    link: 'http://localhost:3100/produtos'
                }

            }
        }
        return res.status(201).send(response)

    } catch (error) {
        return res.status(500).send({ error: error })
    }

}
