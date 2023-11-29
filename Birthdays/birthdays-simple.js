const namesAndBirthdays = [
    { name: "Quinn", birthday: "1988-04-17" },
    { name: "Ryan", birthday: "2006-07-11" },
    { name: "Sophia", birthday: "1991-02-19" },
    { name: "Thomas", birthday: "2007-06-07" },
    { name: "Uma", birthday: "1994-06-12" },
    { name: "Violet", birthday: "1995-03-05" },
    { name: "William", birthday: "1998-07-14" },
    { name: "Xander", birthday: "2000-01-27" },
    { name: "Yara", birthday: "2003-09-29" },
    { name: "Zara", birthday: "2006-07-03" }
];
  
// Birthdays for curent month

const desiredMonth = 7; 

const birthdaysInDesiredMonth = namesAndBirthdays.filter(({ birthday }) => {
const birthMonth = new Date(birthday).getMonth() + 1; 
return birthMonth === desiredMonth;
});

console.log(`Birthdays in month ${desiredMonth}:`);
birthdaysInDesiredMonth.forEach(({ name, birthday }) => { console.log(`${name} - ${birthday}`)});
  

// Birthdays after date (in the some month)

const currentDate = new Date("2000-01-28");

const upcomingBirthdays = namesAndBirthdays.filter(({ birthday }) => {
    const birthdayDate = new Date(birthday);
    return (birthdayDate.getMonth() === currentDate.getMonth() && birthdayDate.getDate() > currentDate.getDate());
});

console.log("Upcoming birthdays in this month:");
upcomingBirthdays.forEach(({ name, birthday }) => { console.log(`${name}: ${birthday}`)});
