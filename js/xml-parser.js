/**
 * SkillSwap XML Parser
 * Parses and validates the XML data format
 */

class XMLParser {
  /**
   * Parse XML file and return structured data
   * @param {string} xmlUrl - URL to XML file
   * @returns {Promise<Object>} - Parsed data
   */
  static async parseXMLFile(xmlUrl) {
    try {
      const response = await fetch(xmlUrl);
      if (!response.ok) throw new Error(`Failed to fetch XML: ${response.status}`);
      
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
      
      // Check for parsing errors
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('XML parsing error');
      }
      
      return XMLParser.extractData(xmlDoc);
    } catch (error) {
      console.error('Error parsing XML:', error);
      return null;
    }
  }

  /**
   * Extract data from parsed XML document
   * @param {Document} xmlDoc - Parsed XML document
   * @returns {Object} - Extracted data
   */
  static extractData(xmlDoc) {
    const data = {
      metadata: XMLParser.extractMetadata(xmlDoc),
      users: XMLParser.extractUsers(xmlDoc),
      listings: XMLParser.extractListings(xmlDoc),
      bookings: XMLParser.extractBookings(xmlDoc),
      messages: XMLParser.extractMessages(xmlDoc),
      reviews: XMLParser.extractReviews(xmlDoc),
      statistics: XMLParser.extractStatistics(xmlDoc)
    };
    
    return data;
  }

  /**
   * Extract metadata from XML
   * @param {Document} xmlDoc - XML document
   * @returns {Object} - Metadata
   */
  static extractMetadata(xmlDoc) {
    const metadata = xmlDoc.querySelector('metadata');
    if (!metadata) return {};
    
    return {
      version: metadata.querySelector('version')?.textContent || '',
      exportDate: metadata.querySelector('exportDate')?.textContent || '',
      appName: metadata.querySelector('appName')?.textContent || '',
      description: metadata.querySelector('description')?.textContent || ''
    };
  }

  /**
   * Extract users from XML
   * @param {Document} xmlDoc - XML document
   * @returns {Array} - Users array
   */
  static extractUsers(xmlDoc) {
    const users = [];
    const userElements = xmlDoc.querySelectorAll('users > user');
    
    userElements.forEach(userEl => {
      const user = {
        id: userEl.querySelector('id')?.textContent || '',
        name: userEl.querySelector('name')?.textContent || '',
        email: userEl.querySelector('email')?.textContent || '',
        bio: userEl.querySelector('bio')?.textContent || '',
        createdAt: userEl.querySelector('createdAt')?.textContent || '',
        skillsTeach: [],
        skillsLearn: []
      };
      
      // Extract skills to teach
      const teachSkills = userEl.querySelectorAll('skillsTeach > skill');
      teachSkills.forEach(skill => {
        user.skillsTeach.push({
          name: skill.querySelector('name')?.textContent || '',
          level: skill.querySelector('level')?.textContent || ''
        });
      });
      
      // Extract skills to learn
      const learnSkills = userEl.querySelectorAll('skillsLearn > skill');
      learnSkills.forEach(skill => {
        user.skillsLearn.push({
          name: skill.querySelector('name')?.textContent || '',
          level: skill.querySelector('level')?.textContent || ''
        });
      });
      
      users.push(user);
    });
    
    return users;
  }

  /**
   * Extract listings from XML
   * @param {Document} xmlDoc - XML document
   * @returns {Array} - Listings array
   */
  static extractListings(xmlDoc) {
    const listings = [];
    const listingElements = xmlDoc.querySelectorAll('listings > listing');
    
    listingElements.forEach(listingEl => {
      const listing = {
        id: listingEl.querySelector('id')?.textContent || '',
        teacherId: listingEl.querySelector('teacherId')?.textContent || '',
        teacherName: listingEl.querySelector('teacherName')?.textContent || '',
        title: listingEl.querySelector('title')?.textContent || '',
        description: listingEl.querySelector('description')?.textContent || '',
        price: parseFloat(listingEl.querySelector('price')?.textContent || 0),
        category: listingEl.querySelector('category')?.textContent || '',
        level: listingEl.querySelector('level')?.textContent || '',
        duration: parseInt(listingEl.querySelector('duration')?.textContent || 0),
        sessionType: listingEl.querySelector('sessionType')?.textContent || '',
        createdAt: listingEl.querySelector('createdAt')?.textContent || '',
        rating: parseFloat(listingEl.querySelector('rating')?.textContent || 0),
        reviewCount: parseInt(listingEl.querySelector('reviewCount')?.textContent || 0)
      };
      
      listings.push(listing);
    });
    
    return listings;
  }

  /**
   * Extract bookings from XML
   * @param {Document} xmlDoc - XML document
   * @returns {Array} - Bookings array
   */
  static extractBookings(xmlDoc) {
    const bookings = [];
    const bookingElements = xmlDoc.querySelectorAll('bookings > booking');
    
    bookingElements.forEach(bookingEl => {
      const booking = {
        id: bookingEl.querySelector('id')?.textContent || '',
        listingId: bookingEl.querySelector('listingId')?.textContent || '',
        listingTitle: bookingEl.querySelector('listingTitle')?.textContent || '',
        teacherId: bookingEl.querySelector('teacherId')?.textContent || '',
        teacherName: bookingEl.querySelector('teacherName')?.textContent || '',
        studentId: bookingEl.querySelector('studentId')?.textContent || '',
        studentName: bookingEl.querySelector('studentName')?.textContent || '',
        price: parseFloat(bookingEl.querySelector('price')?.textContent || 0),
        status: bookingEl.querySelector('status')?.textContent || '',
        createdAt: bookingEl.querySelector('createdAt')?.textContent || '',
        completedAt: bookingEl.querySelector('completedAt')?.textContent || null,
        scheduledDate: bookingEl.querySelector('scheduledDate')?.textContent || null,
        hasReview: bookingEl.querySelector('hasReview')?.textContent === 'true'
      };
      
      bookings.push(booking);
    });
    
    return bookings;
  }

  /**
   * Extract messages from XML
   * @param {Document} xmlDoc - XML document
   * @returns {Array} - Messages array
   */
  static extractMessages(xmlDoc) {
    const messages = [];
    const messageElements = xmlDoc.querySelectorAll('messages > message');
    
    messageElements.forEach(messageEl => {
      const message = {
        id: messageEl.querySelector('id')?.textContent || '',
        senderId: messageEl.querySelector('senderId')?.textContent || '',
        senderName: messageEl.querySelector('senderName')?.textContent || '',
        receiverId: messageEl.querySelector('receiverId')?.textContent || '',
        content: messageEl.querySelector('content')?.textContent || '',
        createdAt: messageEl.querySelector('createdAt')?.textContent || '',
        read: messageEl.querySelector('read')?.textContent === 'true'
      };
      
      messages.push(message);
    });
    
    return messages;
  }

  /**
   * Extract reviews from XML
   * @param {Document} xmlDoc - XML document
   * @returns {Array} - Reviews array
   */
  static extractReviews(xmlDoc) {
    const reviews = [];
    const reviewElements = xmlDoc.querySelectorAll('reviews > review');
    
    reviewElements.forEach(reviewEl => {
      const review = {
        id: reviewEl.querySelector('id')?.textContent || '',
        bookingId: reviewEl.querySelector('bookingId')?.textContent || '',
        teacherId: reviewEl.querySelector('teacherId')?.textContent || '',
        studentId: reviewEl.querySelector('studentId')?.textContent || '',
        studentName: reviewEl.querySelector('studentName')?.textContent || '',
        listingTitle: reviewEl.querySelector('listingTitle')?.textContent || '',
        rating: parseInt(reviewEl.querySelector('rating')?.textContent || 0),
        comment: reviewEl.querySelector('comment')?.textContent || '',
        createdAt: reviewEl.querySelector('createdAt')?.textContent || ''
      };
      
      reviews.push(review);
    });
    
    return reviews;
  }

  /**
   * Extract statistics from XML
   * @param {Document} xmlDoc - XML document
   * @returns {Object} - Statistics
   */
  static extractStatistics(xmlDoc) {
    const stats = xmlDoc.querySelector('statistics');
    if (!stats) return {};
    
    return {
      totalUsers: parseInt(stats.querySelector('totalUsers')?.textContent || 0),
      totalListings: parseInt(stats.querySelector('totalListings')?.textContent || 0),
      totalBookings: parseInt(stats.querySelector('totalBookings')?.textContent || 0),
      totalMessages: parseInt(stats.querySelector('totalMessages')?.textContent || 0),
      totalReviews: parseInt(stats.querySelector('totalReviews')?.textContent || 0),
      averageRating: parseFloat(stats.querySelector('averageRating')?.textContent || 0),
      generatedAt: stats.querySelector('generatedAt')?.textContent || ''
    };
  }

  /**
   * Validate XML structure
   * @param {Object} data - Parsed data
   * @returns {Object} - Validation result
   */
  static validateData(data) {
    const errors = [];
    
    // Validate users
    if (!Array.isArray(data.users) || data.users.length === 0) {
      errors.push('Invalid or empty users section');
    }
    
    // Validate listings
    if (!Array.isArray(data.listings) || data.listings.length === 0) {
      errors.push('Invalid or empty listings section');
    }
    
    // Validate bookings
    if (!Array.isArray(data.bookings)) {
      errors.push('Invalid bookings section');
    }
    
    // Validate messages
    if (!Array.isArray(data.messages)) {
      errors.push('Invalid messages section');
    }
    
    // Validate reviews
    if (!Array.isArray(data.reviews)) {
      errors.push('Invalid reviews section');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Convert parsed XML data back to JSON
   * @param {Object} data - Parsed data
   * @returns {string} - JSON string
   */
  static toJSON(data) {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Get summary of parsed data
   * @param {Object} data - Parsed data
   * @returns {Object} - Summary
   */
  static getSummary(data) {
    return {
      metadata: data.metadata,
      counts: {
        users: data.users.length,
        listings: data.listings.length,
        bookings: data.bookings.length,
        messages: data.messages.length,
        reviews: data.reviews.length
      },
      topTeachers: data.listings
        .map(l => ({ name: l.teacherName, rating: l.rating }))
        .slice(0, 5),
      statistics: data.statistics
    };
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XMLParser;
}
