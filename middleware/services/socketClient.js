/**
 * Created by maxim.bondarenko on 04/11/2016.
 */
function socketClient(socket){
    this.socket = socket;
    this._erroHandler;
}

socketClient.prototype.getId = function(){
    return this.socket.id;
}

socketClient.prototype.setErrorHandler = function(errorCallback){
    this._erroHandler = errorCallback;
}

socketClient.prototype.isAutorize = function(){
    return (this.socket.request.session && this.socket.request.session.user);
}

socketClient.prototype.getUserData = function(){
    if(this.socket.request.session && this.socket.request.session.user)
    {
        return this.socket.request.session.user;
    }
}

socketClient.prototype.setUserData = function(data){
    if(this.socket.request.session)
    {
        this.socket.request.session.user = data;
        if (data && data.pass)
        {
            delete data.pass;
            this.socket.request.session.save(function(err,data) {
                //TODO:: error handling
            });
        };
    }
}

socketClient.prototype.setTimeDiff = function(data){
    if(this.socket.request.session)
    {
        this.socket.request.session.timeDiff = data;
        this.socket.request.session.save(function(err,data) {
            //TODO:: error handling
        });
    }
}

socketClient.prototype.setEvent = function(event,callback)
{
    this.socket.on(event, function(){
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(this);
        try{
            callback.apply(callback.bind,  args);
        }
        catch (error)
        {
            if (typeof this._erroHandler === 'funcion')
            {
                this._erroHandler(this, event, error);
            }
        }
    }.bind(this));
}
module.exports = socketClient;