import { useLocation } from 'react-router-dom';

export default function Footer() {
    const location = useLocation();

    if (location.pathname === '/account') {
        return null;
      }

  return (
    <footer className="bg-gray-800 text-white mt-12 py-6 text-center">
      <div className="container mx-auto px-4">
        <p>© 2026 TechStore. Bản quyền thuộc về TechStore.</p>
      </div>
    </footer>
  );
}
