import { showMessage } from '../utils/api';
import { loginUser } from '../utils/api';
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
    
    document.getElementById('loginBtn')?.addEventListener('click', async () => {
        const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
        const password = (document.getElementById('loginPassword') as HTMLInputElement).value;
        const result = await loginUser({email, password});
        if (result.success) {
            showMessage(app, 'you have loged successfully!', 'success');
        } else {
            showMessage(app, result.error || 'login failed');
        }
    });
    
    document.getElementById('backToHome')?.addEventListener('click', goToHome);
}