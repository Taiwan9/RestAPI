const express = require('express')
const router = express.Router()

router.get('/', (req, res, next)=>{
    res.status(200).send({
        mensagem:'Retorna todos os produtos'
    })
})

router.post('/', (req,res, next)=>{
    res.status(201).send({
        mensagem:'Insere um produto'
    })
})

router.get('/:id_produto', (req, res, next)=>{
    const id = req.params.id_produto

    if(id === 'especial'){
        res.status(200).send({
            mensagem:'Usando o GET de um produto exclusivo',
            id: id
        })
    }else{
        res.status(200).send({
            mensagem:'Você Passou um ID',
            id: id
        })
    }    
})

router.patch('/', (req,res, next)=>{
    res.status(201).send({
        mensagem:'Produto alterado'
    })
})

router.delete('/', (req,res, next)=>{
    res.status(201).send({
        mensagem:'Produto excluido'
    })
})

module.exports = router