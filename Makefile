.PHONY: help
help: ## Displays available make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
.DEFAULT_GOAL := help

.PHONY: create_zip ## Creates a zip file
create_zip:
	@echo "Building dclone_tracker.zip"
	@zip -r dclone_tracker.zip dclone_tracker

.PHONY: create_zip ## Creates a crx file
create_crx:
	@echo "Building dclone_tracker.crx"
	@google-chrome --pack-extension=./dclone_tracker --pack-extension-key=./dclone_tracker.pem

build: create_zip create_crx ## Creates all release objects
