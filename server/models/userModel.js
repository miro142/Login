const db = require('../db');
const bcrypt = require('bcrypt');

class User {
        // Регистрация на потребител
        static async register(username, email, password) {
            // криптиране на паролата
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            return new Promise((resolve, reject) => {
                db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results.insertId);
                    }
                });
            });
        }

    // Търсене на потребител по имейл
    static async getByEmail(email) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    }

    // Автентикация на потребител за login
    static async authenticate(email, password) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const user = results[0];
                    if (!user) {
                        // Когато потребителя не е намерен
                        resolve(null);
                    } else {
                        // Сравняване на криптирани пароли
                        const isMatch = await bcrypt.compare(password, user.password);
                        if (isMatch) {
                            // Ако паролите са еднакви, връщаме потребителя
                            resolve(user);
                        } else {
                            // Ако не, връщаме null
                            resolve(null);
                        }
                    }
                }
            });
        });
    }
}

module.exports = User;