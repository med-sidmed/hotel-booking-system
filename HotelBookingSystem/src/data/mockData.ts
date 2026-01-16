import type { Hotel } from "../types";

export const hotels: Hotel[] = [
    {
        id: 1,
        name: "Hôtel Élégance Royal",
        location: "Tevragh Zeina, Nouakchott",
        rating: 4.8,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        pricePerNight: 250,
        description: "Découvrez le luxe comme jamais auparavant au cœur de Nouakchott. L'Hôtel Élégance Royal offre une vue imprenable sur la ville, une cuisine exquise et des équipements de classe mondiale.",
        rooms: [
            {
                id: 101,
                hotelId: 1,
                type: "Suite Deluxe Océan",
                price: 350,
                capacity: 2,
                amenities: ["Vue Océan", "Lit King Size", "Jacuzzi Privé", "Service en Chambre 24/7"],
                available: true,
                images: [
                    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                ]
            },
            {
                id: 102,
                hotelId: 1,
                type: "Chambre Standard Ville",
                price: 180,
                capacity: 2,
                amenities: ["Vue Ville", "Lit Queen Size", "Wi-Fi Gratuit", "Petit-déjeuner Inclus"],
                available: true,
                images: [
                    "https://images.unsplash.com/photo-1616594039964-40891a90c398?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Station Balnéaire Palmier",
        location: "Route de la Plage, Nouadhibou",
        rating: 4.5,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1325&q=80",
        pricePerNight: 180,
        description: "Détendez-vous au bord de l'océan dans notre magnifique station balnéaire. Profitez du soleil, du sable et de la sérénité avec nos villas privées en bord de mer.",
        rooms: [
            {
                id: 201,
                hotelId: 2,
                type: "Villa Bord de Mer",
                price: 450,
                capacity: 4,
                amenities: ["Accès Plage", "Piscine Privée", "Cuisine", "Terrasse Extérieure"],
                available: true,
                images: [
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                ]
            }
        ]
    },
    {
        id: 3,
        name: "Retraite Oasis du Désert",
        location: "Atar, Adrar",
        rating: 4.7,
        reviews: 56,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        pricePerNight: 200,
        description: "Échappez-vous vers la tranquillité du désert. Notre oasis offre un mélange unique de confort moderne et d'hospitalité traditionnelle mauritanienne.",
        rooms: []
    },
    {
        id: 4,
        name: "Auberge Vue sur le Fleuve",
        location: "Rosso, Trarza",
        rating: 4.3,
        reviews: 42,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80",
        pricePerNight: 120,
        description: "Profitez de la brise apaisante du fleuve Sénégal. Parfait pour les amoureux de la nature et ceux qui recherchent une escapade paisible.",
        rooms: []
    },
    {
        id: 5,
        name: "Hôtel Le Tichit",
        location: "Centre Ville, Nouakchott",
        rating: 4.0,
        reviews: 15,
        image: "https://images.unsplash.com/photo-1455587734955-081b22074882?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        pricePerNight: 90,
        description: "Un hôtel confortable et abordable au cœur de la ville.",
        rooms: []
    } // End of hotel 5
]; // Properly close hotels array

// Mock Bookings
export const mockBookings: any[] = [
    {
        id: "BK-001",
        hotelId: 1,
        userId: 101,
        userName: "Sophie Martin",
        roomType: "Suite Deluxe Océan",
        checkIn: "2026-02-10",
        checkOut: "2026-02-15",
        totalPrice: 1750,
        status: "CONFIRMED",
        date: "2026-01-15"
    },
    {
        id: "BK-002",
        hotelId: 1,
        userId: 102,
        userName: "Pierre Dupont",
        roomType: "Chambre Standard Ville",
        checkIn: "2026-03-01",
        checkOut: "2026-03-05",
        totalPrice: 720,
        status: "PENDING",
        date: "2026-01-20"
    },
    {
        id: "BK-003",
        hotelId: 1,
        userId: 103,
        userName: "Jean Kevin",
        roomType: "Suite Deluxe Océan",
        checkIn: "2026-04-10",
        checkOut: "2026-04-12",
        totalPrice: 700,
        status: "CANCELLED",
        date: "2026-01-22"
    },
    {
        id: "BK-004",
        hotelId: 2, // Different hotel
        userId: 104,
        userName: "Marie Curie",
        roomType: "Villa Bord de Mer",
        checkIn: "2026-05-01",
        checkOut: "2026-05-07",
        totalPrice: 2700,
        status: "CONFIRMED",
        date: "2026-01-25"
    }
];
