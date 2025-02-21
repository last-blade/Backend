/*
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({})

export const User = mongoose.model("User", userSchema);

jab bhi model banate hain kisi kaa bhi, toh sabse pehle yeh 3 line jo hain inko likhna hota hai(see above), aisa koi compulsory 
nahin hai, lekin isse humein yaad ho jaata hai easily, and yeh 3 lines toh sabhi models ke liye same hi rehti hain,

line:1-> pehle import karo mongoose ko
line:2-> fir schema banao mongoose se using new keyword "new mongoose.Schema({})" or fir isko kisi variable mein store karlo
        jaise maine kiya hai "userSchema" naam ke variable mein "const userSchema = new mongoose.Schema({})"

line:3-> fir jo humne schema banaya hai line 2 mein, uske basis par hum model create karenge and fir export karenge, 
        mongoose.model("User", userSchema) -> model kaa naam "User" rakha hai string mein and userSchema ke basis par model
        create kiya hai, ab time hai isko export karna kaa, toh kisi variable mein rakh ke iss model ko export kar denge and then
        hum iss model ko kahin par bhi use kar sakte hain.
        
        Tip: model kaa naam humne "User" rakha hai see here-> "mongoose.model("User", userSchema)"......and mongoDB mein yeh naam 
            lowercase mein store hota hai and user jo hai "users" ban jaata hai i.e., plural word ban jaata hai
*/

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"], // custom validation bhi likh sakte hain, password nahin daala toh fir yeh message show hoga
    },
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);