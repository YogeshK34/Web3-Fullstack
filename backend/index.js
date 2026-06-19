const express = require("express");
const cors = require("cors");
let users = require('./data/users.json');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get('/', (req, res) => {
    res.status(200).json({ message: `Express server is running on port ${PORT}` });
});

app.get('/users', (req, res) => {
    res.status(200).json({ users: users });
})

app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Incorrect id type provided!' });
    };

    const userData = users.find((u) => u.id == id);

    if (!userData) {
        return res.status(404).json({ error: `User with id ${id} not found!` });
    };

    return res.status(200).json({ data: userData });
})

app.post('/create', (req, res) => {
    const { name, niche } = req.body;

    // validate inputs 
    if (!name || !niche) {
        return res.status(400).json({
            error: 'Incomplete or Invalid Payload!'
        })
    }

    const newUser = { id: users.length + 1, name, niche };
    users.push(newUser);

    return res.status(200).json({
        message: 'Resource created successfully!',
        data: newUser
    });
})

app.patch('/update/:id', (req, res) => {
    const { name, niche } = req.body;
    const id = Number(req.params.id);

    if (!name && !niche) {
        return res.status(400).json({ error: 'Need to send atleast 1 field to PATCH resource!' });
    };

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid id type!' })
    }

    const userWithID = users.find((u) => u.id == id);

    if (!userWithID) {
        return res.status(404).json({ error: `User with id ${id} not found!` });
    };

    if (name !== undefined) userWithID.name = name;
    if (niche !== undefined) userWithID.niche = niche;

    return res.status(200).json({ data: userWithID, message: 'Resource updated!' });
})

// DELETE with findIndex + splice

// app.delete('/delete/:id', (req, res) => {
//     const id = Number(req.params.id);

//     if (isNaN(id)) {
//         return res.status(400).json({ error: 'Invalid Id type provided!' });
//     };

//     const userIndex = users.findIndex((u) => u.id == id);
//     if (!userIndex) {
//         return res.status(404).json({ error: `Resource with id ${id} not found!` });
//     };

//     const [deleteUser] = users.splice(userIndex, 1);

//     return res.status(200).json({ message: 'Resource deleted successfully', data: deleteUser });
// })


// DELETE with filter

app.delete('/delete/:id', (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid Id type provided!' });
    };

    const deleteUser = users.find((u) => u.id == id);
    if (!deleteUser) {
        return res.status(404).json({ error: `Resource with id ${id} not found!` })
    };

    // I have to remove the user, so I will move all the values and filter will create a new array with the condition
    users = users.filter((u) => u.id != id);

    return res.status(200).json({ message: 'Resource deleted successfully!', data: deleteUser });
});

app.listen(`${PORT}`, () => {
    console.log(`Express is running on port: ${PORT}`)
});