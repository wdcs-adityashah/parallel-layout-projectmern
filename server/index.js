import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import { UserRoute } from './routes/userdetail.js'
import { PostRoute } from './routes/userdetail.js'
import { NotificationRoute } from './routes/userdetail.js'
import { ProductRoute } from './routes/userdetail.js'
dotenv.config()
const app = express()
mongoose.connect('mongodb://localhost:27017/multiplequadrantroutes')
app.use(cors());
app.use(express.json())
app.use('/',UserRoute);
app.use('/',PostRoute);
app.use('/',NotificationRoute)
app.use('/',ProductRoute)
app.listen(process.env.PORT,()=>{
    console.log("Server is Running");
})