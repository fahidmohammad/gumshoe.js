describe("Array Helpers", function() {

 	it ("should merge objects correctly", function() {
 		var defaults = {
 			'a' : 1,
 			'b' : 2,
 			'c' : 3
 		};

 		var additions = {
 			'b' : 'foo',
 			'c' : 'bar',
 			'd' : 'baz'
 		};

 		expect(Gumshoe.merge(defaults, additions)).toEqual({
 			'a' : 1,
 			'b' : 'foo',
 			'c' : 'bar',
 			'd' : 'baz'
 		});
 	});

});


describe("Date/Time Helpers", function() {

 	it ("should format timestamps to a proper ISOString", function() {
 		// @TODO
	});

});


describe("GUIDs", function() {

	it ("should generate a proper UUID", function() {
		expect(Gumshoe.generateUUID())
			.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
	});

	it ("should generate unique UUIDs", function() {
		expect(Gumshoe.generateUUID())
			.not
			.toEqual(Gumshoe.generateUUID());
	});

});
