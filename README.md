# Uncover

Uncover, or UncoverJS, if necessary,
is a tiny JavaScript framework for turning any web page into a presentation.
It does so by hiding everything behind an overlay and
allowing the user to move it like flipping slides.
It can be embedded as is or run as a bookmarklet.

----

## License

Uncover is free software and
as such licensed under the GNU GPL.
The full license can be found in the `LICENSE` file that
resides in the same directory as this file.
In short, copies and derivative works are permitted as long as
they use the same license.

----

## History

Uncover was written between 2015-04-01 and 2015-04-10 by
Sampsa "Tuplanolla" Kiiskinen in an attempt to
create lecture notes that are pleasant to both read and present.

----

## Example

Uncover works on this very page.
The following documentation also contains interactive widgets for
testing any part of the interface.

Those with unsuitable viewers should look at `example.html` instead.

---

## Usage

The following requirements are normative.
If any of the contracts are violated, the behavior is undefined.

----

### Basic Usage

Uncover is turned on and off with [`uncover.toggle()`][1].
When turned on, it adds an overlay to the current page and
binds some keys to move the overlay.

By default the overlay moves between
the top edges of horizontal rules denoted by `hr` tags.
The default keys are

* *Down* to move to the next tag or the end of the page,
* *Up* to move to the previous tag or the beginning of the page,
* *Ctrl* *Down* to move to the end of the page and
* *Ctrl* *Up* to move to the beginning of the page.

----

### Advanced Usage

The movement of the overlay is determined by
a target descriptor and a collector procedure.

The target descriptor is simply an `Object` that
is passed to the collector when moving the overlay is needed, while
the collector is a unary `function` that
converts the target descriptor into an `Array` of `Number`s.
The `Number`s themselves represent the stopping points of the overlay.

The default collector accepts target descriptors that have

* a `tag` name property and
* an `alignment` property,

where the `tag` name must be a valid `String` and
the `alignment` must either be `"top"`, `"bottom"` or `"center"`.
The `tag` property contains the name of all the tags to collect and
`alignment` the offsets on the corresponding elements that
match the respective stopping points.
The default target descriptor has

* `tag` set to `"hr"` and
* `alignment` set to `"top"`.

The current target descriptor can be obtained with
[`uncover.getTarget()`][4] and modified with [`uncover.setTarget(x)`][5],
where `x` must obey the contract of the corresponding collector.
Similarly the current collector can be obtained with
[`uncover.getCollector()`][6] and modified with [`uncover.setCollector(f)`][7],
where `f` must be a `function` from `Object`s to `Array`s of `Number`s.

It is easy to make the overlay move between paragraphs for instance.

	uncover.setTarget(
			({tag: "p", alignment: "top"})
			);

----

The current stopping point can be conveniently manipulated with
[`uncover.first()`][13],
[`uncover.previous()`][14],
[`uncover.current()`][15],
[`uncover.next()`][16] and
[`uncover.last()`][17].
There also exist
[`uncover.getIndex()`][2] and
[`uncover.setIndex(n)`][3] for direct access,
where `n` must be an integral `Number` or the behavior is undefined.
Notably it is impossible for `n` to be out of bounds.

----

The key bindings are customizable through
[`uncover.getBindings()`][8] and
[`uncover.setBindings(a)`][9],
where `a` must be an `Array` of `Object`s.
The `Object`s are required to have

* a `key` code property,
* an `action` property,
* an optional `alt` property,
* an optional `ctrl` property,
* an optional `meta` property,
* an optional `shift` property and
* an optional `absorb` property,

where `key` must be an integral `Number`,
`action` must be a nullary `function` and
the rest must be `Boolean`s.
The `key` property is the key code as reported by `Event.which`,
`action` is exactly what it says on the tin,
`absorb` determines whether
the key event should be disposed instead of propagated further and
the rest determine whether certain modifiers are required or not.
There is a nuance in the interpretation of the modifier properties:

* `true` means yes,
* `false` means definitely not and
* leaving them `undefined` means the state does not matter.

It is straightforward to, for example, repurpose the *Space* key.

	uncover.setBindings(
			uncover.getBindings().concat([{key: 32, absorb: true, action: uncover.next}])
			);

----

For the sake of completeness there is also a way to edit the help message with
[`uncover.getHelp()`][10] and [`uncover.setHelp(s)`][11],
where `s` must be a `String`.

----

If something goes wrong,
the original state of the framework may be restored with
[`uncover.reset()`][12].

----

### Other Usage

The overlay is a `div` with

* an `id` of `uncover-cover`,
* a `z-index` of `65535`,
* a `background-color` of neutral `"gray"` and
* a text `color` of `"black"`.

It may be given any CSS attributes except for

* `display`,
* `position`,
* `text-align`,
* `width`,
* `height`,
* `left` or
* `top`.

----

The overlay has one child, which is also `div`.
The child may be given any CSS attributes, but
must not be removed from its parent.

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
