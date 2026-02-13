<!-- < ? ini_set('display_errors', 1); error_reporting(E_ALL); ? > -->
<!DOCTYPE html>
<html lang="ru">
<head>
	<?include_once($_SERVER["DOCUMENT_ROOT"]."/local/templates/.default/include/head.php");?>	
</head> 
<body>
	<?$APPLICATION->ShowPanel();?>
	<?include_once($_SERVER["DOCUMENT_ROOT"]."/local/templates/.default/include/header.php");?>
	
<?global $USER;
if ($USER->IsAdmin()):
 $APPLICATION->IncludeComponent(
    "custom:microphone.customizer",
    "",
    Array(
        "IBLOCK_ID" => 0,
        "ELEMENT_ID" => 0,
        "PROPERTY_CODE" => "CUSTOM_CONFIG"
    )
);

else:
    echo "Доступ запрещен";
endif;
?>


