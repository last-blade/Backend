import { asyncHandler, apiError, apiResponse, User } from "../allImports.js"

const getCurrentUser = asyncHandler(async (request, response) => {
    return response.status(200).json(new apiResponse(200, request.user, "User fetched successfully"))
});

export {getCurrentUser}