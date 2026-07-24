import dotenv from "dotenv";
import app from './app.js';

//Loading the enviornment variables
dotenv.config();

const PORT = process.env.PORT || 500;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



