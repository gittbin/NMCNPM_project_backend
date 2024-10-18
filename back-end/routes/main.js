const login=require('./introduce')
const temperary_public=require('./temperary_public')
const userRoleRoutes = require('./user_role_route')
function routes(app){
    app.use('/',temperary_public)    
    app.use('/login',login);
}
module.exports = routes