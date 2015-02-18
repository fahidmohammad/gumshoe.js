describe("Object merging", function() {

	beforeEach(function() {
		Gumshoe.debug = true;
	});

	afterEach(function() {
		Gumshoe.debug = false;
	});

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

 		expect(Gumshoe.merge(defaults, additions))
 			.toEqual({
 				'a' : 1,
 				'b' : 'foo',
 				'c' : 'bar',
 				'd' : 'baz'
 			});
 	});

});


describe("Timestamp formatting", function() {

	beforeEach(function() {
		Gumshoe.debug = true;
	});

	afterEach(function() {
		Gumshoe.debug = false;
	});

 	it ("should format timestamps to a proper ISO Strings", function() {
 		expect(Gumshoe.formatTimestamp(new Date('2001')))
 			.toBe((new Date(Date.UTC(2001, 0, 1, 0, 0, 0, 0))).toISOString());

 		expect(Gumshoe.formatTimestamp(new Date('2001-02')))
 			.toBe((new Date(Date.UTC(2001, 1, 1, 0, 0, 0, 0))).toISOString());

 		expect(Gumshoe.formatTimestamp(new Date('2001-02-03')))
 			.toBe((new Date(Date.UTC(2001, 1, 3, 0, 0, 0, 0))).toISOString());

 		expect(Gumshoe.formatTimestamp(new Date('2001-02-03T11:32:02.250Z')))
 			.toBe((new Date(Date.UTC(2001, 1, 3, 11, 32, 2, 250))).toISOString());

 		expect(Gumshoe.formatTimestamp(new Date('2001-02-03T23:32:02.250Z')))
 			.toBe((new Date(Date.UTC(2001, 1, 3, 23, 32, 2, 250))).toISOString());
	});

	it ("should throw errors on invalid dates", function() {
		expect(function() { Gumshoe.formatTimestamp(new Date('foobar')) })
 			.toThrow();
	});

});


describe("UUID generation", function() {

	beforeEach(function() {
		Gumshoe.debug = true;
	});

	afterEach(function() {
		Gumshoe.debug = false;
	});

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

//isDifferentOrigin
