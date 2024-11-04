const login=require('./introduce')
const temperary_public=require('./temperary_public')
const products=require('./products')
const roles=require('./roles.route')
const accounts = require('./accounts.route') 

function routes(app){
    app.use('/',temperary_public)    
    app.use('/login',login);
    app.use('/products',products)
    app.use('/roles', roles)
    app.use('/accounts', accounts)
}
module.exports = routes