import "./loginReg.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function Login() {
  return <LoginContainer />;
}
function LoginContainer() {
  let [error, setError] = useState(null);
  let [data, setData] = useState(null);
  async function LoginBackend(e) {
    try {
      e.preventDefault();
      let form = e.target;
      let formData = new FormData(form);
      let formObject = Object.fromEntries(formData.entries());
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
      console.log(API_BASE_URL)
      const response = await fetch(`https://grocify-wnao.onrender.com/user/loginUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        alert(error.message)
        setError(error.message);
        return;
      }
      const result = await response.json();
      setData(result);
      console.log("Response from server:", result);
      setError(null);
    } catch (error) {
      setError("There was an issue with the request.");
    }
  }
  return data ? (
    <div className="redirect-login">
      <h1>Logged In Successfully</h1>
      <motion.div className="redirectBtn-wrapper">
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <motion.button whileTap={{ scale: 0.85 }} className="redirctBtn">
            Go To Home Page
          </motion.button>
        </Link>
      </motion.div>
    </div>
  ) : (
    <div className="login-container">
      <img src="navImage.jpg" alt="loginImage"></img>
      <div className="login-form">
        <h1>Login Now</h1>
        <form onSubmit={LoginBackend}>
          <div className="form">
            <label htmlFor="userOremail">Email Id</label>
            <input type="email" id="userOremail" name="email"></input>
          </div>
          <div className="form">
            <label htmlFor="login-password">Password</label>
            <input type="password" id="login-password" name="password"></input>
          </div>
          <span id="no-acc">Don't have a Grocify Account ? <Link to={"/register"} style={{color:"white"}}>Register Now</Link> , <Link to={"/"} style={{color:"white"}}>Home</Link></span>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}
