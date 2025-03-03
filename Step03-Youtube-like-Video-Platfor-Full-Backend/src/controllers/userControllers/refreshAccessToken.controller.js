import { asyncHandler, apiError, apiResponse, sendMail, User } from "../allImports.js"
import jwt from "jsonwebtoken"
import {generateAccessTokenAndrefreshToken} from "./loginUser.controller.js"

const refreshAccessToken = asyncHandler(async (request, response) => {
    const incomingRefreshToken = request.cookies.refreshToken || request.body.refreshToken;

    if(!incomingRefreshToken){
        throw new apiError(401, "Unauthorized access");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userId = decodedToken?.id;
    
        const user = await User.findById(userId);
    
        if(!user){
            throw new apiError(401, "Invalid refresh token");
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new apiError(401, "Refresh token is expired or used")
        }
    
        const options ={
            httpOnly: true,
            secure: true,
        }
    
        const {accessToken, refreshToken} = await generateAccessTokenAndrefreshToken(userId);
    
        return response.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, {accessToken, refreshToken}, "Access token refresh successfully")
        )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token")
    }
});

export {refreshAccessToken}