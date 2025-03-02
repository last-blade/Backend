import { access } from "fs";
import { asyncHandler, apiError, uploadOnCloudinary, apiResponse, sendMail, User } from "../allImports.js"

const generateAccessTokenAndrefreshToken = async (userId) => {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({saveBeforeValidation: false});  // Hum "saveBeforeValidation" kaa use kyon kar rahe hain ? see the Comment-1 in this page.

    return {accessToken, refreshToken};
}

const loginUser = asyncHandler (async(request, response) => {
    const {email, username, password} = request.body;

    if(!username || email){
        throw new apiError(400, "Username or email is required.")
    }

    const foundUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if(!foundUser){
        throw new apiError(404, "User with this email or username does not exist.")
    }

    const isPassowrdValid = await foundUser.isPasswordCorrect(password);

    if(!isPassowrdValid){
        throw new apiError(401, "Incorrect password.")
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndrefreshToken(foundUser._id);

    const loggedInUser = await User.findById(foundUser._id).select("-password -refreshToken");
    /*  yahan par humein firse user ko find karna pad raha hai, kyoki humein response se "passowrd and refreshToken" 
        remove karna hai, lekin hum oopar jab already user fin dkar chuke hain "foundUser" naam ke variable mein, toh 
        fir hum fir se kyon ek expensive database call maar rahe hain, woh isliye kyoki ".select" method ko hum yahin 
        par databse se baat karte time hi use kar sakte hain, lekin humein agar database call firse nahin maarni yaa 
        kahe ki humein user firse find nahin karna hai kyoki oopar hum already find kar chuke hain user, toh iske 
        liye hum apna "foundUser" jo oopar hai ussi kaa use kar sakte hain, lekin iske liye humein "foundUser" ko ek 
        object object mein covert karna padega, kyoki mongodb kaa object alag hota hai or hum usmein changes nahin kar 
        sakte, isliye pehle javascript object mein convert karenge `const userObject = foundUser.toObject();` and then 
        hum apna password nad token unselect kar sakte hain "delete userObject.password; delete userObject.refreshToken; 
        and yeh code databse se delete nahin karega, databse mein password and token safely stored hain and ab hum user 
        ko yeh response send kar sakte hain bina token or password reveal kare.
    */

    const options = {
        httpOnly: true,
        secure: true,
    }
     //oopar options isliye likhe hain jisse ki user frontend se cookies wagerah ko modify naa kar sake, kewal backend se hi ho
    
    return response.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User loggedin successfully.")
    )  
})


//COMMENT-1
/*
    jab bhi hum ".save" method ko run karte hain toh fir woh wala model run ho jaata hai jiske reference kaa use karke hum
    ".save" method ko run kar rahe hain. Toh oopar hum "user" model ke oopar ".save" method run kar rahe hain, toh fir
    "User" model kick in i.e. run ho jaayega and uke andar maine likha hua hai ki "password is required, email is required,
    username, etc." toh model ko ab yeh sab cheezein bhi chahiye saath mein, lekin humein toh bas "refreshToken" hi store
    i.e. save karana hai, toh humein yeh sab faaltu ki details ko send naa karna pade faaltu mein, toh iske liye hum
    "saveBeforeValidation: false" kaa use karte hain.
*/