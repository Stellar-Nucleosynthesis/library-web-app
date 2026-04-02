import {config} from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {graphqlHTTP} from "express-graphql";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import schema from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";
import User from "./models/User.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";

config({path: '../.env'});
await connectDB();

const app = express();
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
        },
    },
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {success: false, message: 'Too many requests, please try again later.'},
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {success: false, message: 'Too many auth attempts, please try again later.'},
});

app.use(limiter);

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

const buildGraphQLContext = async (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user =
                await User.findById(decoded.userId);
            return {user};
        } catch {
            return {user: null};
        }
    }
    return {user: null};
};

app.use(
    '/graphql',
    graphqlHTTP(async (req) => ({
        schema,
        rootValue: resolvers,
        context: await buildGraphQLContext(req),
        customFormatErrorFn: (error) => ({
            message: error.message,
            locations: error.locations,
            path: error.path,
        }),
    }))
);

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/books', bookRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        success: true, message: 'Library Resource Center API is running',
        timestamp: new Date().toISOString()
    });
});

app.use((req, res) => {
    res.status(404).json({success: false, message: 'Route not found'});
});

app.use((err, req, res) => {
    console.error('Global error:', err);
    res.status(500).json({success: false, message: 'Internal server error'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\nLibrary Resource Center Backend`);
    console.log(`Running on http://localhost:${PORT}`);
    console.log(`GraphQL at http://localhost:${PORT}/graphql`);
});
