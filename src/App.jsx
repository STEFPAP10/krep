import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./Pages/Welcome";
import LoginPage from "./Pages/LoginPage";
import Register from "./Pages/Register";
import Menu from "./Pages/user/Menu";         // (θα το φτιάξεις)
import OrderStatus from "./Pages/user/OrderStatus"; // (θα το φτιάξεις)
import Orders from "./Pages/admin/Orders";
import Products from "./Pages/admin/Products";
import CompletedOrders from "./Pages/admin/CompletedOrders";
import Checkout from "./Pages/user/Checkout";
import { CartProvider } from "./context/CartContext";
import ThankYou from "./Pages/ThankYou";




function App() {
  return (
    <CartProvider>    
    <Router>
      <Routes>
        {/* welcome */}
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register/>}></Route>

        {/* Login */}
        <Route path="/login" element={<LoginPage/>} />

        {/* Πελάτης */}
        <Route path="/user/menu" element={<Menu />} />
        <Route path="/user/order-status" element={<OrderStatus />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />



        {/* Κατάστημα */}
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/completed-orders" element={<CompletedOrders />} />

      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;
