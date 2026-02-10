<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();

$arComponentDescription = array(
    "NAME" => GetMessage("MICROPHONE_CUSTOMIZER_NAME"),
    "DESCRIPTION" => GetMessage("MICROPHONE_CUSTOMIZER_DESC"),
    "ICON" => "/images/icon.gif",
    "COMPLEX" => "N",
    "SORT" => 10,
    "PATH" => array(
        "ID" => "Custom",
        "NAME" => GetMessage("MICROPHONE_CUSTOMIZER_SECTION"),
    ),
);
?>
