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
			Gumshoe.logError("record", "No endpoint defined");
			return;
		}
		
		Gumshoe.logInfo(endpoint + " ==> " + JSON.stringify(ajaxData)));
		
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
	
	
	/**
	 * Sends an informative log to the console, if debugging is enabled.
	 * 
	 * @param {string} log - The log data to send to the console.
	 */
	Gumshoe.logInfo = function(log) {
		if (Gumshoe.debug) {
			console.log(log);
		}
	};
	
	
	/**
	 * Sends a warning to the console, if debugging is enabled.
	 * 
	 * @param {string} source - The source of the warning.
	 * @param {string} warning - The warning to log.
	 */
	Gumshoe.logWarning = function(source, warning) {
		if (Gumshoe.debug) {
			console.group("Gumshoe Warning (%s)", source);
			console.warn(warning);
			console.groupEnd();
		}
	};
	
	
	/**
	 * Throws an error from the Gumshoe library, if debugging is enabled.
	 * 
	 * @param {string} source - The source of the error.
	 * @param {string} error - The error string to throw.
	 */
	Gumshoe.logError = function(source, error) {
		if (Gumshoe.debug) {
			throw "Gumshoe(" + source + ") ERROR: " + error;
		}
	};
	
	
	// fireRequest(endpoint, data, synchronous)
	// fireEvent(listeners, data)
	
	// formatTimestamp(date)
	
}).call(this);