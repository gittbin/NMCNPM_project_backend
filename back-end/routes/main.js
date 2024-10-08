const login=require('./introduce')
const temperary_public=require('./temperary_public')
const products=require('./products')
function routes(app){
    app.use('/',temperary_public)    
    app.use('/login',login);
    app.use('/products',products)
    
}
module.exports = routes