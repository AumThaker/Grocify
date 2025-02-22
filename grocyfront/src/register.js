import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Register() {
  let [error, setError] = useState(null);
  let [regStatus, setRegStatus] = useState(false);
  let [userData, setUserData] = useState(null);
  let [userCreated,setUserCreated] = useState(null)
  let [otp, setOtp] = useState(false);
  const inputRefs = useRef([]);

  function handleOtpNumber(e, index) {
    let value = e.target.value;
    if (value.length > 1) {
      e.target.value = value.slice(0, 1);
    }

    // Move to the next input
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  function handleBackspace(e, index) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }
  function handlePhoneNumberValue(e) {
    let value = e.target.value;
    if (value.length > 10) {
      e.target.value = value.slice(0, 10);
    }
  }
  function handlePincodeValue(e) {
    let value = e.target.value;
    if (value.length > 6) {
      e.target.value = value.slice(0, 6);
    }
  }
  async function register(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let body = Object.fromEntries(formData);
    try {
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(`${API_BASE_URL}/user/registerUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        let error = await response.json();
        setError(error.message);
      }
      if (response.ok) {
        let result = await response.json();
        setUserData(result);
        console.log(result)
        setError(null);
      }
    } catch (error) {
      alert("Error Loggin In");
      console.log(error);
    }
  }
  useEffect(() => {
    if (!userData) return;
    (async function otpFetch() {
      let body = userData;
      try {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(
          `${API_BASE_URL}/user/registerOtpCreate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
        if (!response.ok) {
          let error = await response.json();
          alert(error.message);
        }
        if (response.ok) {
          let result = await response.json();
          console.log(result)
          setOtp(result.otp);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [userData]);
  useEffect(() => {
    if (otp) {
      setTimeout(() => {
        setOtp(null);
      }, 300000);
    }
  }, [otp]);
  async function otpVerify(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let formObject = Object.fromEntries(formData);
    let otpEntered = "";
    for (let key in formObject) {
      if (formObject.hasOwnProperty(key)) {
        let value = formObject[key];
        otpEntered = otpEntered + value;
      }
    }
    if (otp.toString() === otpEntered) {
      try {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(`${API_BASE_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        if (!response.ok) {
          let error = await response.json();
          alert(error.message);
        }
        if (response.ok) {
          let result = await response.json();
          setRegStatus(true);
          setUserCreated(result.user)
        }
      } catch (error) {}
    } else {
      alert("OTP ENTERED IS INCORRECT");
    }
  }
  return (

    <>
      <img src="navImage.jpg" alt="img" id="reg-img" />
      {!regStatus ? !otp ? <div className="form-container">
          <h2>Register Now</h2>
          <form id="reg-form" onSubmit={(e) => register(e)}>
            <div className="form-wrapper">
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="number"
                    id="phone"
                    name="phone"
                    min={0}
                    placeholder="Enter your phone number"
                    onInput={(e) => handlePhoneNumberValue(e)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="con-password">Confirm Password</label>
                  <input
                    type="password"
                    id="con-password"
                    name="con_password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="house-number">House Number</label>
                  <input
                    type="text"
                    id="house-number"
                    name="housenumber"
                    placeholder="Enter house number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="street">Street</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    placeholder="Enter street name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    type="number"
                    id="pincode"
                    name="pincode"
                    placeholder="Enter pincode"
                    onInput={(e) => handlePincodeValue(e)}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="register-btn">
              Register
            </button>
            <h3>
              Already have an account ? <Link to={"/login"}>Login</Link> ,{" "}
              <Link to={"/"}>Home</Link>
            </h3>
            <span>{error}</span>
          </form></div> : <div className="otp-box">
          <h3>OTP SENT TO EMAIL AND PHONE</h3>
          <form onSubmit={(e) => otpVerify(e)}>
            <div className="inputs">
              {[0, 1, 2, 3].map((_, index) => (
                <input
                  key={index}
                  type="number"
                  name={"input" + index}
                  min={0}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleOtpNumber(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  className="otp-input"
                />
              ))}
            </div>
            <button type="submit" id="otpSent">
              SUBMIT OTP
            </button>
          </form>
        </div> : <div className="redirect-reg">
          <h1>Registered Successfully</h1>
          <motion.div className="redirectBtn-wrapper">
            <Link to={"/"} style={{ textDecoration: "none" }}>
              <motion.button whileTap={{ scale: 0.85 }} className="redirctBtn">
                Go To Home Page
              </motion.button>
            </Link>
          </motion.div>
        </div>
      }
    </>
  );
}
