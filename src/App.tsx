import { HashRouter, Route, Routes } from "react-router-dom";
import Gallery from "./pages/Gallery";
import HenDetail from "./pages/HenDetail";
import Wishlist from "./pages/Wishlist";
import Market from "./pages/Market";
import Timeline from "./pages/Timeline";
import Admin from "./pages/Admin";
import AdminAdd from "./pages/AdminAdd";
import AdminPrices from "./pages/AdminPrices";
import MobileNav from "./components/MobileNav";
import DesktopNav from "./components/DesktopNav";

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-full pb-20 md:pb-0 md:pt-16">
        <DesktopNav />
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8">
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/hen/:slug" element={<HenDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/market" element={<Market />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/add" element={<AdminAdd />} />
            <Route path="/admin/edit/:id" element={<AdminAdd />} />
            <Route path="/admin/prices" element={<AdminPrices />} />
          </Routes>
        </main>
        <MobileNav />
      </div>
    </HashRouter>
  );
}
