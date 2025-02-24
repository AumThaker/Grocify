import { useState } from 'react';
import { Link } from 'react-router-dom'
import './profile.css';

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: "john_doe",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Ahmedabad",
    totalSpends: "₹12,000",
  });

  return (
    <>
      <div className="profile-container">
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
      </div>
    </>
  );
};

export default ProfilePage;

