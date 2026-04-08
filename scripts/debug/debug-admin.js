// Debug helper for admin authentication issues
// Run this in the browser console to enable debug mode

console.log('🐛 DA LUZ Admin Debug Helper');
console.log('==========================');

// Enable debug mode
localStorage.setItem('admin-debug', 'true');
console.log('✅ Debug mode enabled');

// Show current auth state
const showAuthState = () => {
  console.log('📊 Current state:');
  console.log('- Debug mode:', localStorage.getItem('admin-debug'));
  console.log('- Current URL:', window.location.href);
  console.log('- User agent:', navigator.userAgent);
  console.log('- Local storage keys:', Object.keys(localStorage));
};

// Clear all storage
const clearStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
  console.log('🧹 All storage cleared');
};

// Quick navigation
const goToAdmin = () => {
  window.location.href = '/admin';
};

const goToDebug = () => {
  window.location.href = '/admin/debug';
};

const goToLogin = () => {
  window.location.href = '/login';
};

// Export helper functions
window.adminDebug = {
  showAuthState,
  clearStorage,
  goToAdmin,
  goToDebug,
  goToLogin,
  enableDebug: () => localStorage.setItem('admin-debug', 'true'),
  disableDebug: () => localStorage.removeItem('admin-debug')
};

console.log('🛠️  Available commands:');
console.log('- adminDebug.showAuthState() - Show current state');
console.log('- adminDebug.clearStorage() - Clear all storage');
console.log('- adminDebug.goToAdmin() - Go to admin dashboard');
console.log('- adminDebug.goToDebug() - Go to debug page');
console.log('- adminDebug.goToLogin() - Go to login');
console.log('- adminDebug.enableDebug() - Enable debug mode');
console.log('- adminDebug.disableDebug() - Disable debug mode');

showAuthState();
