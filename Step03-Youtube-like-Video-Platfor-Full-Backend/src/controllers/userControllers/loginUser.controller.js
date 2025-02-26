import { asyncHandler, apiError, uploadOnCloudinary, apiResponse, sendMail, User } from "../allImports.js"

const generateAccessTokenAndrefreshToken = async (userId) => {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({saveBeforeValidation: false})
}

const loginUser = asyncHandler (async(request, response) => {
    const {email, username, password} = request.body;

    if(!username || email){
        throw new apiError(400, "Username or email is required.")
    }

    const foundUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if(!foundUser){
        throw new apiError(404, "User with this email or username does not exist.")
    }

    const isPassowrdValid = await foundUser.isPasswordCorrect(password);

    if(!isPassowrdValid){
        throw new apiError(401, "Incorrect password.")
    }

    generateAccessTokenAndrefreshToken(foundUser._id);
    
})