// This is a tiny web framework called Uncover (or UncoverJS, if need be) that
// turns any website into an interactive presentation.
// It falls under the terms of the GNU GPL version 3 or later.

var uncover = (function() {
	// These are general-purpose procedures.

	var getTopOffset = function(element) {
		var offset = 0;

		do {
			offset += element.offsetTop || 0;
			element = element.offsetParent;
		} while (element);

		return offset;
	};

	var getDocumentHeight = function() {
		var body = document.body;
		var html = document.documentElement;

		return Math.max(body.scrollHeight,
				body.offsetHeight,
				html.clientHeight,
				html.scrollHeight,
				html.offsetHeight);
	};

	var getViewportHeight = function() {
		return Math.max(document.documentElement.clientHeight,
				window.innerHeight);
	};

	var getViewportWidth = function() {
		return Math.max(document.documentElement.clientWidth,
				window.innerWidth);
	};

	// These form the mutable state.

	var currentlyOn = false;

	var currentLine = -1;

	var usage = (function () {
		var element = document.createElement("div");
		element.style.display = "block";
		element.style.position = "absolute";
		element.style.textAlign = "center";
		element.innerHTML = "Use the arrow keys &larr; and &rarr; to navigate.";
		return element;
	})();

	var overlay = (function () {
		var element = document.createElement("div");
		element.id = "cover";
		element.style.display = "block";
		element.style.position = "absolute";
		element.style.textAlign = "center";
		element.style.zIndex = "65535";
		element.style.width = "100%";
		element.style.height = "100%";
		element.style.left = "0px";
		element.style.top = "0px";
		element.appendChild(usage);
		return element;
	})();

	// These are domain-specific procedures.

	var delimiters = function() {
		return document.getElementsByTagName("hr");
	};

	var update = function(line) {
		var elements = delimiters();
		var documentHeight = getDocumentHeight();
		var viewHeight = getViewportHeight();
		var viewWidth = getViewportWidth();

		var nextLine;
		var nextDisplay;
		var nextOffset;
		if (line <= -1) {
			nextLine = -1;
			nextDisplay = "block";
			nextOffset = 0;
		} else if (line >= elements.length) {
			nextLine = elements.length;
			nextDisplay = "none";
			nextOffset = documentHeight;
		} else {
			nextLine = line;
			nextDisplay = "none";
			nextOffset = 0;
			for (var index = 0;
					index < elements.length;
					++index)
				if (index == nextLine)
					nextOffset = getTopOffset(elements[index]);
		}

		currentLine = nextLine;
		usage.style.display = nextDisplay;
		usage.style.top = ((viewHeight - usage.offsetHeight) / 2) + "px";
		usage.style.left = ((viewWidth - usage.offsetWidth) / 2) + "px";
		overlay.style.top = nextOffset + "px";
		overlay.style.height = (documentHeight - nextOffset) + "px";

		window.scrollTo(0, Math.max(0, nextOffset - viewHeight));
	};

	var last = function() {
		update(delimiters().length);
	};

	var next = function() {
		update(currentLine + 1);
	};

	var current = function() {
		update(currentLine);
	};

	var previous = function() {
		update(currentLine - 1);
	};

	var first = function() {
		update(-1);
	};

	var dispatch = function(event) {
		var event = event || window.event;

		switch (event.type) {
		case 'keydown':
			switch (event.keyCode) {
			case 39: // right
				if (event.ctrlKey)
					last();
				else
					next();
				break;
			case 37: // left
				if (event.ctrlKey)
					first();
				else
					previous();
				break;
			case 40: // down
			case 38: // up
			}
			break;
		case 'load':
			document.body.appendChild(overlay);
		case 'resize':
			current();
			break;
		case 'unload':
			document.body.removeChild(overlay);
		}
	};

	var toggle = function() {
		currentlyOn = !currentlyOn;

		var events = ['keydown', 'load', 'resize', 'unload'];

		if (currentlyOn) {
			for (var index = 0;
					index < events.length;
					++index)
				window.addEventListener(events[index], dispatch);

			window.dispatchEvent(new Event('load'));
		} else {
			window.dispatchEvent(new Event('unload'));

			for (var index = 0;
					index < events.length;
					++index)
				window.removeEventListener(events[index], dispatch);
		}
	};

	// This defines the user interface.

	return {
		last: last,
		next: next,
		current: current,
		previous: previous,
		first: first,
		toggle: toggle
	};
})();
