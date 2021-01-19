const hapi = require('hapi')
const Postgres = require('./db/postgres/postgres')
const ProdutoShcema = require('./db/postgres/schema/ProdutoSchema')
const Context = require('./db/base/strategy')
const ProdutoRoute = require('./routes/ProdutoRoute')


const app = new hapi.server({
    port: 5000
})
function mapRoutes(instance, methods){
    return methods.map(method => instance[method]())
}

async function main (){
   
    const connectionPostgress = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgress, ProdutoShcema)
    const contextPostgress = new Context(new Postgres(connectionPostgress,model))
    app.route([
        ...mapRoutes(new ProdutoRoute(contextPostgress), ProdutoRoute.methods())

    ])

    await app.start()
    console.log('Servidor rodando na porta', app.info.port)
    return app
}

module.exports =main()