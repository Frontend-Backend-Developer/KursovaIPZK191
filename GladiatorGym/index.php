<?php
session_start();

if ($_SESSION['user']) {
    header('Location: profile.php');
}

?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Авторизация и регистрация</title>
    <link rel="stylesheet" href="main.css">
    <link rel="stylesheet" href="style_2.css">
</head>
<body>

    <form action="vendor/signin.php" method="post">
    <h2  class="sub-tt2 pt-3" >ВХОД</h2>
    <div class="line"></div><br><br>
        <label>Логин</label>
        <input type="text" name="login" placeholder="Введите свой логин" required>
        <label>Пароль</label>
        <input type="password" name="password" placeholder="Введите пароль" required>
        <button type="submit">Войти</button>
        <p>
           <a href="/register.php">Зарегистрируйтесь!</a>
        </p>
    </form>

</body>
</html>