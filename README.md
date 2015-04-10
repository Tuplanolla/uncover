# Uncover

Uncover (or UncoverJS, if need be) is a tiny JavaScript framework for
turning any website into slides that can be uncovered interactively.
It can be used as is or put into a bookmarklet.

----

# Draft!

This very page is interactive when compiled into `example.html` ---
download the files and see!

----

## Basic Usage

Uncover is turned on and off with [`uncover.toggle()`][1].
When turned on, it adds an overlay to the current page and
binds some keys to move the overlay.

----

By default the overlay moves between

* the top edges of
* `hr` tags

and the default keys are

* *Down* to move to the next tag or the end of the page,
* *Up* to move to the previous tag or the beginning of the page,
* *Ctrl* *Down* to move to the end of the page and
* *Ctrl* *Up* to move to the beginning of the page.

----

## Overview

Uncover is free software and
as such licensed under the GNU GPL.
The full license can be found in the `LICENSE` file that
resides in the same directory as this file.
In short, copies and derivative works are permitted as long as
they use the same license.

The project was started on 2015-04-01 and first released on 2015-04-(not yet).
It was written by Sampsa "Tuplanolla" Kiiskinen for
presenting web things during lecture things.

----

## Advanced Usage

The movement of the overlay is determined by

* a target string,
* an anchor string and
* a collector procedure.

----

The target is simply a string that tells the collector what to look for.
The default behavior is
to collect every tag with the name specified by the target string.
The target string can be obtained with [`uncover.getTarget()`][2] and
modified with [`uncover.setTarget(x)`][3],
where `x` must be a `String` or the behavior is undefined.

----

The anchor is also a string, but
its values are restricted to `"top"` and `"bottom"`.
It determines which part of the target element is
the exact position to place the overlay.
It can be obtained with [`uncover.getAnchor()`][4] and
changed with [`uncover.anchorTop()`][5] and [`uncover.anchorBottom()`][6].

----

The collector is a unary `function` that takes the target string and
returns a list of elements.
As before, there are [`uncover.getCollector()`][9] and
[`uncover.setCollector()`][10].

This will be changed to something more convenient soon.

----

The keys are customizable through
[`uncover.getBindings()`][9] and
[`uncover.setBindings(a)`][10],
where `a` must be an `Array` of object literals with

* an integral `Number` property `key`,
* a nullary `function` property `action`

and optionally some `Bool` properties

* `alt`,
* `ctrl`,
* `meta`,
* `shift` and
* `absorb`

or the behavior is undefined.
Optional properties that are `undefined` are assumed not to matter.

----

It is straightforward to implement such things as
advancing with the *Space* key in addition to the defaults.

	uncover.setBindings(
			uncover.getBindings().concat([{key: 32, absorb: true, action: uncover.next}])
			);

----

The current target element is accessible through the convenient
[`uncover.first()`][11],
[`uncover.previous()`][12],
[`uncover.current()`][13],
[`uncover.next()`][14] and
[`uncover.last()`][15],
in addition to the more precise
[`uncover.getPosition()`][7] and
[`uncover.setPosition(n)`][8],
where `n` must be an integral `Number` or the behavior is undefined.

----

## Technical Details

The overlay is a `div` with an `id` of `uncover` and a `z-index` of `65535`.

[1]: #
[2]: #
[3]: #
[4]: #
[5]: #
[6]: #
[7]: #
[8]: #
[9]: #
[10]: #
[11]: #
[12]: #
[13]: #
[14]: #
[15]: #
[16]: #
[17]: #
