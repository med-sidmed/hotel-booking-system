import React from "react";

const navigation = [
  { name: "Home", href: "#", current: false },
  { name: "Hotels & Resorts", href: "#", current: false },
  { name: "Contact", href: "#", current: false },
  { name: "My Booking", href: "#", current: false },
];

const socialLinks = [
  {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    href: "#",
    label: "Facebook",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
        <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    href: "#",
    label: "Instagram",
  },
 

  {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    href: "#",
    label: "YouTube",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-[#6B5434] shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo à gauche */}
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0">
              <div className="flex flex-col items-center text-white hover:opacity-90 transition-opacity">
                <span className="text-2xl font-serif italic tracking-wide">
                  LUXOTEL
                </span>
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xs">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </div>

          {/* Section droite - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Social icons */}
            <div className="flex items-center space-x-3 border-r border-gray-500/30 pr-6">
         
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-110"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

         

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <button className="bg-[#8B7355] hover:bg-[#9B8365] text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 hover:shadow-lg">
                Login
              </button>
              <button className="bg-[#9B8365] hover:bg-[#AB9375] text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 hover:shadow-lg">
                Book Now
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-[#5B4424] hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Navigation centrale - Desktop */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-10 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "text-white font-semibold border-b-2 border-yellow-400"
                    : "text-gray-200 hover:text-white font-medium",
                  "text-sm transition-all duration-200 pb-1 hover:border-b-2 hover:border-yellow-400/50",
                )}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-white/10">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-[#5B4424] text-white"
                    : "text-gray-300 hover:bg-[#5B4424] hover:text-white",
                  "block rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                )}
              >
                {item.name}
              </a>
            ))}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col space-y-3">
              <button className="w-full bg-[#8B7355] hover:bg-[#9B8365] text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-colors">
                Login
              </button>
              <button className="w-full bg-[#9B8365] hover:bg-[#AB9375] text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
