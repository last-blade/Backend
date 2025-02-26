import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


const uploadOnCloudinary = async (localFilepath) => {
    try {
        if(!localFilepath){
            return null;
        }

        else{
            //uplaoding file on cloudinary by taking the local file path when user uploads file on the server, but hum iss file ko temporarily apne server par store rakhenge jab tak ki file cloudinary par upload naa ho jaaye, jaise hi uplaod hogi, fir um apne server se delete kar denge file ko.
            const response = await cloudinary.uploader.upload(localFilepath, {
                resource_type: "auto",
            })
            
            console.log("File uploaded successfully on cloudinary!!", response);
            fs.unlinkSync(localFilepath);
            return response;
        }
    } catch (error) {
        fs.unlinkSync(localFilepath) // jo humne apne server par local file save karayi thi usko hum delete kar denge, kyoki cloudinary par file upload nahin ho paayi hai, and hum delete iliye kar rahe hain kyoki user firse file upload karega toh fir wahi same file dobara se mere local server par aa jaayegi, aise data badhta rahega
        return null;
    }
}

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export {uploadOnCloudinary}