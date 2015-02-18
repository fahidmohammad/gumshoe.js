# Gumshoe

A JavaScript tracking class for Hyatt.com analytics.


# Dependencies

This library requires JQuery to be available before it is loaded.


# Building from Source

A UNIX Makefile is included to provide ease-of-use for builds.  Available options are `make`, `make test`, and `make clean`.

There are several dependencies required for builds, all of which are contained in an NPM package.json for ease-of-use.  A full build can be performed by following these steps:

1. Install [Node.js and NPM](https://docs.npmjs.com/getting-started/installing-node)
2. Install package dependencies by running `npm install` in the project root directory
3. Run `make` in the project root directory

To run tests with Phantom.js, perform steps 1-2 above, and continue with the following:

1. Run `make test` in the project root directory


# Usage

Include the Gumshoe.js file in the bottom of your page:

```html
<script src="jquery.js" type="text/javascript"></script>
<script src="gumshoe.js" type="text/javascript"></script>
```

(Optional) Set any optional Gumshoe parameters, after loading the library, to customize reporting:

```javascript
// Change the endpoint from the Hyatt default
Gumshoe.endpoint = "/my-data-endpoint";

// Customize the suffix for the event ID for better tracking purposes
Gumshoe.suffix = "my-custom-data-event";
```

## Custom Events

The Gumshoe library can also record asynchronous events:

```javascript
Gumshoe.record("my_event", {
	my_datapoint: "my value"
});
```

Events are sent asynchronously by default, but an optional third parameter will cause a recorded
event to be logged in a synchronous manner:

```javascript
Gumshoe.record("my_event", { my_datapoint: "my value" }, true);
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

This project is maintained by the Analytics Development Group.  Questions can be directed to
[Andrew Vaughan](mailto:andrew.vaughan@hyatt.com)