import { useEffect, useState } from "react";
import './verifyEmail.css'
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
    let [searchParams] = useSearchParams();
    let [message, setMessage] = useState(null);
    let [verified, setVerified] = useState(false);
    let [loading, setLoading] = useState(true);
    
    let email = searchParams.get('email');
    let newUsername = searchParams.get('newUsername');
    let newPassword = searchParams.get('newPassword');
    let housenumber = searchParams.get('hn')
    let street = searchParams.get('str')
    let city = searchParams.get('ct')
    let state = searchParams.get('st')
    let pincode = searchParams.get('pc')
    let newPhone = searchParams.get('newPhone');
    let loginToken = searchParams.get('user');

    useEffect(() => {
        if (!email || !loginToken) {
            alert("Invalid Verification Link");
            setLoading(false);
            return;
        }
        (async function verify() {
            try {
                const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
                const response = await fetch(`${API_BASE_URL}/user/verifyEmail?email=${email}&loginToken=${loginToken}`, {
                    method: "POST",
                    credentials: "include",
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
                setMessage(result.message);
                setVerified(true);
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [email,loginToken]);

    useEffect(() => {
        if (!verified) return;
        if(!newUsername) return;
        (async function changeUsername() {
            try {
                let body = {
                    newUsername: newUsername,
                    verification: verified,
                };
                const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
                const response = await fetch(`${API_BASE_URL}/user/changeUsername`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                    credentials: "include",
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
                setMessage(result.message);
            } catch (error) {
                setMessage(error.message);
            }
        })();
    }, [verified,newUsername]);

    useEffect(()=>{
        if (!verified) return;
        if(!newPassword) return;
        (async function changePassword() {
            try {
                let body = {
                    newPassword: newPassword,
                    verification: verified,
                };
                const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
                const response = await fetch(`${API_BASE_URL}/user/changePassword`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                    credentials: "include",
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
                setMessage(result.message);
            } catch (error) {
                setMessage(error.message);
            }
        })();
    },[verified,newPassword])

    useEffect(()=>{
        if (!verified) return;
        if(!housenumber) return;
        (async function changeAddress() {
            try {
                let body = {
                    housenumber:housenumber,
                    street:street,
                    city:city,
                    state:state,
                    pincode:pincode,
                    verification: verified,
                };
                const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
                const response = await fetch(`${API_BASE_URL}/user/changeAddress`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                    credentials: "include",
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
                setMessage(result.message);
            } catch (error) {
                setMessage(error.message);
            }
        })();
    },[verified,housenumber])

    useEffect(()=>{
        if (!verified) return;
        if(!newPhone) return;
        (async function changePhone() {
            try {
                let body = {
                    newPhone: newPhone,
                    verification: verified,
                };
                const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
                const response = await fetch(`${API_BASE_URL}/user/changePhone`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                    credentials: "include",
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
                setMessage(result.message);
            } catch (error) {
                setMessage(error.message);
            }
        })();
    },[verified,newPhone])
    return (
        <>
            <img src="navImage.jpg" alt="verifyEmailBack" id="verifyEmailBack" />
            <div className="verification">
                {loading ? (
                    <div className="loading-spinner"></div>
                ) : (
                    <>
                        <span>{message}</span>
                        <button onClick={() => (window.location.href = "/")}>Home</button>
                    </>
                )}
            </div>
        </>
    );
}
