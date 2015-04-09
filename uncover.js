var uncover = (function() {
	var getTopOffset = function(element) {
		var offset = 0;

		while (element) {
			offset += element.offsetTop || 0;

			element = element.offsetParent;
		}

		return offset;
	};

	var getBottomOffset = function(element) {
		return getTopOffset(element)
			+ (element.offsetHeight || 0);
	};

	var getDocumentHeight = function() {
		var body = document.body;
		var html = document.documentElement;

		return Math.max(body.scrollHeight || 0,
				body.offsetHeight || 0,
				html.clientHeight || 0,
				html.scrollHeight || 0,
				html.offsetHeight || 0);
	};

	var getViewportHeight = function() {
		return Math.max(document.documentElement.clientHeight || 0,
				window.innerHeight || 0);
	};

	var getViewportWidth = function() {
		return Math.max(document.documentElement.clientWidth || 0,
				window.innerWidth || 0);
	};

	var keyCode = {
		enter: 13,
		escape: 27,
		space: 32,
		pageUp: 33,
		pageDown: 34,
		end: 35,
		home: 36,
		left: 37,
		up: 38,
		right: 39,
		down: 40
	};

	var state = {
		on: false,
		target: "hr",
		anchor: "top",
		position: -1,
		overlay: (function() {
			var child = document.createElement("div");
			child.style.display = "block";
			child.style.position = "absolute";
			child.style.textAlign = "center";
			child.innerHTML = "Use the arrow keys &larr; and &rarr; to navigate.";

			var parent = document.createElement("div");
			parent.id = "cover";
			parent.style.display = "block";
			parent.style.position = "absolute";
			parent.style.textAlign = "center";
			parent.style.zIndex = "65535";
			parent.style.width = "100%";
			parent.style.height = "100%";
			parent.style.left = "0px";
			parent.style.top = "0px";

			parent.appendChild(child);

			return parent;
		})()
	};

	var getTags = function() {
		return document.getElementsByTagName(state.target);
	};

	var getPosition = function() {
		return state.position;
	};

	var setPosition = function(position) {
		var tags = getTags();
		var documentHeight = getDocumentHeight();
		var viewHeight = getViewportHeight();
		var viewWidth = getViewportWidth();
		var top = state.anchor === "top";
		var parent = state.overlay;
		var child = parent.firstChild;

		var position;
		var display;
		var offset;
		if (position <= -1) {
			position = -1;
			display = "block";
			offset = 0;
		} else if (position >= tags.length) {
			position = tags.length;
			display = "none";
			offset = documentHeight;
		} else {
			position = position;
			display = "none";
			offset = 0;
			for (var tag = 0;
					tag < tags.length;
					++tag)
				if (tag === position) {
					offset = (top ? getTopOffset : getBottomOffset)(tags[tag]);
					break;
				}
		}

		state.position = position;
		child.style.display = display;
		child.style.top = ((viewHeight - child.offsetHeight) / 2) + "px";
		child.style.left = ((viewWidth - child.offsetWidth) / 2) + "px";
		parent.style.top = offset + "px";
		parent.style.height = (documentHeight - offset) + "px";

		window.scrollTo(0, Math.max(0, offset - viewHeight));
	};

	var uncoverLast = function() {
		setPosition(getTags().length);
	};

	var uncoverNext = function() {
		setPosition(state.position + 1);
	};

	var uncoverCurrent = function() {
		setPosition(state.position);
	};

	var uncoverPrevious = function() {
		setPosition(state.position - 1);
	};

	var uncoverFirst = function() {
		setPosition(-1);
	};

	var getTarget = function() {
		return state.target;
	};

	var setTarget = function(target) {
		state.target = target.toString();

		uncoverCurrent();
	};

	var getAnchor = function() {
		return state.anchor;
	};

	var anchorTop = function() {
		state.anchor = "top";

		uncoverCurrent();
	};

	var anchorBottom = function() {
		state.anchor = "bottom";

		uncoverCurrent();
	};

	var getKeys = function() {
		return state.target;
	};

	var setKeys = function(target) {
		state.target = target.toString();

		uncoverCurrent();
	};

	var handleEvent = function(event) {
		var event = event || window.event;

		switch (event.type) {
		case "keydown":
			switch (event.key) {
			case keyCode.right:
				if (event.ctrlKey)
					uncoverLast();
				else
					uncoverNext();
				break;

			case keyCode.left:
				if (event.ctrlKey)
					uncoverFirst();
				else
					uncoverPrevious();
				break;
			}
			break;

		case "load":
			document.body.appendChild(state.overlay);
		case "resize":
			uncoverCurrent();
			break;

		case "unload":
			document.body.removeChild(state.overlay);
		}
	};

	var toggle = function() {
		state.on = !state.on;

		var events = ["keydown", "load", "resize", "unload"];

		if (state.on) {
			for (var event = 0;
					event < events.length;
					++event)
				window.addEventListener(events[event], handleEvent);

			window.dispatchEvent(new Event("load"));
		} else {
			window.dispatchEvent(new Event("unload"));

			for (var event = 0;
					event < events.length;
					++event)
				window.removeEventListener(events[event], handleEvent);
		}
	};

	return {
		toggle: toggle,
		getTarget: getTarget,
		setTarget: setTarget,
		getAnchor: getAnchor,
		setAnchor: setAnchor,
		getKeys: getKeys,
		setKeys: setKeys,
		getPosition: getPosition,
		setPosition: setPosition,
		uncoverLast: uncoverLast,
		uncoverNext: uncoverNext,
		uncoverCurrent: uncoverCurrent,
		uncoverPrevious: uncoverPrevious,
		uncoverFirst: uncoverFirst
	};
})();
