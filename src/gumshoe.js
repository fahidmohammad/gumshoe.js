/*! Gumshoe v0.1.0 | (c) 2015 Hyatt Hotels Corporation | http://www.apache.org/licenses/LICENSE-2.0 */

(function() {
	
	/**
	 * Creates the Gumshoe global function for use.
	 * 
	 * @param {string} endpoint - The endpoint to direct requests to.  Defaults to /data.
	 */
	var Gumshoe = this.Gumshoe = function(endpoint) {
		this.endpoint = endpoint || "/data";
		this.listeners = {
			record: []
		};
	};
	
	
	/**
	 * Records an event.
	 * 
	 * @param {string} eventName - The name of the event to log.
	 * @param {object} data - The data to log for the event.
	 */
	Gumshoe.prototype.record = function(eventName, data) {
		var defaults = {
			"event_id":         Gumshoe.generateUUID(),
			"event_name":       eventName.toString().toLowerCase(),
			"client_timestamp": formatTimestamp(new Date())
		};
		
		var ajaxData = Gumshoe.merge(data, defaults);
		var endpoint = this.endpoint || Gumshoe.endpoint;
		
		if (!endpoint) {
			Gumshoe.logError("Gumshoe.record", "No endpoint defined");
			return;
		}
		
		Gumshoe.logInfo("Gumshoe.record", endpoint + " ==> " + JSON.stringify(ajaxData)));
		
	    fireRequest(endpoint, ajaxData, false);
	    fireEvent(this.listeners.record, ajaxData);
	};
	
	
	/**
	 * Registers a listener with Gumshoe.
	 * 
	 * @param {string} name - The name of the event to listen on.
	 * @param {function} listener - The callback function to trigger on event.
	 */
	Gumshoe.prototype.on = function(name, listener) {
		this.listeners[name].push(listener);
	};
	
	
	// Gumshoe.generateUUID()
	// Gumshoe.merge(object, object)
	
	// Gumshoe.logInfo(string)
	// Gumshoe.logWarning(string)
	// Gumshoe.logError(string)
	
	// fireRequest(endpoint, data, synchronous)
	// fireEvent(listeners, data)
	
	// formatTimestamp(date)
	
}).call(this);