import connectDatabase from "../../lib/connectDatabase";
import User from "../../model/User";

export default async function (req, res) {
  try {
    await connectDatabase();

    const users = await User.find();

    res.status(200).json({ users });
  } catch (error) {
    console.error("An error occurred while fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
}