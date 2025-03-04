import { asyncHandler, apiError, apiResponse, User } from "../allImports.js"

const updateAccountDetails = asyncHandler(async (request, response) => {
    const {fullname, email} = request.body;

    if(!fullname || !email){
        throw new apiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(request.user?.id,
        {
            $set: {
                fullname,
                email
                //OR
                /* 
                    fullname: fullname
                    email: email 
                */
            }
        },
        {new: true}
    ).select("-password");

    return response.status(200)
    .json(new apiResponse(200, user, "Account details updated successfully"))

});

export {updateAccountDetails}