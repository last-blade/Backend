import mongoose, {mongo, Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
    content: {
        type: String,
    },

    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    },
    commnetOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },


}, {timestamps: true});

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);