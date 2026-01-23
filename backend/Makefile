
.PHONY: run migration superuser test
run:
	uv run manage.py runserver django

migration:
	uv run manage.py makemigrations && uv run manage.py migrate

superuser:
	uv run manage.py createsuperuser --username admin --email 

django:
	uv add django

test:
	uv run pytest --cov=.
