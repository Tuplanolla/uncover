MD=kramdown

build: example.html

clean:
	$(RM) *.html

example.html: README.md example.css example.template widgets.md
	{ grep -v '\[[0-9]\+\]: *#$$' $< && \
	cat widgets.md ; \
	} | $(MD) --template example.template > $@
