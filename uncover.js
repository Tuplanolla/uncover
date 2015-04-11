/*
Copyright (c) 2015 Sampsa "Tuplanolla" Kiiskinen

This is free software, and you are welcome to redistribute it
under certain conditions; see the LICENSE file for details.
*/

"use strict";

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

	var getCenterOffset = function(element) {
		return getTopOffset(element)
			+ (element.offsetHeight || 0) / 2;
	};

	var getDocumentHeight = function() {
		var body = document.body;
		var html = document.documentElement;

		return Math.max(body ? Math.max(body.scrollHeight || 0,
					body.offsetHeight || 0) : 0,
				html ? Math.max(html.clientHeight || 0,
					html.scrollHeight || 0,
					html.offsetHeight || 0) : 0);
	};

	var getViewportHeight = function() {
		var html = document.documentElement;

		return Math.max(html ? html.clientHeight || 0 : 0,
				window.innerHeight || 0);
	};

	var getViewportWidth = function() {
		var html = document.documentElement;

		return Math.max(html ? html.clientWidth || 0 : 0,
				window.innerWidth || 0);
	};

	var state = {
		on: false,
		index: -1,
		target: {},
		collector: function() {
			return [];
		},
		bindings: []
	};

	var getIndex = function() {
		return state.index;
	};

	var setIndex = function(index) {
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

			var parent = state.overlay;
			var child = parent.firstChild;

			parent.style.top = nextOffset + "px";
			parent.style.height = (documentHeight - nextOffset) + "px";

			child.innerHTML = state.help;
			child.style.display = nextDisplay;
			child.style.top = ((viewHeight - child.offsetHeight) / 2) + "px";
			child.style.left = ((viewWidth - child.offsetWidth) / 2) + "px";

			window.scrollTo(0, Math.max(0, nextOffset - viewHeight));
		}
	};

	var uncoverFirst = function() {
		setIndex(-1);
	};

	var uncoverPrevious = function() {
		setIndex(state.index - 1);
	};

	var uncoverCurrent = function() {
		setIndex(state.index);
	};

	var uncoverNext = function() {
		setIndex(state.index + 1);
	};

	var uncoverLast = function() {
		setIndex(Infinity);
	};

	var handleEvent = function(event) {
		event = event || window.event;

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

	var getOn = function() {
		return state.on;
	};

	var setOn = function(on) {
		var events = ["keydown", "load", "resize", "unload"];

		if (!state.on && on) {
			for (var event = 0;
					event < events.length;
					++event)
				window.addEventListener(events[event], handleEvent);

			window.dispatchEvent(new Event("load"));
		} else if (state.on && !on) {
			window.dispatchEvent(new Event("unload"));

			for (var event = 0;
					event < events.length;
					++event)
				window.removeEventListener(events[event], handleEvent);
		}

		state.on = on;

		uncoverCurrent();
	};

	var toggle = function() {
		setOn(!state.on);
	};

	var getTarget = function() {
		return state.target;
	};

	var setTarget = function(target) {
		state.target = target;

		uncoverCurrent();
	};

	var getCollector = function() {
		return state.collector;
	};

	var setCollector = function(collector) {
		state.collector = collector;

		uncoverCurrent();
	};

	var getBindings = function() {
		return state.bindings;
	};

	var setBindings = function(bindings) {
		state.bindings = bindings;

		uncoverCurrent();
	};

	var getHelp = function() {
		return state.help;
	};

	var setHelp = function(help) {
		state.help = help;

		uncoverCurrent();
	};

	var reset = function() {
		setOn(false);

		state.index = -1;

		state.target = {
			tag: "hr",
			alignment: "top"
		};

		state.collector = function(target) {
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

		state.overlay = (function() {
			var child = document.createElement("div");
			child.style.display = "block";
			child.style.position = "absolute";
			child.style.textAlign = "center";

			var parent = document.createElement("div");
			parent.id = "uncover-cover";
			parent.style.backgroundColor = "gray";
			parent.style.color = "black";
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
