const User = require('../models/userModel');
const url = require('url');


const userController = {
    // За регистрация на потребител (на адрес /register)
    registerUser: async (req, res) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const userData = JSON.parse(body);

            // проверка за валиден формат на имейл
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid email format' }));
                return;
            }

            // проверка за повторен имейл адрес
            const existingUser = await User.getByEmail(userData.email);
            if (existingUser) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Email already exists' }));
                return;
            }

            // проверка за валидна парола (8+ символа с букви и цифри)
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(userData.password)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Password must be at least 8 characters long and contain both letters and numbers' }));
                return;
            }

            // проверка за валидно потребителско име (да не е празно)
            if (!userData.username || userData.username.trim() === '') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Username is required' }));
                return;
            }

            try {
                const userId = await User.register(userData.username, userData.email, userData.password);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User registered successfully', userId }));
            } catch (error) {
                console.error('Error registering user:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to register user' }));
            }
        });
    },

    // Validate email
    validateEmail: async (req, res) => {
        // Implement email validation logic here
    },

    // Get user data
    getUserData: async (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const query = parsedUrl.query;
        const email = query.email; // Assuming email is passed as a query parameter

        try {
            const userData = await User.getByEmail(email);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userData));
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to fetch user data' }));
        }
    },
     // За влизане на потребител (на адрес /login)
     loginUser: async (req, res) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { email, password } = JSON.parse(body);
            try {
                // Автентикация на потребителя
                const user = await User.authenticate(email, password);
                if (user) {
                    // Създаваме cookie с идентифициращ token
                    res.setHeader('Set-Cookie', `authToken=${user.id}; HttpOnly; SameSite=Strict`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Login successful', userId: user.id }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid email or password' }));
                }
            } catch (error) {
                console.error('Error logging in user:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to login user' }));
            }
        });
    },
    // Logout на потребител
    logoutUser: (req, res) => {
        //Чистене на cookie
        res.setHeader('Set-Cookie', 'authToken=; HttpOnly; Max-Age=0');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Logout successful' }));
    }
};

module.exports = userController;