const express = require('express')
const pool = require('./config/database')

const app = express()
app.use(express.json())

const queryAsync=(sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, results) =>{
            if(err) reject(err)
            else resolve(results)
        })
    })
}

app.get('/filmes', async (req,res) => {
    try{
        const filmes = await queryAsync('SELECT * FROM filme')

        res.json({
            sucesso: true,
            dados: filmes,
            total: filmes.length
        })
    } catch (erro) {
        console.error('Erro ao listar filmes:', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar filmes',
            erro: erro.message
        })
    }
   
})

app.get('/filmes/:id', async(req,res) => {
    const {id} = req.params
    try {
        const {id} = req.params

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de filme inválido'
            })
        }
        const filme = await queryAsync('SELECT FROM * filme WHERE id = ?' [id])

        if (filme.lenght === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado'
            })
        }

        res.json({
            sucesso: true,
            dados: filme[0]
        })
    } catch (error) {
        console.error('Erro ao listar filmes:', error)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar filmes',
            erro: error.message
        })
    }
})

app.post('/filmes', async(req,res)=>{
    try {
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

        if(!titulo || !genero || !duracao){
            return res.status(400).json({
                sucesso:false,
                mensagem:'Título, gênero e duração são obrigatórios.'
            })
        }
        if(typeof duracao !== 'number' || duracao <= 0){
            return res.status(400).json({
                sucesso:false,
                mensagem: 'Duração deve ser um número positivo.'
            })
        }

        const novoFilme = {
            titulo: titulo.trim(),
            genero: genero.trim(),
            duracao,
            classificacao: classificacao.trim()|| null,
            data_lancamento: data_lancamento.trim() || null
        }

        const resultado = await queryAsync('INSERT INTO filme SET ?', [novoFilme])

        res.status(200).json({
            sucesso:true,
            mensagem: 'Filme cadastrado com sucesso',
            id: resultado.InsertId
        })
    } catch (erro) {
        console.error('Erro ao salvar filme:', erro)

        res.status(500).json({
            sucesso:false,
            mensagem:'Erro ao salvar filme.',
            erro: erro.message
        })
    }
})

app.put('/filmes/:id', async(req,res) => {
    try {
        const {id} = req.params
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

        if(!id || isNaN(id)){
            return req.status(400).json({
                sucesso:false,
                mensagem:'ID Filme inválido'
            })
        }

        const filmeExiste = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])

        if(filmeExiste.lenght === 0){
            return res.status(404).json({
                sucesso:false,
                mensagem: 'Filme não encontrado'
            })
        }

        const filmeAtualizado = {}

        if(titulo !== undefined) filmeAtualizado.titulo = titulo.trim() 
        if(genero !== undefined) filmeAtualizado.genero = genero.trim()
        if(duracao !== undefined){
            if(typeof duracao !== 'number' || duracao <= 0){
                return res.status(400).json({
                    sucesso:false,
                    mensagem: 'Duração deve ser um número positivo'
                })
            }
            filmeAtualizado.duracao = duracao
        }
        if(classificacao !== undefined) filmeAtualizado.classificacao = classificacao
        if(data_lancamento !== undefined) filmeAtualizado.data_lancamento = data_lancamento

        if(Object.keys(filmeAtualizado).length === 0){
            return res.status(400).json({
                sucesso:false,
                mensagem: 'Nenhum campo para atualizar.'
            })
        }

        await queryAsync('UPDATE filme SET ? WHERE id = ?', [filmeAtualizado, id])
        res.json({
            sucesso:true,
            mensagem:'Filme atualizado',
        })
    } catch (erro) {
        console.error('Erro ao atualizar filme', erro)
        res.status(500).json({
            sucesso:false,
            mensagem:'Erro ao atualizar filme.',
            erro: erro.message
        })
    }
})

app.delete('/filmes/:id', async(req,res) =>{
    try {
        const{id} = req.params
        
        if(!id || isNaN(id)){
            return req.status(400).json({
                sucesso:false,
                mensagem:'ID Filme inválido'
            })
        }

        const filmeExiste = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])

        if(filmeExiste.lenght === 0){
            return res.status(404).json({
                sucesso:false,
                mensagem: 'Filme não encontrado'
            })
        }

        await queryAsync('DELETE FROM filme WHERE id = ?', [id])
        res.status(200).json({
            sucesso:true,
            mensagem: 'Filme eliminado com sucesso'
        })

    } catch (erro) {
        console.error('Erro ao deletar filme', erro)
        res.status(500).json({
            sucesso:false,
            mensagem:'Erro ao deletar filme.',
            erro: erro.message
        })
    }
})

app.get('/salas', async (req,res) =>{
    try {
        const salas = await queryAsync('SELECT * FROM sala')

        res.json({
            sucesso: true,
            dados: salas,
            salas: salas.lenght
        })
    } catch (erro) {
        console.error('Erro ao listar salas', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar salas',
            erro: erro.mensage 
        })
    }
})

app.get('/salas/:id', async(req,res) => {
    const {id} = req.params
    try {
        const {id} = req.params

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de sala inválido'
            })
        }
        const sala = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])

        if (sala.lenght === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada'
            })
        }

        res.json({
            sucesso: true,
            dados: sala[0]
        })
    } catch (erro) {
        console.error('Erro ao listar salas:', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar salas',
            erro: erro.message
        })
    }
})


app.post('/salas', async(req,res) =>{
    try {
    const {id, nome, capacidade} = req.body

    if(!nome){
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O nome da sala é obrigatório'
        })
    }
    if(typeof capacidade !== 'number' || capacidade <= 0){
        return res.status(400)({
            sucesso: false,
            mensagem: 'A capacidade deve ser um número positivo'
        })
    }

    const novaSala = {
        nome: nome.trim(),
        capacidade
    }

    const resultado = await queryAsync('INSERT INTO sala SET ?', [novaSala])

    res.status(200).json({
        sucesso: true,
        mensagem: 'Sala cadastrada com sucesso',
        id: resultado.InsertId
    })
    } catch (erro) {
        console.error('Erro ao salvar sala', erro)

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao salvar sala',
            erro: erro.mensage
        })
    }
})

app.put('/salas/:id', async(req,res) => {
    try {
        const {id} = req.params
        const {nome, capacidade} = req.body

        if(!id || isNaN(id)){
            return req.status(400).json({
                sucesso:false,
                mensagem:'ID Sala inválido'
            })
        }

        const salaExiste = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])

        if(salaExiste.lenght === 0){
            return res.status(404).json({
                sucesso:false,
                mensagem: 'Sala não encontrada'
            })
        }

        const salaAtualizada = {}

        if(nome !== undefined) salaAtualizada.nome = nome.trim() 
        if(capacidade !== undefined){
            if(typeof capacidade !== 'number' || capacidade <= 0){
                return res.status(400).json({
                    sucesso:false,
                    mensagem: 'Capacidade deve ser um número positivo'
                })
            }
            salaAtualizada.capacidade = capacidade
        }

        if(Object.keys(salaAtualizada).length === 0){
            return res.status(400).json({
                sucesso:false,
                mensagem: 'Nenhum campo para atualizar.'
            })
        }

        await queryAsync('UPDATE sala SET ? WHERE id = ?', [salaAtualizada, id])
        res.json({
            sucesso:true,
            mensagem:'Sala atualizada',
        })
    } catch (erro) {
        console.error('Erro ao atualizar sala', erro)
        res.status(500).json({
            sucesso:false,
            mensagem:'Erro ao atualizar sala.',
            erro: erro.message
        })
    }
})

app.delete('/salas/:id', async(req,res) =>{
    try {
        const{id} = req.params
        
        if(!id || isNaN(id)){
            return req.status(400).json({
                sucesso:false,
                mensagem:'ID Sala inválido'
            })
        }

        const salaExiste = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])

        if(salaExiste.lenght === 0){
            return res.status(404).json({
                sucesso:false,
                mensagem: 'Sala não encontrada'
            })
        }

        await queryAsync('DELETE FROM sala WHERE id = ?', [id])
        res.status(200).json({
            sucesso:true,
            mensagem: 'Sala eliminada com sucesso'
        })

    } catch (erro) {
        console.error('Erro ao deletar sala', erro)
        res.status(500).json({
            sucesso:false,
            mensagem:'Erro ao deletar sala.',
            erro: erro.message
        })
    }
})

app.get('/sessoes', async (req,res) =>{
    try {
        const sessao = await queryAsync('SELECT * FROM sessao')

        res.json({
            sucesso: true,
            dados: sessao,
            salas: sessao.lenght
        })
    } catch (erro) {
        console.error('Erro ao listar sessoes', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar sessoes',
            erro: erro.mensage 
        })
    }
})

app.get('/sessoes/:id', async(req,res) => {
    const {id} = req.params
    try {
        const {id} = req.params

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de sessão inválido'
            })
        }
        const sessao = await queryAsync('SELECT * FROM sessao WHERE id = ?', [id])

        if (sessao.lenght === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sessão não encontrada'
            })
        }

        res.json({
            sucesso: true,
            dados: sessao[0]
        })
    } catch (erro) {
        console.error('Erro ao listar sessões:', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar sessões',
            erro: erro.message
        })
    }
})

app.post('/sessoes', async(req,res) =>{
    try {
    const {preco} = req.body

    if(!nome){
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O id da sessão é obrigatório'
        })
    }
    if(typeof preco !== 'number' || preco <= 0){
        return res.status(400)({
            sucesso: false,
            mensagem: 'O preço deve ser um número positivo'
        })
    }

    const novaSessao = {
        preco
    }

    const resultado = await queryAsync('INSERT INTO sessao SET ?', [novaSessao])

    res.status(200).json({
        sucesso: true,
        mensagem: 'Sessão cadastrada com sucesso',
        id: resultado.InsertId
    })
    } catch (erro) {
        console.error('Erro ao salvar sessão', erro)

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao salvar sessão',
            erro: erro.mensage
        })
    }
})

module.exports = app




// const express = require(`express`)
// const pool = require(`./config/database`)

// const app = express()

// app.use(express.json())

// app.get(`/`, (req,res) =>{
//     res.send("Api-Cinema")
// })

// app.get('/filmes', (req,res) =>{
//     pool.query('SELECT * FROM filme',(err, results =>{
//         res.json(results)
//     }))
// })

// module.exports = app

    // pool.query('SELECT * FROM filme', (err, results) =>{
    //     res.json(results)