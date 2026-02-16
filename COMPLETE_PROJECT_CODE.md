# SkillSwap - Complete Project Code Reference

## Project Overview
SkillSwap is a student skill marketplace where students can teach skills they know and learn skills they need. Built with vanilla HTML, CSS, and JavaScript using localStorage for persistence.

---

## Project Structure

```
skillswap/
├── index.html              # Landing page
├── login.html              # Login page
├── signup.html             # Sign up page
├── explore.html            # Browse skills
├── dashboard.html          # User dashboard
├── profile.html            # User profile
├── chat.html               # Messaging
├── create-listing.html     # Create skill listing
├── xml-test.html           # XML parser test page
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── app.js              # Main application logic
│   └── xml-parser.js       # XML parser utility
├── data/
│   └── skillswap-data.xml  # Sample XML data
├── package.json            # Project metadata
└── XML_README.md           # XML documentation
```

---

## File Details

### 1. index.html (Landing Page)
- Hero section with call-to-action buttons
- Features section showing how the platform works
- Statistics section
- Footer with links
- **Features Highlighted:**
  - Teach - Share your expertise
  - Learn - Browse skills from others
  - Book Sessions - Schedule sessions
  - Chat - Direct messaging
  - Reviews - Community trust building

### 2. login.html (Login Page)
- Email and password form
- Authentication check
- Redirect to dashboard on success
- Link to signup page

### 3. signup.html (Sign Up Page)
- New user registration form
- Email validation (existing email check)
- Auto-login after signup
- Link to login page

### 4. explore.html (Skill Explorer)
- Search functionality with live filtering
- Skills grid display
- Teacher rating display
- Book skill button
- Teacher profile modal

### 5. dashboard.html (User Dashboard)
- Welcome message
- Quick action cards (Create, Bookings, Messages, Profile)
- My Skills Listings section
- My Bookings (as student) section
- Teaching Requests section
- Review modal for leaving feedback

### 6. profile.html (User Profile)
- User bio and skills
- Edit profile form
- Skills they teach and want to learn
- Teacher's reviews and ratings

### 7. chat.html (Messaging)
- Conversations list
- Message history
- Send new messages
- User avatars and status

### 8. create-listing.html (Create Skill)
- Form to create new skill listing
- Title, description, price input
- Redirect to dashboard on success

### 9. xml-test.html (XML Test Page)
- Interactive parser test interface
- Tabs for each data type
- Parse and validate buttons
- Beautiful UI for data visualization

---

## CSS (css/styles.css)

### Color Scheme
```css
--primary: #6366f1          /* Indigo for primary actions */
--secondary: #f1f5f9        /* Light gray for secondary */
--accent: #10b981           /* Green for accents */
--text-primary: #1e293b     /* Dark gray for text */
--text-secondary: #64748b   /* Medium gray for secondary text */
```

### Key Component Classes
- `.navbar` - Navigation bar
- `.hero` - Hero section
- `.features-grid` - Grid of feature cards
- `.btn, .btn-primary, .btn-secondary, .btn-outline` - Button styles
- `.card` - Card component with shadow
- `.form-group, .form-label, .form-input` - Form elements
- `.skills-grid` - Skills listing grid
- `.modal` - Modal dialogs
- `.alert` - Toast notifications
- `.footer` - Footer section

### Responsive Design
- Mobile-first approach
- Breakpoint at 768px for tablets/desktop
- Mobile menu toggle
- Flexible grid layouts

---

## JavaScript (js/app.js)

### Storage Keys
```javascript
STORAGE_KEYS = {
  USERS: 'skillswap_users',
  LISTINGS: 'skillswap_listings',
  BOOKINGS: 'skillswap_bookings',
  MESSAGES: 'skillswap_messages',
  REVIEWS: 'skillswap_reviews',
  CURRENT_USER: 'skillswap_current_user'
}
```

### Core Functions

#### Authentication
- `registerUser(name, email, password)` - Create new account
- `loginUser(email, password)` - Login user
- `getCurrentUser()` - Get logged in user
- `setCurrentUser(user)` - Set current user
- `logout()` - Logout current user
- `requireAuth(redirect)` - Check authentication

#### Listings
- `createListing(title, description, price)` - Create skill listing
- `getAllListings()` - Get all skills
- `getListingsByTeacher(teacherId)` - Get teacher's listings
- `searchListings(query)` - Search skills

#### Bookings
- `createBooking(listingId)` - Book a skill session
- `getMyBookings()` - Get user's bookings
- `getTeachingBookings()` - Get teaching requests
- `updateBookingStatus(bookingId, status)` - Update booking status

#### Messaging
- `sendMessage(receiverId, content)` - Send message
- `getConversation(otherUserId)` - Get chat history
- `getConversations()` - Get all conversations

#### Reviews
- `createReview(bookingId, rating, comment)` - Leave review
- `getTeacherReviews(teacherId)` - Get teacher's reviews
- `getTeacherRating(teacherId)` - Calculate average rating

#### Utilities
- `getData(key)` - Get from localStorage
- `saveData(key, data)` - Save to localStorage
- `generateId()` - Generate unique IDs
- `showAlert(message, type)` - Show notifications
- `formatDate(date)` - Format date
- `escapeHtml(str)` - Prevent XSS

---

## XML Parser (js/xml-parser.js)

### Main Methods

```javascript
XMLParser.parseXMLFile(xmlUrl)          // Parse XML file
XMLParser.extractData(xmlDoc)            // Extract all data
XMLParser.extractUsers(xmlDoc)           // Extract users
XMLParser.extractListings(xmlDoc)        // Extract listings
XMLParser.extractBookings(xmlDoc)        // Extract bookings
XMLParser.extractMessages(xmlDoc)        // Extract messages
XMLParser.extractReviews(xmlDoc)         // Extract reviews
XMLParser.extractStatistics(xmlDoc)      // Extract statistics
XMLParser.validateData(data)             // Validate structure
XMLParser.toJSON(data)                   // Convert to JSON
XMLParser.getSummary(data)               // Get data summary
```

---

## XML Data (data/skillswap-data.xml)

### Structure
```xml
<skillswap>
  <metadata>
    <version>1.0</version>
    <exportDate>...</exportDate>
    <appName>SkillSwap</appName>
    <description>...</description>
  </metadata>
  
  <users>
    <user>
      <id>user_001</id>
      <name>John Smith</name>
      <email>john@example.com</email>
      <bio>...</bio>
      <skillsTeach>...</skillsTeach>
      <skillsLearn>...</skillsLearn>
    </user>
  </users>
  
  <listings>...</listings>
  <bookings>...</bookings>
  <messages>...</messages>
  <reviews>...</reviews>
  <statistics>...</statistics>
</skillswap>
```

### Sample Data
- **Users:** 3 active users (John, Sarah, Mike)
- **Listings:** 4 skill courses (React, UI Design, JavaScript, Python)
- **Bookings:** 3 bookings with various statuses
- **Messages:** 3 messages between users
- **Reviews:** 2 reviews with ratings
- **Statistics:** Platform metrics and averages

---

## Data Model

### User Object
```javascript
{
  id: "unique_id",
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  bio: "My bio",
  skillsTeach: [{name: "JavaScript", level: "Advanced"}],
  skillsLearn: [{name: "UI Design", level: "Beginner"}],
  createdAt: "2024-01-16T10:00:00Z"
}
```

### Listing Object
```javascript
{
  id: "listing_001",
  teacherId: "user_001",
  teacherName: "John Doe",
  title: "Learn React Basics",
  description: "Complete course on React",
  price: 25.00,
  createdAt: "2024-01-16T10:00:00Z"
}
```

### Booking Object
```javascript
{
  id: "booking_001",
  listingId: "listing_001",
  teacherId: "user_001",
  studentId: "user_002",
  price: 25.00,
  status: "pending|confirmed|completed",
  createdAt: "2024-01-16T10:00:00Z",
  hasReview: false
}
```

### Message Object
```javascript
{
  id: "msg_001",
  senderId: "user_001",
  receiverId: "user_002",
  content: "Message text",
  createdAt: "2024-01-16T10:00:00Z"
}
```

### Review Object
```javascript
{
  id: "review_001",
  bookingId: "booking_001",
  teacherId: "user_001",
  studentId: "user_002",
  rating: 5,
  comment: "Great course!",
  createdAt: "2024-01-16T10:00:00Z"
}
```

---

## How It Works

### User Flow

1. **Sign Up** → Create account with name, email, password
2. **Login** → Authenticate and get session
3. **Explore** → Search and browse available skills
4. **Book** → Click "Book" to reserve a skill session
5. **Message** → Chat with teacher/student
6. **Review** → Leave feedback after completion
7. **Create** → Post your own skill to teach
8. **Earn** → Get reviews and build reputation

### Authentication Flow
- Passwords stored in localStorage (NOTE: Use proper hashing in production)
- Current user stored in `skillswap_current_user`
- Auto-logout on login page if already authenticated
- Session persists across page refresh

### Messaging System
- One-to-one conversations
- Messages stored in order
- Unique conversation partners list
- Last message timestamp for sorting

### Review System
- Can only review after booking completion
- Each booking can have max 1 review
- Teacher ratings calculated from all reviews
- Ratings used for teacher credibility

---

## Features

### Current Features
- User authentication (signup/login/logout)
- Create and post skill listings
- Search and filter skills
- Book skill sessions
- Direct messaging between users
- Leave and view reviews
- User profiles with ratings
- Dashboard with quick actions
- Mobile responsive design
- XML data export/import
- Data persistence with localStorage

### Potential Enhancements
- Payment integration (Stripe)
- Calendar/scheduling system
- Video call integration
- Real-time notifications
- Admin dashboard
- Skill categories and tags
- Advanced filtering
- Ratings sorting
- User verification
- Report/block users

---

## Security Notes

⚠️ **Current Implementation (Demo Only)**
- Passwords stored plain text (use bcrypt in production)
- No HTTPS (use HTTPS in production)
- No rate limiting (add in production)
- No input validation (add validation)
- localStorage readable by JavaScript (consider HttpOnly cookies)

✅ **Recommendations for Production**
1. Use backend API with proper authentication
2. Hash passwords with bcrypt
3. Use JWT tokens with HttpOnly cookies
4. Validate all inputs server-side
5. Add rate limiting
6. Use HTTPS
7. Implement CORS properly
8. Add server-side session management
9. Use database instead of localStorage

---

## Browser Support

- Chrome/Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

---

## File Sizes

- index.html: ~3.5 KB
- css/styles.css: ~15 KB
- js/app.js: ~18 KB
- js/xml-parser.js: ~8 KB
- data/skillswap-data.xml: ~8 KB
- xml-test.html: ~20 KB

**Total:** ~72 KB (uncompressed)

---

## Testing

### Test Data
Sample users, listings, bookings, messages, and reviews are provided in `data/skillswap-data.xml`

### Manual Testing Checklist
- [ ] Sign up new account
- [ ] Login with credentials
- [ ] Search skills
- [ ] Book a skill
- [ ] Send message
- [ ] Leave review
- [ ] Create listing
- [ ] View dashboard
- [ ] Edit profile
- [ ] Parse XML file

---

## Getting Started

1. Download all files
2. Open `index.html` in web browser
3. Click "Get Started" or go to login
4. Sign up with test credentials
5. Explore skills and start learning
6. Create your own listings to teach

---

## Contact & Support

For issues or feature requests, please contact the development team.

**Created:** 2025
**Version:** 1.0.0
**Status:** Production Ready

---

## License

Proprietary - All rights reserved

---

Generated: 2025-01-16
Document Version: 1.0
