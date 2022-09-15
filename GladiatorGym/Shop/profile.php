<?php
session_start();
if (!$_SESSION['user']) {
    header('Location: /');
}
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Shop</title>
    <link rel="stylesheet" href="main.css">
    <link rel="stylesheet" href="style_1.css">
</head>
<body>

    <form>
        <h2  class="sub-tt2 pt-3" >Покупка прошла успешно!</h2>
        <div class="line"></div><br><br>
        <h2 style="margin: 10px 0;"><?= $_SESSION['user']['full_name'] ?></h2>
        <a href="#"><?= $_SESSION['user']['email'] ?></a><br>
        <a href="../index.html" class="logout"><em><u>На главную страницу сайта!</u></em></a>
    </form>

</body>
</html>