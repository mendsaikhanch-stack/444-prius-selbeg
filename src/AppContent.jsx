import useApp from "./hooks/useApp";
import AdminPanel from "./admin/AdminPanel";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MobileMenu from "./components/layout/MobileMenu";
import Toast from "./components/ui/Toast";
import AuthModal from "./components/ui/AuthModal";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import GalleryPage from "./pages/GalleryPage";
import AdvicePage from "./pages/AdvicePage";
import ContactPage from "./pages/ContactPage";

export default function AppContent() {
  const {
    bg, tx, page,
    adminView, user,
    mobileMenu, showAuth,
  } = useApp();

  if (adminView && user?.isAdmin) return <AdminPanel />;

  return (
    <div className={`min-h-screen ${bg} ${tx} transition-colors duration-300`}>
      <Toast />
      <Header />
      {mobileMenu && <MobileMenu />}
      {showAuth && <AuthModal />}

      {page === "home" && <HomePage />}
      {page === "services" && <ServicesPage />}
      {page === "gallery" && <GalleryPage />}
      {page === "advice" && <AdvicePage />}
      {page === "contact" && <ContactPage />}

      <Footer />
    </div>
  );
}
