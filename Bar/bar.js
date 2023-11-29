const barCustomers = {
  James: { age: 19, drinks: 0 },
  Clara: { age: 19, drinks: 0 },
  Tom: { age: 19, drinks: 0 },
  John: { age: 16, drinks: 0 }
};

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const positiveOptions = ['да', 'мхм', 'добре', 'естествено', 'da', 'ok', 'yes', 'y', 'yep', 'yeah', 'yeh', 'ya'];

function placeOrder() {
  rl.question('Въведете име на клиент: ', (name) => {

    // При невалиден инпут да пита отново
    if (!name.trim() || !isNaN(name)) {
      console.log('Моля, въведете валидно име на клиента.');
      placeOrder();
      return;
    }

    // Проверка за валидно име
    else if (!barCustomers.hasOwnProperty(name)) {
      console.log('Въведете валидно име на клиента (James, Clara, Tom, John). ');
      placeOrder();
      return;
    }

    const customer = barCustomers[name];

    askNumDrinks();
    
    function askNumDrinks() {
      rl.question('Въведете брой питиета за поръчка: ', (numDrinks) => {       

        // Проверка за валидно число
        if (isNaN(numDrinks) || Number(numDrinks) <= 0 || !numDrinks.trim()) {
          console.log('Въведете валидно положително число за брой питиета.');
          askNumDrinks();
          return;
        }

        // Проверка за възраст
        else if (customer.age < 18) {
          console.log('Трябва да почакаш');
        }

        // Проверка за брой питиета
        else if (customer.drinks + Number(numDrinks) >= 6) {
          console.log('Пиян си');
        }
        
        // Увеличаване на броя на питиетата на клиента
        else {
          customer.drinks += Number(numDrinks);

          // Принтиране на поръчките на всички
          for (const [customerName, customerData] of Object.entries(barCustomers)) {
            console.log(`${customerName}: ${customerData.drinks} питиета`);
          }
        }
        
        askResetOption();
      });
    }
  });
}

function askResetOption() {
  rl.question('Искате ли да нулирате поръчките?', (resetOption) => {

    // При невалиден инпут да пита отново
    if (!resetOption.trim() || !isNaN(resetOption)) {
      console.log('Моля, въведете валидна опция за нулиране на поръчките.');
      askResetOption();
      return;
    }

    // При съвпадение на инпута с позитивните опции да нулира записите
    else if (positiveOptions.includes(resetOption.toLowerCase())) {
      resetOrders();

    } else {
      placeOrder();
    }
  });
}

function resetOrders() {
  for (const customerData of Object.values(barCustomers)) {
    customerData.drinks = 0;
  }

  console.log('Поръчките са нулирани.');

  askLeaveOption();
}

function askLeaveOption() {
  rl.question('Искате ли да напуснете бара?: ', (leaveOption) => {

    // При невалиден инпут да пита отново
    if (!leaveOption.trim() || !isNaN(leaveOption)) {
      console.log('Моля, въведете валидна опция за напускане на бара.');
      askLeaveOption(); 
      return;
    }

    // При съвпадение на инпута с позитивните опции да излиза от програмта след 3 секунди
    else if (positiveOptions.includes(leaveOption.toLowerCase())) {
      console.log('Благодарим Ви, че посетихте бар "In da club"!');
      setTimeout(() => {
        rl.close();
      }, 3000);

    } else {
      placeOrder();
    }
  });
}

// Начало на програмата
placeOrder();
