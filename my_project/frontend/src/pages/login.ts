import { showMessage } from '../utils/api';

export function renderLogin(app: HTMLElement, goToHome: () => void) {
    app.innerHTML = `
        <div class="container">
            <h1>Login</h1>
            
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="loginEmail" placeholder="Your email">
            </div>
            
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="loginPassword" placeholder="Your password">
            </div>
            
            <button id="loginBtn" ">LOGIN </button>
            
            <p class="link" id="backToHome">← Back to Home</p>
        </div>
    `;
    
    document.getElementById('loginBtn')?.addEventListener('click', () => {
        showMessage(app, '5asna n9ado l backend dyalo lwl');
    });
    
    document.getElementById('backToHome')?.addEventListener('click', goToHome);
}