import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./cart.css";

export default function Cart() {
  let [loginStat, setLoginStat] = useState(false);
  useEffect(() => {
    (async function loginCheck(){
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
    const response = await fetch(`${API_BASE_URL}/user/checkLoginToken`, {
      method: "POST",
      credentials: "include",
    });
    if(!response.ok){
      setLoginStat(false)
      return;
    }
    if(response.ok){
      setLoginStat(true)
      return;
    }
    })()
  }, [loginStat]);
  async function logout() {
    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
    const response = await fetch(`${API_BASE_URL}/user/logoutUser`, {
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
              width="40"
              height="40"
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
  let [cart, setCart] = useState([]);
  let [error, setError] = useState(null);
  let [paymentId, setPaymentId] = useState(null);
  let [paymentDate, setPaymentDate] = useState(null);
  let [paymentAmount, setPaymentAmount] = useState(null);
  let [orderData, setOrderData] = useState(null);
  let [orderedItems, setOrderedItems] = useState(null);

  useEffect(() => {
    if (cart.length === 0)
      (async function cartItems() {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(`${API_BASE_URL}/cart/cartItems`, {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) {
          const error = await response.json();
          setError(error.message);
        }
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          setCart(result.cart);
        }
      })();
    else {
      return;
    }
  }, [cart]);
  async function handleQuantityInput(stock, id, e) {
    let value = e.target.value;
    if (value.length > stock.length || isNaN(value)) {
      e.target.value = value.slice(0, 2);
    }
    if (value > stock) {
      e.target.value = stock;
      value = e.target.value;
    }
    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
    const response = await fetch(
      `${API_BASE_URL}/cart/changeQuantity?productId="${cart[id][0]._id}&quantity=${value}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
    }
    if (response.ok) {
      const result = await response.json();
      let updatedCart = [...cart];
      updatedCart[id][1] = value;
      setCart(updatedCart);
    }
  }
  async function singleItemOrder(id) {
    let body = {
      productId: cart[id][0]._id,
      quantity: cart[id][1],
    };
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const handlePayment = async () => {
      const res = await loadRazorpayScript();

      if (!res) {
        alert(
          "Failed to load Razorpay script. Check your internet connection."
        );
        return;
      } else {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(
          `${API_BASE_URL}/orders/createOrderSingleItem`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            credentials: "include",
          }
        );
        if (!response.ok) {
          const error = await response.json();
          alert(error.message);
        }
        let result = response.json().then((data) => {
          setOrderData(data);
          console.log(data);
          openRazorpayCheckout(data);
        });
      }
    };
    const openRazorpayCheckout = (orderData) => {
      const options = {
        key: process.env.RAZORPAY, // Replace with environment variable
        amount: orderData.newOrder.amount, // Amount in the smallest currency unit
        currency: "INR",
        name: "Grocify",
        description: "Grocify Shopping",
        image: "", // Replace with your logo URL
        order_id: orderData.newOrder.id, // Order ID from backend
        handler: function (response) {
          setPaymentId(response.razorpay_payment_id);
          setPaymentDate(new Date().toLocaleString());
          setPaymentAmount(orderData.newOrder.amount); // Use correct value
        },
        prefill: {
          name: orderData.userDetails.name,
          email: orderData.userDetails.email,
          contact: orderData.userDetails.number, // Ensure correct key
        },
        notes: {
          address: "Shubham Complex",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });

      try {
        rzp.open();
      } catch (error) {
        console.error("Error opening Razorpay checkout:", error);
      }
    };
    await handlePayment();
    const order = cart.map((item,id)=>{return {productId:item[0]._id,productName:item[0].name,price:item[0].price,productImage:item[0].imageUrl,productQuantity:item[1]} })
    setOrderedItems(order)
  }
  useEffect(() => {
    if (!paymentId || !orderedItems) return;
    (async function updateOrder() {
      let body = {
        orderedItems: orderedItems,
        paymentId: paymentId,
        paymentDate: paymentDate,
        paymentAmount: paymentAmount,
        orderId: orderData.newOrder.id,
        deliveryCharge: orderData.orderDetails.deliveryCharges,
        estimatedDeliveryTime: orderData.orderDetails.estimatedDeliveryTime,
      };
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(`${API_BASE_URL}/orders/addToOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!response.ok) {
        let error = await response.json();
        alert(error);
      }
      if (response.ok) {
        alert(
          "Ordered Successfully\nOrder Id : " +
            orderData.newOrder.id +
            "\nTransaction Id : " +
            paymentId
        );
      }
      setPaymentId(null);
      setOrderedItems(null);
    })();
  }, [paymentId, orderedItems]);
  async function removeFromCart(id) {
    try {
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(
        `${API_BASE_URL}/cart/removeFromCart?productId=${cart[id][0]._id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        let error = await response.json();
        alert(error);
      }
      if (response.ok) {
        const result = await response.json();
        setCart(result.cart);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function buyAll() {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const handlePayment = async () => {
      const res = await loadRazorpayScript();

      if (!res) {
        alert(
          "Failed to load Razorpay script. Check your internet connection."
        );
        return;
      } else {
        if (cart.length === 0) alert("No Items In Cart");
        else {
          try {
            const body = cart.map((item,id)=>{return {productId:item[0]._id,productName:item[0].name,price:item[0].price,productImage:item[0].imageUrl,productQuantity:item[1]} })
            const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
            const response = await fetch(`${API_BASE_URL}/orders/createOrderAllItems`,{
              method:"POST",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify(body),
              credentials:"include"
            })
            if(!response.ok){
              const error = await response.json()
              alert(error.message)
            }
            if(response.ok){
              let result = response.json().then((data) => {
                setOrderData(data);
                console.log(data);
                openRazorpayCheckout(data);
              });
            }
          } catch (error) {
            console.log(error)
          }
        }
      }
    };
    const openRazorpayCheckout = (orderData) => {
      const options = {
        key: process.env.RAZORPAY, // Replace with environment variable
        amount: orderData.newOrder.amount, // Amount in the smallest currency unit
        currency: "INR",
        name: "Grocify",
        description: "Grocify Shopping",
        image: "", // Replace with your logo URL
        order_id: orderData.newOrder.id, // Order ID from backend
        handler: function (response) {
          setPaymentId(response.razorpay_payment_id);
          setPaymentDate(new Date().toLocaleString());
          setPaymentAmount(orderData.newOrder.amount); // Use correct value
        },
        prefill: {
          name: orderData.userDetails.name,
          email: orderData.userDetails.email,
          contact: orderData.userDetails.number, // Ensure correct key
        },
        notes: {
          address: "Shubham Complex",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });

      try {
        rzp.open();
      } catch (error) {
        console.error("Error opening Razorpay checkout:", error);
      }
    };
    await handlePayment();
    const order = cart.map((item,id)=>{return {productId:item[0]._id,productName:item[0].name,price:item[0].price,productImage:item[0].imageUrl,productQuantity:item[1]} })
    setOrderedItems(order)
  }
  return loginStat ? (
    <div className="cart">
      <div className="top-section-cart">
        <h1>CART ITEMS</h1>
        <motion.div className="BuyAll-wrapper">
          <motion.button whileTap={{ scale: 0.85 }} className="BuyAll" onClick={buyAll}>
            Buy All
          </motion.button>
        </motion.div>
      </div>
      <div className="cart-items">
        {cart.length > 0 ? (
          cart.map((item, id) => {
            return (
              <div className="itemBox" key={id}>
                <img
                  src={item[0].imageUrl ? item[0].imageUrl : "loading.jpg"}
                  alt="cartImage"
                  id="cartImage"
                ></img>
                <span id="cartItemName">{item[0].name}</span>
                <span id="cartItemPrice">
                  Rs{item[0].price} / {item[0].unit}
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
                    max={item[0].stock}
                    id="Quantity"
                    defaultValue={item[1]}
                    name="quantity"
                    onInput={(e) => {
                      handleQuantityInput(item[0].stock, id, e);
                    }}
                  ></input>
                </div>
                <div className="cart-buttons">
                  <motion.div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="BuyThis"
                      onClick={() => singleItemOrder(id)}
                    >
                      Buy This
                    </motion.button>
                  </motion.div>
                  <motion.div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="cart-remove"
                      onClick={() => removeFromCart(id)}
                    >
                      Remove
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-cart">NOTHING IN CART</div>
        )}
      </div>
    </div>
  ) : (
    <div className="login-first">Login To See Cart</div>
  );
}
