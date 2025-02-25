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


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){ //agar password modifiy nahin hua hai toh return kar jaao
        return next();
    }

    else{
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
}) // yahan par hum mongoose kaa "pre" middleware use kar rahe hain, see comment: 2 below

userSchema.methods.isPasswordCorrect = async function(password){ // see Comment: 3
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    const accessToken = jwt.sign(
        {
            id: this._id, email: this.email, fullname: this.fullname, username: this.username
        }, 

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )

    return accessToken;
}

userSchema.method.generateRefreshToken = async function(){
    const refreshToken = jwt.sign(
        {
            id: this._id,
        }, 

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )

    return refreshToken;
}


export const User = mongoose.model("User", userSchema);


//COMMENT:-1
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

//COMMENT:-2
/*
    "pre" ek middleware hai mongoose kaa, jo ki hum use karte hain like, You use the pre-hook (middleware) in Mongoose 
    when you need to perform some actions before executing a database operation.
    Neeche kuch usecases likh raha hoon:
    1️⃣ Hashing Password Before Saving a User
    2️⃣ Adding Timestamps Before Saving
    3️⃣ Modifying Data Before Updating

    Syntax: 
    userSchema.pre("save", async function(){

    });

*/

//COMMENT:-3
/*
mongoose ke andar alreday kuch pre-defined methods hote hain like updateOne, deleteOne, etc, but hum apne khud ke "custom methods"
bhi define kar sakte hain.....jiss schema ke liye method banana hai usko target karke hum method bana sakte hain like
userSchema.methods.<your-custom-method-name> = async function(password){ humein password ko check karna hai valid hai ki nahin, toh isliye parameter mein password pass kiya hai
}

// ".methods" jo hai ek object hai, or iss object ke andar predefined properties hoti hain alreday, but humein apni property
    chahiye custom, toh hum seedhe methods.<my own custom method> karke create kar sakte hain
*/