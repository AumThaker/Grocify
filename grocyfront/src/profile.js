import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './profile.css';

const ProfilePage = () => {
  let [loginStat, setLoginStat] = useState(false);
  const [user, setUser] = useState(null)
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
    useEffect(()=>{
      try{
      (async function fetchUserDetails(){
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(`${API_BASE_URL}/user/fetchUserDetails`, {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) {
          const error = await response.json();
          alert(error.message)
          return;
        }
        const result = await response.json();
        setUser(result.user);
        console.log("Response from server:", result);
    })()} catch (error) {
        alert(error)
      }
    },[])
  return (
    <>
    {loginStat?user!==null?<div className="profile-container">
        <img src="navImage.jpg" alt="profileBack" id="profileBack" />
        <div className="profile-card">
          <h1>Welcome to <span>Grocify</span></h1>
          <div className="profile-details">
            <div className="detail-item">
              <label id='profile-ItemLabel'>Username:</label>
              <p id='profile-item-details'>{user.name}</p>
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
              <p id='profile-item-details'>{user.spent}</p>
            </div>
          </div>
          <div className="profile-btns">
            <Link to={"/changeDetails"}><button className="change-btn">Change Details</button></Link>
            <Link to={"/"}><button className="home-btn">Back To Home</button></Link>
          </div>
        </div>
      </div>:null:<div className="not-logged-in">
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

