const { Query } = require('pg')
const Sequelize = require('sequelize')
const ICrud = require('../interface/Icrud')


class Postgres extends ICrud{
    constructor(connection, schema){
        super()
        this._connetion= connection,
        this._schema = schema

    }
    async isConnected(){
     
        try{
            
            await this._connetion.authenticate()
            return true
        }catch(error){
            console.log('fail', error)
            return false;
        }
    }
    static async defineModel(connection, schema){
        const model = connection.define(schema.name, schema.schema, schema.options)
         
         await model.sync()
         return model
     }

    static async connect(){
        const connection = new Sequelize(
            'produto',
            'minas',
            'minas123',{
                    host: 'localhost',
                    dialect: 'postgres',
                    quoteIdentifiers: false,
                    operatorsAliases: false,
                    logging: false
            }
        )
      return connection
    }
    async create(item){

         try {
            const {dataValues} = await this._schema.create(item)
            return dataValues
             
         } catch (error) {
             console.log('error',error)
             
         }
         
    }
    async delete(id){
      
        try {
            if(!id){
                return message='Id não pode ser nulo'
            }
            return await this._schema.destroy({where: {id}})

            
        } catch (error) {
            console.log('error',error)
            
        }
    }
    async read(query){

        try {
            return this._schema.findAll({where: query})
            
        } catch (error) {
            console.log('error',error) 
        }
        

    }
    async update(id, item, upsert= false){
        const fn = upsert ? 'upsert': 'update'
       
            return  this._schema[fn](item, { where: { id }})
    }
}

module.exports = Postgres