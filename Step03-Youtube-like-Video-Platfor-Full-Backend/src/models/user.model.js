import mongoose, {mongo, Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true, // why we are using "index" ? see the answer in below comment.
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true,
    },

    fullname: {
        type: String,
        required: true,
        trime: true,
        index: true,
    },

    avatar: {
        type: String, //cloudinary url user karenge iske liye
        required: true,
    },

    coverImage: {
        type: String,
    },

    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

    password: {
        type: String,
        required: [true, "Password is required"],

    },

    refreshToken: {
        type: String,
    },
    
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);

/*
--> How Indexing Improves Query Performance
    When you run a query like:
    User.findOne({ email: "test@example.com" });
    MongoDB searches for the document where email matches "test@example.com". If there is no index, MongoDB does a collection scan, meaning it checks every document one by one. This is slow when the collection has many documents.

🔹 With Indexing:
        MongoDB creates a B-tree index for the email field.
        Instead of scanning the entire collection, MongoDB quickly jumps to the indexed location of "test@example.com", making the query much faster.
        Think of it like searching for a word in a dictionary (indexed) vs. reading every page of a book (collection scan).
🔹 Without Indexing:
        MongoDB has to check every document in the collection.
        This takes O(n) time, where n is the total number of documents.
🔹 With Indexing:
        MongoDB finds the value in O(log n) time (much faster).
        This is why indexing improves query performance significantly, especially as the database grows.

Question:-> So indexing is provided to that particular email or the document where the email lies.
Answer:->   Indexing is applied to the field (email), not just a single document.

--> How It Works:
        When you add index: true to email, MongoDB creates a separate data structure (B-tree index) that stores all email values in sorted order, along with references (pointers) to the actual documents.
        This means every document's email is stored in the index.

--> Example: Collection Data (users)    
    [
        { "_id": 1, "email": "alice@example.com" },
        { "_id": 2, "email": "bob@example.com" },
        { "_id": 3, "email": "charlie@example.com" }
    ]

*/