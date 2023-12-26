import {v2 as cloudinary} from 'cloudinary'

 // ** Cloudinary Upload Image//
 export const cloudinaryUploadImage = async (fileToUpload: any) => {
    try {
      const data = await cloudinary.uploader.upload(fileToUpload, {
        resource_type: "auto",
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Internal Server Error (cloudinary)");
    }
  };