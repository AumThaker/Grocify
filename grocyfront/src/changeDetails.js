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
                <div className="change-section">
                  <label htmlFor="oldPassword">Enter old password</label>
                  <input
                    type="password"
                    id="oldPassword"
                    placeholder="Old password"
                  />

                  <label htmlFor="newPassword">Enter new password</label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="New password"
                  />

                  <button className="submit-btn">Submit</button>
                </div>
              )}
              {btnActive === 2 && (
                <div className="change-section">
                  <div className="address-grid">
                    <div>
                      <label htmlFor="change-house-number">House Number</label>
                      <input
                        type="text"
                        id="change-house-number"
                        placeholder="Enter house number"
                      />
                    </div>

                    <div>
                      <label htmlFor="change-street">Street</label>
                      <input
                        type="text"
                        id="change-street"
                        placeholder="Enter street name"
                      />
                    </div>

                    <div>
                      <label htmlFor="change-city">City</label>
                      <input
                        type="text"
                        id="change-city"
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label htmlFor="change-state">State</label>
                      <input
                        type="text"
                        id="change-state"
                        placeholder="Enter state"
                      />
                    </div>

                    <div className="full-width">
                      <label htmlFor="change-pincode">Pincode</label>
                      <input
                        type="number"
                        id="change-pincode"
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>

                  <button className="submit-btn">Submit</button>
                </div>
              )}
              {btnActive === 3 && (
                <div className="change-section">
                  <label htmlFor="changePhone">Enter phone number</label>
                  <input
                    type="number"
                    id="changePhone"
                    placeholder="New phone number"
                  />
                  <button className="submit-btn">Submit</button>
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
      <button id="BackToHome">Home</button>
    </>
  );
}
