import mongoose from "mongoose";
import { apiResponse, asyncHandler, User } from "../allImports"

const getWatchHistory = asyncHandler(async (request, response) => {
    const user = await User.aggregate([
        //first pipeline
        {
            $match: {
                _id: new mongoose.Types.ObjectId(request.user.id) // request.user.id is usually a string, like: "65e984f5c9e88d1a9b3c2a10". Convert the String to an ObjectId, new mongoose.Types.ObjectId(request.user.id) converts it into an ObjectId: new ObjectId("65e984f5c9e88d1a9b3c2a10")

            }
        },

        //second pipeline
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                //third pipeline, yahan hum second pipeline ke andar ek or pipeline likh rahe hain, issi ko hum nested or sub-pipeline kehte hai
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        avatar: 1,
                                        fullname: 1,
                                    }
                                }
                            ]
                        }
                    },

                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            }
                        }
                    }
                ]
            },
        }
    ]);

    return response.status(200)
    .json(new apiResponse(200, user[0].watchHistory, "Watch history fetched successfully"));
});

export {getWatchHistory}

