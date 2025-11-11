// script.js - handles register, login, profile protection and nav state

document.addEventListener("DOMContentLoaded", () => {
  // set current year in footers
  const yearEls = [document.getElementById('year'), document.getElementById('year2'), document.getElementById('year3')];
  yearEls.forEach(el => { if (el) el.textContent = new Date().getFullYear(); });

  // NAV: show/hide login/register or logout depending on session
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const loginLinks = document.querySelectorAll('#nav-login, #nav-login-c, #nav-login-l, #nav-login-r, #nav-login-p');
  const registerLinks = document.querySelectorAll('#nav-register, #nav-register-c, #nav-register-l, #nav-register-r, #nav-register-p');
  const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtn2, #logoutBtn3');

  function updateNav(){
    const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if(u){
      loginLinks.forEach(a => { if(a) a.classList.add('hide'); });
      registerLinks.forEach(a => { if(a) a.classList.add('hide'); });
      logoutBtns.forEach(b => { if(b) b.classList.remove('hide'); });
    } else {
      loginLinks.forEach(a => { if(a) a.classList.remove('hide'); });
      registerLinks.forEach(a => { if(a) a.classList.remove('hide'); });
      logoutBtns.forEach(b => { if(b) b.classList.add('hide'); });
    }
  }
  updateNav();

  // LOGOUT buttons
  logoutBtns.forEach(btn => {
    if(btn){
      btn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        updateNav();
        // redirect to home after logout
        window.location.href = "index.html";
      });
    }
  });

  // REGISTER
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const password = document.getElementById('regPassword').value;

      // simple existing-check (single-user demo)
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      if (stored && stored.email === email) {
        alert('This email is already registered. Try logging in.');
        return;
      }

      const user = { username, email, password, createdAt: new Date().toISOString() };
      localStorage.setItem('user', JSON.stringify(user));
      // auto-login after register
      localStorage.setItem('currentUser', JSON.stringify(user));
      updateNav();
      alert('Account created successfully!');
      window.location.href = "profile.html";
    });
  }

  // LOGIN
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (document.getElementById('loginEmail').value || '').trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;

      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      if (stored && stored.email === email && stored.password === password) {
        localStorage.setItem('currentUser', JSON.stringify(stored));
        updateNav();
        alert(`Welcome back, ${stored.username}!`);
        window.location.href = "profile.html";
      } else {
        alert('Invalid email or password');
      }
    });
  }

  // PROTECT PROFILE PAGE
  if (window.location.pathname.endsWith('profile.html') || window.location.href.includes('profile.html')) {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
      // not logged in -> redirect to login
      alert('Please login to view your profile');
      window.location.href = "login.html";
    } else {
      // fill profile info
      const card = document.getElementById('profileCard');
      if (card) {
        card.innerHTML = `
          <h2>Hello, ${escapeHtml(user.username)}</h2>
          <p>Email: ${escapeHtml(user.email)}</p>
          <p>Member since: ${new Date(user.createdAt).toLocaleDateString()}</p>
          <div style="margin-top:12px;">
            <a href="courses.html" class="btn">View Courses</a>
            <button id="logoutProfile" class="btn btn-outline" style="margin-left:8px;">Logout</button>
          </div>
        `;

        const logoutProfile = document.getElementById('logoutProfile');
        if (logoutProfile) {
          logoutProfile.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            updateNav();
            window.location.href = 'index.html';
          });
        }
      }
    }
  }

  // small helper to avoid XSS when injecting user strings
  function escapeHtml(string) {
    if(!string) return '';
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
