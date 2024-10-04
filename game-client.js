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

// Получаем диапазон из аргументов командной строки
const args = process.argv.slice(2); // Получаем аргументы командной строки

if (args.length === 2) {
    min = parseInt(args[0]);
    max = parseInt(args[1]);
    console.log(`Диапазон установлен: от ${min} до ${max}`);
} else {
    console.log("Пожалуйста, укажите диапазон в формате: node game-client.js <min> <max>");
    process.exit(1); // Завершение работы скрипта с ошибкой
}

// Функция для начала игры
function startGame() {
    if (min !== undefined && max !== undefined && targetNumber !== undefined) {
        socket.emit('startGame', { min, max, targetNumber });
    } else {
        console.log("Пожалуйста, задайте загаданное число.");
    }
}

// Обработка входящих данных от сервера
socket.on('serverGuess', (data) => {
    console.log(`Сервер предполагает: ${data.guess}`);
});

// Обработка результата игры
socket.on('gameResult', (data) => {
    console.log(data.message);
});

// Обработка ввода пользователя для задания загаданного числа
rl.on('line', (input) => {
    const args = input.split(' ');

    if (args[0] === 'int') {
        // Устанавливаем загаданное число
        targetNumber = parseInt(args[1]);
        console.log(`Загаданное число установлено: ${targetNumber}`);
        startGame();
    } else if (input === 'more' || input === 'less') {
        socket.emit('hint', input);
    } else {
        console.log("Неверная команда. Используйте 'int <число>' для задания загаданного числа.");
    }
});

// Обработка события закрытия соединения
socket.on('disconnect', () => {
    console.log('Соединение закрыто');
});
