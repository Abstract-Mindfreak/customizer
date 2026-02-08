<?php
define("NO_KEEP_STATISTIC", true);
define("NOT_CHECK_PERMISSIONS", true);
require_once($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");

use Bitrix\Main\Loader;
use Bitrix\Main\Context;
use Bitrix\Main\Web\Json;

header('Content-Type: application/json');

global $USER;

if (!check_bitrix_sessid()) {
    echo Json::encode(["error" => "Session expired"]);
    die();
}

if (!$USER->IsAuthorized()) {
    echo Json::encode(["error" => "Authorization required"]);
    die();
}

$request = Context::getCurrent()->getRequest();
$action = $request->getPost("action");
$elementId = (int)$request->getPost("elementId");

if (!Loader::includeModule("iblock")) {
    echo Json::encode(["error" => "Iblock module not found"]);
    die();
}

// Check if user has permission to edit the element
// This is a basic check; real-world apps might need more granular rights
$res = CIBlockElement::GetByID($elementId);
if ($arElement = $res->GetNext()) {
    // Check if user has edit rights on the iblock
    $permission = CIBlock::GetPermission($arElement["IBLOCK_ID"]);
    if ($permission < "W") { // W = Write
        echo Json::encode(["error" => "Access denied"]);
        die();
    }
} else {
    echo Json::encode(["error" => "Element not found"]);
    die();
}

switch ($action) {
    case "save":
        $config = $request->getPost("config");
        if (!$elementId || !$config) {
            echo Json::encode(["error" => "Invalid data"]);
            break;
        }

        // Validate configuration format
        $decodedConfig = json_decode($config, true);
        if (!$decodedConfig) {
            echo Json::encode(["error" => "Invalid JSON configuration"]);
            break;
        }

        $el = new CIBlockElement;
        $res = $el->SetPropertyValuesEx($elementId, false, [
            "CUSTOM_CONFIG" => $config
        ]);

        echo Json::encode(["success" => true]);
        break;

    case "load":
        if (!$elementId) {
            echo Json::encode(["error" => "Invalid element ID"]);
            break;
        }

        $dbRes = CIBlockElement::GetProperty(
            $arElement["IBLOCK_ID"],
            $elementId,
            [],
            ["CODE" => "CUSTOM_CONFIG"]
        );
        if ($ob = $dbRes->Fetch()) {
            echo Json::encode(["success" => true, "config" => $ob["VALUE"]]);
        } else {
            echo Json::encode(["error" => "Config not found"]);
        }
        break;

    default:
        echo Json::encode(["error" => "Unknown action"]);
        break;
}

require_once($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/epilog_after.php");
