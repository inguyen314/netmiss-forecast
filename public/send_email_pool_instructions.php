<?php
require_once "/wm/mvs/wm_web/var/apache2/2.4/htdocs/web_apps/sendmail_summary/private/initialize.php";

$db = db_connect($db_host, $db_port, $db_service_name, $db_user, $db_pass);

require 'modules/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require 'modules/vendor/phpmailer/phpmailer/src/SMTP.php';
require 'modules/vendor/phpmailer/phpmailer/src/Exception.php'; // Include the Exception file

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception; // Add the Exception namespace


// Check if the table HTML is received
if (isset($_POST['tableHTMLPool'])) {
    // Get the table HTML from the POST request
    $tableHTMLPool = $_POST['tableHTMLPool'];

    $mail = new PHPMailer(true); // Pass true to enable exceptions
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host = 'gw2.usace.army.mil';
    $mail->Port = 25;
    // $mail->SMTPAuth = true;
    // $mail->Username = '';
    // $mail->Password = '';

    // Get today's date
    $todayDate = date('l, F j, Y');

    $paragraphHTMLForecastDate = '<p>Forecast Date: ' . $todayDate . '</p>';

    $paragraphHTMLQPF = 'Links of Interest:    http://www.wpc.ncep.noaa.gov/qpf/24hrqpfall.html, http://images.intellicast.com/WxImages/CurrentWinds/stl.jpg';


    $mail->setFrom('noreply@usace.army.mil', 'noreply@usace.army.mil');
    $mail->addAddress('ivan.h.nguyen@usace.army.mil', 'Ivan');
    $mail->addAddress('chn262@gmail.com', 'Ivan Personal');
    // $mail->addAddress('liam.wallace@usace.army.mil', 'Liam'); 
    // $mail->addAddress('davor.karic@usace.army.mil', 'Davor'); 
    // $mail->addAddress('rob.n.holmquist@usace.army.mil', 'Rob'); 
    // $mail->addAddress('timothy.j.lauth@usace.army.mil', 'Tim'); 
    // $mail->addAddress('allen.phillips@usace.army.mil', 'Allen'); 
    // $mail->addAddress('jmstemler22@gmail.com', 'Joan Personal');
    // $mail->addAddress('Lcmwallace@gmail.com', 'Liam Personal');
    $mail->isHTML(true);
    //$mail->ContentType = 'text/html'; // Set content type to HTML
    $mail->ContentType = 'text/html; charset=UTF-8';
    $mail->CharSet = 'UTF-8'; // Set character set
    $mail->Subject = 'MVS Internal River Forecast';
    $paragraphHTML = '<p>Note - Additional instructions may be issued as conditions change and will be issued via phone.  If there are any questions, please call the water control office at (314)331-8342 and ask for Joan, Davor, Liam, or Rob.  If there is no answer or for after-hours, below are the water managers duty cell phones.Joan: (314)630-6292, Davor: (314)675-8193, Liam: (314)857-8393, Rob: (314)928-7722</p>';
    $mail->Body    = $paragraphHTMLForecastDate . $paragraphHTMLQPF . $paragraphHTML . $tableHTMLPool;
    $mail->AltBody = 'This is the plain text version of the email'; // Add plain text alternative
    // $mail->Body = '<p>Hello, this is a test email.</p>';
    // $mail->AltBody = 'This is the plain text version of the email';
    // $mail->addAttachment('path/to/file.txt');

    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );

    // Send email
    if ($mail->send()) {
        echo 'Email sent successfully';
    } else {
        echo 'Error: ' . $mail->ErrorInfo;
    }
} else {
    // If table HTML is not received, return an error
    echo 'Error: Table HTML not received';
}
db_disconnect($db);
