import type { Hotel } from "../types";

export const hotels: Hotel[] = [
    {
        id: 1,
        name: "Fairmont Nusa Dua International",
        location: "Nusa Dua, Bali, Indonesia",
        description: "Experience ultimate luxury with stunning ocean views, world-class amenities, and exceptional service in the heart of Bali.",
        reviews: 1234,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        rooms: [
            {
                id: 101,
                hotelId: 1,
                type: "Ocean View Suite",
                price: 350,
                capacity: 2,
                amenities: ["Ocean View", "King Bed", "Jacuzzi", "WiFi"],
                images: [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
                ],
                available: true
            },
            {
                id: 102,
                hotelId: 1,
                type: "Garden Villa",
                price: 500,
                capacity: 4,
                amenities: ["Private Pool", "Garden View", "Butlers Service", "WiFi"],
                images: [
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop"
                ],
                available: true
            }
        ]
    },
    {
        id: 2,
        name: "Atlantis Waterfront Resort",
        location: "Dubai Marina, UAE",
        description: "An iconic waterfront destination offering breathtaking views, luxurious accommodations, and unforgettable experiences.",
        reviews: 2156,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
        rooms: [
            {
                id: 201,
                hotelId: 2,
                type: "Royal Penthouse",
                price: 1200,
                capacity: 6,
                amenities: ["Panoramic View", "Private Elevator", "Cinema", "Gym"],
                images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"],
                available: true
            }
        ]
    },
    {
        id: 3,
        name: "Pullman Palace Suite",
        location: "Paris, France",
        description: "Classic Parisian elegance meets modern comfort. Perfectly located near the Eiffel Tower and Champs-Élysées.",
        reviews: 987,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
        rooms: []
    },
    {
        id: 4,
        name: "Royal Continental Lisbon",
        location: "Lisbon, Portugal",
        description: "Historic charm blended with contemporary luxury in Portugal's captivating capital city.",
        reviews: 1543,
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop",
        rooms: []
    },
    {
        id: 5,
        name: "Hotel Vista Premium",
        location: "Tokyo, Japan",
        description: "Modern Japanese hospitality with panoramic city views and authentic cultural experiences.",
        reviews: 1876,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
        rooms: []
    },
    {
        id: 6,
        name: "Hotel Des Arts Miami",
        location: "Miami Beach, Florida",
        description: "Art deco luxury on pristine beaches with vibrant nightlife and world-class dining.",
        reviews: 2341,
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
        rooms: []
    },
    {
        id: 7,
        name: "Royal One Bloomsbury",
        location: "London, United Kingdom",
        description: "British sophistication in the heart of London, steps from iconic landmarks and cultural treasures.",
        reviews: 1654,
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
        rooms: []
    },
    {
        id: 8,
        name: "Hotel Diva Museum",
        location: "Florence, Italy",
        description: "Renaissance beauty and Italian luxury combined in the cradle of art and culture.",
        reviews: 1432,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
        rooms: []
    }
];
