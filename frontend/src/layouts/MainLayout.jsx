import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000, // Tự tắt sau 2 giây
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
      />

      {/* Khu vực Outlet sẽ là nơi render nội dung của Home, Cart... */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
