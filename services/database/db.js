import mongoose from "mongoose";
import 'dotenv/config';

const db = async() => {
    const conn = await mongoose.connect(process.env.DB);
    if(conn){
        console.log('Connected to database');
    }else{
        console.log('Failed to connect to the database')
    }
}

export default db;