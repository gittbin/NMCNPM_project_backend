const login=require('./introduce')
const temperary_public=require('./temperary_public')
const products=require('./products')
const sell=require('./sell.js')
function routes(app){
    app.use('/',temperary_public)    
    app.use('/login',login);
    app.use('/products',products)
    app.use('/sell',sell)
    
}
module.exports = routes