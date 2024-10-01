import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    lastname:{type:String,required:true}
})

const UserModel = mongoose.model("userdetails",UserSchema);

const PostSchema = new mongoose.Schema({
    title:{type:String,required:true,unique:true},
    body:{type:String,required:true}
})
const PostModel = mongoose.model("postdetails",PostSchema);
const NotificationSchema = new mongoose.Schema({
    title:{type:String,required:true,unique:true},
    description:{type:String,required:true},
    brand:{type:String,required:true,unique:true}

})
const NotificationModel = mongoose.model("notificationdetails",NotificationSchema);
const ProductSchema = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    cuisine:{type:String,required:true},
    caloriesPerServing:{type:Number,required:true}
})
const ProductModel = mongoose.model("productdetails",ProductSchema);
export {UserModel as Userdetails,PostModel as PostDetails,NotificationModel as NotificationDetails,ProductModel as ProductDetails} 