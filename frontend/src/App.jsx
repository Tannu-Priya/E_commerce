import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./pages/components/context/CartContext";
import { WishlistProvider } from "./pages/components/context/WishlistContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import Navbar from "./pages/components/Navbar";
import Toast from "./pages/components/Toast";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <Toast />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
