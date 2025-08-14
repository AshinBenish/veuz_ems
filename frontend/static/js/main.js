function logout() {
    // Remove stored tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');

    // Optionally clear sessionStorage too
    sessionStorage.clear();

    // Redirect to login page
    window.location.href = '/login/';
}