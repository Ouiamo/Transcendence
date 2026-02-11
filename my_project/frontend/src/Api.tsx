// const API_URL = `https://${import.meta.env.VITE_API_URL || '10.13.249.23:3010'}`; // kant backend
const API_URL = 'https://10.13.249.23:3010'
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
    try {
        const response = await fetch(`${API_URL}/api/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { 
                success: false, 
                code: response.status,
                message: errorData.message || 'Server error'
            };
        }
        
        return await response.json();
    } catch (error) {
        console.error('Signup API Error:', error);
        return { 
            success: false, 
            code: 0,
            message: 'Connection failed. Please ensure you have accepted the security certificate for https://10.13.249.23:3010'
        };
    }
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
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
           
        });
        
        return await response.json();
}

