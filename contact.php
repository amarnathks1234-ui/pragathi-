
<?php
if($_SERVER["REQUEST_METHOD"] == "POST"){

    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    $to = "pragathicareer1@gmail.com";
    $subject = "New Contact Message";

    $body = "Name: $name\nEmail: $email\nMessage:\n$message";

    $headers = "From: $email";

    if(mail($to, $subject, $body, $headers)){
        echo "Message Sent Successfully!";
    } else {
        echo "Error sending message.";
    }
}
?>
