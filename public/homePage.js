`use strict`

// Выход из личного кабинета.

const logout = new LogoutButton();
logout.action = () => ApiConnector.logout(response => {
  if (response.success) location.reload();
})

// Получение информации о пользователе

ApiConnector.current(response => {
  return ProfileWidget.showProfile(response.data);
});

// Получение текущих курсов валюты

const board = new RatesBoard();

function getStocks() {
  ApiConnector.getStocks(response => {
    if (response.success) {
      board.clearTable();
      board.fillTable(response.data);
    }
  })
}

getStocks();
const intervalStocks = setInterval (getStocks, 60000);

// Операции с деньгами

const money = new MoneyManager();

//  Пополнение баланса

money.addMoneyCallback = data => {
  // data = {currency, amount}
  ApiConnector.addMoney(data, response => {
    if (response.success) {
      money.setMessage(true, `Вы успешно пополнили баланс на ${data.amount} ${data.currency}`);
      ProfileWidget.showProfile(response.data);
    } else {
      money.setMessage(false, `Невозможно совершить действие, проверьте корректность введеных данных`);
    }
  })
}

// Конвертация валюты

money.conversionMoneyCallback = data => {
  // data = {fromCurrency, targetCurrency, fromAmount}
  ApiConnector.convertMoney(data, response => {
    if (response.success) {
      money.setMessage(true, `Вы успешно конвертировали ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`);
      ProfileWidget.showProfile(response.data);
    } else {
      money.setMessage(false, `Невозможно совершить действие, проверьте корректность введеных данных`);
    }
  })
}

/* Реализуйте перевод валюты:
1. Запишите в свойство sendMoneyCallback функцию, которая будет выполнять запрос.
2. Внутри функции выполните запрос на пополнение баланса (transferMoney).
4. Используйте аргумент функции свойства sendMoneyCallback для передачи данных в запрос.
5. Повторите пункты 2.4-2.7 */

money.sendMoneyCallback = data => {
  // data = { to, currency, amount }
  ApiConnector.transferMoney(data, response => {
    if (response.success) {
      money.setMessage(true, `Вы успешно перевели ${data.to} ${data.amount} ${data.currency}`);
      ProfileWidget.showProfile(response.data);
    } else {
      money.setMessage(false, `Невозможно совершить действие, проверьте корректность введеных данных`);
    }
  })
}

// Работа с избранным

const favorites = new FavoritesWidget();

/* ==Запросите начальный список избранного:==
1.Выполните запрос на получение списка избранного (getFavorites).
2.В колбеке запроса проверяйте успешность запроса.
3.При успешном запросе очистите текущий список избранного (clearTable).
4.Отрисуйте полученные данные (fillTable).
5.Заполните выпадающий список для перевода денег (updateUsersList).*/

ApiConnector.getFavorites(response => {
  if(response.success) {
    favorites.clearTable();
    favorites.fillTable(response.data);
    money.updateUsersList(response.data);
  }
})

/*==Реализуйте добавления пользователя в список избранных:==
1.Запишите в свойство addUserCallback функцию, которая будет выполнять запрос.
2.Внутри функции выполните запрос на добавление пользователя (addUserToFavorites).
3. Используйте аргумент функции свойства addUserCallback для передачи данных пользователя в запрос.
4.После выполнения запроса выполните проверку успешности запроса.
5.В случае успеха запроса выполните пункты 2.3-2.5
6.Также выведите сообщение об успехе или ошибку (причину неудачного действия) добавлении пользователя в окне отображения сообщения (setMessage).*/

favorites.addUserCallback = data => {
  // data = {id, name}
  ApiConnector.addUserToFavorites (data, response => {
    if(response.success) {
      favorites.setMessage(true, `Пользователь ${data.name} c id = ${data.id} добавлен в список избранных`);
      favorites.clearTable();
      favorites.fillTable(response.data);
      money.updateUsersList(response.data);
    } else {
      favorites.setMessage(false, `Невозможно совершить действие, проверьте корректность введеных данных`);
    }
  })
}

/* ==Реализуйте удаление пользователя из избранного==
1.Запишите в свойство removeUserCallback функцию, которая будет выполнять запрос.
2.Внутри функции выполните запрос на удаление пользователя (removeUserFromFavorites).
3.Используйте аргумент функции свойства removeUserCallback для передачи данных пользователя в запрос.
4.После запроса выполните пункты 3.4-3.7*/

favorites.removeUserCallback = id => {
  ApiConnector.removeUserFromFavorites(id, response => {
    if(response.success) {
      favorites.setMessage(true, `Пользователь c id = ${id} удален из списока избранных`);
      favorites.clearTable();
      favorites.fillTable(response.data);
      money.updateUsersList(response.data);
    } else {
      favorites.setMessage(false, `Невозможно совершить действие, проверьте корректность введеных данных`);
    }
  });
}
