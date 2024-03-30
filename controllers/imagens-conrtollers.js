const mysql = require('../mysql')

exports.deleteImagem = async (req, res, next) => {
    try {
        const query = `DELETE FROM imagens_produtos WHERE id_imagens = ?; `
        await mysql.execute(query, [req.params.id_imagens])
        const response = {
            mensagem: 'Imagem removida com sucesso',
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