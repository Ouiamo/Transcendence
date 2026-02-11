// const API_URL = `https://${import.meta.env.VITE_API_URL || 'localhost:3010'}`; // kant backend
// const API_URL = 'https://localhost:3010'
// const devUrl = import.meta.env.VITE_API_URL;

// In production, use relative path so NGINX can proxy /api
// export const API_URL = import.meta.env.MODE === "development" ? devUrl : "/api"; //     const msg = document.createElement('div');
// api.tsx
export const API_URL = ""; // empty, use relative

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
           
        });
        
        return await response.json();
}

