describe("GUIDs", function() {

	it ("should generate a proper UUID", function() {
		expect(Gumshoe.generateUUID()).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
	});

	it ("should generate unique UUIDs", function() {
		expect(Gumshoe.generateUUID()).not.toEqual(Gumshoe.generateUUID());
	});

});