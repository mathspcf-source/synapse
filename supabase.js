const SUPABASE_URL = 'https://wedhebcoxljyeoxhgaob.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlZGhlYmNveGxqeWVveGhnYW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTgwNDgsImV4cCI6MjA5MjQ3NDA0OH0._Xnqxp6YSazOK37xP5qSi5gOuThvqGm5Kw_xmWZU8XQ';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const SESSION_DURATION = 2 * 60 * 60 * 1000;
let currentUser = null, currentUserId = null;

// ==================== SESSÃO ====================
function verificarSessao(tipo) {
    const d = localStorage.getItem('synapse_session');
    if (!d) { window.location.href = 'index.html'; return false; }
    try {
        const s = JSON.parse(d);
        if (Date.now() - s.timestamp > SESSION_DURATION) {
            localStorage.clear();
            window.location.href = 'index.html';
            return false;
        }
        if (s.tipo !== tipo) {
            window.location.href = 'index.html';
            return false;
        }
        currentUserId = s.id;
        currentUser = s;
        return true;
    } catch(e) {
        window.location.href = 'index.html';
        return false;
    }
}

function criarSessao(tipo, id, nome) {
    const s = { tipo, id, nome, timestamp: Date.now() };
    localStorage.setItem('synapse_session', JSON.stringify(s));
    localStorage.setItem('synapse_user_id', id);
    localStorage.setItem('synapse_user_nome', nome);
    localStorage.setItem('synapse_user_tipo', tipo);
}

function destruirSessao() {
    localStorage.removeItem('synapse_session');
    localStorage.removeItem('synapse_user_id');
    localStorage.removeItem('synapse_user_nome');
    localStorage.removeItem('synapse_user_tipo');
}

// ==================== UTILS ====================
const $ = (id) => document.getElementById(id);
const showLoading = () => $('loading').classList.add('show');
const hideLoading = () => $('loading').classList.remove('show');

function toast(msg) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function openModal(id) { $(id).classList.add('show'); }
function closeModal(id) { $(id).classList.remove('show'); }
window.onclick = function(e) { if (e.target.classList.contains('modal')) e.target.classList.remove('show'); };

function logout() {
    destruirSessao();
    window.location.href = 'index.html';
}

// ==================== KEEP ALIVE ====================
setInterval(() => {
    sb.from('terapeutas').select('id').eq('email', 'admin@synapse.com').single().then(() => {}).catch(() => {});
}, 240000);
