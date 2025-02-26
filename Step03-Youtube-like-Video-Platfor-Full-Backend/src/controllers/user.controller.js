import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
import { sendMail } from "../utils/mailer.js"

const registerUser = asyncHandler(async (request, response) => {
    const {fullname, email, username, password} = request.body;
    console.log("Req.body RegisterUser: ", request.body);

    if([fullname, email, password, username].some((inputField) => inputField?.trim === "")){
        /*
            --> Array mein saare field ek baar mein bhej diye, jo fields user jo hai register karte time details fill karega,
                and fir array par ".some" method laga diya jo ki boolean value return karta hai and callback fun accept
                karta hai.
            --> koi field empty hai ki nahin yeh sab toh hum "if-else" kaa use kar ke bhi kar sakte thay, lekin iske liye
                fir humein multiple "if-else" lagane padte or har ek field ko check karte ki empty toh nahin hai koi field.    
                
            The "?."" (optional chaining) checks if inputField exists (i.e., not null or undefined) before 
            accessing its properties. If inputField exists (not null or undefined), it calls .trim(). OR agar 
            trime karne ke baad koi bhi filed khaali hai i.e. string empty(i.e. "") hai toh fir ".some" method jo hai 
            true return kar dega ki bhai koi naa koi field khaali hai isliye true return kar diya ".some" method ne
        */ 
        throw new apiError(400, "All field are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }] // '$or'-> The $or operator is used to specify that either one of the conditions should match.
    });

    if(existedUser){
        throw new apiError(409, "User with this email or username already exists.")
    }
    //oopar wale code tak humne check kar liya hai ki signupr/register karne se pehle user exist karta hai ki nahin
    
    // ab check karenge ki user ne "avatar" and "coverImage" upload kari bhi hai yaa nahin, agar nahin kari toh error message bhej do
    
    /* jaise "express" humein "request.body" kaa access deta hai, waise hi multer bhi deta hai "request.files", toh 
        ab hum check kar sakte hain req.files mein avatar and coverImage hai ki nahin, since humne files multer 
        ke through upload kari hai apne local server par i.e. public folder ke andar temp folder mein. 
    */
    console.log("Multer req.files: ", request.files);
    const avatarLocalPath = request.files?.avatar[0]?.path; // "avatar" naam maine "user.routes.js" mein diya hai isliye yahan bhi yahi same usser karna hai
    // const coverImageLocalPath = request.files?.coverImage[0]?.path;// "coverImage" naam maine "user.routes.js" mein diya hai isliye yahan bhi yahi same usser karna hai
    console.log("avatarLocalpath:", avatarLocalPath)
    
    let coverImageLocalPath;
    if(request.files && Array.isArray(request.files.coverImage) && request.files.coverImage.length > 0){
        coverImageLocalPath = request.files.coverImage[0].path; 
    }
    
    if(!avatarLocalPath){
        throw new apiError(400, "Avatar file is required.")
    }

    // ab cloudinary par file upload kar denge 
    const avatar = await uploadOnCloudinary(avatarLocalPath); //cloudinary kaa function already banaya hua hai "utils" folder mein, jo ki bas ek parameter accept karta hai file kaa path kya hai, baaki cloudinary wala methoad apne aap upload kar dega, and ismein time lag sakta hai isliye "await" lagayenge 
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // ab check karenge ki "avatar" image cloudinary par upload huyi bhi hai yaa nahin, and "coverImage" optional hai, models mein bhi humne mandatory nahin rakha hai
    if(!avatar){
        throw new apiError(400, "Avatar file is required.")
    }

    const createdUser = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    /*check kar rahe hain ki user create hua bhi hai ki nahin, agar create ho gaya hai toh mongodb mein mil jaayega, 
    or hum user ko find karke dekh rahe hain uski "_id" kaa use kar ke, agar find ho gaya toh user create ho gaya hai
    and agar create ho gaya hai toh fir hum ".select" kaa use karke "passwor and refreshToken" ko exclude kar rahe hain
    jisse ki user ko hum response send kare toh fir password and token show naa kare usko, jab bhi woh api fetch kare frontend mein. */
    const foundedUser = await User.findById(createdUser._id).select("-password -refreshToken");

    if(!foundedUser){
        throw new apiError(500, "Something went wrong while registering the user.")
    }

    await sendMail(email, "Welcome to our platform Youtube", `Hello ${fullname},\n\nThank you for registering!`);

    return response.status(201).json(
        new apiResponse(200, foundedUser, "User registered successfully.")
    );
})

export {registerUser}