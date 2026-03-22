import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Account from "./pages/Account";

function App() {
  return (
    <Routes>
      {/* Route cha dùng MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Các Route con sẽ được render vào vị trí <Outlet /> trong MainLayout */}
        <Route index element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="account" element={<Account />} />
      </Route>
    </Routes>
  );
}

export default App;
