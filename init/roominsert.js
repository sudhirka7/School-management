const room = require("../model/admin/rooms");
const db = require("../config/db");
require("dotenv").config();
db();
// Generate 300 Students
const students = [];
for (let i = 1; i <= 30; i++) {
    for(let j = 1; j<4; j++){
        students.push({
             hostel_name: "Boys A",
             section: "A",  // Alternate sections
             roomNo: i, // Random room number (1-50)
             bedNo: j // Random bed number (1-5)
        });
    }    
}


for (let i = 1; i <= 30; i++) {
    for(let j = 1; j<4; j++){
        students.push({
             hostel_name: "Girls A",
             section: "A",  // Alternate sections
             roomNo: i, // Random room number (1-50)
             bedNo: j // Random bed number (1-5)
        });
    }    
}
for (let i = 1; i <= 30; i++) {
    for(let j = 1; j<4; j++){
        students.push({
             hostel_name: "Boys B",
             section: "B",  // Alternate sections
             roomNo: i, // Random room number (1-50)
             bedNo: j // Random bed number (1-5)
        });
    }    
}

const addroom =()=>{
     
  room.insertMany(students)
  .then(() => {
      console.log("180 Students Added Successfully!");
      
  })
  .catch(err => console.log(err));
}

const delroom = ()=>{
    room.deleteMany({})
    .then(()=>{
        console.log("rooms Deleted");
    })
    .catch((e)=>{
        console.log("Error", e);
    })
}


delroom();
addroom()
