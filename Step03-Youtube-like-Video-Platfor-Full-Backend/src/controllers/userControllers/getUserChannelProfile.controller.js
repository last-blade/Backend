/*
    --> An aggregation pipeline consists of one or more stages that process documents:

        --> Each stage performs an operation on the input documents. For example, a stage can filter documents, group documents, 
            and calculate values.

        --> The documents that are output from a stage are passed to the next stage.

        --> An aggregation pipeline can return results for groups of documents. For example, return the total, 
            average, maximum, and minimum values.
*/

import { asyncHandler, apiError, apiResponse, User, uploadOnCloudinary } from "../allImports.js"

const getCurrentUserChannelProfile = asyncHandler(async (request, response) => {
    const { username } = request.params;

    if(!username?.trim()){
        throw new apiError(400, "Username is missing")
    }

    /* 
        yahan par hum "User" document par aggregation pipeline laga rahe hain, and "aggregate" ek method hai jo "array 
        accept karta hai, and iss array ke andar hum object ke andar pipeline likhte hain, like ek object banaoge toh ek pipeline,
        2 object banaoge to 2 pipeline
        
        User.aggregate([
            {}, // pipeline one
            {}, // pipeline two
            {}, // pipeline three
            
        ])
    */
    const channel = await User.aggregate([
        //pipeline- 1
        {
            $match: {
                username: username?.toLowerCase()
            }
        },

        //pipeline- 2 for, Mere channel ke kitne subscribers hain
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            }
        },

        //Pipeline- 3 for, Maine kitne channels ko subscribe kiya hua hai
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            }
        },

        //Pipeline- 4 
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers",
                },

                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },

                isSubscribed: {
                    $cond: {
                        if: {$in: [request.user?.id, "$subscribers.subscriber"]},
                        then: true,
                        else: false,
                    }
                }
            }
        },

        //Pipeline- 5
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                email: 1,
                channelsSubscribedToCount: 1,
                isSubscribed,
                avatar: 1,
                coverImage: 1,
            }
        }

    ]);

    console.log("channel", channel);

    if(!channel?.length){
        throw new apiError(404, "Channel does not exist")
    }

    return response.status(200)
    .json(new apiResponse(200, channel[0], "User channel fetched successfully"))
});

export { getCurrentUserChannelProfile }