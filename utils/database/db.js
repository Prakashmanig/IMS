import mongoose from "mongoose";
import 'dotenv/config'

const str = process.env.DB
if(!str){
    console.log('No MongoDB connection string found')
}

const db = async () => {
    try {
        const conn = await mongoose.connect(str)
        if(!conn){
            console.error('Failed to connect to the database')
        }else{
            console.log('Connected to database')
        }
    } catch (error) {
        console.error('Failed to connect to the database', error)
    }
}

export default db;