import { useState } from "react";
import NavBar from "../component/common/NavBar";

// Composant SearchBar
function SearchBar() {
  return (
    <div className="bg-[#8B7355] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <select className="bg-white/90 text-gray-700 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <option>Destination</option>
            <option>Paris</option>
            <option>London</option>
            <option>New York</option>
          </select>

          <input
            type="date"
            className="bg-white/90 text-gray-700 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Check-in"
          />

          <input
            type="date"
            className="bg-white/90 text-gray-700 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Check-out"
          />

          <select className="bg-white/90 text-gray-700 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <option>Rooms</option>
            <option>1 Room</option>
            <option>2 Rooms</option>
            <option>3+ Rooms</option>
          </select>

          <button className="bg-[#6B5434] hover:bg-[#5B4424] text-white font-semibold px-6 py-3 rounded-md transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant HotelCard
function HotelCard({ hotel }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>

        <div className="md:w-2/3 bg-[#9B8365] text-white p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>

            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-sm">
                  ★
                </span>
              ))}
              <span className="ml-2 text-sm opacity-90">
                ({hotel.reviews} reviews)
              </span>
            </div>

            <p className="text-sm opacity-90 mb-3 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {hotel.location}
            </p>

            <p className="text-sm leading-relaxed opacity-90">
              {hotel.description}
            </p>
          </div>

          <div className="mt-4">
            <button className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Footer
function Footer() {
  return (
    <footer className="bg-[#6B5434] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1">
            <div className="flex flex-col items-start mb-4">
              <span className="text-2xl font-serif italic">Park Vista</span>
              <div className="flex items-center gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xs">
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Experience luxury and comfort at our world-class hotels. Your
              perfect stay awaits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Our Hotels
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Room Booking
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Restaurant
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Spa & Wellness
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>123 Luxury Avenue, Hotel District, City 12345</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>info@parkvista.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300 mb-4 md:mb-0">
              © 2024 Park Vista Hotels. All rights reserved.
            </p>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">FOLLOW US:</span>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Composant principal
export default function HotelListingPage() {
  const hotels = [
    {
      id: 1,
      name: "Fairmont Nusa Dua International",
      location: "Nusa Dua, Bali, Indonesia",
      description:
        "Experience ultimate luxury with stunning ocean views, world-class amenities, and exceptional service in the heart of Bali.",
      reviews: 1234,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      name: "Atlantis Waterfront Resort",
      location: "Dubai Marina, UAE",
      description:
        "An iconic waterfront destination offering breathtaking views, luxurious accommodations, and unforgettable experiences.",
      reviews: 2156,
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      name: "Pullman Palace Suite",
      location: "Paris, France",
      description:
        "Classic Parisian elegance meets modern comfort. Perfectly located near the Eiffel Tower and Champs-Élysées.",
      reviews: 987,
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    },
    {
      id: 4,
      name: "Royal Continental Lisbon",
      location: "Lisbon, Portugal",
      description:
        "Historic charm blended with contemporary luxury in Portugal's captivating capital city.",
      reviews: 1543,
      image:
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop",
    },
    {
      id: 5,
      name: "Hotel Vista Premium",
      location: "Tokyo, Japan",
      description:
        "Modern Japanese hospitality with panoramic city views and authentic cultural experiences.",
      reviews: 1876,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    },
    {
      id: 6,
      name: "Hotel Des Arts Miami",
      location: "Miami Beach, Florida",
      description:
        "Art deco luxury on pristine beaches with vibrant nightlife and world-class dining.",
      reviews: 2341,
      image:
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
    },
    {
      id: 7,
      name: "Royal One Bloomsbury",
      location: "London, United Kingdom",
      description:
        "British sophistication in the heart of London, steps from iconic landmarks and cultural treasures.",
      reviews: 1654,
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
    },
    {
      id: 8,
      name: "Hotel Diva Museum",
      location: "Florence, Italy",
      description:
        "Renaissance beauty and Italian luxury combined in the cradle of art and culture.",
      reviews: 1432,
      image:
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar/>
      {/* Search Bar */}
      <SearchBar />

      {/* Hotels List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Discover Our Hotels
          </h1>
          <p className="text-gray-600">
            Explore {hotels.length} luxury destinations worldwide
          </p>
        </div>

        <div className="space-y-6 grid grid-cols-2 gap-1 ">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
