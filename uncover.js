var uncover = (function() {
	// These are general-purpose constants.

	var VK_LEFT = 37;
	var VK_UP = 38;
	var VK_RIGHT = 39;
	var VK_DOWN = 40;

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

	var currentAnchor = "hr";

	var currentPosition = -1;

	var usage = (function () {
		var element = document.createElement("div");
		element.style.display = "block";
		element.style.position = "absolute";
		element.style.textAlign = "center";
		element.innerHTML = "Use the arrow keys &larr; and &rarr; to navigate.";
		return element;
	})();

	var overlay = (function() {
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
		return document.getElementsByTagName(currentAnchor);
	};

	var update = function(position) {
		var elements = delimiters();
		var documentHeight = getDocumentHeight();
		var viewHeight = getViewportHeight();
		var viewWidth = getViewportWidth();

		var nextLine;
		var nextDisplay;
		var nextOffset;
		if (position <= -1) {
			nextLine = -1;
			nextDisplay = "block";
			nextOffset = 0;
		} else if (position >= elements.length) {
			nextLine = elements.length;
			nextDisplay = "none";
			nextOffset = documentHeight;
		} else {
			nextLine = position;
			nextDisplay = "none";
			nextOffset = 0;
			for (var index = 0;
					index < elements.length;
					++index)
				if (index === nextLine)
					nextOffset = getTopOffset(elements[index]);
		}

		currentPosition = nextLine;
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
		update(currentPosition + 1);
	};

	var current = function() {
		update(currentPosition);
	};

	var previous = function() {
		update(currentPosition - 1);
	};

	var first = function() {
		update(-1);
	};

	var get = function() {
		return currentPosition;
	};

	var set = function(n) {
		update(n);
	};

	var dispatch = function(event) {
		var event = event || window.event;

		switch (event.type) {
		case "keydown":
			switch (event.keyCode) {
			case VK_RIGHT:
				if (event.ctrlKey)
					last();
				else
					next();
				break;

			case VK_LEFT:
				if (event.ctrlKey)
					first();
				else
					previous();
				break;
			}
			break;

		case "load":
			document.body.appendChild(overlay);
		case "resize":
			current();
			break;

		case "unload":
			document.body.removeChild(overlay);
		}
	};

	var toggle = function() {
		currentlyOn = !currentlyOn;

		var events = ["keydown", "load", "resize", "unload"];

		if (currentlyOn) {
			for (var index = 0;
					index < events.length;
					++index)
				window.addEventListener(events[index], dispatch);

			window.dispatchEvent(new Event("load"));
		} else {
			window.dispatchEvent(new Event("unload"));

			for (var index = 0;
					index < events.length;
					++index)
				window.removeEventListener(events[index], dispatch);
		}
	};

	var target = function(tag) {
		currentAnchor = tag;

		current();
	};

	// This determines the visible parts.

	return {
		last: last,
		next: next,
		current: current,
		previous: previous,
		first: first,
		get: get,
		set: set,
		toggle: toggle,
		target: target
	};
})();
