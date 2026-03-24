import { Link } from "@tanstack/react-router";
import { useData } from "../lib/DataContext";

// Assam scenic silhouette strip — tea bushes, rhino, Kamakhya-style temple
function AssamSceneStrip() {
  return (
    <svg
      viewBox="0 0 1200 80"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-16 md:h-20 block"
      aria-hidden="true"
    >
      {/* Ground baseline */}
      <rect x="0" y="60" width="1200" height="20" fill="#1a1a1a" />

      {/* Rolling hills / terrain */}
      <path
        d="M0 60 Q100 40 200 55 Q300 68 400 50 Q500 35 600 52 Q700 65 800 48 Q900 34 1000 55 Q1100 68 1200 50 L1200 80 L0 80 Z"
        fill="#1a1a1a"
        opacity="0.25"
      />

      {/* Tea bushes — dome clusters along the ground */}
      {/* Bush group 1 */}
      <ellipse cx="60" cy="60" rx="22" ry="12" fill="#1a1a1a" />
      <ellipse cx="82" cy="58" rx="18" ry="11" fill="#1a1a1a" />
      <ellipse cx="40" cy="61" rx="16" ry="10" fill="#1a1a1a" />
      {/* Bush group 2 */}
      <ellipse cx="190" cy="59" rx="24" ry="13" fill="#1a1a1a" />
      <ellipse cx="215" cy="57" rx="19" ry="11" fill="#1a1a1a" />
      <ellipse cx="168" cy="61" rx="17" ry="10" fill="#1a1a1a" />
      {/* Bush group 3 */}
      <ellipse cx="340" cy="61" rx="22" ry="12" fill="#1a1a1a" />
      <ellipse cx="362" cy="59" rx="18" ry="11" fill="#1a1a1a" />
      <ellipse cx="320" cy="62" rx="16" ry="10" fill="#1a1a1a" />
      {/* Bush group 4 */}
      <ellipse cx="490" cy="60" rx="23" ry="12" fill="#1a1a1a" />
      <ellipse cx="513" cy="58" rx="19" ry="11" fill="#1a1a1a" />
      <ellipse cx="469" cy="61" rx="17" ry="10" fill="#1a1a1a" />
      {/* Bush group 5 */}
      <ellipse cx="640" cy="61" rx="22" ry="12" fill="#1a1a1a" />
      <ellipse cx="662" cy="59" rx="18" ry="11" fill="#1a1a1a" />
      <ellipse cx="619" cy="62" rx="16" ry="10" fill="#1a1a1a" />
      {/* Bush group 6 */}
      <ellipse cx="780" cy="60" rx="21" ry="11" fill="#1a1a1a" />
      <ellipse cx="801" cy="58" rx="17" ry="10" fill="#1a1a1a" />
      <ellipse cx="760" cy="61" rx="15" ry="9" fill="#1a1a1a" />

      {/* One-horned Rhino silhouette — facing right, around x=880 */}
      <g transform="translate(855, 22)" fill="#1a1a1a">
        {/* Body */}
        <ellipse cx="28" cy="22" rx="28" ry="14" />
        {/* Head */}
        <ellipse cx="51" cy="18" rx="13" ry="10" />
        {/* Horn on snout */}
        <polygon points="62,12 66,6 64,13" />
        {/* Ear */}
        <ellipse cx="49" cy="10" rx="4" ry="5" />
        {/* Front legs */}
        <rect x="38" y="32" width="6" height="10" rx="2" />
        <rect x="28" y="33" width="6" height="9" rx="2" />
        {/* Rear legs */}
        <rect x="10" y="32" width="6" height="10" rx="2" />
        <rect x="2" y="33" width="6" height="9" rx="2" />
        {/* Tail */}
        <path
          d="M0 22 Q-6 18 -5 14"
          strokeWidth="3"
          stroke="#1a1a1a"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Kamakhya-style temple / pagoda silhouette — right side, around x=1060 */}
      <g transform="translate(1040, 0)" fill="#1a1a1a">
        {/* Base platform */}
        <rect x="0" y="54" width="80" height="6" rx="1" />
        {/* Main body */}
        <rect x="10" y="38" width="60" height="18" />
        {/* Mid tier */}
        <rect x="18" y="26" width="44" height="14" />
        {/* Upper tier */}
        <rect x="26" y="16" width="28" height="12" />
        {/* Shikhara / spire */}
        <polygon points="40,0 50,16 30,16" />
        {/* Small dome on top */}
        <ellipse cx="40" cy="3" rx="5" ry="4" />
        {/* Steps */}
        <rect x="28" y="58" width="24" height="4" rx="1" />
        {/* Flag on spire */}
        <line
          x1="40"
          y1="0"
          x2="40"
          y2="-6"
          stroke="#1a1a1a"
          strokeWidth="1.5"
        />
        <polygon points="40,-6 48,-3 40,-1" />
        {/* Decorative arches on body */}
        <path
          d="M18 38 Q25 32 32 38"
          stroke="#D4A017"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M48 38 Q55 32 62 38"
          stroke="#D4A017"
          strokeWidth="1.5"
          fill="none"
        />
      </g>

      {/* Bamboo stalks — left edge */}
      <g fill="#1a1a1a">
        <rect x="2" y="10" width="4" height="52" rx="2" />
        <rect x="10" y="18" width="3" height="44" rx="1.5" />
        <rect x="17" y="14" width="4" height="48" rx="2" />
        {/* Bamboo leaves */}
        <path d="M4 20 Q12 15 8 28" fill="#1a1a1a" />
        <path d="M13 30 Q20 24 17 36" fill="#1a1a1a" />
        <path d="M19 22 Q26 17 23 29" fill="#1a1a1a" />
      </g>
    </svg>
  );
}

export default function Footer() {
  const { settings } = useData();
  const year = new Date().getFullYear();

  const instagram =
    settings.aboutMe?.businessInstagram ||
    settings.aboutMe?.personalInstagram ||
    "";
  const whatsapp = settings.whatsapp || "";

  return (
    <footer className="mt-0" style={{ backgroundColor: "#D4A017" }}>
      {/* Decorative scenic strip */}
      <div className="overflow-hidden">
        <AssamSceneStrip />
      </div>

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {settings.logoImage ? (
                <img
                  src={settings.logoImage}
                  alt="logo"
                  className="h-10 w-10 rounded-full object-cover border-2 border-black/20"
                />
              ) : (
                <div className="w-10 h-10 bg-black rounded flex items-center justify-center font-bold text-sm text-[#D4A017] font-playfair flex-shrink-0">
                  {settings.logoText || "TDG"}
                </div>
              )}
              <span className="font-playfair text-lg font-bold text-black leading-tight">
                The Digital Gallery
                <br />
                <span className="text-sm font-normal text-black/70">
                  by Emon
                </span>
              </span>
            </div>
            <p className="text-black/80 text-sm leading-relaxed mb-2 font-medium">
              Crafted with love from Assam
            </p>
            <p className="text-black/60 text-sm">📍 Bongaigaon, Assam</p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-black text-xs uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "Photo Frames", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Track Order", to: "/track" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-black/75 hover:text-black font-medium transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-bold text-black text-xs uppercase tracking-widest mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-sm">
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/91${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-black/75 hover:text-black font-medium transition-colors"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    +91 {whatsapp}
                  </a>
                </li>
              )}
              {instagram && (
                <li>
                  <a
                    href={`https://instagram.com/${instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-black/75 hover:text-black font-medium transition-colors"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    {instagram}
                  </a>
                </li>
              )}
              <li className="text-black/60 text-xs pt-1">
                100% Refund if delivery not feasible
              </li>
              <li className="text-black/60 text-xs">3–4 Days Delivery</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/20 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-black/70 text-xs font-medium text-center sm:text-left">
            © {year} The Digital Gallery by Emon · Made with ❤️ in Assam
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/40 text-xs hover:text-black/60 transition-colors"
          >
            Built with caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
