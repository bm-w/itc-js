FILE := $(dir $(lastword $(MAKEFILE_LIST)))
DIR := $(FILE:/=)


# Targets

.PHONY: clean

clean:
	rm -rf $(DIR)/node_modules
