import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },

        {
            name: "coverImage", // name apne accoording de sakte hain
            maxCount: 1 // jitni coverimage chahiye utni counting likh sakte hain yahan par
        },
    ]),
    registerUser
);

/*
    --> oopar wala code pehle aisa dikhta tha jab humne multe middleware nahin lagaya tha, see below:-
        --> router.route("/register").post(registerUser); 
        --> register route par registerUser wala controller chal raha tha, lekin ab "registerUser" controller 
        chalne se pehle hum middleware chalayenge i.e. "multer", isliye "registerUser" se pehle multer laga 
        diya i.e. "upload" jo humne multer middlware wali file se import kiya hai ooapr.
        
    --> ab aate hain next topic par, "upload.fields([])" kyon likha hai ?
        Answer:- upload.fields([]) isliye likha hai kyoki humein user se multiple files chahiye, and jab bhi 
                multiple files upload karwani hoti hai user se, toh hum ".fields" kaa use karte hain and woh multiple 
                files hain "avatar" and "coverimage" and yeh files humein register karte time chahiye, "avatar and 
                coverimage" kaa humne user model mein field banaya hua hai(see there).

                --> And ".fields" array accept karta hai, and multiple files ke liye hum array ke andar objects bana sakte hain
                    and jitni files chahiye utne objects.

                --> single file upload ke liye hum "upload.single" kaa use karte hain.    

*/

export default router;