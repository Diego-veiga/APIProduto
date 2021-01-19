const { deepEqual } = require('assert')
const assert = require('assert')
const Context = require('../db/base/strategy')
const postgres = require('../db/postgres/postgres')
const ProdutoShcema = require('../db/postgres/schema/ProdutoSchema')


const PRODUTO_CADASTRAR ={
    nome: `banana`,
    precovenda:3.50,
    descricao: 'Produto muito gostoso'

}

const PRODUTO_DELETAR ={
    nome: `delete`,
    precovenda:15.50,
    descricao: 'Produto para deletar'

}
const PRODUTO_Atualziar ={
    nome: `morango`,
    precovenda:15.50,
    descricao: 'produto vermelho'

}



describe('Postgres test', function(){
    this.timeout(Infinity)
    this.beforeAll(async function(){
        const connection = await postgres.connect()
        const model= await postgres.defineModel(connection, ProdutoShcema)
        context= new Context(new postgres(connection, model))
        ObjDeletar= await context.create(PRODUTO_DELETAR)
        await context.create(PRODUTO_Atualziar)
        
    })
    it('autenticação',  async function(){
       const result = await context.isConnected()
       assert.ok(result, true)

    })
    it('cadastrar', async function(){
        const [produto] = await context.read({nome: PRODUTO_CADASTRAR.nome})
        
        if(!!produto){
        
             await context.delete(produto.id)
        }
        const result = await context.create(PRODUTO_CADASTRAR)
        delete result.id

        assert.deepEqual(result, PRODUTO_CADASTRAR)
    })
    it('Listar', async function(){

        const [result] = await context.read({nome: PRODUTO_CADASTRAR.nome})
       
        
        assert.deepEqual(result.nome, PRODUTO_CADASTRAR.nome)
    })
    it('deletar', async function(){
    
     const id = ObjDeletar.id
     
     const result =  await context.delete(id)
     assert.deepEqual(result,1)
    })
    it('atualizar', async function(){

    const [t] = await context.read({nome: 'Caju'})
    
    if(!!t){        
        let identificador = t.id
        
        const del =await context.delete(identificador)  
      
     }
        const [itemAtualziar] = await context.read({nome: PRODUTO_Atualziar.nome})
        const novoItem ={
           ...PRODUTO_Atualziar,
           nome:'Caju'
        }
        
        const [result] = await context.update(itemAtualziar.id, novoItem)
        const [itemAtualziado] = await context.read({id: itemAtualziar.id})
         assert.deepEqual(result,1)
         assert.deepEqual(novoItem.nome, itemAtualziado.nome)
    
    })
})