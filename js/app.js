/**
 * SkillSwap - Student Skill Marketplace
 * Main JavaScript Application
 */

// ==========================================
// Data Storage Keys
// ==========================================
const STORAGE_KEYS = {
  USERS: 'skillswap_users',
  LISTINGS: 'skillswap_listings',
  BOOKINGS: 'skillswap_bookings',
  MESSAGES: 'skillswap_messages',
  REVIEWS: 'skillswap_reviews',
  CURRENT_USER: 'skillswap_current_user'
};

// ==========================================
// Utility Functions
// ==========================================

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @returns {Array} - Parsed array or empty array
 */
function getData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return [];
  }
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 */
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

/**
 * Generate unique ID
 * @returns {string} - Unique identifier
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Get current logged in user
 * @returns {Object|null} - Current user or null
 */
function getCurrentUser() {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Set current user
 * @param {Object} user - User object
 */
function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

/**
 * Logout current user
 */
function logout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  window.location.href = 'index.html';
}

/**
 * Check if user is logged in, redirect if not
 * @param {boolean} redirect - Whether to redirect to login
 * @returns {Object|null} - Current user
 */
function requireAuth(redirect = true) {
  const user = getCurrentUser();
  if (!user && redirect) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

/**
 * Show alert/toast notification
 * @param {string} message - Message to display
 * @param {string} type - Alert type (success, error, info)
 */
function showAlert(message, type = 'success') {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll('.alert');
  existingAlerts.forEach(alert => alert.remove());
  
  // Create new alert
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  document.body.appendChild(alert);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date
 */
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format time to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted time
 */
function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Update navbar based on auth state
 */
function updateNavbar() {
  const user = getCurrentUser();
  const navLinks = document.querySelector('.nav-links');
  
  if (navLinks) {
    if (user) {
      navLinks.innerHTML = `
        <a href="index.html">Home</a>
        <a href="explore.html">Explore Skills</a>
        <a href="dashboard.html">Dashboard</a>
        <a href="#" onclick="logout(); return false;">Logout</a>
      `;
    } else {
      navLinks.innerHTML = `
        <a href="index.html">Home</a>
        <a href="explore.html">Explore Skills</a>
        <a href="login.html">Login</a>
        <a href="signup.html">Signup</a>
      `;
    }
  }
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object|null} - User object
 */
function getUserById(userId) {
  const users = getData(STORAGE_KEYS.USERS);
  return users.find(u => u.id === userId) || null;
}

/**
 * Update user in storage
 * @param {Object} updatedUser - Updated user object
 */
function updateUser(updatedUser) {
  const users = getData(STORAGE_KEYS.USERS);
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveData(STORAGE_KEYS.USERS, users);
    // Update current user if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  }
}

/**
 * Render star rating HTML
 * @param {number} rating - Rating value (1-5)
 * @returns {string} - HTML string
 */
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return `<span class="review-rating">${stars}</span>`;
}

// ==========================================
// User/Auth Functions
// ==========================================

/**
 * Register new user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null} - Created user or null
 */
function registerUser(name, email, password) {
  const users = getData(STORAGE_KEYS.USERS);
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    showAlert('Email already registered!', 'error');
    return null;
  }
  
  const newUser = {
    id: generateId(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: password, // Note: In production, use proper hashing
    bio: '',
    skillsTeach: [],
    skillsLearn: [],
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveData(STORAGE_KEYS.USERS, users);
  setCurrentUser(newUser);
  
  return newUser;
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null} - User or null
 */
function loginUser(email, password) {
  const users = getData(STORAGE_KEYS.USERS);
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (user) {
    setCurrentUser(user);
    return user;
  }
  
  return null;
}

// ==========================================
// Listing Functions
// ==========================================

/**
 * Create new skill listing
 * @param {string} title - Listing title
 * @param {string} description - Listing description
 * @param {number} price - Session price
 * @returns {Object|null} - Created listing
 */
function createListing(title, description, price) {
  const user = getCurrentUser();
  if (!user) return null;
  
  const listings = getData(STORAGE_KEYS.LISTINGS);
  
  const newListing = {
    id: generateId(),
    teacherId: user.id,
    teacherName: user.name,
    title: title.trim(),
    description: description.trim(),
    price: parseFloat(price),
    createdAt: new Date().toISOString()
  };
  
  listings.push(newListing);
  saveData(STORAGE_KEYS.LISTINGS, listings);
  
  return newListing;
}

/**
 * Get all listings
 * @returns {Array} - All listings
 */
function getAllListings() {
  return getData(STORAGE_KEYS.LISTINGS);
}

/**
 * Get listings by teacher
 * @param {string} teacherId - Teacher user ID
 * @returns {Array} - Teacher's listings
 */
function getListingsByTeacher(teacherId) {
  const listings = getData(STORAGE_KEYS.LISTINGS);
  return listings.filter(l => l.teacherId === teacherId);
}

/**
 * Search listings
 * @param {string} query - Search query
 * @returns {Array} - Matching listings
 */
function searchListings(query) {
  const listings = getData(STORAGE_KEYS.LISTINGS);
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return listings;
  
  return listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm) ||
    listing.description.toLowerCase().includes(searchTerm) ||
    listing.teacherName.toLowerCase().includes(searchTerm)
  );
}

// ==========================================
// Booking Functions
// ==========================================

/**
 * Create booking
 * @param {string} listingId - Listing ID to book
 * @returns {Object|null} - Created booking
 */
function createBooking(listingId) {
  const user = getCurrentUser();
  if (!user) return null;
  
  const listings = getData(STORAGE_KEYS.LISTINGS);
  const listing = listings.find(l => l.id === listingId);
  
  if (!listing) {
    showAlert('Listing not found!', 'error');
    return null;
  }
  
  // Can't book own listing
  if (listing.teacherId === user.id) {
    showAlert('You cannot book your own listing!', 'error');
    return null;
  }
  
  const bookings = getData(STORAGE_KEYS.BOOKINGS);
  
  // Check if already booked
  const existingBooking = bookings.find(
    b => b.listingId === listingId && b.studentId === user.id && b.status !== 'completed'
  );
  
  if (existingBooking) {
    showAlert('You already have a pending booking for this skill!', 'error');
    return null;
  }
  
  const newBooking = {
    id: generateId(),
    listingId: listingId,
    listingTitle: listing.title,
    teacherId: listing.teacherId,
    teacherName: listing.teacherName,
    studentId: user.id,
    studentName: user.name,
    price: listing.price,
    status: 'pending', // pending, confirmed, completed
    createdAt: new Date().toISOString(),
    hasReview: false
  };
  
  bookings.push(newBooking);
  saveData(STORAGE_KEYS.BOOKINGS, bookings);
  
  return newBooking;
}

/**
 * Get bookings for current user (as student)
 * @returns {Array} - User's bookings
 */
function getMyBookings() {
  const user = getCurrentUser();
  if (!user) return [];
  
  const bookings = getData(STORAGE_KEYS.BOOKINGS);
  return bookings.filter(b => b.studentId === user.id);
}

/**
 * Get bookings where user is teacher
 * @returns {Array} - Teaching bookings
 */
function getTeachingBookings() {
  const user = getCurrentUser();
  if (!user) return [];
  
  const bookings = getData(STORAGE_KEYS.BOOKINGS);
  return bookings.filter(b => b.teacherId === user.id);
}

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status
 */
function updateBookingStatus(bookingId, status) {
  const bookings = getData(STORAGE_KEYS.BOOKINGS);
  const index = bookings.findIndex(b => b.id === bookingId);
  
  if (index !== -1) {
    bookings[index].status = status;
    saveData(STORAGE_KEYS.BOOKINGS, bookings);
  }
}

// ==========================================
// Message Functions
// ==========================================

/**
 * Send message
 * @param {string} receiverId - Receiver user ID
 * @param {string} content - Message content
 * @returns {Object|null} - Created message
 */
function sendMessage(receiverId, content) {
  const user = getCurrentUser();
  if (!user || !content.trim()) return null;
  
  const messages = getData(STORAGE_KEYS.MESSAGES);
  
  const newMessage = {
    id: generateId(),
    senderId: user.id,
    senderName: user.name,
    receiverId: receiverId,
    content: content.trim(),
    createdAt: new Date().toISOString()
  };
  
  messages.push(newMessage);
  saveData(STORAGE_KEYS.MESSAGES, messages);
  
  return newMessage;
}

/**
 * Get conversation between two users
 * @param {string} otherUserId - Other user's ID
 * @returns {Array} - Messages in conversation
 */
function getConversation(otherUserId) {
  const user = getCurrentUser();
  if (!user) return [];
  
  const messages = getData(STORAGE_KEYS.MESSAGES);
  
  return messages.filter(m =>
    (m.senderId === user.id && m.receiverId === otherUserId) ||
    (m.senderId === otherUserId && m.receiverId === user.id)
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

/**
 * Get all conversations for current user
 * @returns {Array} - Array of conversation partners with last message
 */
function getConversations() {
  const user = getCurrentUser();
  if (!user) return [];
  
  const messages = getData(STORAGE_KEYS.MESSAGES);
  const users = getData(STORAGE_KEYS.USERS);
  
  // Get unique conversation partners
  const partnerIds = new Set();
  messages.forEach(m => {
    if (m.senderId === user.id) partnerIds.add(m.receiverId);
    if (m.receiverId === user.id) partnerIds.add(m.senderId);
  });
  
  // Build conversation list
  const conversations = [];
  partnerIds.forEach(partnerId => {
    const partner = users.find(u => u.id === partnerId);
    if (partner) {
      const convoMessages = messages.filter(m =>
        (m.senderId === user.id && m.receiverId === partnerId) ||
        (m.senderId === partnerId && m.receiverId === user.id)
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      if (convoMessages.length > 0) {
        conversations.push({
          partnerId: partnerId,
          partnerName: partner.name,
          lastMessage: convoMessages[0].content,
          lastMessageTime: convoMessages[0].createdAt
        });
      }
    }
  });
  
  // Sort by most recent
  return conversations.sort((a, b) => 
    new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  );
}

// ==========================================
// Review Functions
// ==========================================

/**
 * Create review
 * @param {string} bookingId - Booking ID
 * @param {number} rating - Rating (1-5)
 * @param {string} comment - Review comment
 * @returns {Object|null} - Created review
 */
function createReview(bookingId, rating, comment) {
  const user = getCurrentUser();
  if (!user) return null;
  
  const bookings = getData(STORAGE_KEYS.BOOKINGS);
  const booking = bookings.find(b => b.id === bookingId);
  
  if (!booking || booking.studentId !== user.id) {
    showAlert('Invalid booking!', 'error');
    return null;
  }
  
  if (booking.hasReview) {
    showAlert('You have already reviewed this booking!', 'error');
    return null;
  }
  
  const reviews = getData(STORAGE_KEYS.REVIEWS);
  
  const newReview = {
    id: generateId(),
    bookingId: bookingId,
    teacherId: booking.teacherId,
    studentId: user.id,
    studentName: user.name,
    listingTitle: booking.listingTitle,
    rating: parseInt(rating),
    comment: comment.trim(),
    createdAt: new Date().toISOString()
  };
  
  reviews.push(newReview);
  saveData(STORAGE_KEYS.REVIEWS, reviews);
  
  // Mark booking as reviewed
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex !== -1) {
    bookings[bookingIndex].hasReview = true;
    saveData(STORAGE_KEYS.BOOKINGS, bookings);
  }
  
  return newReview;
}

/**
 * Get reviews for a teacher
 * @param {string} teacherId - Teacher user ID
 * @returns {Array} - Teacher's reviews
 */
function getTeacherReviews(teacherId) {
  const reviews = getData(STORAGE_KEYS.REVIEWS);
  return reviews.filter(r => r.teacherId === teacherId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get average rating for a teacher
 * @param {string} teacherId - Teacher user ID
 * @returns {number} - Average rating
 */
function getTeacherRating(teacherId) {
  const reviews = getTeacherReviews(teacherId);
  if (reviews.length === 0) return 0;
  
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return (total / reviews.length).toFixed(1);
}

// ==========================================
// Initialize on page load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  initMobileMenu();
});
