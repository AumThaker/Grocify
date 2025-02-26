import "./changeDetails.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ChangeDetails() {
  let [loginStat, setLoginStat] = useState(false);
  let [btnActive, setBtnActive] = useState(0);
  let [emailVerified, setEmailVerified] = useState(false);
  useEffect(() => {
    (async function loginCheck() {
      const API_BASE_URL =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(`${API_BASE_URL}/user/checkLoginToken`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        setLoginStat(false);
      }
      if (response.ok) {
        setLoginStat(true);
      }
    })();
  }, [loginStat]);
  const changeDetailsArray = [
    "Change Username",
    "Change Password",
    "Change Address",
    "Change Phone",
  ];
  function buttonActive(index) {
    setBtnActive(index);
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
  async function changeUsername(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let formobject = Object.fromEntries(formData);
    formobject.verification = emailVerified;
    if(formobject.newUsername===""){
      alert("Enter new username")
      return;
    }
    const API_BASE_URL =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
    const response = await fetch(`${API_BASE_URL}/user/changeUsername`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formobject),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
    }
    if (response.ok) {
      const result = await response.json();
      alert(result.message);
    }
  }
  async function changePassword(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let formobject = Object.fromEntries(formData);
    formobject.verification = emailVerified;
    const API_BASE_URL =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
    const response = await fetch(`${API_BASE_URL}/user/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formobject),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
    }
    if (response.ok) {
      const result = await response.json();
      alert(result.message);
    }
  }
  async function changeAddress(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let formobject = Object.fromEntries(formData);
    formobject.verification = emailVerified;
    const API_BASE_URL =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
    const response = await fetch(`${API_BASE_URL}/user/changeAddress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formobject),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
    }
    if (response.ok) {
      const result = await response.json();
      alert(result.message);
    }
  }
  async function changePhone(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let formobject = Object.fromEntries(formData);
    formobject.verification = emailVerified;
    const API_BASE_URL =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
    const response = await fetch(`${API_BASE_URL}/user/changePhone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formobject),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
    }
    if (response.ok) {
      const result = await response.json();
      alert(result.message);
    }
  }
  return (
    <>
      {loginStat ? (
        <div className="change-container">
          <img
            src="navImage.jpg"
            alt="changeDetailsBack"
            id="changeDetailsBack"
          />

          <div className="change-card">
            <h1>
              Update Your <span>Details</span>
            </h1>

            <div className="change-options">
              {changeDetailsArray.map((text, i) => (
                <button
                  key={i}
                  onClick={() => buttonActive(i)}
                  className={btnActive === i ? "active-btn" : ""}
                >
                  {text}
                </button>
              ))}
            </div>

            <div className="change-form">
              {btnActive === 0 && (
                <div className="change-section">
                  <form
                    onSubmit={(e) => {
                      changeUsername(e);
                    }}
                  >
                    <label htmlFor="changeUsername">Enter new username</label>
                    <input
                      type="text"
                      id="changeUsername"
                      name="newUsername"
                      placeholder="New username"
                    />
                    <button className="submit-btn" type="submit">
                      Submit
                    </button>
                  </form>
                </div>
              )}

              {btnActive === 1 && (
                <form onSubmit={(e)=>{changePassword(e)}}>
                <div className="change-section">
                  <label htmlFor="newPassword">Enter new password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New password"
                  />

                  <label htmlFor="newconPassword">Enter new confirm password</label>
                  <input
                    type="password"
                    id="newConPassword"
                    name="newConPassword"
                    placeholder="New Confirm password"
                  />

                  <button className="submit-btn" type="submit">Submit</button>
                </div>
                </form>
              )}
              {btnActive === 2 && (
                <div className="change-section">
                  <form onSubmit={(e)=>changeAddress(e)}>
                  <div className="address-grid">
                    <div>
                      <label htmlFor="change-house-number">House Number</label>
                      <input
                        type="text"
                        id="change-house-number"
                        name="housenumber"
                        placeholder="Enter house number"
                      />
                    </div>

                    <div>
                      <label htmlFor="change-street">Street</label>
                      <input
                        type="text"
                        id="change-street"
                        name="street"
                        placeholder="Enter street name"
                      />
                    </div>

                    <div>
                      <label htmlFor="change-city">City</label>
                      <input
                        type="text"
                        id="change-city"
                        name="city"
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label htmlFor="change-state">State</label>
                      <input
                        type="text"
                        id="change-state"
                        name="state"
                        placeholder="Enter state"
                      />
                    </div>

                    <div className="full-width">
                      <label htmlFor="change-pincode">Pincode</label>
                      <input
                        type="number"
                        id="change-pincode"
                        name="pincode"
                        placeholder="Enter pincode"
                        onInput={(e)=>{handlePincodeValue(e)}}
                      />
                    </div>
                  </div>

                  <button className="submit-btn" type="submit">Submit</button>
                  </form>
                </div>
              )}
              {btnActive === 3 && (
                <div className="change-section">
                  <form onSubmit={(e)=>changePhone(e)}>
                  <label htmlFor="changePhone">Enter phone number</label>
                  <input
                    type="number"
                    id="changePhone"
                    name="newPhone"
                    placeholder="New phone number"
                    onInput={(e)=>handlePhoneNumberValue(e)}
                  />
                  <button className="submit-btn" type="submit">Submit</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="not-logged-in">
          <img
            src="navImage.jpg"
            alt="changeDetailsBack"
            id="changeDetailsBack"
          />
          <span>User Not Logged In</span>
          <Link to={"/login"}>
            <button id="loginPage">Log In Now</button>
          </Link>
        </div>
      )}
      <Link to={"/"}>
      <button id="BackToHome">Home</button>
      </Link>
    </>
  );
}
