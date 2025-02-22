import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <>
      <Nav />
      <Dashboard />
      <Footer />
    </>
  );
}
function Nav() {
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
      <nav>
      <img src="navImage.jpg" alt="navImage" id="imageNav"></img>
        <div className="descNav">
          <span id="siteName">Grocify</span>
          <span id="siteTag">Fresh, Green, and Plastic-Free Deliveries</span>
          <motion.div className="showNow-wrapper">
            <Link to={"/groceries"} style={{ textDecoration: "none" }}>
              <motion.button whileTap={{ scale: 0.85 }} className="shopnow">
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
        <div className="traverse-wrapper">
          <div className="traverse">
            <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
              <span>Home</span>
            </Link>
            <Link
              to={"/groceries"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>Groceries</span>
            </Link>
            <Link
              to={"/cart"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>Cart</span>
            </Link>
            <Link
              to={"/order"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>Orders</span>
            </Link>
          </div>
          <div className="profile">
            {loginStat ? (
              <div className="logout-profile">
                <motion.div className="LogOutBtn-wrapper">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    className="LogOutBtn"
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
                  id="profileHome"
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
              <motion.div className="LoginBtn-wrapper">
                <Link to={"/login"} style={{ textDecoration: "none" }}>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    className="LoginBtn"
                  >
                    Log in
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
function Dashboard() {
  return (
    <main>
      <div className="infoSec">
        <span id="aboutus">About us</span>
        <p id="aboutUsPara">
          Welcome to Grocify, your go-to online grocery store, designed to bring
          fresh and high-quality groceries right to your doorstep. We offer a
          wide range of vegetables, fruits, and essential food items, ensuring
          you get the best produce at the best prices. Our goal is to make
          grocery shopping easy, convenient, and time-saving, so you can focus
          on what truly matters. With a seamless ordering experience, real-time
          delivery tracking, and a user-friendly interface, Grocy is committed
          to delivering freshness with every order. Whether you're stocking up
          on daily essentials or looking for farm-fresh produce, we've got you
          covered. Experience hassle-free grocery shopping with us today!
        </p>
        <span id="product">Products</span>
        <div className="products">
          <div className="product">
            <h3>Vegetables</h3>
            <img src="vegetables.webp" alt="Fresh Vegetables" />
            <motion.div className="shopnowProd-wrapper">
              <Link
                to={"/groceries"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className="shopnowProd"
                >
                  Shop Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
          <div className="product">
            <h3>Fruits</h3>
            <img src="fruits.png" alt="Fresh Fruits" />
            <motion.div className="shopnowProd-wrapper">
              <Link
                to={"/groceries"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className="shopnowProd"
                >
                  Shop Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
          <div className="product">
            <h3>Dairy & Bakery</h3>
            <img src="dairy.png" alt="Dairy Products" />
            <motion.div className="shopnowProd-wrapper">
              <Link
                to={"/groceries"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className="shopnowProd"
                >
                  Shop Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
          <div className="product">
            <h3>Grains & Staples</h3>
            <img src="grains.png" alt="Grains and Staples" />
            <motion.div className="shopnowProd-wrapper">
              <Link
                to={"/groceries"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className="shopnowProd"
                >
                  Shop Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
        <span id="wcu">Why Choose us ?</span>
        <div className="wcuBox">
          <div className="wcu">
            <img src="delTruck.png" alt="delTruck"></img>
            <h1>Fast Delivery !</h1>
          </div>
          <div className="wcu">
            <img src="quaAss.png" alt="quaAss"></img>
            <h1>Quality Assurance</h1>
          </div>
          <div className="wcu">
            <img src="secPay.png" alt="secPay"></img>
            <h1>Secure Payment</h1>
          </div>
          <div className="wcu">
            <img src="besPri.png" alt="bestPri"></img>
            <h1>Best Prices</h1>
          </div>
        </div>
      </div>
    </main>
  );
}
function Footer() {
  return (
    <footer>
      <img src="navImage.jpg" alt="footerImage"></img>
      <div className="footerDesc">
        <span id="footerSiteName">Grocify</span>
        <div className="footerInfo">
          <div className="footerInfo1">
            <span>Terms & Conditions</span>
            <span> | </span>
            <span>Privacy Policy</span>
          </div>
          <div className="footerInfo2">
            <span>Refund/Cancel Policy</span>
            <span> | </span>
            <span>Contact Us</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
