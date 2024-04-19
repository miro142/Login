const { registerUser, validateEmail, getUserData, loginUser } = require('../controllers/userController');

function handleRequest(req, res) {
    const url = req.url;
    const method = req.method;

    if (url === '/register' && method === 'POST') {
        registerUser(req, res);
    } else if (url === '/validate-email' && method === 'POST') {
        validateEmail(req, res);
    } else if (url === '/user' && method === 'GET') {
        getUserData(req, res);
    } else if (url === '/login' && method === 'POST') {
        loginUser(req, res);
    }else if (url === '/logout' && method === 'GET') {
            logoutUser(req, res);
    } else {
        // При въвеждане на невалиден адрес
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
}

module.exports = handleRequest;