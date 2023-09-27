<?php
// PHP не умет работать с JSON по этому немного модернизируем наш код всё что приходит от клиента мы декодируем из JSON в PHP
$_POST = json_decode(file_get_contents("php://input"),  true);
echo var_dump($_POST);