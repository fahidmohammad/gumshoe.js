# Gumshoe

A JavaScript tracking class for Hyatt.com analytics.  By default, the script will report basic
information to the Hyatt Analytics Warehouse; however, the information reported can be modified and
appended significantly.


# Usage

1. Include the gumshoe.js file at the bottom of your page:
	
```html
<script src="gumshoe.js" type="text/javascript"></script>
```
	
2. (Optional) Set any optional Gumshoe parameters, after loading the library, to customize reporting:
	
	```javascript
	
	// Change the endpoint from the Hyatt default
	Gumshoe.endpoint = "/gumshoe";
	
	// Customize the prefix for the event ID for better tracking purposes
	Gumshoe.prefix = "my-custom-data-event";
	
	
	```

## Custom Events

The Gumshoe library can also record asynchronous events:

	```javascript
	
	Gumshoe.record("my_event", {
		my_datapoint: "my value"
	});
	
	```


## Event Logging

The Gumshoe library provides events to watch tracking:

	```javascript
	
	Gumshoe.on("record", function(events) {
		console.log("Sent event(s): ", events)
	});
	
	```


## Timestamp Overrides

The Gumshoe default can be overriden by providing a client timestamp with the `client_timestamp` 
property (useful for asynchronous calls):

	```javascript
	
	var storedTimestamp = new Date();
	
	setTimeout(function() {
		
		Gumshoe.record("my_event", {
			client_timestamp: storedTimestamp,
			my_datapoint:     "my value"
		});
		
	}, 1500);
	
	```


## Debugging

At any time, you can set Gumshoe into debug mode to receive verbose information on AJAX requests being
processed in the browser console:

	```javascript
	
	Gumshoe.debug = true;
	
	```


# Support

This project is maintained by the Hyatt.com Rearchitecture Group.  Questions can be directed to
[Andrew Vaughan](mailto:andrew.vaughan@hyatt.com)