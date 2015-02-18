describe("Logging functions", function() {

	beforeEach(function() {
		Gumshoe.debug = true;
	});

	afterEach(function() {
		Gumshoe.debug = false;
	});

 	it ("should send log messages to the console", function() {
 		spyOn(console, "log");

 		Gumshoe.logInfo("test log");

 		expect(console.log)
 			.toHaveBeenCalledWith("test log");
 	});

 	it ("should send warning messages")

});


describe("Debug state", function() {

	it ("should not log when debugging is off", function() {
		expect(Gumshoe.debug)
			.toBeFalsy();

		spyOn(console, "log");
		
		Gumshoe.logInfo("info");

		expect(console.log)
			.not
			.toHaveBeenCalled();
	});

	it ("should not warn when debugging is off", function() {
		expect(Gumshoe.debug)
			.toBeFalsy();

		spyOn(console, "warn");
		
		Gumshoe.logWarning("source", "warning");

		expect(console.warn)
			.not
			.toHaveBeenCalled();
	});

	it ("should not throw Errors when debugging is off", function() {
		expect(Gumshoe.debug)
			.toBeFalsy();

		expect(function() { Gumshoe.logError("source", "error") })
			.not
			.toThrow();
	});

});