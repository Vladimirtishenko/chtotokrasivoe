var parent = require('../../../core/model');
var mongoose = require('../../../../lib/mongoose');
var error = require('../../../core/AppServerError');
var dProv = require('./SchemaModel');
function User() {
    parent.apply(this, arguments);
    this.dataProvider = dProv;

    this.requiredFields = ["email","pass"];
    this.entityData = {
        _id: 0,
        uname: '',
        email: '',
        city: '',
        role: 'customer',
        pass: ''
    }
}
User.prototype = Object.create(parent.prototype);
User.prototype.getEntity = function(email, callback)
{
    this.dataProvider.findOne({email: email}, function(err, user) {
        if(err) return callback(err);
        return callback(user);
    });
};

User.prototype.saveToStorage = function(entity, action, calback)
{
    if (action == 'create')
    {
        delete  entity._id;
        this.dataProvider.create(entity, function(err, newUser) {
            if(err) return calback(err);
            return calback(newUser);
        });
        return;
    }
    if (action == 'update')
    {
        this.dataProvider.update({_id: entity._id},entity,function(err, user) {
            if(err) return callback(err);
            return callback(user);
        });
        return;
    }
    this.__throwError("Error 'saveToStorage' ","Action parameter incorrect", 1);
};

module.exports = User;