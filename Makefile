.PHONY: b f i
b:
	cd backend && uv run manage.py runserver
f:
	cd HotelBookingSystem && bun run dev

i:
	cd HotelBookingSystem && bun i
