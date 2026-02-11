<!DOCTYPE html>
<html lang="ru">
<head>
	<?include_once($_SERVER["DOCUMENT_ROOT"]."/local/templates/.default/include/head.php");?>	
</head> 
<body>
	<?$APPLICATION->ShowPanel();?>
	<?include_once($_SERVER["DOCUMENT_ROOT"]."/local/templates/.default/include/header.php");?>
	  
<?
// Проверка на админа, чтобы никто другой не видел
global $USER;
if ($USER->IsAdmin()):

 <?$APPLICATION->IncludeComponent(
    "custom:microphone.customizer",
    "",
    Array(
        "IBLOCK_ID" => 0,        // 0 для автономного режима
        "ELEMENT_ID" => 0,       // 0 для автономного режима
        "PROPERTY_CODE" => "CUSTOM_CONFIG"
    )
);

else:
    echo "Доступ запрещен";
endif;
?>


