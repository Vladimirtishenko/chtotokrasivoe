var error = require('./AppServerError');
function Model(data)
{
    this.id_counter = 1;
    this.requiredFields = [];
    this.entityData = {};
    this.table = {};
}
Model.prototype.getEntityFields = function(data){
    return this.entityData;
};
Model.prototype.getRequiredFields = function(data){
    return this.requiredFields;
};

Model.prototype.createEntity = function(data)
{
    //reset id counter;
    if (this.id_counter > 100000)
    {
        this.id_counter = 1;
    }
    var entity = {};
    for(var i = 0; i < this.requiredFields.length; i++)
    {
        if(!data.hasOwnProperty(this.requiredFields[i]))
        {
            throw new error("Error entity create","Missing required property "+this.requiredFields[i],1);
        }
    }
    entity._uid = this.id_counter++;
    for(var key in this.entityData)
    {
        if(this.entityData.hasOwnProperty(key))
        {
            entity[key] = (data.hasOwnProperty(key)) ? data[key]:
                (typeof this.entityData[key] === 'object') ?
                    JSON.parse(JSON.stringify(this.entityData[key])) : this.entityData[key];
        }
    }
    this.table[entity._uid] = entity;
    return entity;
};

Model.prototype.getEntity = function(uid)
{
    if(typeof this.table[uid] !== "undefined")
    {
        return this.table[uid];
    }
    return null;
};

Model.prototype.removeEntity = function(uid)
{
    if(typeof this.table[uid] !== "undefined")
    {
        delete this.table[uid];
    }
};

Model.prototype.saveToStorage = function()
{
    throw new error("Method not declare","Method  'saveToStorage' not declare ",1);
};

Model.prototype.removeFromStorage = function()
{
    throw new error("Method not declare","Method  'removeFromStorage' not declare ",1);
};

Model.prototype.__throwError = function(name,message,level)
{
    throw new error(name,message,level);
};

Model.prototype.clearTable = function()
{
    if(typeof this.table !== "undefined")
    {
        this.table = {};
        this.id_counter = 1;
    }
};

module.exports = Model;