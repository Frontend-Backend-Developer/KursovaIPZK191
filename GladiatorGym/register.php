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
    <link rel="stylesheet" href="style_1.css">
</head>
<body>

    <form action="vendor/signup.php" method="post">
     <h2  class="sub-tt2 pt-3" >Регистрация</h2>
        <div class="line"></div><br>
        <label>ФИО</label>
        <input type="text" name="full_name" placeholder="Введите свое полное имя">
        <label>Логин</label>
        <input type="text" name="login" placeholder="Введите свой логин" required>
        <label>Почта</label>
        <input type="email" name="email" placeholder="Введите адрес своей почты" required>
        <label>Пароль</label>
        <input type="password" name="password" placeholder="Введите пароль" required>
        <label>Подтверждение пароля</label>
        <input type="password" name="password_confirm" placeholder="Подтвердите пароль" required>
        <button type="submit">Войти</button>
        <p>
            <a href="/">Авторизируйтесь!</a>
        </p>
        <?php
            if ($_SESSION['message']) {
                echo '<p class="msg"> ' . $_SESSION['message'] . ' </p>';
            }
            unset($_SESSION['message']);
        ?>
    </form>

</body>
</html>