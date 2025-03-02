import { asyncHandler, apiError, apiResponse, sendMail, User } from "../allImports.js"

/*
--> For logging out a user, the main idea is:

    1. Remove the refresh token:
        > Delete it from the database (if stored).
        > Remove it from cookies/local storage (if stored on the client).
    
    2. Invalidate access token (optional):
        > If using JWT, you can blacklist it or change the secret key (but JWTs usually expire on their own).
    
    3. Clear session (if using sessions):
        > Destroy the session on the server.
*/

const logoutUser = asyncHandler( async(request, response) => {
    
    await User.findByIdAndUpdate(request.user._id, 
        {
            $set: {
                refreshToken: undefined
            }
        },

        {
            new: true,
        }
    );


    options = {
        httpOnly: true,
        secure: true,
    }

    return response.status(200)
    .clearCookie("accessToken", options) // naam sahi se likhna hai token kaa, tabhi token remove hoga cookies mein se
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "Logout successfully"));
});


export {logoutUser}

/*
    Logout user wale controller ke chalne se pehle middleware chalega(i.e. auth.middleware.js), user routes wali file mein jaake
    dekhoge toh wahan dikhega ki "/logout" route par jaane se pehle auth middleware chalega, or check karega ki user jo hai
    logged in hai bhi ki nahin, or check kaise karega user login hai ki nahin, cookies mein "access token" dekhenge
    hai yaa nahin, agar token hai cookies mein, toh fir iska matlab user logged in hai and jab humne middleware chalaya tha
    toh humne "request" object mein apna object inject kar diya tha "user" naam kaa or iss user mein maine necessary
    information store kara di thi or ab hum logout karte time "request" object ke andar se "user" ko access kar sakte hain.
    "request.user" see in the above code, and iss user ke andar id bhi hai jisse ki hum user ko find kar sakte hain
    or fir uska access token remove kar sakte hain "cookies" se.

    Question: lekin humne "request" object mein user ki inforation kyon store kari ?
    Answer: Woh isliye store kari hai kyoki login and register karte time toh hum form data le rahe thay user se "req.body" se,  
            like email, username, etc. or fir hum email, username se login yaa register karwa paa rahe thay 
            lekin logout karte time thodi naa hum user se data maangte hain, seedhe button diya hota hai
            or logout kar dete hain. Toh fir hum logout karte time user ko find kaise karenge, agar email, username
            hai hi nahin paas mein. or user find nahin karegenge toh hum uss particuar user ko logout kaise karenge,
            toh issi liye humne "auth middleware" mein jaaoge toh or dekhoge toh humne request object mein humne 
            "user" object inject kar diya tha "request.user = foundedUser;" or ab "request" object mein user ki 
            information hai like email, username, etc or ab hum user ko find karke logout kar sakte hain easily.

            Isliye humne request object mein store karayi thi user ki information.
            
*/