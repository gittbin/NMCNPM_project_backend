const login=require('./introduce')
const temperary_public=require('./temperary_public')
const products=require('./products')
const roles=require('./roles.route')
const accounts = require('./accounts.route') 
const sell=require('./sell.js')
const home=require('./home.js')
const chat=require('./chat.js')
const profile=require('./profile.js')
const calendar=require('./calendar.js')
const Import = require("./import.js");
const Bank = require("./bank.js");
function routes(app){
    app.use('/',temperary_public)    
    app.use('/login',login);
    app.use('/products',products)
    app.use('/roles', roles)
    app.use('/accounts', accounts)
    app.use('/products',products)
    app.use('/sell',sell)
    app.use('/home',home)
    app.use('/chat',chat)
    app.use('/profile',profile)
    app.use('/calendar',calendar)
    app.use("/import", Import);
    app.use("/bank", Bank);
    
}
module.exports = routes;
