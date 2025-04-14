let mysql = require ('mysql2');

let conexion = mysql.createConnection({

    host: 'localhost',
    user:'root',
    password:'rutas1',
    database: 'albiweb',
    port:3306
    
});

conexion.connect(function(error){
    if (error){
        throw error;
    }else{
        console.log('CONEXION EXITOSA')
    }

});
conexion.end();