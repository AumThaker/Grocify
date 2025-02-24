import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './profile.css';

const ProfilePage = () => {
  let [loginStat, setLoginStat] = useState(false);
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
  const [user, setUser] = useState({
    username: "john_doe",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Ahmedabad",
    totalSpends: "₹12,000",
  });

  return (
    <>
    {loginStat?<div className="profile-container">
        <img src="navImage.jpg" alt="profileBack" id="profileBack" />
        <div className="profile-card">
          <h1>Welcome to <span>Grocify</span></h1>
          <div className="profile-details">
            <div className="detail-item">
              <label id='profile-ItemLabel'>Username:</label>
              <p id='profile-item-details'>{user.username}</p>
            </div>
            <div className="detail-item">
              <label id='profile-ItemLabel'>Email:</label>
              <p id='profile-item-details'>{user.email}</p>
            </div>
            <div className="detail-item">
              <label id='profile-ItemLabel'>Phone:</label>
              <p id='profile-item-details'>{user.phone}</p>
            </div>
            <div className="detail-item">
              <label id='profile-ItemLabel'>Address:</label>
              <p id='profile-item-details'>{user.address}</p>
            </div>
            <div className="detail-item">
              <label id='profile-ItemLabel'>Total Spends:</label>
              <p id='profile-item-details'>{user.totalSpends}</p>
            </div>
          </div>
          <div className="profile-btns">
            <Link to={"/changeDetails"}><button className="change-btn">Change Details</button></Link>
            <Link to={"/"}><button className="home-btn">Back To Home</button></Link>
          </div>
        </div>
      </div>:<div className="not-logged-in">
          <img
            src="navImage.jpg"
            alt="changeDetailsBack"
            id="changeDetailsBack"
          />
          <span>User Not Logged In</span>
          <Link to={"/login"}>
            <button id="loginPage">Log In Now</button>
          </Link>
        </div>}
    </>
  );
};

export default ProfilePage;

