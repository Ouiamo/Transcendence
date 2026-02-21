// const API_URL = `https://${import.meta.env.VITE_API_URL || 'localhost:3010'}`; // kant backend
export const API_URL = "";
// export function showMessage(app: HTMLElement, text: string, type: 'success' | 'error' = 'error') {
//     const msg = document.createElement('div');
//     msg.className = `message ${type}`;
//     msg.textContent = text;
//     app.appendChild(msg);
//     setTimeout(() => msg.remove(), 3000);
// }

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

export async function loginUser(userData: {
    email: string;
    password: string;
}) {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        return await response.json();
}

export async function profil( {
   
}) {
        const response = await fetch(`${API_URL}/api/profile`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        
        return await response.json();
}

