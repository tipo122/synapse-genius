lint:
	black functions py_test --check
	isort functions py_test --check --profile black
	flake8 functions py_test --ignore=E501,E203,W503
	mypy functions py_test --explicit-package-bases --ignore-missing-imports --install-types --non-interactive


format:
	black functions py_test
	isort functions py_test --profile black

