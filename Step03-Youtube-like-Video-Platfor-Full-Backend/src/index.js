import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";


dotenv.config({
    path: "./env"
});

connectDB();

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