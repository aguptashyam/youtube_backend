import {v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        // console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        // console.log("response: ", response);
        
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)  //remove the locally saved temporarily file 
        // as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (publicUrl) => {
    if (!publicUrl) return;
    // Extract public_id from the URL
    const parts = publicUrl.split('/');
    const fileWithExtension = parts[parts.length - 1];
    const [publicId] = fileWithExtension.split('.');
    // You may need to include the folder if you use folders in Cloudinary
    const folder = parts[parts.length - 2];
    const public_id = `${folder}/${publicId}`;
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        throw new Error("Failed to delete image from Cloudinary");
    }
};

export {uploadOnCloudinary, deleteFromCloudinary}