const sequelize =  require('sequelize')

const ProdutoShcema = {
    name: 'Produto',
    schema:{
        id:{
            type: sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome:{
            type: sequelize.STRING,
            required: true,
            unique: true,
            allowNull: false


        },
        precovenda:{
                 type:sequelize.DECIMAL,
                 required: true,
                 allowNull: false
        },
        descricao:{
            type: sequelize.TEXT,


        }
    },
    options:{
        tableName: 'TB_Produto',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = ProdutoShcema