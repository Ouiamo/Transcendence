const API_URL = 'http://localhost:3010';

export function showMessage(app: HTMLElement, text: string, type: 'success' | 'error' = 'error') {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    app.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

export async function signupUser(userData: {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
}) {
        const response = await fetch(`${API_URL}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        return await response.json();
}