Играть помжно как при помощи интрефейса так и про помощи термирала:

1 Способ терминал:

1.1 Запускаем серверную часть через команду node game-server.js

1.2 Далее запускаем клиенскую часть, в новом терминале прописываем команду node game-Client 1 100 
Числа в конце это диапазон {"range": "min-max"}, например {"range": "1-100"} 

1.3 Далее указываем загадоное число через команду int число, например int 22
Так же команда int используется для нового преположения сервера просто напишите в терминале снова int число, и сервер выдаст новое преположение 

1.4 так же есть команды more и less
при вводе more добаляется +1 к текущему преположению сервера
при вводе less отнимается -1 от текущего предположения сервера 

2 Способ интрефейс 

2.1 Запускаем серверную часть через команду node game-server.js

2.2 далее в браузере переходим по адресу http://localhost:3000/

2.3 В интерфейсе можем указать наше загаданое число и диапазон

2.4 При нажатии кнопки начать игру сервер делает преположенеи что бы сделать новое преположение ещё раз нажмите на кпоку 

2.5 так же есть кнопки больше меньше
при нажатии кпонки больше добаляется +1 к текущему преположению сервера
при нажатии кпонки меньше отнимается -1 от текущего предположения сервера 
