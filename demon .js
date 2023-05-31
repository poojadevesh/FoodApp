payrolls.forEach(async (payroll) => {
    try {
      // Step 2: Retrieve Employee Data
      const employee = await Employee.findOne({ employeeID: payroll.employeeID });
  
      if (employee) {
        // Step 3: Perform Payroll Calculation
        const salary = calculateSalary(employee.defaultSalary); // Replace with your actual salary calculation logic
        
        // Step 4: Generate Payslips
        const payslipContent = generatePayslip(employee.employeeID, salary); // Replace with your actual payslip generation logic
  
        // Step 5: Send Payslips via Email
        const emailSent = await sendEmail(employee.email, employee.employeeID, payslipContent); // Replace with your actual email sending logic
        
        if (emailSent) {
          // Update the payslips field in the payroll document
          payroll.payslips = payslipContent;
          await payroll.save();
  
          console.log(`Payslip generated and emailed for employee with ID ${employee.employeeID}`);
        } else {
          console.log(`Failed to send email for employee with ID ${employee.employeeID}`);
        }
      } else {
        console.log(`Employee not found for payroll with ID ${payroll._id}`);
      }
    } catch (error) {
      console.error(`Error during payroll calculation for payroll with ID ${payroll._id}:`, error);
    }
  });const PDFDocument = require('pdfkit');
  const fs = require('fs');
  const nodemailer = require('nodemailer');
  const smtp = require('nodemailer-smtp-transport');
  
  const generatePayslip = (employeeName, salary) => {
    // Create a new PDF document
    const doc = new PDFDocument();
  
    // Add content to the PDF
    doc.fontSize(20).text(`Payslip for ${employeeName}`);
    doc.moveDown();
    doc.fontSize(16).text(`Salary: ${salary}`);
  
    // Return the content of the PDF
    return doc;
  };
  
  const sendEmail = async (email, employeeName, payslip) => {
    let transporter = nodemailer.createTransport(
      smtp({
        host: 'smtp.office365.com',
        port: 587,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        secureConnection: false,
        tls: { ciphers: 'SSLv3' },
      })
    );
  
    let info = {
      from: process.env.EMAIL,
      to: email,
      subject: `Monthly Payslip for ${employeeName}`,
      text: '',
      html: `Dear ${employeeName},<br><br>
      Please find attached your monthly payslip.<br><br>
      Warm Regards,<br>
      HR Team`,
      attachments: [{
        filename: 'payslip.pdf',
        content: payslip,
      }],
    };
  
    try {
      await transporter.sendMail(info);
      return true; // Email sent successfully
    } catch (error) {
      console.error(error);
      return false; // Failed to send email
    }
  };
  
  const payrollScheduler = () => {
    // Set up a schedule to run the payrollScheduler function on the first day of every month at 12:00 AM
    const job = schedule.scheduleJob('0 0 1 * *', async () => {
      try {
        // Get all the employees from the database
        const employees = await Employee.find();
  
        // Loop through each employee and generate their payslip
        for (const employee of employees) {
          // Generate the payslip for the employee
          const payslipContent = generatePayslip(employee.name, employee.salary);
  
          // Send the payslip to the employee's email
          await sendEmail(employee.email, employee.name, payslipContent);
  
          // Update the employee's payslip in the database
          await Employee.findByIdAndUpdate(employee._id, { $set: { payslip: payslipContent } });
        }
      } catch (error) {
        console.error(error);
      }
    });
  };
  const express = require('express');
  const router = express.Router();
  const Payroll = require('../models/payroll'); // Assuming you have a Payroll model
  const nodemailer = require('nodemailer');
  
  // Calculate Payroll, Generate Payslips, and Mail
  router.post('/payroll/calculate', async (req, res) => {
    try {
      // Get the current date
      const currentDate = new Date();
      
      // Check if it is the first day of the month
      if (currentDate.getDate() !== 1) {
        return res.status(400).json({ message: 'Payroll can only be calculated on the first day of the month' });
      }
      
      // Retrieve all payroll records from the database
      const payrolls = await Payroll.find();
      
      // Perform payroll calculations and generate payslips for each employee
      payrolls.forEach(async (payroll) => {
        // Your payroll calculation logic goes here
        // Calculate the salary for the employee based on your requirements
        
        // Generate the payslip for the employee
        const payslip = generatePayslip(); // Replace this with your actual function to generate the payslip
        
        // Send the payslip to the employee via email
        const emailSent = await sendEmail(payroll.email, payroll.employeeName, payslip);
        
        if (emailSent) {
          // Update the payslip field in the payroll record
          payroll.payslip = payslip;
          await payroll.save();
        }
      });
      
      res.json({ message: 'Payroll calculated, payslips generated, and mailed successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Helper function to send payslip by email
  async function sendEmail(email, employeeName, payslip) {
    // Configure your email transporter (e.g., using nodemailer)
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      auth: {
        user: process.env.EMAIL, // Replace with your email address or use environment variable
        pass: process.env.PASSWORD, // Replace with your email password or use environment variable
      },
      secureConnection: false,
      tls: { ciphers: 'SSLv3' },
    });
  
    // Configure your email options (e.g., sender, recipient, subject, body, attachment, etc.)
    const mailOptions = {
      from: process.env.EMAIL, // Replace with your email address or use environment variable
      to: email,
      subject: `Monthly Payslip for ${employeeName}`,
      text: '',
      html: `Dear ${employeeName},<br><br>
      Please find attached your monthly payslip.<br><br>
      Warm Regards,<br>
      HR Team`,
      attachments: [{
        filename: 'payslip.pdf',
        content: payslip,
      }],
    };
  
    try {
      await transporter.sendMail(mailOptions);
      return true; // Email sent successfully
    } catch (error) {
      console.error(error);
      return false; // Failed to send email
    }
  }
  
  // Helper function to generate the payslip
  function generatePayslip() {
    // Your payslip generation logic goes here
    // Generate the payslip and return its content
    return 'This is the content of the payslip'; // Replace this with the actual content of your payslip
  }
  
  module.exports = router;
    
  