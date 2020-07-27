<?php

  // crear las credenciales para la base de datos
  define('DB_USUARIO', 'root');
  define('DB_PASSWORD', 'root');
  define('DB_HOST', 'localhost');
  define('DB_NOMBRE', 'agendaphp');

  //creamos la conexio. mysql quedo en el pasado ahora es mysqli

  $conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE);

//Para comprobar que se esta conectando a la base de datos. 1 se conecto. 0 o nada no esta conectada
 // echo $conn->ping();

