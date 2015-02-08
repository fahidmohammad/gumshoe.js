/*! Gumshoe v0.1.0 | (c) 2015 Hyatt Hotels Corporation | http://www.apache.org/licenses/LICENSE-2.0 */

(function() {
	
	/**
	 * Storage unit for listeners.
	 */
	var listeners = {
		record: []
	};
	
	
	/**
	 * The Gumshoe global object for use.
	 */
	var Gumshoe = this.Gumshoe = {
		endpoint = "/data"
	};
	
	
	/**
	 * Records an event.
	 * 
	 * @param {string} eventName - The name of the event to log.
	 * @param {object} data - The data to log for the event.
	 * @param {boolean} synchronous - Whether to make the request synchronously (default false).
	 */
	Gumshoe.record = function(eventName, data, synchronous) {
		var formattedData = formatData(data);
		
		if (!formattedData) {
			Gumshoe.logError("record", "Data in improper format for Gumshoe.");
			return;
		}
		
		var result = fireRequest(formattedData, synchronous);
		
		if (result) {
			fireEvent(listeners.record, formattedData);
		}
		
		return result;
	};
	
	/*
		Gumshoe.logInfo(endpoint + " ==> " + JSON.stringify(ajaxData)));
	*/
	
	
	/**
	 * Registers a listener with Gumshoe.
	 * 
	 * @param {string} name - The name of the event to listen on.
	 * @param {function} listener - The callback function to trigger on event.
	 */
	Gumshoe.on = function(name, listener) {
		listeners[name].push(listener);
	};
	
	
	/**
	 * Generates and returns a UUID.
	 * 
	 * @return {string} The UUID generated.
	 */
	Gumshoe.generateUUID = function() {
		
		// Assists with UUID creation
		function seed() {
			return (
				((Math.random() + 1) * 0x10000) | 0
			).toString(16).substring(1);
		}
		
		var uuid = 
			seed() + seed() + "-" +
			seed() + "-" +
			seed() + "-" +
			seed() + "-" +
			seed() + seed() + seed();
		
		if (Gumshoe.suffix) {
			uuid += "-" + encodeURI(Gumshoe.suffix);
		}
		
		return uuid;
	};
	
	
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
	
	
	/**
	 * Formats a data message to the proper Gumshoe format.
	 * 
	 * @param {object} data - The data object to format.
	 * 
	 * @return {object} The properly formatted object.
	 */
	function formatData(data) {
		var result = Gumshoe.merge({}, data);
		
		// Set a unique ID on this event
		result.event_id = Gumshoe.generateUUID();
		
		// Ensure all event names are lower case
		if (result.event_name) {
			var lowercase = result.event_name.toString().toLowerCase();
			
			if (lowercase != result.event_name) {
				Gumshoe.logWarning("record", "event_name changed from " + result.event_name + " to " + lowercase);
				result.event_name = lowercase;
			}
		}
		
		// Add a timestamp if one has not been set
		if (!result.client_timestamp) {
			result.client_timestamp = formatTimestamp(new Date());
		}
		
		// Ensure the timestamp is a string
		if (typeof result.client_timestamp !== "string") {
			result.client_timestamp = formatTimestamp(result.client_timestamp);
		}
		
		return result;
	}
	
	
	// fireRequest(data, synchronous)
	
	/**
	 * Fires an event at the provided listeners.
	 * 
	 * @param {string} listeners - An array of listener callbacks to call.
	 * @param {object} data - The data to provide with the callback.
	 */
	function fireEvent(listeners, data) {
		for (var i in listeners) {
			try {
				listeners[i](data);
			} catch (e) {
				Gumshoe.logWarning("event", "Error calling listener " + listeners[i].toString());
			}
		}
	}
	
	
	/**
	 * Helper function that merges two arrays, overriding any new data.
	 * 
	 * @param {array} source - The source array of default data.
	 * @param {array} data - New data to apply to the source array.
	 * 
	 * @return {array} The combined arrays.
	 */
	function merge(source, data) {
		var key, result = {};
		
		for (key in source) {
			result[key] = source[key];
		}
		
		for (key in data) {
			result[key] = data[key];
		}
		
		return result;
	}
	
	
	/**
	 * Helper function to format timestamps into ISO String.  Date.toISOString() is inconsistent
	 * across browsers as to whether it displays milliseconds, so this function forces that
	 * functionality.
	 * 
	 * @param {Date} date - The Date object to format.
	 * 
	 * @return {string} The formatted timestamp.
	 */
	function formatTimestamp(date) {
		
		// See https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/toISOString#Compatibility
		function pad(number) {
			var s = String(number);
			if (s.length === 1) {
				s = '0' + s;
			}
			return s;
		}
		
		return
			date.getUTCFullYear() + "-" +
			pad(date.getUTCMonth() + 1) + "-" +
			pad(date.getUTCDate()) + "T" + 
			pad(date.getUTCHours()) + ":" + 
			pad(date.getUTCMinutes()) + ":" +
			pad(date.getUTCSeconds()) + "." +
			String((now.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) + "Z";
	}
	
}).call(this);