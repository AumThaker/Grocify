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
  res.clearCookie("loginToken");
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
  console.log(user);
  // const createdUser = await User.create(user)
  // if(!createdUser) return res.status(400).json({message:"ACCOUNT NOT CREATED"})
  // return res.status(200).json({message:"ACCOUNT CREATED",user:createdUser})
};

export { registerUser, loginUser, logoutUser, registerOtpSent, register };
