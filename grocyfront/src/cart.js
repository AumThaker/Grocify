import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./cart.css";

export default function Cart() {
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
    const response = await fetch("http://localhost:3000/user/logoutUser", {
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
      <CartItems loginStat={loginStat} />
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
        <span>Orders</span>
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
function CartItems({ loginStat }) {
  let [cart, setCart] = useState(null);
  let [error, setError] = useState(null);
  useEffect(() => {
    (async function cartItems() {
      const response = await fetch("http://localhost:3000/cart/cartItems", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
      }
      if (response.ok) {
        const result = await response.json();
        setCart(result.cart);
      }
    })();
  }, []);
  async function handleQuantityInput(stock,id,e){
    let value = e.target.value
    if (value.length > stock.length || isNaN(value)) {
        e.target.value = value.slice(0, 2);
    }
    if(value>stock){
        e.target.value = stock;
        value = e.target.value
    }
    const response = await fetch(`http://localhost:3000/cart/changeQuantity?productId=${cart[id]._id}&quantity=${value}`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        alert(error.message)
      }
      if (response.ok) {
        const result = await response.json();
      }
  }
  return loginStat ? (
    <div className="cart">
      <div className="top-section-cart">
        <h1>CART ITEMS</h1>
        <motion.div className="BuyAll-wrapper">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    className="BuyAll"
                  >
                    Buy All
                  </motion.button>
                </motion.div>
      </div>
      <div className="cart-items">
        {cart ? (
          cart.map((item, id) => {
            return (
              <div className="itemBox">
                <img src={item.imageUrl} alt="cartImage" id="cartImage"></img>
                <span id="cartItemName">{item.name}</span>
                <span id="cartItemPrice">
                  Rs{item.price} / {item.unit}
                </span>
                <div
                  className="quantity-item"
                  style={{ display: "flex", flexDirection: "row", gap: "5px" }}
                >
                  <label
                    htmlFor="Quantity"
                    style={{ color: "white", fontFamily: "Queensides" }}
                  >
                    Quantity :
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    min={1}
                    max={item.stock}
                    id="Quantity"
                    defaultValue={1}
                    onInput={(e)=>{handleQuantityInput(item.stock,id,e)}}
                  ></input>
                </div>
                <motion.div>
                  <motion.button whileTap={{ scale: 0.85 }} className="BuyThis">
                    Buy This
                  </motion.button>
                </motion.div>
              </div>
            );
          })
        ) : (
          <div className="no-cart"></div>
        )}
      </div>
    </div>
  ) : (
    <div className="login-first">Login To See Cart</div>
  );
}
