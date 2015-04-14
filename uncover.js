/*
Copyright (c) 2015 Sampsa "Tuplanolla" Kiiskinen

This is free software, and you are welcome to redistribute it
under certain conditions; see the LICENSE file for details.
*/

"use strict";

var uncover = (function () {
	var getTopOffset = function (element) {
		var offset = 0;

		while (element) {
			offset += element.offsetTop || 0;

			element = element.offsetParent;
		}

		return offset;
	};

	var getBottomOffset = function (element) {
		return getTopOffset(element)
			+ (element.offsetHeight || 0);
	};

	var getCenterOffset = function (element) {
		return getTopOffset(element)
			+ (element.offsetHeight || 0) / 2;
	};

	var getDocumentHeight = function () {
		var body = document.body;
		var html = document.documentElement;

		return Math.max(body ? Math.max(body.scrollHeight || 0,
					body.offsetHeight || 0) : 0,
				html ? Math.max(html.clientHeight || 0,
					html.scrollHeight || 0,
					html.offsetHeight || 0) : 0);
	};

	var getViewportHeight = function () {
		var html = document.documentElement;

		return Math.max(html ? html.clientHeight || 0 : 0,
				window.innerHeight || 0);
	};

	var getViewportWidth = function () {
		var html = document.documentElement;

		return Math.max(html ? html.clientWidth || 0 : 0,
				window.innerWidth || 0);
	};

	var getNewEvent = function (name) {
		try {
			return new Event(name);
		} catch (exception) {
			var object;

			if (document.createEvent) {
				object = document.createEvent("HTMLEvents");
				object.initEvent(name, false, false);
				object.eventName = name;
			} else {
				object = document.createEventObject();
				object.eventName = object.eventType = name;
			}

			return object;
		}
	};

	var getEventDispatcher = function (fallback) {
		if (window.dispatchEvent)
			return function (object) {
				window.dispatchEvent(object);
			};
		else if (window.fireEvent)
			return function (object) {
				window.fireEvent("on" + object.eventType, object);
			};
		else
			return fallback;
	};

	var state = {
		on: false,
		index: -1,
		target: {},
		collector: function () {
			return [];
		},
		bindings: []
	};

	var getIndex = function () {
		return state.index;
	};

	var setIndex = function (index) {
		var documentHeight = getDocumentHeight();

		var offsets = state.collector(state.target);

		var nextIndex;
		var nextOffset;
		var nextDisplay;
		if (index <= -1) {
			nextIndex = -1;
			nextOffset = 0;
			nextDisplay = "block";
		} else if (index >= offsets.length) {
			nextIndex = offsets.length;
			nextOffset = documentHeight;
			nextDisplay = "none";
		} else {
			nextIndex = index;
			nextOffset = offsets[index];
			nextDisplay = "none";
		}

		state.index = nextIndex;

		if (state.on) {
			var viewHeight = getViewportHeight();
			var viewWidth = getViewportWidth();

			var superior = state.overlay;
			var inferior = superior.firstChild;

			superior.style.top = nextOffset + "px";
			superior.style.height = (documentHeight - nextOffset) + "px";

			inferior.innerHTML = state.help;
			inferior.style.display = nextDisplay;
			inferior.style.top = ((viewHeight - inferior.offsetHeight) / 2) + "px";
			inferior.style.left = ((viewWidth - inferior.offsetWidth) / 2) + "px";

			window.scrollTo(0, Math.max(0, nextOffset - viewHeight));
		}
	};

	var uncoverFirst = function () {
		setIndex(-1);
	};

	var uncoverPrevious = function () {
		setIndex(state.index - 1);
	};

	var uncoverCurrent = function () {
		setIndex(state.index);
	};

	var uncoverNext = function () {
		setIndex(state.index + 1);
	};

	var uncoverLast = function () {
		setIndex(Infinity);
	};

	var handleEvent = function (object) {
		var happening = object || window.event;

		switch (happening.type) {
		case "customunload":
			document.body.removeChild(state.overlay);
			break;

		case "customload":
			document.body.appendChild(state.overlay);
		case "resize":
			uncoverCurrent();
			break;

		case "keydown":
			for (var index = 0;
					index < state.bindings.length;
					++index) {
				var binding = state.bindings[index];

				if (binding.key === happening.which
						&& (binding.alt === undefined
							|| binding.alt === happening.altKey)
						&& (binding.ctrl === undefined
							|| binding.ctrl === happening.ctrlKey)
						&& (binding.meta === undefined
							|| binding.meta === happening.metaKey)
						&& (binding.shift === undefined
							|| binding.shift === happening.shiftKey)) {
					if (binding.absorb)
						happening.preventDefault();

					if (binding.action)
						binding.action();
				}
			}
		}
	};

	var getOn = function () {
		return state.on;
	};

	var setOn = function (on) {
		var dispatcher = getEventDispatcher(handleEvent);
		var events = ["customload", "customunload", "keydown", "resize"];

		var previouslyOn = state.on;
		state.on = on;

		if (!previouslyOn && on) {
			for (var index = 0;
					index < events.length;
					++index)
				window.addEventListener(events[index], handleEvent, false);

			dispatcher(getNewEvent("customload"));
		} else if (previouslyOn && !on) {
			dispatcher(getNewEvent("customunload"));

			for (var index = 0;
					index < events.length;
					++index)
				window.removeEventListener(events[index], handleEvent, false);
		}

		uncoverCurrent();
	};

	var toggle = function () {
		setOn(!state.on);
	};

	var getTarget = function () {
		return state.target;
	};

	var setTarget = function (target) {
		state.target = target;

		uncoverCurrent();
	};

	var getCollector = function () {
		return state.collector;
	};

	var setCollector = function (collector) {
		state.collector = collector;

		uncoverCurrent();
	};

	var getBindings = function () {
		return state.bindings;
	};

	var setBindings = function (bindings) {
		state.bindings = bindings;

		uncoverCurrent();
	};

	var getHelp = function () {
		return state.help;
	};

	var setHelp = function (help) {
		state.help = help;

		uncoverCurrent();
	};

	var reset = function () {
		setOn(false);

		state.index = -1;

		state.target = {
			tag: "hr",
			alignment: "top"
		};

		state.collector = function (target) {
			var getOffset;
			switch (target.alignment || "top") {
			case "bottom":
				getOffset = getBottomOffset;
				break;

			case "center":
				getOffset = getCenterOffset;
				break;

			case "top":
				getOffset = getTopOffset;
			}

			var nodes = document.getElementsByTagName(target.tag || "body");

			var positions = [];
			for (var node = 0;
					node < nodes.length;
					++node)
				positions.push(getOffset(nodes[node]));

			return positions;
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

		state.help = "Use the arrow keys &darr; and &uarr; to navigate.";

		state.overlay = (function () {
			var inferior = document.createElement("div");
			inferior.style.display = "block";
			inferior.style.position = "absolute";
			inferior.style.textAlign = "center";

			var superior = document.createElement("div");
			superior.id = "uncover-cover";
			superior.style.backgroundColor = "gray";
			superior.style.color = "black";
			superior.style.display = "block";
			superior.style.position = "absolute";
			superior.style.textAlign = "center";
			superior.style.zIndex = "65535";
			superior.style.width = "100%";
			superior.style.height = "100%";
			superior.style.left = "0px";
			superior.style.top = "0px";

			superior.appendChild(inferior);

			return superior;
		})();
	};

	reset();

	return {
		getIndex: getIndex,
		setIndex: setIndex,
		first: uncoverFirst,
		previous: uncoverPrevious,
		current: uncoverCurrent,
		next: uncoverNext,
		last: uncoverLast,
		getOn: getOn,
		setOn: setOn,
		toggle: toggle,
		getTarget: getTarget,
		setTarget: setTarget,
		getCollector: getCollector,
		setCollector: setCollector,
		getBindings: getBindings,
		setBindings: setBindings,
		getHelp: getHelp,
		setHelp: setHelp,
		reset: reset
	};
})();
