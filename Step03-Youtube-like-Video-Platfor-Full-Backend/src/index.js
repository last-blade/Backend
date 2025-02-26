import dotenv from "dotenv";
import connectDB from "./db/index.js";
// import express from "express";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
});

// const app = express();

connectDB() /* jab bhi koi "asynchronous" method complete hota hai toh ek "promise" bhi return karta hai, since connectDB ek async method hai (see in "db" folder) toh hum .then and .catch bhi likh sakte hain, mostlt professional codes mein yeh dekhne ko bhi milta hai, otheriwse yeh ek optional hai step hai */
.then(() => {
    // app.on("error", (error) => {
    //     console.error("Error", error);
    //     throw error;
    // });

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on 🛞  http://localhost:${process.env.PORT}`)
    });
})

.catch((error) => {
    console.log("MongoDB Connection FAILED !!", error)
});
























// ;(async () =>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         // if DB connected but still there are some issues, then we use this "on" listener of the express.
//         app.on("error", (error) => {
//             console.error("Error", error);
//             throw error;
//         });
        
//         // if successfully connected with DB
//         app.listen(`${process.env.PORT}`, () => {
//             console.log(`App is listening on ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log("Error in connecting with Database: ", error);
//         throw error;
//     }
// })();