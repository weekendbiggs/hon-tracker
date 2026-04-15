import { NavLink } from "react-router-dom";
import { LayoutGrid, Egg, LineChart, BarChart3, User, Lock } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

export default function MobileNav() {
  const { signedIn } = useAdmin();
  const tabs = [
    { to: "/", label: "Collection", icon: LayoutGrid, end: true },
    { to: "/wishlist", label: "Wishlist", icon: Egg },
    { to: "/market", label: "Market", icon: LineChart },
    { to: "/timeline", label: "Timeline", icon: BarChart3 },
    { to: "/admin", label: "Admin", icon: User, lock: !signedIn },
  ];
  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-white/92 backdrop-blur border-t border-[rgba(61,43,31,0.12)] md:hidden z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5">
        {tabs.map(({ to, label, icon: Icon, end, lock }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors relative ${
                isActive ? "text-gold" : "text-subink"
              }`
            }
          >
            <Icon size={22} strokeWidth={1.7} />
            <span>{label}</span>
            {lock && (
              <Lock
                size={10}
                className="absolute top-2 right-[30%] text-subink"
                aria-label="locked"
              />
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
