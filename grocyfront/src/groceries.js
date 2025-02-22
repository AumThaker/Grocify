import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./groceries.css";

export default function Groceries() {
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
  async function logout(){
    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
    const response = await fetch(`${API_BASE_URL}/user/logoutUser`,{
      method:"POST",
      credentials:"include"
    })
    if(!response.ok) {
      let error = await response.json();
      console.log(error.message)
    }
    if(response.ok) setLoginStat(false)
  }
  return (
    <>
      <Nav logout={logout} loginStat={loginStat} />
      <Vegetables loginStat={loginStat} />
    </>
  );
}
function Nav({ loginStat,logout }) {
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
        {loginStat ? <div className="nav-logout-profile">
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
              </div> : (
          <motion.div className="nav-login-wrapper">
            <Link to={"/login"} style={{textDecoration:"none"}}>
            <motion.button whileTap={{ scale: 0.85 }} className="nav-login-btn">
              Log in
            </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
function Vegetables({ loginStat }) {
  let [vegData, setVegData] = useState(null);
  let [notify,setNotify] = useState(false)
  useEffect(() => {
    (async function () {
      try {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(`${API_BASE_URL}/api/grocyVegInfo`, {
          method: "POST",
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setVegData(data);
          });
      } catch (error) {
        console.log("Error");
      }
    })();
  }, []);
  function notifyCart(){
    loginStat?setNotify(false):setNotify(true)
  }
  function closeNotify(){
    setNotify(false)
  }

  async function addToCart(id){
    let itemId = vegData[id]._id
    if(loginStat){
      setNotify(false)
      try {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(`${API_BASE_URL}/cart/addToCart?productId=${itemId}`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          credentials:"include"
        })
        if(!response.ok){
          let error = await response.json();
          alert(error.message)
        }
        if(response.ok){
          let result = await response.json();
          alert(result.message)
        }
      } catch (error) {
        console.log(error)
      }
    }else{
      setNotify(true)
    }
  }
  return (
    <>
      <div className="vegetables">
        <h1>VEGETABLES</h1>
        <div className="veggies">
          {vegData ? (
            vegData.map((veg, id) => {
              return (
                <div className="vegBox" key={id}>
                  <img src={veg.imageUrl} alt="imageVeg" id="imageVeg"></img>
                  <span id="vegName">{veg.name}</span>
                  <span id="vegPrice">
                    Rs{veg.price} / {veg.unit}
                  </span>
                  <motion.div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="AddToCart"
                      onClick={()=>{addToCart(id)}}
                    >
                      Add To Cart
                    </motion.button>
                  </motion.div>
                </div>
              );
            })
          ) : (
            <>
              <img src="loader.png" alt="loader" id="loader"></img>
              <h3>Loading...</h3>
            </>
          )}
        </div>
      </div>
      {notify ? <div className="notification">
          <span>Login To Add To Cart</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x-circle-fill"
            viewBox="0 0 16 16"
            onClick={closeNotify}
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
          </svg>
        </div>: null}
    </>
  );
}