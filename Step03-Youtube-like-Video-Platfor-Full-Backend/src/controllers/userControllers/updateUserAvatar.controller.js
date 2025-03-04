import { asyncHandler, apiError, apiResponse, User, uploadOnCloudinary } from "../allImports.js"

const updateUserAvatar = asyncHandler(async (request, response) => {
    const avatarLocalPath = request.file?.path;
    
    if(!avatarLocalPath){
        throw new apiError(404, "Avatart file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new apiError(400, "Error while uploading avatar")
    }

    const user = User.findByIdAndUpdate(request.user?.id,
        {
            $set: {
                avatar: avatar.url,
            }
        },

        {new: true}// databse mein information update hone ke baad, updated user ko return karta hai, like user ne agar "fullname" update kiya hai, toh fir yeh jo hai "user" object ko return karega or usmein updated "fullname" hoga

    ).select("-password")
});

export {updateUserAvatar}