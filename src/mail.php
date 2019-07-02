<?php

$frm_name  = "Youname";
$recepient = "lely.94@mail.ru";
$sitename  = "Armata Financical Group";
$subject   = "Новая заявка с сайта \"$sitename\"";

$name = trim($_POST["persons_name"]);// название класса как в index.html
$phone = trim($_POST["persons_phone"]);
$formname = trim($_POST["formname"]);

$message = "
Форма: $formname <br>
Имя: $name <br>
Телефон: $phone
";

mail($recepient, $subject, $message, "From: $frm_name <$email>" . "\r\n" . "Reply-To: $email" . "\r\n" . "X-Mailer: PHP/" . phpversion() . "\r\n" . "Content-type: text/html; charset=\"utf-8\"");
