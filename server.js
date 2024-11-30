import express from 'express';
import 'dotenv/config';
import db from './utils/database/db.js';
import adminRouter from './utils/router/admin.routes.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import facultyRouter from './utils/router/faculty.routes.js';
import courseRouter from './utils/router/course.routes.js';
import studentRouter from './utils/router/student.routes.js';
const app = express();
const port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors('*'));

app.use('/api/v1', adminRouter);
app.use('/api/v1', facultyRouter);
app.use('/api/v1', courseRouter);
app.use('/api/v1', studentRouter);
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
    db()
});
