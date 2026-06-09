import express from 'express';
import cors from 'cors';
import ideas from './routes/ideas.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const app = express();
await connectDB();

app.use(
    cors({
        origin: ['http://localhost:9000', 'http://localhost:8000'],
        credentials: true,
    }),
);
app.use((req, res, next) => {
    console.log(`Method:${req.method}, URL: ${req.originalUrl} `);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//use routes
app.use('/api/ideas', ideas);

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});
