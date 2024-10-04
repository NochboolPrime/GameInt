const io = require('socket.io-client');
const readline = require('readline');

// Создаем интерфейс для чтения ввода из терминала
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Устанавливаем соединение с сервером
const socket = io.connect('http://127.0.0.1:3000');

let min, max, targetNumber;

// Функция для начала игры
function startGame() {
    if (min !== undefined && max !== undefined && targetNumber !== undefined) {
        socket.emit('startGame', { min, max, targetNumber });
    } else {
        console.log("Пожалуйста, задайте диапазон и загаданное число.");
    }
}

// Обработка входящих данных от сервера
socket.on('serverGuess', (data) => {
    console.log(`Сервер предполагает: ${data.guess}`);
});

socket.on('gameResult', (data) => {
    console.log(data.message);
});

// Обработка ввода пользователя для настройки игры
rl.on('line', (input) => {
    const args = input.split(' ');

    if (args[0] === 'int') {
        // Устанавливаем загаданное число
        targetNumber = parseInt(args[1]);
        console.log(`Загаданное число установлено: ${targetNumber}`);
        startGame();
    } else if (args.length === 2) {
        // Устанавливаем диапазон
        min = parseInt(args[0]);
        max = parseInt(args[1]);
        console.log(`Диапазон установлен: от ${min} до ${max}`);
        startGame();
    } else {
        console.log("Неверная команда. Используйте 'int <число>' или '<min> <max>' для задания диапазона.");
    }
});

// Запрос подсказки у пользователя
rl.on('line', (input) => {
    if (input === 'more' || input === 'less') {
        socket.emit('hint', input);
    }
});

// Обработка события закрытия соединения
socket.on('disconnect', () => {
    console.log('Соединение закрыто');
});
