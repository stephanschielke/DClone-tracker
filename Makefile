.PHONY: help
help: ## displays available make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
.DEFAULT_GOAL := help

.PHONY: create_zip ## Creates a zip file, ready to be uploaded to the chrome web store
create_zip:
	zip -r dclone_tracker.zip dclone_tracker
