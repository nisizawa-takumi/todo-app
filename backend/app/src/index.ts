import express from 'express';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Express + TypeScript!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
