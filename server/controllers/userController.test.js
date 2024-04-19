// Mocking the User module
const User = require('../models/userModel');
const userController = require('./userController');

// Mock request and response objects
const req = {
    on: function (event, callback) {
        if (event === 'data') {
            callback(JSON.stringify({
                username: 'testuser',
                email: 'test@example.com',
                password: 'testpassword'
            }));
        }
        if (event === 'end') {
            callback();
        }
    }
};
let res = {
    statusCode: 200,
    data: '',
    end: function (data) {
        this.data = data;
    },
    writeHead: function (statusCode, headers) {
        this.statusCode = statusCode;
        this.headers = headers;
    }
};

// Mock the register method of the User module
const originalRegister = User.register;
User.register = async () => 123; // Mocking the register method to resolve with 123

// Test registerUser method
const testRegisterUser = async () => {
    await userController.registerUser(req, res);

    // Check response status code
    if (res.statusCode === 201) {
        console.log('Register User - Success: Passed');
    } else {
        console.error('Register User - Success: Failed (Unexpected status code)');
    }

    // Check response data
    const expectedData = JSON.stringify({ message: 'User registered successfully', userId: 123 });
    if (res.data === expectedData) {
        console.log('Response Data: Passed');
    } else {
        console.error('Response Data: Failed (Unexpected response data)');
    }
};

// Run the test
testRegisterUser().catch(error => console.error('Error:', error));

// Reset the register method to its original implementation after the test
User.register = originalRegister;