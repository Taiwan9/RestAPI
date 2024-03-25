const mysql = require('../mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.cadastroUsuario = async (req, res, next) => {
    try {
        var query = 'SELECT * FROM usuarios WHERE email = ?';
        var result = await mysql.execute(query, [req.body.email])

        if (result.length > 0) {return res.status(409).send({ mensagem: 'Usuario já cadastrado' }) }

        const hash = await bcrypt.hashSync(req.body.senha, 10)

        query = `INSERT INTO usuarios (email, senha) VALUES (?,?)`;
        result = await mysql.execute(query, [req.body.email, hash])

        const response = {
            mensagem: 'Usuário criado com sucesso',
            usuarioCriado: {
                id_usuario: result.insertId,
                email: req.body.email,
                hash: hash
            }
        }
        return res.status(201).send(response)

    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.loginUsuario = async (req, res, next) => {
    try {
        const query = `SELECT * FROM usuarios WHERE email = ?`
        const result = await mysql.execute(query, req.body.email)

        if (result.length < 1) {
            return res.status(401).send({ mensagem: 'Falha na autenticação' })
        }
            if (await bcrypt.compareSync(req.body.senha, result[0].senha)) {
            const token = jwt.sign({
                id_usuario: result[0].id_usuario,
                email: result[0].email
            },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
            )
            return res.status(200).send({ mensagem: 'Autenticado com sucesso', token: token })
        }
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}