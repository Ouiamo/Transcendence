export function renderHome(app: HTMLElement, goToSignup: () => void, goToLogin: () => void) {
    app.innerHTML = `
        <div class="container">
            <h1>Welcome to Pong Transcendence</h1>
            <button id="signupBtn">CREATE ACCOUNT</button>
            
            <p class="link" id="loginLink">
                Already have an account? Click here to login
            </p>
        </div>
    `;
    
    document.getElementById('signupBtn')?.addEventListener('click', goToSignup);
    document.getElementById('loginLink')?.addEventListener('click', goToLogin);
}