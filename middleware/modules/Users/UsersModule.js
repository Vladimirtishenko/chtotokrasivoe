var parent = require('../../core/module');
var userClass = require('./models/User');
var passHash = require('./services/password');
var usertModel = new userClass();

function UsersModule() {
    parent.apply(this, arguments);
    this.events = [
        'userFounded',
        'userCreated',
        'userLogined',
        'autoryzeCompleted'
    ];
}

UsersModule.prototype = Object.create(parent.prototype);
UsersModule.prototype.constructor = UsersModule;

UsersModule.prototype.registerUser = function(email, pass, city, role, callback){
    var userData = {
        uname: email.split('@')[0],
        email: email,
        pass: passHash.hash(pass),
        city: city || 'Белгород',
        role: role || 'customer'
    };
    var entity = usertModel.createEntity(userData);
    usertModel.saveToStorage(entity, 'create', function(user)
    {
        if (user && user.pass)
        {
            delete user.pass;
        }
        if(callback){
            callback(user);
        } else {
            this.dispatchEvent('userCreated', user);
        }
    }.bind(this))
};


UsersModule.prototype.autoryze = function(email, pass, callback){
    usertModel.getEntity(email, function(user)
    {
        if (!user || !passHash.validate(user.pass, pass))
        {
            user = false;
        }
        else {
            delete user.pass;
        }
        if(callback){
            callback(user);
        } else {
          this.dispatchEvent('autoryzeCompleted', user);  
        }
    }.bind(this));
};

module.exports = UsersModule;