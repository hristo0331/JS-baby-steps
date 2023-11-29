const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const positiveOptions = ['да', 'мхм', 'добре', 'естествено', 'da', 'ok', 'yes', 'y', 'yep', 'yeah', 'yeh', 'ya', 'sure'];
const negativeOptions = ['не', 'да бе', 'тц', 'цък', 'ne', 'n', 'no', 'not', 'nah', 'negative', 'false'];


console.log('This program will calculate the count of days until next Christmas from a specific date.')

function askForCurrentDate() {
    rl.question('Do you want to use the current date?: ', (answer) => {

        if (positiveOptions.includes(answer.toLowerCase())) {
            timeDifference();            
        } 
        
        else if (negativeOptions.includes(answer.toLowerCase())) {
            askForDate();
        } 
        
        else {
            console.log('Invalid input. Please enter "yes" or "no".');
            askForCurrentDate();
        }
    });
}

function nextChristmas(year, month, day) {
    const christmasDay = new Date(year, 11, 25);
    
    if (christmasDay.getTime() < new Date(year, month, day).getTime()) {
        christmasDay.setFullYear(year + 1);
    }
    return christmasDay;
}

function timeDifference(choosenDay) {

    if (!choosenDay) {
        choosenDay = new Date();
    }

    const presentYear = choosenDay.getFullYear();
    const presentMonth = choosenDay.getMonth();
    const presentDay = choosenDay.getDate();
    const christmasDay = nextChristmas(presentYear, presentMonth, presentDay);
    const millisecondsPerDay = 1000 * 3600 * 24; 
    const timeDiff = christmasDay.getTime() - choosenDay.getTime();
    let daysToChristmas = Math.round(timeDiff / millisecondsPerDay);

    console.log('Days to Christmas:', daysToChristmas);
    askCalculateAgain();  
}

function isValidDate(year, month, day) {

    if (month < 1 || month > 12) {
        console.log('Invalid input. Month must be between 1 and 12');
        askForDate();
        return;
    }

    if (day < 1 || day > 31) {
        console.log('Invalid input. Day must be between 1 and 31');
        askForDate();
        return;
    }
        
    else if (month === 2) {

        if (year % 4 === 0 && (day > 29 || day < 1)) {
            console.log('Invalid input. February has only 29 days in leap years!');
            askForDate();
            return;
        } 

        else if (year % 4 !== 0 && (day > 28 || day < 1)) {
            console.log('Invalid input. February has only 28 days in non-leap years!');
            askForDate();
            return;
        }
    } 

    else if ([4, 6, 9, 11].includes(month) && day > 30) {
        console.log('Invalid input. This month has only 30 days!');
            askForDate();
            return;
    }

    return true;
}

function askForDate() {
    rl.question('Enter the custom date (YYYY-MM-DD): ', (customDate) => {
        // const year = parseInt(customDate.substring(0, 4));
        // const month = parseInt(customDate.substring(5, 7));
        // const day = parseInt(customDate.substring(8, 10));

        const [year, month, day] = customDate.split('-').map(Number);

        if (!isValidDate(year, month, day)) {                
            askForDate();
            return;
        }

        const choosenDay = new Date(year, month - 1, day);
        timeDifference(choosenDay);
        askCalculateAgain();
    });
}

function askCalculateAgain() {
    rl.question('Do you want to calculate from another date?: ', (resetOption) => {
        
        if (!resetOption.trim() || !isNaN(resetOption)) {
            console.log('Do you want to calculate from another date? (yes/no): ');
            askCalculateAgain();
            return;
        }

        else if (positiveOptions.includes(resetOption.toLowerCase())) {
            askForCurrentDate();  
        } 

        else {
            askCloseProgram();
        }
    });
}
  
  
function askCloseProgram() {
    rl.question('Do you want to close the program?: ', (leaveOption) => {

        if (!leaveOption.trim() || !isNaN(leaveOption)) {
            console.log('Do you want to close the program? (yes/no): ');
            askCloseProgram(); 
            return;
        }

        else if (positiveOptions.includes(leaveOption.toLowerCase())) {
            console.log('Thank you for using the Christmas calculator!');
            setTimeout(() => {
            rl.close();
            }, 3000);

        } else {
            askCalculateAgain();
        }
    });
}

askForCurrentDate();
