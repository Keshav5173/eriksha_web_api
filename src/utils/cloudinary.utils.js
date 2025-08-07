import { v2 as cloudinary } from 'cloudinary';
import fs, { unlinkSync } from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath){
            console.log("File not found!!");
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            recource_type: "auto",
            transformation: [
                { quality: "auto:eco" },
                { fetch_format: "auto" }
            ]
        });

        console.log("✅ File Uploaded successfully:", response.url);


        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return response;

    }catch(error){
        console.error("Error occured in uploading file to cloudinary", error);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

export {uploadOnCloudinary}