function Module() {
    this.events = [];
    this.eventListeners = {};
}
Module.prototype.setListenere = function(event, callback)
    {
        if (this.events.indexOf(event)>=0 && typeof callback === 'function')
        {
            if (typeof this.eventListeners[event] === 'undefined')
            {
                this.eventListeners[event] = [];
            }
            if (this.eventListeners[event].indexOf(callback)>=0)
            {
                return;
            }
            this.eventListeners[event].push(callback);
        }
    };

Module.prototype.unsetListener = function(eventData)
    {
        if (typeof this.eventListeners[eventData.event] !== 'undefined')
        {
            delete this.eventListeners[eventData.event][eventData.index];
            //this.eventListeners[eventData.event] = this.eventListeners[eventData.event].splice(eventData.index, 1);
        }
    };

Module.prototype.dispatchEvent = function(event,data)
    {
        if (typeof this.eventListeners[event] !== 'undefined')
        {
            for (var i in this.eventListeners[event])
            {
                if (this.eventListeners[event].hasOwnProperty(i) && this.eventListeners[event][i])
                {
                    this.eventListeners[event][i]({index: i, event: event}, data);
                }
            }
        }
    };



module.exports = Module;