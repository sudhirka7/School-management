const mongoose = require("mongoose");
const Student = require("../model/admin/student.js");
const db = require("../config/db");
require("dotenv").config();

db();


const students =[
  {
    "father_contact": 7254809630,
    "date_of_birth": "25/11/2005",
    "date_of_joinning": "25/01/2025",
    "gender": "F",
    "father_name": "Mukesh Singh",
    "mother_name": "Divya",
    "name": "Amit Kumar",
    "studentId": "1521524041",
    "branch": "Computer Science & Engineering",
    "roll_no": "CSE101",
    "district": "Patna",
    "email": "amit.kumar@example.com",
    "contact_no": "9876543210"
  },
  {
    "father_contact": 7254809630,
    "date_of_birth": "10/05/2004",
    "date_of_joinning": "15/02/2024",
    "gender": "M",
    "father_name": "Ravi Verma",
    "mother_name": "Pooja Verma",
    "name": "Rahul Verma",
    "studentId": "1521524042",
    "branch": "Information Technology",
    "roll_no": "IT102",
    "district": "Gaya",
    "email": "rahul.verma@example.com",
    "contact_no": "9876543220"
  },
  {
    "father_contact": 7254809630,
    "date_of_birth": "08/07/2003",
    "date_of_joinning": "10/03/2023",
    "gender": "F",
    "father_name": "Suresh Sharma",
    "mother_name": "Meena Sharma",
    "name": "Priya Sharma",
    "studentId": "1521524043",
    "branch": "Electronics & Communication",
    "roll_no": "ECE103",
    "district": "Bhagalpur",
    "email": "priya.sharma@example.com",
    "contact_no": "9876543230"
  },
  {
    "father_contact": 7254809630,
    "date_of_birth": "12/12/2005",
    "date_of_joinning": "20/01/2025",
    "gender": "M",
    "father_name": "Arun Yadav",
    "mother_name": "Sunita Yadav",
    "name": "Vikash Yadav",
    "studentId": "1521524044",
    "branch": "Mechanical Engineering",
    "roll_no": "ME104",
    "district": "Muzaffarpur",
    "email": "vikash.yadav@example.com",
    "contact_no": "9876543240"
  },
  {
    "father_contact": 7254809630,
    "date_of_birth": "22/09/2004",
    "date_of_joinning": "05/03/2024",
    "gender": "F",
    "father_name": "Rajesh Kumar",
    "mother_name": "Anita Kumar",
    "name": "Sneha Kumari",
    "studentId": "1521524045",
    "branch": "Civil Engineering",
    "roll_no": "CE105",
    "district": "Darbhanga",
    "email": "sneha.kumari@example.com",
    "contact_no": "9876543250"
  }
]

  const addStudent = () =>{
    Student.insertMany(students)
      .then(() => {
          console.log("300 Students Added Successfully!");
          mongoose.connection.close();
      })
      .catch(err => console.log(err));
  }

  const del = ()=>{
    Student.deleteMany()
    .then(()=>{
        console.log("Deleted");
    })
    .catch((e)=>{
        console.log("Error ", error);
    });
  }
  
  del();
 addStudent();

  
  
  
  