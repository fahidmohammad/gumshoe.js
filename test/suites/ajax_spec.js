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

describe("Posting a standard AJAX call", function() {

	beforeEach(function() {
		Gumshoe.debug = true;
	});

	afterEach(function() {
		Gumshoe.debug = false;
	});

	it ("should rely on jQuery", function() {
		jQuery = jasmine.createSpyObj('jQuery', ['ajax']);

		expect(jQuery.ajax)
			.toBeDefined();

		Gumshoe.post({ 'foo' : 'bar' }, false);

		expect(jQuery.ajax)
			.toHaveBeenCalled();
	});

});

describe("Posting a raw AJAX call", function() {

	beforeEach(function() {
		Gumshoe.debug = true;

		Gumshoe.getXHR = jasmine.createSpy('getXHR').andReturn({
			open: function() { },
			setRequestHeader: function() { },
			onreadystatechange: function() { },
			send: function(data) {
				this.onreadystatechange();
			}
		});
	});

	afterEach(function() {
		Gumshoe.debug = false;
	});

	it ("should fail if the XHR is invalid", function() {
		var functionHolder = Gumshoe.getXHR;

		Gumshoe.getXHR = jasmine.createSpy('getXHR');

		expect(Gumshoe.getXHR)
			.toBeDefined();

		expect(Gumshoe.postRaw({ 'foo' : 'bar' }, false))
			.toBeFalsy();

		expect(Gumshoe.getXHR)
			.toHaveBeenCalled();
	});

	it ("should fail if the XHR is in a failure state", function() {
		var functionHolder = Gumshoe.getXHR;

		expect(Gumshoe.getXHR)
			.toBeDefined();

		Gumshoe.getXHR.send = function(data) {
			this.readyState = 4;
			this.onreadystatechange();
		};

		expect(Gumshoe.postRaw({ 'foo' : 'bar' }, false))
			.toBeFalsy();

		expect(Gumshoe.getXHR)
			.toHaveBeenCalled();
	});

	it ("should retry twice when a bad status code is returned", function() {
		var functionHolder = Gumshoe.getXHR;

		expect(Gumshoe.getXHR)
			.toBeDefined();

		Gumshoe.getXHR.send = function(data) {
			this.readyState = 1;
			this.status = 404;
			this.onreadystatechange();
		};

		expect(Gumshoe.postRaw({ 'foo' : 'bar' }, false))
			.toBeFalsy();

		expect(Gumshoe.getXHR.callCount)
			.toEqual(3);
	});

});


// fireRequest

