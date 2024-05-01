<?php

$method = $_SERVER['REQUEST_METHOD'];

//Script Foreach
$c = true;
if ( $method === 'POST' ) {

	$project_name = trim($_POST["project_name"]);
	$admin_email  = trim($_POST["admin_email"]);
	$from_email  = trim($_POST["from_email"]);
	$form_subject = trim($_POST["form_subject"]);

	foreach ( $_POST as $key => $value ) {
		if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "from_email" && $key != "form_subject" && $key != "alert_message" && $key != "captcha"  && $key != "cool"  && $key != "cool_message"  && $key != "bad"  && $key != "bad_message" ) {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
			<td style='padding: 10px; border: #e9e9e9 1px solid; font-size: 16px;'><b>$key</b></td>
			<td style='padding: 10px; border: #e9e9e9 1px solid; font-size: 16px;'>$value</td>
		</tr>
		";
		}
	}
} else if ( $method === 'GET' ) {

	$project_name = trim($_GET["project_name"]);
	$admin_email  = trim($_GET["admin_email"]);
	$from_email  = trim($_GET["from_email"]);
	$form_subject = trim($_GET["form_subject"]);

	foreach ( $_GET as $key => $value ) {
		if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "from_email" && $key != "form_subject"  && $key != "captcha"  && $key != "сool"  && $key != "сool_message"  && $key != "bad"  && $key != "bad_message" ) {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
			<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
			<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
		</tr>
		";
		}
	}
}

function get_ip()
{
	if (!empty($_SERVER['HTTP_CLIENT_IP']))
	{
		$ip=$_SERVER['HTTP_CLIENT_IP'];
	}
	elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
	{
		$ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
	}
	else
	{
		$ip=$_SERVER['REMOTE_ADDR'];
	}
	return $ip;
}

$ip = get_ip();

$message = "<table style='width: 100%;'>$message</table><p>IP: $ip</p>";

function adopt($text) {
	return '=?UTF-8?B?'.base64_encode($text).'?=';
}

$headers = "MIME-Version: 1.0" . PHP_EOL .
	"Content-Type: text/html; charset=utf-8" . PHP_EOL .
//	'From: '.adopt($project_name).' <'."admin@site.ua".'>' . PHP_EOL;
	'From: '.adopt($project_name).' <'.$from_email.'>' . PHP_EOL;

mail($admin_email, adopt($form_subject), $message, $headers );

return json_encode(['response'=>'Response!']);
