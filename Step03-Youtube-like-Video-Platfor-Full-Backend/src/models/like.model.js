import mongoose, {mongo, Schema} from "mongoose";

const likeSchema = new Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },

    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },

    tweetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    },

    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },


}, {timestamps: true});

export const Like = mongoose.model("Like", likeSchema);