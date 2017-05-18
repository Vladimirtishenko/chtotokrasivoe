/**
 * Created by maxim.bondarenko on 31/10/2016.
 */
function AppServerError(name,message,level)
{
    var data = {};
    data.name = (name !== undefined) ? name : 'Undefined error';
    data.level = (level !== undefined || !Number.isInteger(level)) ? level : 0;
    data.message = (message !== undefined) ? message : '';
    data.toString = function(){return data.name + ": " + data.message;};
    return data;
}

module.exports = AppServerError;