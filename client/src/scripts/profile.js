document.addEventListener('DOMContentLoaded', async () => {
    const userDataContainer = document.getElementById('userDataContainer');
    const emailValidationContainer = document.getElementById('emailValidationContainer');
    const validateEmailBtn = document.getElementById('validateEmailBtn');
    const changeNameBtn = document.getElementById('changeNameBtn');
    const logoutBtn = document.getElementById('logoutBtn'); // Add logout button reference

    // Взимаме данните за потребителя от сървъра
    try {
        const response = await fetch('/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const userData = await response.json();

            // Показване на данни за потребителя
            userDataContainer.innerHTML = `
                <p><strong>Username:</strong> ${userData.username}</p>
                <p><strong>Email:</strong> ${userData.email}</p>
            `;

            // Проверяваме дали имейла е валидиран
            if (userData.emailValidated) {
                emailValidationContainer.innerHTML = '<p>Email is validated</p>';
            } else {
                emailValidationContainer.innerHTML = '<p>Email is not validated</p>';
            }
        } else {
            console.error('Failed to retrieve user data:', response.statusText);
        }
    } catch (error) {
        console.error('Failed to retrieve user data:', error.message);
    }

    // Event listener за валидация на имейл
    validateEmailBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/validate-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                //при успешна валидация
                emailValidationContainer.innerHTML = '<p>Email is validated</p>';
            } else {
                console.error('Failed to validate email:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to validate email:', error.message);
        }
    });

    // Event listener за промяна на име (placeholder)
    changeNameBtn.addEventListener('click', () => {
        const newName = prompt('Enter your new name:');
        if (newName !== null && newName.trim() !== '') {
            // Тук трябва да се направи request към сървъра за промяна на име
            console.log('Name changed to:', newName);
        }
    });

    // Event listener за бутон logout
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                //при успешен logout се връщаме на страница login
                window.location.href = '/login.html';
            } else {
                console.error('Failed to logout:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to logout:', error.message);
        }
    });
});