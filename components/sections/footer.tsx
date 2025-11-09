import React from "react";

export default function Footer() {
  return (
    <footer
      className="text-[var(--color-black)] noisebg "
     
    >
      <div className="bg-black text-[var(--color-black)]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & About */}
            <div className="space-y-4">
              <h1 className="logo">
          MyKolachi
        </h1>
              <p className="text-sm text-[var(--color-gray)]">
               Karachi's rich history and vibrant culture.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-2 rounded-md bg-[var(--color-brown)]/10 hover:bg-[var(--color-brown)]/20"
                  aria-label="Instagram"
                >
                  <i className="fa-brands fa-instagram text-lg text-[var(--color-brown)]"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-md bg-[var(--color-brown)]/10 hover:bg-[var(--color-brown)]/20"
                  aria-label="Facebook"
                >
                  <i className="fa-brands fa-facebook text-lg text-[var(--color-brown)]"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-md bg-[var(--color-brown)]/10 hover:bg-[var(--color-brown)]/20"
                  aria-label="Twitter"
                >
                  <i className="fa-brands fa-x-twitter text-lg text-[var(--color-brown)]"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-3 text-[var(--color-brown)]">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-[var(--color-gray)]">
                <li>
                  <a href="#" className="hover:text-[var(--color-light-beige)]">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[var(--color-light-beige)]">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[var(--color-red)]">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-3 text-[var(--color-brown)]">
                Contact
              </h3>
              <address className="not-italic text-sm text-[var(--color-gray)] space-y-2">
                <div>📍  Karachi</div>
                <div>
                  📞{" "}
                  <a
                    href="tel:+922100000000"
                    className="hover:text-[var(--color-red)]"
                  >
                    +92 21 0000 0000
                  </a>
                </div>
                <div>
                  ✉️{" "}
                  <a
                    href="mailto:hello@kolachi.example"
                    className="hover:text-[var(--color-red)]"
                  >
                    hello@kolachi.example
                  </a>
                </div>
              </address>

            
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold mb-3 text-[var(--color-brown)]">
                Join Our Newsletter
              </h3>
              <p className="text-sm text-[var(--color-gray)] mb-3">
                Get weekly specials and events — no spam.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thanks for subscribing!");
                }}
              >
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  className="w-full sm:flex-1 px-3 py-2 rounded-md border border-[var(--color-brown)]/30 bg-[var(--color-light-beige)] placeholder-[var(--color-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[var(--color-red)] hover:bg-[var(--color-brown)] text-[var(--color-light-beige)] font-medium transition"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-[var(--color-gray)] mt-3">
                By subscribing you agree to our{" "}
                <a href="/privacy" className="underline hover:text-[var(--color-red)]">
                  privacy policy
                </a>
                .
              </p>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-[var(--color-brown)]/20 mt-10 pt-6 text-sm text-[var(--color-gray)] flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              © {new Date().getFullYear()} Kolachi. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="/terms" className="hover:text-[var(--color-red)]">
                Terms
              </a>
              <a href="/privacy" className="hover:text-[var(--color-red)]">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
