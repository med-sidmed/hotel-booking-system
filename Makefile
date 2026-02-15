.PHONY: b f
b:
	cd backend && uv run manage.py runserver
f:
	cd HotelBookingSystem && bun run dev
