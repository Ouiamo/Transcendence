import { showMessage, signupUser } from '../utils/api';

export function renderSignup(app: HTMLElement, goToHome: () => void) {
    app.innerHTML = `
        <div class="container">
            <h1>Create Your Account</h1>
            
            <div class="form-group">
                <label>First Name (Optional)</label>
                <input type="text" id="firstname" placeholder="First name">
            </div>
            
            <div class="form-group">
                <label>Last Name (Optional)</label>
                <input type="text" id="lastname" placeholder="Last name">
            </div>
            
            <div class="form-group">
                <label>Username *</label>
                <input type="text" id="username" placeholder="Choose a username" required>
            </div>
            
            <div class="form-group">
                <label>Email *</label>
                <input type="email" id="email" placeholder="Your email" required>
            </div>
            
            <div class="form-group">
                <label>Password *</label>
                <input type="password" id="password" placeholder="Create a password" required>
            </div>
            
            <button id="submitBtn">SIGN UP</button>
            
            <p class="link" id="backBtn"> ← Back to Home</p>
        </div>
    `;
    document.getElementById('submitBtn')?.addEventListener('click', async () => {
        const firstname = (document.getElementById('firstname') as HTMLInputElement).value;
        const lastname = (document.getElementById('lastname') as HTMLInputElement).value;
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        
        if (!username || !email || !password) {
            showMessage(app, 'Username, email and password are required');
            return;
        }
        
        try {
            const result = await signupUser({ firstname, lastname, username, email, password });
            
            if (result.success) {
                showMessage(app, 'Account created successfully!', 'success');
            } else {
                showMessage(app, result.error || 'Signup failed');
            }
        } catch (error: any) {
            showMessage(app, error.message || 'Cannot connect to server');
        }
    });

    document.getElementById('backBtn')?.addEventListener('click', goToHome);
}

