describe("XHR requests", function() {

	beforeEach(function() {
		Gumshoe.debug = true;
	});

	afterEach(function() {
		Gumshoe.debug = false;
	});

	it ("should return an XHR object", function() {
		expect(Gumshoe.getXHR)
			.not
			.toBeFalsy();
	});

});

describe("Posting an AJAX call", function() {

	beforeEach(function() {
		Gumshoe.debug = true;
	});

	afterEach(function() {
		Gumshoe.debug = false;
	});

	it ("should rely on jQuery for standard posts", function() {
		jasmine.createSpyObj('jQuery', ['ajax']);

		expect(jQuery.ajax)
			.toBeDefined();

/*
		Gumshoe.post({ 'foo': 'bar' }, false);

		expect(jQuery.ajax)
			.toHaveBeenCalled();
	});

	it ("should rely on XHR for raw posts", function() {
*/
	});

});


// fireRequest

