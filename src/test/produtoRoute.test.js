
const assert = require('assert')
const api = require('./../app')
let app ={}

const PRODUTO_CADASTRAR ={
    nome: `suco ${new Date()}`,
    precovenda:3.50,
    descricao: 'Produto em po'

}
const PRODUTO_ATUALIZAR={
    nome: `pera${new Date()}`,
    precovenda:3.50,
    descricao: 'Produto em po'
}

describe('test rota', function(){
    this.beforeAll(async ()=>{
        app = await api
        const result = await app.inject({
            method:'POST',
            url:'/produtos', 
            payload: PRODUTO_ATUALIZAR
        })
        const dados = JSON.parse(result.payload)
        PRODUTO_ATUALIZAR_ID = dados.id

    })
    it('listar', async()=>{
        const NAME='banana'
        const result = await app.inject({
            method:'GET',
            url: `/produtos?nome=${NAME}`

        })
        
        const statisCode= result.statusCode
        const dados = JSON.parse(result.payload)
        
        assert.deepEqual(statisCode, 200)
        assert.ok(dados.nome === NAME)

    })
    it('Cadastrar', async()=>{
        const result = await app.inject({
            method:'POST',
            url:'/produtos', 
            payload: PRODUTO_CADASTRAR
        })
        
        const statusCode = result.statusCode
        const {id,message} = JSON.parse(result.payload)
        assert.deepEqual(statusCode,200)
        assert.ok(message,'sucesso')
        
    })
    it('atualizar', async()=>{
       
        const result = await app.inject({
            method: 'PATCH',
            url:`/produtos/${PRODUTO_ATUALIZAR_ID}`,
            payload:{
                nome:`atualizado${new Date()}`,
                precovenda:20.54
            }

        })

        const statusCode = result.statusCode
        const message =result.payload
        
        assert.deepEqual(statusCode,200)
        assert.ok(message,"Produto atualziado com sucesso")
    })
    it.only('atualizar não existente', async()=>{
        const ID=1
        const result = await app.inject({
            method: 'PATCH',
            url:`/produtos/${ID}`,
            payload:{
                nome:`atualizado${new Date()}`,
                precovenda:20.59
            }
        })
        const statusCode = result.statusCode
        const message = result.payload
        console.log('MESSAGE',message)
       
        assert.deepEqual(statusCode ,200)
        assert.ok(message ,"O 1 não foi encontrado no banco de dados")
    })
})