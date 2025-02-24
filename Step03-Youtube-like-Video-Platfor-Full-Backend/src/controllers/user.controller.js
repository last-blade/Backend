import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"

const registerUser = asyncHandler(async (request, response) => {
    const {fullname, email, username, password} = request.body;

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

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    });

    if(existedUser){
        throw new apiError(409, "User with this email or username already exists.")
    }

})

export {registerUser}