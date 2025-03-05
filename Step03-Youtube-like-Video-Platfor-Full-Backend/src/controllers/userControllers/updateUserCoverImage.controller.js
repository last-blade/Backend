import { asyncHandler, apiError, apiResponse, User, uploadOnCloudinary } from "../allImports.js"

const updateUserCoverImage = asyncHandler(async (request, response) => {
    const coverImageLocalPath = request.file?.path;
    
    if(!coverImageLocalPath){
        throw new apiError(404, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar.url){
        throw new apiError(400, "Error while uploading cover image")
    }

    const user = User.findByIdAndUpdate(request.user?.id,
        {
            $set: {
                coverImage: coverImage.url,
            }
        },

        {new: true}// databse mein information update hone ke baad, updated user ko return karta hai, like user ne agar "fullname" update kiya hai, toh fir yeh jo hai "user" object ko return karega or usmein updated "fullname" hoga

    ).select("-password");

    return response.status(200)
    .json(new apiResponse(200, user, "Cover image updated successfully"));
});

export {updateUserCoverImage}