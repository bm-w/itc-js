FILE := $(dir $(lastword $(MAKEFILE_LIST)))
DIR := $(FILE:/=)

NODE_BIN := $(or $(shell which node),"$(NODE_HOME)/bin/node")
MOCHA_BIN := $(DIR)/node_modules/mocha/bin/mocha
COFFEE_BIN := $(DIR)/node_modules/coffee-script/bin/coffee


# Targets

.PHONY: test clean

TESTS :=\
	$(DIR)/tests/identifier.js\
	$(DIR)/tests/event.js
test: $(MOCHA_BIN) $(TESTS)
	$(NODE_BIN) $(MOCHA_BIN) $(TESTS)

clean:
	rm -rf $(DIR)/node_modules
	rm -ff $(DIR)/tests


# Files
	
$(DIR)/tests/identifier.js: $(DIR)/src/identifier.js
$(DIR)/tests/event.js: $(DIR)/src/event.js
$(DIR)/tests/%.js: $(DIR)/specs/%.coffee.md | $(DIR)/tests
	$(NODE_BIN) $(COFFEE_BIN) -bclp $< > $@

$(DIR)/tests:
	mkdir -p $@
