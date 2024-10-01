import express from 'express'
const router = express.Router();
import { Userdetails } from '../models/User.js';
import { PostDetails } from '../models/User.js';
import { NotificationDetails } from '../models/User.js';
import { ProductDetails } from '../models/User.js';
router.post('/users',async(req,res)=>{
    const {firstname,email,lastname} = req.body;
    if(!firstname || !email || !lastname){
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await Userdetails.findOne({email});
        if(user){
            return res.status(400).json({ message: "User already existed" }); // <-- 400 status for already existed user
        }
        const newUser = new Userdetails({
            firstname,
            email,
            lastname
        })
        const savedUser = await newUser.save()
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error during registration:', error);
    res.status(500).json({ message: "Server error", error: err.message });
    }
  
})

router.get('/users', async (req, res) => {
    try {
      const users = await Userdetails.find(); // Fetch all users
      res.status(200).json(users);
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
router.get('/userCount',async(req,res)=>{
    try{
        const usercount = await Userdetails.countDocuments();
        res.status(200).json({count:usercount})
        
    }
    catch(error){
        console.error('Error fetching post count:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    
    }
})
router.post('/post',async(req,res)=>{
    const {title,body} = req.body;
    if(!title || !body){
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const post = await PostDetails.findOne({title});
        if(post){
            return res.status(400).json({ message: "Post already existed" }); // <-- 400 status for already existed user
        }
        const PostUser = new PostDetails({
            title,
            body
        })
        const savedPost = await PostUser.save()
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error during registration:', error);
    res.status(500).json({ message: "Server error", error: err.message });
    }
})
router.get('/post',async(req,res)=>{
    try {
        const posts = await PostDetails.find();
        res.status(200).json(posts)
        if(!posts || posts.length === 0){
            return res.status(404).json({ message: "No Posts found" });
        }
    } catch (error) {
        console.error('Error during registeration:',err);
        res.status(500).json({message:"Server error",error:err.message});
    }
})
router.get('/postcount',async(req,res)=>{
    try{
        const postcount = await PostDetails.countDocuments();
        res.status(200).json({count:postcount})
    }
    catch(error){
        console.error('Error fetching post count:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    
    }
})
router.post('/notification',async(req,res)=>{
    const{title,description,brand} = req.body;
    if(!title || !description || !brand){
        return res.status(400).json({message:"All fields are required"})
    }
    try {
        const notification = await NotificationDetails.findOne({title});
        if(notification){
            return res.status(400).json({message:"Notification Already exist"});
        }
        const NotifyProduct = new NotificationDetails({
            title,
            description,
            brand
        })
        const savedNotify = await NotifyProduct.save();
        res.status(201).json(savedNotify);
    } catch (error) {
        console.error('Error during registration:', error);
    res.status(500).json({ message: "Server error", error: error.message });
    }
})
router.get('/notification',async(req,res)=>{
    try {
        const notification = await NotificationDetails.find();
        res.status(200).json(notification)
        if(!notification || notification.length === 0){
            return res.status(404).json({ message: "No notification found" });
        }
    } catch (error) {
        console.error('Error during registeration:',err);
        res.status(500).json({message:"Server error",error:err.message});
    }
})
router.get('/notificationcount',async(req,res)=>{
    try {
        const notificationcount = await NotificationDetails.countDocuments();
        res.status(200).json({count:notificationcount})
    } catch (error) {
        console.error('Error fetching post count:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})
router.post('/product',async(req,res)=>{
    const{name,cuisine,caloriesPerServing} = req.body;
    if(!name || !cuisine || !caloriesPerServing){
        return res.status(400).json({message:"All fields are required"})
    }
    try {
        const product = await ProductDetails.findOne({name});
        if(product){
            return res.status(400).json({message:"Product Already exist"});
        }
        const Product = new ProductDetails({
            name,
            cuisine,
            caloriesPerServing
        })
        const savedProduct = await Product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error during registration:', err);
    res.status(500).json({ message: "Server error", error: err.message });
    }
})
router.get('/product',async(req,res)=>{
    try {
        const product = await ProductDetails.find();
        res.status(200).json(product)
        if(!product || product.length === 0){
            return res.status(404).json({ message: "No Product found" });
        }
    } catch (error) {
        console.error('Error during registeration:',err);
        res.status(500).json({message:"Server error",error:err.message});
    }
})
router.get('/productcount',async(req,res)=>{
    try {
        const productcount = await ProductDetails.countDocuments();
        res.status(200).json({count:productcount})
    } catch (error) {
        console.error('Error fetching post count:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})

router.delete('/users/:id',async(req,res)=>{
    const {id} = req.params
  try {
    const user = await Userdetails.findByIdAndDelete(id); // Fetch all users
    if(!user){
    return res.status(404).json({message:"User not found"});
    }  
    res.status(200).json({message:"User deleted successfully"});    
  } catch (error) {
    console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
})

router.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const updatedUser = await Userdetails.findByIdAndUpdate(id, updateData, { new: true });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);    
    } catch (error) {
      console.error('Error updating user:', error); // More descriptive log
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
router.delete('/post/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const post = await PostDetails.findByIdAndDelete(id);
        if(!post){
            return res.status(404).json({message:"Posts not found"});
        }
        res.status(200).json({message:"Posts deleted successfully"});
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})
router.patch('/post/:id',async(req,res)=>{
    const {id} = req.params;
    const updateData = req.body;
    try {
        const updatedPost = await PostDetails.findByIdAndUpdate(id,updateData,{new:true});
        res.status(200).json(updatedPost)
         
         if(!updatedPost){
            return res.status(404).json({message:"Posts not found"});
         }
        
    } catch (error) {
        console.error('Error updating post:', error); // More descriptive log
        res.status(500).json({ message: 'Server error', error: error.message });
  
    }
})
router.delete('/notification/:id',async(req,res)=>{
    const {id} = req.params;
    try {
       const notification = await NotificationDetails.findByIdAndDelete(id);
       
       if(!notification){
        return res.status(404).json({message:"No Notifications found"});
       }
       return res.status(200).json({message:"Notifications Deleted Successfully"});
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})
router.patch('/notification/:id',async(req,res)=>{
    const {id} = req.params;
    const updatedData = req.body;
    try {
        const updatedNotification = await NotificationDetails.findByIdAndUpdate(id,updatedData,{new:true})
        if(!updatedNotification){
            return res.status(404).json({message:"No Notifications found"})
        }
        res.status(200).json(updatedNotification);

    } catch (error) {
        console.error('Error updating post:', error); // More descriptive log
        res.status(500).json({ message: 'Server error', error: error.message });

    }
})
router.delete('/product/:id',async(req,res)=>{
    const {id} = req.params;
    try {
     const product = await ProductDetails.findByIdAndDelete(id);
     if(!product){
        res.status(404).json({message:"No products Found"});
     }
     res.status(200).json({message:"Product Deleted suuccessflly"})
        
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})
router.patch('/product/:id',async(req,res)=>{
    const {id} = req.params;
    const updatedData = req.body;
    try {
        const updatedProduct = await ProductDetails.findByIdAndUpdate(id,updatedData,{new:true});
        if(!updatedProduct){
            res.status(404).json({message:"No Updated Products found"})
        }
       res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });

    }
})
export { router as UserRoute };
export { router as PostRoute };
export {router as NotificationRoute};
export {router as ProductRoute};
