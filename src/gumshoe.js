/*! Gumshoe v1.0.0
 *
 * Copyright 2015 Hyatt Hotels Corporation
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 * 
 *  @license http://www.apache.org/licenses/LICENSE-2.0
 */
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
		endpoint: "/data"
	};
	
	
	/**
	 * Records an event.
	 * 
	 * @param {string} eventName - The name of the event to log.
	 * @param {object} data - The data to log for the event.
	 * @param {boolean} synchronous - Whether to make the request synchronously (default false).
	 * 
	 * @return {boolean} Whether the call was successful.
	 */
	Gumshoe.record = function(eventName, data, synchronous) {
		var formattedData = Gumshoe.formatData(data);
		
		if (!formattedData) {
			Gumshoe.logError("record", "Data in improper format for Gumshoe.");
			return;
		}
		
		return Gumshoe.fireRequest(formattedData, synchronous);
	};
	
	
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
	 * Formats a data message to the proper Gumshoe format.
	 * 
	 * @param {object} data - The data object to format.
	 * 
	 * @return {object} The properly formatted object.
	 */
	Gumshoe.formatData = function(data) {
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
			result.client_timestamp = Gumshoe.formatTimestamp(new Date());
		}
		
		// Ensure the timestamp is a string
		if (typeof result.client_timestamp !== "string") {
			result.client_timestamp = Gumshoe.formatTimestamp(result.client_timestamp);
		}
		
		return result;
	};
	
	
	/**
	 * Handles request processing for Gumshoe events cross-browser.
	 * 
	 * @param {object} data - The data to log for the event.
	 * @param {boolean} synchronous - Whether to make the request synchronously (default false).
	 * 
	 * @return {boolean} Whether the call was successful.
	 */
	Gumshoe.fireRequest = function(data, synchronous) {
	    if (data === undefined || (data instanceof Array && data.length === 0)) {
	      Gumshoe.logError("No data to send in request.");
	      return;
	    }
		
	    if (!Gumshoe.endpoint) {
	      Gumshoe.logError("No endpoint defined for request.");
	      return;
	    }
		
		// Determine if the endpoint is on another origin
		var result = false;
		
		var a = document.createElement('a');
		a.href = Gumshoe.endpoint;

		// Different origin requests
		if (Gumshoe.isDifferentOrigin(window.location, a)) {
			
			// Handle IE calls differently (there's no differentiation between synch and async)
			if (global.XDomainRequest) {
				result = Gumshoe.postIE(data);
			}
			
			// Otherwise, do a raw post
			else {
				result = Gumshoe.postRaw(data, synchronous);
			}
		}
		
		// Same origin requests
		else {
			result = Gumshoe.post(data, synchronous);
		}
		
		// Announcements
		Gumshoe.logInfo(Gumshoe.endpoint + " ==> " + JSON.stringify(data));
		Gumshoe.fireEvent(listeners.record, data);
		
		return result;
	};
	
	
	/**
	 * Handles same-domain requests.
	 * 
	 * @param {object} data - The data to log for the event.
	 * @param {boolean} synchronous - Whether to make the request synchronously (default false).
	 * 
	 * @return {boolean} Whether the call was successful.
	 */
	Gumshoe.post = function(data, synchronous) {
		var status = false;

		withRetries(2, function(retry) {
			
			jQuery.ajax({
				type:			"POST",
				url:			Gumshoe.endpoint,
				contentType:	"text/plain",
				async:			!synchronous,
				data:			JSON.stringify(data),
				
				error: function() {
					retry();
				},

				success: function() {
					status = true;
				}
			});
			
		});

		if (!status) {
			Gumshoe.logWarning("post", "Failed to post after 3 attempts");
		}

		return status;
	};
	
	
	/**
	 * Handles cross-domain requests for all browser except IE.
	 * 
	 * @param {object} data - The data to log for the event.
	 * @param {boolean} synchronous - Whether to make the request synchronously (default false).
	 * 
	 * @return {boolean} Whether the call was successful.
	 */
	Gumshoe.postRaw = function(data, synchronous) {
		var status = false;

		withRetries(2, function(retry) {
			
			var xhr = Gumshoe.getXHR();
			if (!xhr) {
				return;
			}
			
			xhr.open("POST", Gumshoe.endpoint, !synchronous);
			xhr.setRequestHeader("Content-Type", "text/plain");
			
			xhr.onreadystatechange = function() {
				if (xhr.readyState != 4) {
					Gumshoe.logWarning("postRaw", "XHR not in ready state");
					return;
				}
				if (xhr.status != 200) {
					retry();
				} else {
					status = true;
				}
			}
			
			xhr.send(JSON.stringify(data));

		});

		if (!status) {
			Gumshoe.logWarning("postRaw", "Failed to post after 3 attempts");
		}

		return status;
	};
	
	
	/**
	 * Handles cross-domain requests for IE.
	 * 
	 * @param {object} data - The data to log for the event.
	 *
	 * @return {boolean} Whether the call was successful.
	 */
	Gumshoe.postIE = function(data) {
		var status = false;

		withRetries(2, function(retry) {
			
			var xdr = new global.XDomainRequest();
			
			xdr.onerror = function() {
				status = false;
				retry();
			};
			
			status = true;

			xdr.open("post", Gumshoe.endpoint);
			xdr.send(JSON.stringify(data));

		});

		if (!status) {
			Gumshoe.logWarning("postIE", "Failed to post after 3 attempts");
		}

		return status;
	};
	
	
	/**
	 * Returns the XHR to use for all requests.
	 * 
	 * @return {object} the XHR object to use for requests.
	 */
	Gumshoe.getXHR = function() {
		if (global.XMLHttpRequests && ('file:' != global.location.protocol || !global.ActiveXObject)) {
			return new XMLHttpRequest();
		}
		
		try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
		try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
		try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
		try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
		
		return false;
	};
	
	
	/**
	 * Fires an event at the provided listeners.
	 * 
	 * @param {string} listeners - An array of listener callbacks to call.
	 * @param {object} data - The data to provide with the callback.
	 */
	Gumshoe.fireEvent = function(listeners, data) {
		for (var i in listeners) {
			try {
				listeners[i](data);
			} catch (e) {
				Gumshoe.logWarning("event", "Error calling listener " + listeners[i].toString());
			}
		}
	};
	
	
	/**
	 * Helper function that merges two arrays, overriding any new data.
	 * 
	 * @param {array} source - The source array of default data.
	 * @param {array} data - New data to apply to the source array.
	 * 
	 * @return {array} The combined arrays.
	 */
	Gumshoe.merge = function(source, data) {
		var key, result = {};
		
		for (key in source) {
			result[key] = source[key];
		}
		
		for (key in data) {
			result[key] = data[key];
		}
		
		return result;
	};
	
	
	/**
	 * Helper function to format timestamps into ISO String.  Date.toISOString() is inconsistent
	 * across browsers as to whether it displays milliseconds, so this function forces that
	 * functionality.
	 * 
	 * @param {Date} date - The Date object to format.
	 * 
	 * @return {string} The formatted timestamp.
	 */
	Gumshoe.formatTimestamp = function(date) {
		if (!(date instanceof Date) || isNaN(date.getTime())) {
			Gumshoe.logError("formatTimestamp", "Invalid date provided.");
		}

		return date.getUTCFullYear() + "-" +
			pad(date.getUTCMonth() + 1) + "-" +
			pad(date.getUTCDate()) + "T" + 
			pad(date.getUTCHours()) + ":" + 
			pad(date.getUTCMinutes()) + ":" +
			pad(date.getUTCSeconds()) + "." +
			String((date.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) + "Z";
	};
	
	
	/**
	 * Generates and returns a UUID.
	 * 
	 * @return {string} The UUID generated.
	 */
	Gumshoe.generateUUID = function() {
		
		// Assists with UUID creation
		var seed = function() {
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
			throw new Error("Gumshoe(" + source + ") ERROR: " + error);
		}
	};


	Gumshoe.isDifferentOrigin = function(viewport, target) {
		if (target.host.length === 0) {
			return false;
		} else {
			return (viewport.protocol + viewport.host !== target.protocol + target.host);
		}
	};
	
	
	/**
	 * Retries calling a function if there is a failure.
	 * 
	 * @param {int} retries - The number of retries remaining.
	 * @param {function} method - The function to attempt.
	 * 
	 * @return The result of the method.
	 */
    var withRetries = function(retries, method) {
		var doRetry = function() {
			if (retries > 0) {
				retries--;
				method(doRetry);
			}
		};
		
		method(doRetry);
	};


	/**
	 * Pads numbers for dates
	 * 
	 * @link https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/toISOString#Compatibility
	 * 
	 * @param {int} number - The number to pad to two digits.
	 * 
	 * @return The padded number.
	 */
	var pad = function(number) {
		var s = String(number);
		if (s.length === 1) {
			s = '0' + s;
		}
		return s;
	};
	
}).call(this);