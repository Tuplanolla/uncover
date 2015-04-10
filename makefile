MD=kramdown

build: example.html

clean:
	$(RM) *.html

example.html: README.md example.template links.md
	{ perl -0pe "s/(\n\n)\[.*/\1/gms" $< && \
	cat links.md ; \
	} | $(MD) --template example.template > $@
