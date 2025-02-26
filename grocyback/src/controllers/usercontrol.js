import Orders from "../models/orders.js";
import User from "../models/usermodel.js";
import nodemailer from "nodemailer";

const registerUser = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      phone,
      con_password,
      housenumber,
      street,
      city,
      state,
      pincode,
    } = req.body;
    console.log(req.body);
    if (!username) return res.status(400).json({ message: "INVALID USERNAME" });
    if (!email) return res.status(400).json({ message: "INVALID EMAIL" });
    if (!phone) return res.status(400).json({ message: "INVALID PHONENUMBER" });
    if (!password) return res.status(400).json({ message: "INVALID PASSWORD" });
    if (!housenumber || !street || !city || !state || !pincode)
      return res.status(400).json({ message: "COMPLETE ADDRESS DETAILS" });
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "INVALID EMAIL ID" });
    const passRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!passRegex.test(password))
      return res.status(400).json({
        message:
          "PASSWORD SHOULD CONTAIN 1 UPPERCASE , 1 LOWERCASE , 1 DIGIT , 1 SPECIAL CHARACTER",
      });
    if (password != con_password)
      return res
        .status(400)
        .json({ message: "PASSWORD AND CONFIRM PASSWORD ARE NOT THE SAME" });
    const phoneRegex = /^((\+91?)|\+)?[7-9][0-9]{9}$/;
    if (!phoneRegex.test(phone))
      return res
        .status(400)
        .json({ message: "PHONE NUMBER SHOULD BE OF 10 DIGITS" });
    let checkUserExists = await User.findOne({ username: username });
    if (checkUserExists)
      return res.status(405).json({ message: "USERNAME ALREADY EXISTS" });
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "EMAIL ID ALREADY EXISTS" });
    }
    let user = {
      name: username,
      email: email,
      password: password,
      phone: phone,
      address: {
        housenumber: housenumber,
        street: street,
        city: city,
        state: state,
        pincode: pincode,
      },
    };
    return res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "SOME ERROR OCCURRED", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "INCORRECT EMAIL OR PASSWORD" });
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Account with username/email doesnot exist" });
    let isPassCorrect = await user.ComparePassword(password);
    if (!isPassCorrect)
      return res.status(400).json({ message: "INCORRECT PASSWORD" });
    let loginToken = await user.genLoginToken();
    user.loginToken = loginToken;
    await user.save();
    const loggedInUser = await User.findOne({ loginToken: loginToken });
    if (!loggedInUser)
      return res.status(404).json({ message: "NOT LOGGED IN" });
    const options = {
      httpsOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    };
    return res
      .status(200)
      .cookie("loginToken", loginToken, options)
      .json({ message: "Logged in successfully", user: loggedInUser });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "SOME ERROR OCCURRED", error: error.message });
  }
};
const logoutUser = async (req, res) => {
  const loggedInUser = await User.findById(req.user._id);
  console.log(loggedInUser);
  if (!loggedInUser)
    return res.status(400).json({ message: "User not logged in" });
  loggedInUser.loginToken = undefined;
  await loggedInUser.save({ validateBeforeSave: false });
  res.clearCookie("loginToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });
  let loggedOutUser = await User.findById(req.user._id);
  return res
    .status(200)
    .json({ message: "LOGGED OUT SUCCESFULLY", user: loggedOutUser });
};

const registerOtpSent = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user.email)
      return res.status(400).json({ message: "EMAIL NOT AVAILABLE" });
    if (!user.phone)
      return res.status(400).json({ message: "PHONE NUMBER NOT AVAILABLE" });
    let phoneNumber = `+91${user.phone.toString()}`;
    let otp = Math.floor(1000 + Math.random() * 9000);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "thakeraum1511@gmail.com",
        pass: "jzjj twhi kozs hrnc",
      },
    });
    transporter.verify(function (error, success) {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("SMTP server is ready to send emails!");
      }
    });
    let emailTemplate = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 500px; background: white; padding: 20px; border-radius: 10px; margin: auto;">
              <h2 style="color: #007bff;">Your OTP Code</h2>
              <p>Use the OTP below to complete your verification process.</p>
              <div style="font-size: 24px; font-weight: bold; background: #f8f9fa; padding: 10px; border-radius: 5px; display: inline-block;">
                  ${otp}
              </div>
              <p>This OTP is valid for the next 5 minutes. Do not share it with anyone.</p>
          </div>
      </div>
    `;
    var mailOptions = {
      from: "thakeraum1511@gmail.com",
      to: user.email,
      subject: "Grocify Account Creation Step",
      html: emailTemplate,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(404).json("Email not verified");
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    //complete after upgrading twilio
    // const accountSid = process.env.accountSid;
    // const authToken = process.env.authToken;
    // const client = require("twilio")(accountSid, authToken);
    // client.messages
    //   .create({
    //     body: `Grocify Shopping\nAn Account with your number is registered\nOTP is ${otp}\nOTP valid for 5mins`,
    //     from: "+18319992437",
    //     to: phoneNumber,
    //   })
    //   .then((message) => console.log(message.sid))
    //   .done();
    return res.status(200).json({ message: "OTP SENT", otp: otp });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "SOME ERROR OCCURED", error: error });
  }
};
const register = async (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(404).json({ message: "USER DATA NOT FOUND" });
  const createdUser = await User.create(user);
  if (!createdUser)
    return res.status(400).json({ message: "ACCOUNT NOT CREATED" });
  return res
    .status(200)
    .json({ message: "ACCOUNT CREATED", user: createdUser });
};
const checkLoginToken = async (req, res) => {
  const loginToken = req.cookies?.loginToken;
  if (!loginToken)
    return res.status(401).json({ loginstatus: false, message: "No Token" });
  return res
    .status(200)
    .json({ loginstatus: true, message: "Token available" });
};
const changeUsername = async (req, res) => {
  try {
    const { newUsername, verification } = req.body;
    if (!newUsername)
      return res.status(400).json({ message: "New Username Not Found" });
    console.log(newUsername);
    let user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "User Not Found" });
    const API_BASE_URL = process.env.FRONTEND_URL || "http://localhost:3001";
    if (!verification) {
      const verificationLink = `${API_BASE_URL}/verifyEmail?email=${user.email}&newUsername=${newUsername}&user=${user.loginToken}`;
      let emailBody = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; background: white; padding: 20px; border-radius: 10px; margin: auto;">
            <h2 style="color: #007bff;">Verify Your Email</h2>
            <p>Click the button below to complete your verification process.</p>
            <a href="${verificationLink}" style="text-decoration: none;">
                <button style="
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    font-size: 18px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;">
                    Verify Email
                </button>
            </a>
            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
    </div>
  `;
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_EMAIL_PASS,
        },
      });
      await transporter.verify(function (error, success) {
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("SMTP server is ready to send emails!");
        }
      });
      let emailTemplate = emailBody;
      var mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.email,
        subject: "Grocify Username Change Verification",
        html: emailTemplate,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(404).json("Email not verified");
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res
        .status(200)
        .json({ stat: "MailSent", message: "Email sent to user's mail id" });
    }
    user.name = newUsername;
    await user.save();
    return res
      .status(200)
      .json({ stat: "UserUpdated", message: "Username Successfully Updated" });
  } catch (error) {
    console.error("Error in changeUsername:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const verifyEmail = async (req, res) => {
  const { email, loginToken } = req.query;
  if (!email) return res.status(404).json({ message: "Email Id Not Correct" });
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("Email Not Verified");
  }
  const options = {
    httpsOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  };
  return res
    .status(200)
    .cookie("loginToken", loginToken, options)
    .json({ message: "Email Successfully Verified" });
};
const changePassword = async (req, res) => {
  try {
    const { newPassword , newConPassword, verification } = req.body;
    if (!newPassword)
      return res.status(400).json({ message: "New Password Not Found" });
    console.log(newPassword);
    if(newPassword!==newConPassword){
        return res.status(200).json({message:"Both Passwords Are Not Same"})
    }
    const passRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!passRegex.test(newPassword)) {
      return res
        .status(400)
        .json({
          message:
            "Password Should Contain 1 Uppercase , 1 Lowercase , 1 Digit , 1 Symbol",
        });
    }
    let user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "User Not Found" });
    const API_BASE_URL = process.env.FRONTEND_URL || "http://localhost:3001";
    if (!verification) {
      const verificationLink = `${API_BASE_URL}/verifyEmail?email=${user.email}&newPassword=${newPassword}&user=${user.loginToken}`;
      let emailBody = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; background: white; padding: 20px; border-radius: 10px; margin: auto;">
            <h2 style="color: #007bff;">Verify Your Email</h2>
            <p>Click the button below to complete your verification process.</p>
            <a href="${verificationLink}" style="text-decoration: none;">
                <button style="
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    font-size: 18px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;">
                    Verify Email
                </button>
            </a>
            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
    </div>
  `;
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_EMAIL_PASS,
        },
      });
      await transporter.verify(function (error, success) {
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("SMTP server is ready to send emails!");
        }
      });
      let emailTemplate = emailBody;
      var mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.email,
        subject: "Grocify Password Change Verification",
        html: emailTemplate,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(404).json("Email not verified");
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res
        .status(200)
        .json({ stat: "MailSent", message: "Email sent to user's mail id" });
    }
    user.password = newPassword;
    await user.save();
    return res
      .status(200)
      .json({ stat: "UserUpdated", message: "Password Successfully Updated" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const changeAddress = async (req, res) => {
  try {
    const { housenumber, street, city, state, pincode, verification } =
      req.body;
    if (!(housenumber || street || city || state || pincode))
      return res.status(400).json({ message: "Incomplete Address" });
    let user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "User Not Found" });
    const API_BASE_URL = process.env.FRONTEND_URL || "http://localhost:3001";
    if (!verification) {
      const verificationLink = `${API_BASE_URL}/verifyEmail?email=${user.email}&hn=${housenumber}&str=${street}&ct=${city}&st=${state}&pc=${pincode}&user=${user.loginToken}`;
      let emailBody = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; background: white; padding: 20px; border-radius: 10px; margin: auto;">
            <h2 style="color: #007bff;">Verify Your Email</h2>
            <p>Click the button below to complete your verification process.</p>
            <a href="${verificationLink}" style="text-decoration: none;">
                <button style="
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    font-size: 18px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;">
                    Verify Email
                </button>
            </a>
            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
    </div>
  `;
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_EMAIL_PASS,
        },
      });
      await transporter.verify(function (error, success) {
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("SMTP server is ready to send emails!");
        }
      });
      let emailTemplate = emailBody;
      var mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.email,
        subject: "Grocify Address Change Verification",
        html: emailTemplate,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(404).json("Email not verified");
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res
        .status(200)
        .json({ stat: "MailSent", message: "Email sent to user's mail id" });
    }
    user.address.housenumber = housenumber;
    user.address.street = street;
    user.address.city = city;
    user.address.state = state;
    user.address.pincode = pincode;
    await user.save();
    return res
      .status(200)
      .json({ stat: "UserUpdated", message: "Address Successfully Updated" });
  } catch (error) {
    console.error("Error in changeAddress:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const changePhone = async (req, res) => {
  try {
    const { newPhone, verification } = req.body;
    if (!newPhone)
      return res.status(400).json({ message: "New Phone Number Not Found" });
    console.log(newPhone);
    const phoneRegex = /^((\+91?)|\+)?[7-9][0-9]{9}$/;
    if (!phoneRegex.test(newPhone)) {
      return res
        .status(400)
        .json({ message: "Phone number should be of 10 digits" });
    }
    let user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "User Not Found" });
    const API_BASE_URL = process.env.FRONTEND_URL || "http://localhost:3001";
    if (!verification) {
      const verificationLink = `${API_BASE_URL}/verifyEmail?email=${user.email}&newPhone=${newPhone}&user=${user.loginToken}`;
      let emailBody = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; background: white; padding: 20px; border-radius: 10px; margin: auto;">
            <h2 style="color: #007bff;">Verify Your Email</h2>
            <p>Click the button below to complete your verification process.</p>
            <a href="${verificationLink}" style="text-decoration: none;">
                <button style="
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    font-size: 18px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;">
                    Verify Email
                </button>
            </a>
            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
    </div>
  `;
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_EMAIL_PASS,
        },
      });
      await transporter.verify(function (error, success) {
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("SMTP server is ready to send emails!");
        }
      });
      let emailTemplate = emailBody;
      var mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.email,
        subject: "Grocify Mobile Number Change Verification",
        html: emailTemplate,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(404).json("Email not verified");
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res
        .status(200)
        .json({ stat: "MailSent", message: "Email sent to user's mail id" });
    }
    user.phone = newPhone;
    await user.save();
    return res
      .status(200)
      .json({
        stat: "UserUpdated",
        message: "Mobile Number Successfully Updated",
      });
  } catch (error) {
    console.error("Error in changePhone:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const fetchUserDetails = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).json({ message: "USER NOT FOUND" });
  const orders = await Promise.all(
    user.orders.map(async (order) => {
      const ord = await Orders.findById(order.orderId);
      return ord ? ord.payment.paymentAmount / 100 : 0; 
    })
  );
  const orderSpends = orders.reduce((total, amount) => total + amount, 0);
  const address = Object.values(user.address).filter(Boolean).join(" ");
  let userDetails = {
    name:user.name,
    email:user.email,
    address:address,
    phone:user.phone,
    spent:orderSpends
  }
  return res.status(200).json({message:"FETCHED SUCCESSFULLY",user:userDetails})
};
export {
  registerUser,
  loginUser,
  logoutUser,
  registerOtpSent,
  register,
  checkLoginToken,
  changeUsername,
  verifyEmail,
  changePassword,
  changeAddress,
  changePhone,
  fetchUserDetails
};
