const login=require('./introduce')
const temperary_public=require('./temperary_public')
const products=require('./products')
const sell=require('./sell.js')
const home=require('./home.js')
function routes(app){
    app.use('/',temperary_public)    
    app.use('/login',login);
    app.use('/products',products)
    app.use('/sell',sell)
    app.use('/home',home)
    
}
module.exports = routes