
const BaseRoute = require("./base/baseRoute")
const joi = require('joi');
const failAction= (request,handler,erro)=>{
    throw erro;
}

class ProdutoRoute extends BaseRoute{
    constructor(db){
        super()
        this.db = db
    }
    list(){
        return{
            path: '/produtos',
            method: 'GET',
            config:{
                validate:{
                    failAction: failAction,

                    query:{
                        nome: joi.string()
                    }
                }

            },
            handler: async (request)=>{
               
                try {
                    const { nome} = request.query
                    const [result] =  await this.db.read({nome: nome})
                    return result
                    
                } catch (error) {
                 
                    console.log('error',error)
                    
                }
                
            }
        }
    }

    create(){
        return{
            path:'/produtos',
            method:'POST',
            config:{
                validate:{
                    failAction,
                    payload:{
                        nome: joi.string().required().max(50).min(3),
                        precovenda: joi.number().required(),
                        descricao: joi.string().max(100)

                    }
                }
            },
            handler: async(request)=>{
                try {
                    const {nome, precovenda} = request.payload
                    const result = await this.db.create({nome, precovenda})
                    return{
                        message:'Produto cadastrado com sucesso',
                        id:result.id
                    }
                    
                } catch (error) {
                    
                    console.log('error',error)
                }

            }
        }
    }
    update() {
        return {
            path: '/produtos/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Deve atualizar heroi por id',
                notes: 'Pode atualizar qualquer campo',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                      },
                    payload: {
                        nome: joi.string().max(100),
                        precovenda: joi.number(),
                        descricao: joi.string().max(100)
                    },
                    
                    params: {
                        id: joi.number().required()
                    }
                },

            },
            handler: async (request) => {
                try{
                    const {id} =request.params
                    const {payload} = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    const [result] = await this.db.update(id, dados)
                     
                    console.log('RESULT', result)
                    if(result === 0){
                        console.log('ENTREI AQUI ')
                        return{message: `O ${id} não foi encontrado no banco de dados`}
                    }
                   
                    return {
                        message: 'Produto atualziado com sucesso'
                    }
                }catch(error){
                    console.error('Deu ruim' , error)
                    
                }
               
            }
        }
    }





}
module.exports = ProdutoRoute