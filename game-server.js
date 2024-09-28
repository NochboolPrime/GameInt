const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let min, max, targetNumber, currentGuess;

app.use(express.static(__dirname)); // Позволяет обслуживать статические файлы

io.on('connection', (socket) => {
    console.log("Клиент подключен...");

    socket.on('startGame', (range) => {
        min = range.min;
        max = range.max;
        targetNumber = range.targetNumber; // Получаем загаданное число от клиента
        currentGuess = Math.floor(Math.random() * (max - min + 1)) + min; // Первоначальное предположение

        guessNumber(socket);
    });

    socket.on('hint', (hint) => {
        // Увеличиваем или уменьшаем текущее предположение
        if (hint === "more") {
            currentGuess++; // Увеличиваем текущее предположение на 1
        } else if (hint === "less") {
            currentGuess--; // Уменьшаем текущее предположение на 1
        }
        
        // Проверка на выход за пределы диапазона
        if (currentGuess < min || currentGuess > max) {
            socket.emit('gameResult', { message: "Ошибка! Предположение вне диапазона." });
            return;
        }

        guessNumber(socket);
    });
});

function guessNumber(socket) {
    // Отправка текущего предположения клиенту
    socket.emit('serverGuess', { guess: currentGuess });

    // Проверка на угаданное число
    if (currentGuess === targetNumber) {
        socket.emit('gameResult', { message: `Сервер угадал число ${currentGuess}! Игра окончена.` });
    }
}

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
