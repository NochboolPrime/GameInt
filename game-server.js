const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let min, max, targetNumber;

app.use(express.static(__dirname)); // Позволяет обслуживать статические файлы

io.on('connection', (socket) => {
    console.log("Клиент подключен...");

    socket.on('startGame', (range) => {
        min = range.min;
        max = range.max;
        targetNumber = range.targetNumber; // Получаем загаданное число от клиента

        guessNumber(socket);
    });

    socket.on('hint', (hint) => {
        if (hint === "more") {
            min++;
        } else if (hint === "less") {
            max--;
        }
        
        // Проверка на выход за пределы диапазона
        if (min > max) {
            socket.emit('gameResult', { message: "Ошибка! Диапазон недопустим." });
            return;
        }

        guessNumber(socket);
    });
});

function guessNumber(socket) {
    const guess = Math.floor((min + max) / 2);
    
    // Отправка предположения клиенту
    socket.emit('serverGuess', { guess });

    // Проверка на угаданное число
    if (guess === targetNumber) {
        socket.emit('gameResult', { message: `Сервер угадал число ${guess}! Игра окончена.` });
    } else if (min === max) {
        socket.emit('gameResult', { message: `Сервер не смог угадать число. Игра окончена.` });
    }
}

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
