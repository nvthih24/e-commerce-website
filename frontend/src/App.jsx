import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Search from './pages/Search';
import Products from './pages/Products';

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";

function App() {
  return (
    <Routes>
      {/* ========================================== */}
      {/* GIAO DIỆN KHÁCH HÀNG (Dùng chung MainLayout) */}
      {/* ========================================== */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="account" element={<Account />} />
        <Route path="search" element={<Search />} />
        <Route path="products" element={<Products />} />
      </Route>


      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

    </Routes>
  );
}

export default App;