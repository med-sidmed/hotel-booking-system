
.PHONY: run migration superuser django
run:
	uv run manage.py runserver 

migration:
	uv run manage.py makemigrations && uv run manage.py migrate

superuser:
	uv run manage.py createsuperuser --username admin --email 

django:
	uv add django


