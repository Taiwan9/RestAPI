const express = require('express')
const router = express.Router()
const multer = require('multer')
const login = require('../middleware/login')
const produtosControllers = require('../controllers/produtos-controllers')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname);

    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }


}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20
    },
    fileFilter: fileFilter
})

router.get('/',
    produtosControllers.getProdutos
)

router.post('/',
    upload.single('produto_imagem'),
    login.obrigatorio,
    produtosControllers.postProdutos
)

router.post(
    '/:id_produto/imagem',
    login.obrigatorio,
    upload.single('produto_imagem'),
    produtosControllers.postImagem
)
router.get(
    '/:id_produto/imagens',
    produtosControllers.getImagens
)

router.get('/:id_produto',
    produtosControllers.getProdutosId
)

router.patch('/',
    login.obrigatorio,
    produtosControllers.pathProdutos
)

router.delete('/',
    login.obrigatorio,
    produtosControllers.deleteProdutos
)

module.exports = router