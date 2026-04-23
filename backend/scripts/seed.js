require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Session = require('../models/Session');
const Message = require('../models/Message');
const Review = require('../models/Review');
const connectDB = require('../config/db');

const skillsList = ['JavaScript', 'Yoga', 'Guitar', 'Python', 'Cooking', 'Drawing', 'Photography', 'Hindi', 'Chess', 'Fitness Training'];

const generateIndianName = () => {
  const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Siddharth', 'Rohan', 'Ishaan', 'Krishna', 'Aanya', 'Diya', 'Kavya', 'Priya', 'Neha', 'Aditi', 'Sanya', 'Tara', 'Riya', 'Ananya'];
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Das', 'Gupta', 'Verma', 'Reddy', 'Rao', 'Nair'];
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
};

const seedDB = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database...');
    await User.deleteMany({});
    await Session.deleteMany({});
    await Message.deleteMany({});
    await Review.deleteMany({});

    console.log('Inserting Users...');
    const hashedPassword = await bcrypt.hash('Password@123', 10);
    
    const usersData = [];
    
    // Add 2 admins
    usersData.push({
      name: 'Site Admin',
      email: 'admin@skillswap.com',
      password: hashedPassword,
      role: 'admin',
      skillsTeach: [skillsList[0], skillsList[3]],
      skillsLearn: [skillsList[1]],
      hourlyRate: 1500,
      rating: 5.0,
      totalReviews: 5
    });
    usersData.push({
      name: 'Arjun Admin',
      email: 'arjun@skillswap.com',
      password: hashedPassword,
      role: 'admin',
      skillsTeach: [skillsList[2], skillsList[8]],
      skillsLearn: [skillsList[4]],
      hourlyRate: 1200,
      rating: 4.8,
      totalReviews: 3
    });

    // Add 8 regular users
    for (let i = 0; i < 8; i++) {
        const numTeach = Math.floor(Math.random() * 3) + 1;
        const teachSkills = [];
        for(let j=0; j<numTeach; j++) {
            const r = skillsList[Math.floor(Math.random() * skillsList.length)];
            if(!teachSkills.includes(r)) teachSkills.push(r);
        }

        const numLearn = Math.floor(Math.random() * 3) + 1;
        const learnSkills = [];
        for(let j=0; j<numLearn; j++) {
            const r = skillsList[Math.floor(Math.random() * skillsList.length)];
            if(!learnSkills.includes(r)) learnSkills.push(r);
        }

        usersData.push({
            name: generateIndianName(),
            email: `user${i+1}@skillswap.com`,
            password: hashedPassword,
            role: 'user',
            skillsTeach: teachSkills,
            skillsLearn: learnSkills,
            hourlyRate: Math.floor(Math.random() * (2000 - 200 + 1) + 200),
            rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
            totalReviews: Math.floor(Math.random() * 20)
        });
    }

    const createdUsers = await User.insertMany(usersData);
    
    console.log('Inserting Sessions...');
    const sessionStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const sessionsData = [];
    
    for (let i = 0; i < 15; i++) {
        let teacherInfo = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        let learnerInfo = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        
        while(teacherInfo._id.toString() === learnerInfo._id.toString()) {
            learnerInfo = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        }

        const status = sessionStatuses[Math.floor(Math.random() * sessionStatuses.length)];
        const skill = teacherInfo.skillsTeach.length > 0 ? teacherInfo.skillsTeach[0] : skillsList[0];
        
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 30));
        
        sessionsData.push({
            teacher: teacherInfo._id,
            learner: learnerInfo._id,
            status: status,
            skill: skill,
            date: dateObj,
            price: teacherInfo.hourlyRate,
            roomId: `${teacherInfo._id}_${learnerInfo._id}_${Date.now() + i}`
        });
    }

    const createdSessions = await Session.insertMany(sessionsData);

    console.log('Inserting Messages...');
    const messagesData = [];
    const conversationSamples = [
        "Hi, are you still available for the class?",
        "Yes, I am. What time works for you?",
        "How about tomorrow at 5 PM?",
        "That works perfectly. I will prepare the materials.",
        "Great, looking forward to it. Thanks!"
    ];

    const targetSessions = createdSessions.slice(0, 5);
    for (let i = 0; i < 20; i++) {
        const session = targetSessions[i % 5];
        const senderId = i % 2 === 0 ? session.teacher : session.learner;
        const msgContent = conversationSamples[i % 5] + ` (Message ${i+1})`;
        
        const timestamp = new Date(session.date);
        timestamp.setHours(timestamp.getHours() - (20 - i));

        messagesData.push({
            roomId: session.roomId,
            sender: senderId,
            content: msgContent,
            timestamp: timestamp
        });
    }
    
    await Message.insertMany(messagesData);

    console.log('Inserting Reviews and Updating Ratings...');
    const completedSessions = createdSessions.filter(s => s.status === 'completed');
    
    while(completedSessions.length < 10) {
        let additionalSession = createdSessions[Math.floor(Math.random() * createdSessions.length)];
        completedSessions.push(additionalSession);
    }

    const reviewsData = [];
    const reviewComments = [
        "Great teacher, very patient!",
        "I learned a lot, highly recommended.",
        "Good session, but could be structured better.",
        "Excellent skills and communication.",
        "Very helpful and knowledgeable."
    ];

    for (let i = 0; i < 10; i++) {
        const session = completedSessions[i];
        
        reviewsData.push({
            session: session._id,
            reviewer: session.learner,
            reviewee: session.teacher,
            rating: Math.floor(Math.random() * 3) + 3,
            comment: reviewComments[i % reviewComments.length]
        });
    }

    await Review.insertMany(reviewsData);

    console.log('Recalculating teacher ratings...');
    for (const user of createdUsers) {
        const userReviews = await Review.find({ reviewee: user._id });
        if (userReviews.length > 0) {
            const sum = userReviews.reduce((acc, rev) => acc + rev.rating, 0);
            const avgRating = sum / userReviews.length;
            
            await User.findByIdAndUpdate(user._id, {
                rating: avgRating.toFixed(1),
                totalReviews: userReviews.length
            });
        }
    }

    console.log('Database successfully seeded!');
    process.exit();
  } catch (error) {
    console.error(`Error with data seed: ${error}`);
    process.exit(1);
  }
};

seedDB();
