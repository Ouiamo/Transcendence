import '../style.css';
import { renderHome } from './pages/home';
import { renderSignup } from './pages/signup';
import { renderLogin } from './pages/login';

const app = document.getElementById('app') as HTMLElement;

function showHomePage() {
    renderHome(app, showSignupPage, showLoginPage);
}

function showSignupPage() {
    renderSignup(app, showHomePage);
}

function showLoginPage() {
    renderLogin(app, showHomePage);
}

showHomePage();