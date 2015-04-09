MD=kramdown

build: example.html

clean:
	$(RM) *.html

example.html: README.md example.template
	$(MD) --template example.template < $< > $@
