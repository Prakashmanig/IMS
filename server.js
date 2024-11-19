import express from 'express';
import 'dotenv/config';
import db from './services/database/db.js';
import userRouter from './services/router/user.routes.js';

const app = express();
const port = process.env.PORT || 8585;

app.use(express.urlencoded({extended:true}));
app.use('/', userRouter);

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
    db()
})