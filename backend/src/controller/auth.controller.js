import { User } from "../models/user.model.js";

const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    //check if the user already exists
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      //signup
      await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in auth callback", error);
    next(error);
  }
};

export { authCallback };
