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

	var state = {
		on: false,
		target: "hr",
		anchor: "top",
		position: -1,
		bindings: [],
		overlay: (function() {
			var child = document.createElement("div");
			child.style.display = "block";
			child.style.position = "absolute";
			child.style.textAlign = "center";
			child.innerHTML = "Use the arrow keys &uarr; and &darr; to navigate.";

			var parent = document.createElement("div");
			parent.id = "uncover";
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
		var offset;
		var display;
		if (position <= -1) {
			position = -1;
			offset = 0;
			display = "block";
		} else if (position >= tags.length) {
			position = tags.length;
			offset = documentHeight;
			display = "none";
		} else {
			position = position;
			offset = (top ? getTopOffset : getBottomOffset)(tags[position]);
			display = "none";
		}

		state.position = position;

		parent.style.top = offset + "px";
		parent.style.height = (documentHeight - offset) + "px";

		child.style.display = display;
		child.style.top = ((viewHeight - child.offsetHeight) / 2) + "px";
		child.style.left = ((viewWidth - child.offsetWidth) / 2) + "px";

		window.scrollTo(0, Math.max(0, offset - viewHeight));
	};

	var uncoverFirst = function() {
		setPosition(-1);
	};

	var uncoverPrevious = function() {
		setPosition(state.position - 1);
	};

	var uncoverCurrent = function() {
		setPosition(state.position);
	};

	var uncoverNext = function() {
		setPosition(state.position + 1);
	};

	var uncoverLast = function() {
		setPosition(getTags().length);
	};

	var getTarget = function() {
		return state.target;
	};

	var setTarget = function(target) {
		state.target = target;

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

	var getBindings = function() {
		return state.bindings;
	};

	var setBindings = function(bindings) {
		state.bindings = bindings;
	};

	var handleEvent = function(event) {
		var event = event || window.event;

		switch (event.type) {
		case "keydown":
			for (var index = 0;
					index < state.bindings.length;
					++index) {
				var binding = state.bindings[index];

				if (binding.key === event.which
						&& (binding.alt === undefined
							|| binding.alt === event.altKey)
						&& (binding.ctrl === undefined
							|| binding.ctrl === event.ctrlKey)
						&& (binding.meta === undefined
							|| binding.meta === event.metaKey)
						&& (binding.shift === undefined
							|| binding.shift === event.shiftKey)) {
					if (binding.absorb)
						event.preventDefault();

					if (binding.action)
						binding.action();
				}
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

	state.bindings = [
		{
			key: 38, // Up
			ctrl: false,
			absorb: true,
			action: uncoverPrevious
		}, {
			key: 38,
			ctrl: true,
			absorb: true,
			action: uncoverFirst
		}, {
			key: 40, // Down
			ctrl: false,
			absorb: true,
			action: uncoverNext
		}, {
			key: 40,
			ctrl: true,
			absorb: true,
			action: uncoverLast
		}
	];

	return {
		toggle: toggle,
		getTarget: getTarget,
		setTarget: setTarget,
		getAnchor: getAnchor,
		anchorTop: anchorTop,
		anchorBottom: anchorBottom,
		getPosition: getPosition,
		setPosition: setPosition,
		getBindings: getBindings,
		setBindings: setBindings,
		first: uncoverFirst,
		previous: uncoverPrevious,
		current: uncoverCurrent,
		next: uncoverNext,
		last: uncoverLast
	};
})();
