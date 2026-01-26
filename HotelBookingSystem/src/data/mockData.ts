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
        userId: "client-1",
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
        userId: "client-2",
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
        userId: "client-1",
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
        userId: "client-2",
        userName: "Marie Curie",
        roomType: "Villa Bord de Mer",
        checkIn: "2026-05-01",
        checkOut: "2026-05-07",
        totalPrice: 2700,
        status: "CONFIRMED",
        date: "2026-01-25"
    }
];

// Mock Reviews
import type { Review, Transaction, Notification, Message, LoyaltyPoints, Promotion } from "../types";

export const mockReviews: Review[] = [
    {
        id: "REV-001",
        hotelId: 1,
        userId: "client-1",
        userName: "Sophie Martin",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        rating: 5,
        comment: "Séjour exceptionnel ! Personnel très accueillant, chambres luxueuses et vue magnifique. Je recommande vivement.",
        photos: [
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427"
        ],
        date: "2026-01-10",
        ownerResponse: {
            text: "Merci beaucoup pour votre avis ! Nous sommes ravis que vous ayez apprécié votre séjour.",
            date: "2026-01-11"
        },
        verified: true
    },
    {
        id: "REV-002",
        hotelId: 1,
        userId: "client-2",
        userName: "Pierre Dupont",
        userAvatar: "https://i.pravatar.cc/150?img=2",
        rating: 4,
        comment: "Très bon hôtel, bien situé. Seul bémol : le wifi était un peu lent.",
        photos: [],
        date: "2026-01-08",
        verified: true
    },
    {
        id: "REV-003",
        hotelId: 2,
        userId: "client-1",
        userName: "Marie Curie",
        userAvatar: "https://i.pravatar.cc/150?img=3",
        rating: 5,
        comment: "Villa en bord de mer absolument parfaite ! Piscine privée magnifique.",
        photos: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"],
        date: "2026-01-05",
        verified: true
    }
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
    {
        id: "TRX-001",
        userId: "client-1",
        bookingId: "BK-001",
        amount: 1750,
        currency: "MRU",
        method: "CARD",
        status: "COMPLETED",
        type: "FULL_PAYMENT",
        date: "2026-01-15",
        invoiceUrl: "/invoices/TRX-001.pdf"
    },
    {
        id: "TRX-002",
        userId: "client-2",
        bookingId: "BK-002",
        amount: 216,
        currency: "MRU",
        method: "CARD",
        status: "COMPLETED",
        type: "DEPOSIT",
        date: "2026-01-20"
    },
    {
        id: "TRX-003",
        userId: "client-2",
        bookingId: "BK-004",
        amount: 2700,
        currency: "MRU",
        method: "BANK_TRANSFER",
        status: "COMPLETED",
        type: "FULL_PAYMENT",
        date: "2026-01-25",
        invoiceUrl: "/invoices/TRX-003.pdf"
    }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
    {
        id: "NOT-001",
        userId: "client-1",
        type: "BOOKING_CONFIRMED",
        title: "Réservation Confirmée",
        message: "Votre réservation pour l'Hôtel Élégance Royal a été confirmée !",
        read: false,
        date: "2026-01-15T14:30:00Z",
        actionUrl: "/my-bookings"
    },
    {
        id: "NOT-002",
        userId: "client-1",
        type: "PAYMENT_SUCCESS",
        title: "Paiement Réussi",
        message: "Votre paiement de 1750 MRU a été traité avec succès.",
        read: false,
        date: "2026-01-15T14:32:00Z"
    },
    {
        id: "NOT-003",
        userId: "client-2",
        type: "PROMOTION",
        title: "Offre Spéciale -20%",
        message: "Profitez de -20% sur votre prochaine réservation avec le code WINTER2026",
        read: true,
        date: "2026-01-10T09:00:00Z",
        actionUrl: "/promotions"
    },
    {
        id: "NOT-004",
        userId: "client-2",
        type: "REVIEW_REQUEST",
        title: "Partagez votre expérience",
        message: "Comment s'est passé votre séjour à Station Balnéaire Palmier ?",
        read: false,
        date: "2026-01-26T10:00:00Z",
        actionUrl: "/hotels/2/review"
    },
    {
        id: "NOT-OWNER-001",
        userId: "owner-1",
        type: "BOOKING_CONFIRMED",
        title: "Nouvelle Réservation",
        message: "Une nouvelle réservation a été effectuée pour la Suite Deluxe par Jean Valjean.",
        read: false,
        date: new Date().toISOString(),
        actionUrl: "/owner/bookings"
    },
    {
        id: "NOT-OWNER-002",
        userId: "owner-1",
        type: "MESSAGE",
        title: "Nouveau Message",
        message: "Le client Marc Lévy vous a envoyé une question sur les services de l'hôtel.",
        read: false,
        date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        actionUrl: "/owner/messages"
    },
    {
        id: "NOT-ADMIN-001",
        userId: "admin-1",
        type: "PROMOTION",
        title: "Système: Promo Automatique",
        message: "La promotion SUMMER2026 a été activée automatiquement.",
        read: false,
        date: new Date().toISOString(),
        actionUrl: "/admin/promotions"
    }
];

// Mock Messages
export const mockMessages: Message[] = [
    {
        id: "MSG-001",
        senderId: "client-1",
        senderName: "Sophie Martin",
        receiverId: "owner-1",
        conversationId: "CONV-101-1",
        content: "Bonjour, est-il possible d'avoir une chambre avec vue sur mer ?",
        timestamp: "2026-01-14T16:20:00Z",
        read: true
    },
    {
        id: "MSG-002",
        senderId: "owner-1",
        senderName: "Hôtel Élégance Royal",
        receiverId: "client-1",
        conversationId: "CONV-101-1",
        content: "Bonjour ! Bien sûr, nous avons des suites avec vue mer disponibles. Je vous contacte pour les détails.",
        timestamp: "2026-01-14T16:45:00Z",
        read: true
    },
    {
        id: "MSG-003",
        senderId: "client-2",
        senderName: "Pierre Dupont",
        receiverId: "owner-1",
        conversationId: "CONV-102-1",
        content: "Le petit déjeuner est-il inclus dans le tarif ?",
        timestamp: "2026-01-20T11:00:00Z",
        read: false
    }
];

// Mock Conversations
import type { Conversation } from "../types";

export const mockConversations: Conversation[] = [
    {
        id: "CONV-101-1",
        participants: [
            { id: "client-1", name: "Sophie Martin", role: "USER", avatar: "https://i.pravatar.cc/150?img=1" },
            { id: "owner-1", name: "Hôtel Élégance Royal", role: "OWNER", avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=50&h=50&fit=crop" }
        ],
        unreadCount: 0,
        lastMessage: mockMessages[1]
    },
    {
        id: "CONV-102-1",
        participants: [
            { id: "client-2", name: "Pierre Dupont", role: "USER", avatar: "https://i.pravatar.cc/150?img=2" },
            { id: "owner-1", name: "Hôtel Élégance Royal", role: "OWNER", avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=50&h=50&fit=crop" }
        ],
        unreadCount: 1,
        lastMessage: mockMessages[2]
    }
];

// Mock Loyalty Points
export const mockLoyaltyPoints: LoyaltyPoints[] = [
    {
        userId: "client-1",
        totalPoints: 1750,
        tier: "GOLD",
        transactionHistory: [
            {
                id: "LP-001",
                points: 1750,
                reason: "Réservation BK-001 complétée",
                date: "2026-01-15"
            },
            {
                id: "LP-002",
                points: 500,
                reason: "Bonus inscription",
                date: "2025-12-01"
            }
        ]
    },
    {
        userId: "client-2",
        totalPoints: 720,
        tier: "SILVER",
        transactionHistory: [
            {
                id: "LP-003",
                points: 720,
                reason: "Réservation BK-002 (acompte)",
                date: "2026-01-20"
            }
        ]
    }
];

// Mock Users for Authentication
import type { UserLogin } from "../types";

export const mockUsers: UserLogin[] = [
    {
        id: "admin-1",
        name: "Administrateur",
        email: "admin@luxotel.com",
        password: "admin",
        role: "ADMIN"
    },
    {
        id: "owner-1",
        name: "Propriétaire Hôtel",
        email: "owner@hotel.com",
        password: "owner",
        role: "OWNER"
    },
    {
        id: "client-1",
        name: "Sophie Martin",
        email: "client@user.com",
        password: "user",
        role: "USER"
    },
    {
        id: "client-2",
        name: "Pierre Dupont",
        email: "pierre@user.com",
        password: "user",
        role: "USER"
    }
];

// Mock Promotions
export const mockPromotions: Promotion[] = [
    {
        id: "PROMO-001",
        code: "WINTER2026",
        title: "Offre Hiver -20%",
        description: "Profitez de -20% sur toutes les réservations en février",
        discountType: "PERCENTAGE",
        discountValue: 20,
        validFrom: "2026-02-01",
        validUntil: "2026-02-28",
        minPurchase: 500,
        usageLimit: 100,
        usedCount: 23,
        active: true
    },
    {
        id: "PROMO-002",
        code: "WELCOME50",
        title: "Bienvenue -50 MRU",
        description: "Réduction de 50 MRU pour votre première réservation",
        discountType: "FIXED",
        discountValue: 50,
        validFrom: "2026-01-01",
        validUntil: "2026-12-31",
        minPurchase: 200,
        usageLimit: 500,
        usedCount: 142,
        active: true
    },
    {
        id: "PROMO-003",
        code: "SUMMER2026",
        title: "Été Luxueux -15%",
        description: "Réduction de 15% sur les suites premium en été",
        discountType: "PERCENTAGE",
        discountValue: 15,
        validFrom: "2026-06-01",
        validUntil: "2026-08-31",
        maxDiscount: 300,
        usageLimit: 200,
        usedCount: 0,
        active: true
    }
];

