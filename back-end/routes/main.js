const login=require('./introduce')
const temperary_public=require('./temperary_public')
function routes(app){
    app.use('/',temperary_public)    
    app.use('/login',login);
}
module.exports = routes