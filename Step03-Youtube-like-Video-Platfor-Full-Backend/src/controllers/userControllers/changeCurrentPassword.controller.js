import { asyncHandler, apiError, apiResponse, User } from "../allImports.js"

const changeCurrentPassword = asyncHandler(async (request, response) => {
    const{oldPassword, newPassword, confirmPassword} = request.body;

    if(!(newPassword === confirmPassword)){
        throw new apiError(400, "New password and confirm password do not match");
    }

    const userId = request.user?.id;
    const user = await User.findById(userId);

    const passwordCorrectOrNot = user.isPasswordCorrect(oldPassword); /* "isPasswordCorrect" wala method humne user model mein define kiya hua hai, isliye user ke through access kar rahe hain iss method ko, or yeh method tru or false return karega, agar tumne purana wala password sahi daala hai toh true or else false */
    //agar password galat hai purana wala, toh error bhej do
    if(!passwordCorrectOrNot){
        throw new apiError(400, "Invalid password")
    }

    //password sahi hai toh DB mein naya password update kardo uss particular user kaa
    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return response.status(200)
    .json(new apiResponse(200, {}, "Password changed successfully."))
})