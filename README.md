# Uncover

Uncover (or UncoverJS, if need be) is a tiny JavaScript framework for
turning any website into slides that can be uncovered interactively.
It can be used as is or put into a bookmarklet.

----

# Draft!

## Working Principle

Uncover adds an overlay to the page and
moves it between anchor points.
The overlay is a `div` with an `id` of `cover` and a `z-index` of `65535`.
Anchors are other things.

Uncover can be enabled and disabled with
[`uncover.toggle()`][1].

There are
[`uncover.getTarget()`][2]
[`uncover.setTarget()`][3]
must be string or the behavior is undefined.

There are
[`uncover.getAnchor()`][4]
[`uncover.anchorTop()`][5]
[`uncover.anchorBottom()`][6]
yeah.

There are
[`uncover.getPosition()`][7]
[`uncover.setPosition()`][8]
must be an integral `Number` or the behavior is undefined.

There are
[`uncover.getBindings()`][9]
[`uncover.setBindings()`][10]
must be an array of object literals with the following properties or
the behavior is undefined.
There are

* `key` integral `Number`,
* `action` nullary `function`

and optionally `bool` modifiers

* `alt`,
* `ctrl`,
* `meta`,
* `shift`,
* `absorb`.

If they are `undefined`, they are assumed to not matter.

Try this to add advancing with the *Space* key.

	uncover.getBindings().concat([{key: 32, absorb: true, action: uncover.next}])

There are
[`uncover.first()`][11]
[`uncover.previous()`][12]
[`uncover.current()`][13]
[`uncover.next()`][14]
[`uncover.last()`][15]
right.

[1]: javascript:uncover.toggle();
[2]: javascript:window.alert(uncover.getTarget());
[3]: javascript:uncover.setTarget((function(x) {return x || uncover.getTarget()})(window.prompt()));
[4]: javascript:window.alert(uncover.getAnchor());
[5]: javascript:uncover.anchorTop();
[6]: javascript:uncover.anchorBottom();
[7]: javascript:window.alert(uncover.getPosition());
[8]: javascript:uncover.setPosition((function(x) {return x ? parseInt(x) : uncover.getPosition()})(window.prompt()));
[9]: javascript:window.alert(JSON.stringify(uncover.getBindings(), null, 2));
[10]: javascript:uncover.setBindings((function(x) {return x ? eval(x) : uncover.getBindings()})(window.prompt()));
[11]: javascript:uncover.first();
[12]: javascript:uncover.previous();
[13]: javascript:uncover.current();
[14]: javascript:uncover.next();
[15]: javascript:uncover.last();
