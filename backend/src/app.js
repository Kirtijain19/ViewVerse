import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

// app.use(cors())
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : [];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    })
);

// data will be coming from various sources: url, json, body
app.use(express.urlencoded({extended:true, limit:"16kb"}))  // extended means to allow nested objects
app.use(express.json({limit:"16kb"}))
//earlier express could not take json directly, it used body-parser
app.use(express.static("public"))   // to keep assets like pdf, images, files in public folder
app.use(cookieParser())



// routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

// routes declaration     // phle hum app.get() se krre the when we were not exporting routes

// but now when we are using routes, we will have to use middlewares


app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// Error handler
app.use((err, req, res, next) => {
    const statusCode = err?.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err?.message || "Internal Server Error",
        errors: err?.errors || []
    });
});

//http://localhost:8000/api/v1/user/register


// MIDDLEWARE
// like hum kisi url pe gye hume res.send("...") krna h but usse phle beech me kuch checking krni hai like if user is logged in or not... that is middleware

export {app}