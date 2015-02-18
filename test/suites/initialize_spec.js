describe("Initialization", function() {

	it ("should exist", function() {
		expect(Gumshoe)
			.toBeDefined();
 	});

	it ("should have a default endpoint", function() {
 		expect(Gumshoe.endpoint)
			.toEqual("/data");
	});

});
