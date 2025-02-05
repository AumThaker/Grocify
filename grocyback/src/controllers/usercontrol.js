import User from "../models/usermodel.js";

const registerUser = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      phone,
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
      return res.status(400).json({ message: "INVALID EMAIL" });
    const passRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!passRegex.test(password))
      return res
        .status(400)
        .json({ message: "PASSWORD IS NOT ACCORDING TO INSTRUCTIONS" });
    const phoneRegex = /^((\+91?)|\+)?[7-9][0-9]{9}$/;
    if (!phoneRegex.test(phone))
      return res.status(400).json({ message: "PHONE NUMBER IS INVALID" });
    let checkUserExists = await User.findOne({ username: username });
    if (checkUserExists)
      return res.status(405).json({ message: "USERNAME ALREADY EXISTS" });
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const userCreate = await User.create({
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
    });
    if (!userCreate)
      return res.status(500).json({ message: "ACCOUNT NOT CREATED" });
    let createdUser = await User.findById(userCreate._id);
    return res.status(200).json({ userCreated: createdUser });
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
      return res
        .status(400)
        .json({ message: "INCORRECT EMAIL OR PASSWORD" });
    const user = await User.findOne({ email:email });
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
  console.log(loggedInUser)
  if (!loggedInUser)
    return res.status(400).json({ message: "User not logged in" });
  loggedInUser.loginToken = undefined;
  await loggedInUser.save({ validateBeforeSave: false });
  res.clearCookie("loginToken");
  let loggedOutUser = await User.findById(req.user._id);
  return res.status(200).json({message:"LOGGED OUT SUCCESFULLY",user:loggedOutUser})
};
export { registerUser, loginUser, logoutUser};
