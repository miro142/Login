document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const errorContainer = document.getElementById('errorContainer');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Чистим минали съобщения за грешки
        errorContainer.innerHTML = '';

        // Взимаме данните от формата
        const formData = new FormData(registerForm);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Правим валидация на данните за frontend частта
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        if (!isValidPassword(password)) {
            showError('Password must be at least 8 characters long and contain both letters and numbers.');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match.');
            return;
        }

        // Пращаме register request към сървъра
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                // при успешна регистрация ни връща на страница login
                window.location.href = '/login.html';
            } else {
                const errorMessage = await response.text();
                console.error('Registration failed:', errorMessage);
                showError("Registration failed");
            }
        } catch (error) {
            console.error('Registration failed:', error.message);
            showError(error.message);
        }
    });

    // проверка за валиден формат на имейл
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // проверка за валидна парола
    function isValidPassword(password) {
        // Паролата трябва да е дълга поне 8 символа и да съдържа както цифри, така и букви
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    //Функция за съобщение за грешки
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.textContent = message;
        errorContainer.appendChild(errorElement);
    }
});