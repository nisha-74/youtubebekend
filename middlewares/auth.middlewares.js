import { APiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/ayncHandler.js";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.schema.js";

const verifyJWTToken = asyncHandler(async (req,_, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log(token);

    if (!token) {
      throw new APiError(401, "Unauthorize");
    }

    const decodeInformations = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodeInformations);

    const user = await User.findById(decodeInformations?._id).select("-password -refresToken")
    console.log(user);
    if (!user) {
      throw new APiError(401, "User is not found..")
    }

    req.user = user;
    next();
  }
  catch (err) {
    throw new APiError(500, " Something went to wrong", err);
  }
});

export {
  verifyJWTToken
}