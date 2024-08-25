import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import connectToDatabase  from './db_connection.js';
import { 
    fileImagePath,
    Registration,
    Login,
    PostData,
    fetchData,
    deleteData 
} from "./api/logic.js";



            // Equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3000;
app.use(express.json());    //To parse JSON.


//File upload.
const storagePhoto = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, fileImagePath); // Specify the directory to store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Use a unique name for the file
    }
});

const upload = multer({ storage: storagePhoto });

                    //Network Testing.
app.get("/",(req,res)=>{
    return res.json({
        "code":200,
        "message":"Listening get request to Node Server Successfully!"
    });
});

                            //API Routing.
app.use('/Upload_Images', express.static(path.join(__dirname, 'Upload_Images')));
app.post('/registration', upload.single('photo'), Registration);
app.post('/login',Login);
app.post('/postData',PostData);
app.get('/fetchData',fetchData);
app.post('/deleteData',deleteData);



const startServer = async() => {
    try {
        await connectToDatabase();

        app.listen(PORT, () => {
            console.log(`Server is running at http://192.168.43.238:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);            // Exit the process with a failure code.
    }
};


startServer();