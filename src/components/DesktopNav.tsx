import { NavLink, Link } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { CONFIG } from "@/config";
import { Lock } from "lucide-react";

export default function DesktopNav() {
  const { signedIn } = useAdmin();
  const links = [
    { to: "/", label: "Collection", end: true },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/market", label: "Market" },
    { to: "/timeline", label: "Timeline" },
  ];
  return (
    <header className="hidden md:block fixed top-0 inset-x-0 bg-warm/90 backdrop-blur border-b border-[rgba(61,43,31,0.12)] z-40">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl flex items-center gap-2">
          <span aria-hidden>🪺</span> {CONFIG.siteTitle}
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "text-gold" : "text-ink hover:bg-[rgba(61,43,31,0.06)]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `ml-2 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isActive
                  ? "text-gold"
                  : "text-subink hover:text-ink hover:bg-[rgba(61,43,31,0.06)]"
              }`
            }
          >
            {!signedIn && <Lock size={13} />} Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
