document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorContainer = document.getElementById('errorContainer');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Чистим минали съобщения за грешки
        errorContainer.innerHTML = '';

        // Взимаме информацията от формата
        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        // Валидация
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        if (!isValidPassword(password)) {
            showError('Password must be at least 8 characters long and contain both letters and numbers.');
            return;
        }

        // Пращаме login request към сървъра
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                // При успешен login ни праща към страница profile
                window.location.href = '/profile.html';
            } else {
                const errorMessage = await response.text();
                console.error('Login failed:', errorMessage);
                showError('Invalid email or password.');
            }
        } catch (error) {
            console.error('Login failed:', error.message);
            showError('An unexpected error occurred. Please try again later.');
        }
    });

    // Функция за проверяване дали имейл формата е валиден
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Функция за проверяване за валидна парола
    function isValidPassword(password) {
        // Паролата трябва да е поне 8 символа и da съдържа цифри и букви
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