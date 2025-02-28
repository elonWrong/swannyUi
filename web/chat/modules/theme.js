export function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    
    // Set initial theme icon
    const themeIcon = document.querySelector('.theme-toggle .material-icons');
    themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    
    document.getElementById('darkModeToggle').addEventListener('click', toggleTheme);
  }
  
  export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme icon
    const themeIcon = document.querySelector('.theme-toggle .material-icons');
    themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
  }