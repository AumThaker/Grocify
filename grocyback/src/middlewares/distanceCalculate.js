import User from "../models/usermodel.js";
import { warehouse } from "../models/warehousemodel.js";

const calculateDistance = async (req, res, next) => {
  const userId = req.user._id;
  const storage = await warehouse.findOne({ name: "GrocyStorage1" });
  if (!userId) return res.status(404).json({ message: "INCORRECT ID" });
  if (!storage) return res.status(400).json({ message: "WAREHOUSE NOT FOUND" });
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "USER NOT FOUND" });
  let userAddress = Object.values(user.address)
    .map((obj) => obj + " ")
    .join("");
  if (!userAddress)
    return res.status(400).json({ message: "ADDRESS NOT AVAILABLE" });
  let warehouseAddress = Object.values(storage.address)
    .map((obj) => obj + " ")
    .join("");
  if (!warehouseAddress)
    return res.status(400).json({ message: "ADDRESS NOT AVAILABLE" });
  const response =
    await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json
?origins=${userAddress}
&destinations=${warehouseAddress}
&units=metric
&key=${process.env.GOOGLE_MAP_API_KEY}
`);
  let result = await response.json();
  let distance = result.rows[0].elements[0].distance.value/1000
  let duration = result.rows[0].elements[0].duration.value
  let deliveryCharges;
  if (distance <= 2) {
    deliveryCharges = distance * 2;  // 0 - 2 km range
  } else if (distance <= 5) {
    deliveryCharges = distance * 4;  // 2 - 5 km range
  } else if (distance <= 10) {
    deliveryCharges = distance * 5;  // 5 - 10 km range
  } else if (distance <= 15) {
    deliveryCharges = distance * 6;  // 10 - 15 km range
  } else if (distance <= 20) {
    deliveryCharges = distance * 7;  // 15 - 20 km range
  } else if (distance <= 25) {
    deliveryCharges = distance * 8;  // 20 - 25 km range
  } else if (distance <= 30) {
    deliveryCharges = distance * 9;  // 25 - 30 km range
  } else {
    deliveryCharges = 0
  }
  req.distance = distance
  req.duration = duration
  req.deliveryCharges = deliveryCharges
  next()
};
export { calculateDistance };
