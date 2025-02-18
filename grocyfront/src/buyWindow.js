import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./buyWindow.css";
export default function BuyWindow() {
  let [loginStat, setLoginStat] = useState(false);
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      let [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === "loginToken" && cookieValue) {
        setLoginStat(true);
        break; // No need to continue checking after finding the token
      }
    }
  }, [loginStat]);
  async function logout() {
    const response = await fetch(`${process.env.DeployedSite+"/user/logoutUser" || "http://localhost:3000/user/logoutUser"}`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      let error = await response.json();
      console.log(error.message);
    }
    if (response.ok) setLoginStat(false);
  }
  return (
    <>
      <Nav logout={logout} loginStat={loginStat} />
      <OrderBody loginStat={loginStat}/>
    </>
  );
}
function Nav({ loginStat, logout }) {
  return (
    <div className="navigation-wrapper">
      <div className="navigator">
        <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
          <span>Home</span>
        </Link>
        <Link
          to={"/groceries"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <span>Groceries</span>
        </Link>
        <Link to={"/cart"} style={{ textDecoration: "none", color: "inherit" }}>
          <span>Cart</span>
        </Link>
        <Link
          to={"/order"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <span>Orders</span>
        </Link>
      </div>
      <div className="nav-profile">
        {loginStat ? (
          <div className="nav-logout-profile">
            <motion.div className="nav-LogOutBtn-wrapper">
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="nav-LogOutBtn"
                onClick={logout}
              >
                Log out
              </motion.button>
            </motion.div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
          </div>
        ) : (
          <motion.div className="nav-login-wrapper">
            <Link to={"/login"} style={{ textDecoration: "none" }}>
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="nav-login-btn"
              >
                Log in
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
function OrderBody({loginStat}) {
  let [orderDetails, setOrderDetails] = useState(null);
  useEffect(() => {
    (async function fetchOrder() {
      const response = await fetch(`${process.env.DeployedSite+"/orders/fetchOrders" || "http://localhost:3000/orders/fetchOrders"}`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        return error;
      }
      const result = await response.json();
      setOrderDetails(result.orderDetails);
      console.log(result);
    })();
  }, []);
  return loginStat?<div className="AllOrders">
  <h1>Your Orders</h1>
  <div className="order-list">
    {orderDetails ? (
      orderDetails.map((order, i) => (
        <div className="order" key={i}>

          <img src={order.orderedItems[0].productImage} alt="orderImage" />

          <div className="order-details">
            
            <div className="orderItemsName">
              <div className="order-section-title">Items</div>
              {order.orderedItems.map((item, id) => (
                <span key={id}>
                  {item.productName} x {item.productQuantity}
                </span>
              ))}
            </div>

            <div className="orderPayment">
              <div className="order-section-title">Payment Details</div>
              <span><strong>Order ID:</strong> {order.payment.orderId}</span>
              <span><strong>Transaction ID:</strong> {order.payment.transactionId}</span>
              <span><strong>Date:</strong> {order.payment.paymentDate}</span>
              <span><strong>Amount:</strong> ₹{order.payment.paymentAmount / 100}</span>
              <span><strong>Delivery Charge:</strong> ₹{order.payment.deliveryCharge}</span>
            </div>

            <div className="orderDeliver">
              <div className="order-section-title">Delivery Status</div>
              <span>{order.deliverStatus}</span>
              <span>Estimated: {order.estimatedTime}</span>
            </div>

          </div>
        </div>
      ))
    ) : (
      <div className="no-order">NO ORDERS YET</div>
    )}
  </div>
</div>:<div className="login-first">Login To See Orders</div>
}
