const personsBirthdates = {
    James: { day: 0, month: 0, year: 0},
    Olivia: { day: 0, month: 0, year: 0},
    Alexander: { day: 0, month: 0, year: 0},
    Mia: { day: 0, month: 0, year: 0},
    Michael: { day: 0, month: 0, year: 0},
    Emily: { day: 0, month: 0, year: 0},
    Matthew: { day: 0, month: 0, year: 0},
    David: { day: 0, month: 0, year: 0},
    Elizabeth: { day: 0, month: 0, year: 0},
    Ryan: { day: 0, month: 0, year: 0},    
  };

const readline = require('readline');

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

function setBirthdays() {
    // Create an array of person names from the object keys
    const personNames = Object.keys(personsBirthdates);
  
    // Recursive function to prompt for each person's birthdate one by one
    function promptBirthday(index) {
      if (index === personNames.length) {
        // All birthdays are set. Close the readline interface.
        rl.close();
        console.log('Birthdays have been set successfully!');
        return;
      }
  
      const personName = personNames[index];
      rl.question(`Enter birthdate (dd-mm-yyyy) for ${personName}: `, (answer) => {
        const [day, month, year] = answer.split('-').map(Number);
        if (isNaN(day) || isNaN(month) || isNaN(year) || day <= 0 || month <= 0 || year <= 0 || day > 31 || month > 12) {
          console.log('Invalid input. Please enter a valid birthdate (day month year).');
          promptBirthday(index);
        } else {
          // Update the person's birthdate in the personsBirthdates object
          personsBirthdates[personName] = { day, month, year };
          // Move to the next person
          promptBirthday(index + 1);
        }
      });
    }
  
    // Start prompting for the first person's birthdate
    promptBirthday(0);
  }
  
  // Call the function to start setting the birthdays
  setBirthdays();

  
