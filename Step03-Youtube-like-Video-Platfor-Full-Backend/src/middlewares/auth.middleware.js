import jwt, { decode } from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (request, _, next) => { // "response" kaa koi use nahin kar rahe hain hum, isliye underscore '_' laga dete hain, industry standards mein aksar aisa hota hai code mein 
    //token access karenge cookies mein jo stored hai.
    try {
            const token = request.cookies?.accessToken || request.header("Authorization")?.replace("Bearer ", "");
        
            //agar token nahin hai toh error dikha do
            if(!token){
                throw new apiError(401, "Unauthorized access")
            }

            console.log("Token:", token)
        
            //agar token hai, toh verify karo ki yeh token fake toh nahin hai
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) // token generate karte time maine user ki information bhi store kara di thi token ke saath mein(like username, _id, email, etc), user model mein jaake check karo, wahan par maine generate access token kaa function likha hua hai, toh maine
            // console.log("decoded token: ", decodedToken)
            const userId = decodedToken?.id;
            // console.log("UserId", userId)
            const foundedUser = await User.findById(userId).select("-password -refreshToken");
            // console.log("foundedUser", foundedUser);
            //agar user find nahin ho paaya hai toh iska matlab invalid access token hai. 
            if(!foundedUser){
                throw new apiError(401, "Invalid access token")
            }
        
            //agar valid token hai toh fir hum "request" object mein apna naya object inject kar denge "user" ke naam se, or yahi hum logout ke time par use karenge
            request.user = foundedUser;
            next();
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }
})

export {verifyJWT}