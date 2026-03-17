const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function test() {
  try {
    console.log('Testing with:');
    console.log('USER:', process.env.EMAIL_USER);
    console.log('PASS:', process.env.EMAIL_PASSWORD ? '****' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET');
    
    await transporter.verify();
    console.log('✅ SMTP Connection Successful!');
  } catch (error) {
    console.error('❌ SMTP Connection Failed:', error.message);
  }
}

test();
