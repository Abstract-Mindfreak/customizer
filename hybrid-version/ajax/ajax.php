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
    // Проверяем, не является ли это автономным режимом
    $request = Context::getCurrent()->getRequest();
    $element_id = (int)$request->getPost("element_id");
    if ($element_id !== 0) {
        echo Json::encode(["error" => "Session expired"]);
        die();
    }
}

if (!$USER->IsAuthorized()) {
    // Проверяем, не является ли это автономным режимом
    $element_id = (int)$request->getPost("element_id");
    if ($element_id !== 0) {
        echo Json::encode(["error" => "Authorization required"]);
        die();
    }
}

$request = Context::getCurrent()->getRequest();
$action = $request->getPost("action");
$elementId = (int)$request->getPost("elementId");
$element_id = (int)$request->getPost("element_id"); // для loadConfig

if (!Loader::includeModule("iblock")) {
    echo Json::encode(["error" => "Iblock module not found"]);
    die();
}

// Для автономного режима (element_id = 0) пропускаем проверку прав
if ($elementId > 0 || $element_id > 0) {
    $actualElementId = $elementId > 0 ? $elementId : $element_id;

    // Check if user has permission to edit the element
    $res = CIBlockElement::GetByID($actualElementId);
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
}

switch ($action) {
    case "save":
        $config = $request->getPost("config");
        if (!$elementId || !$config) {
            echo Json::encode(["error" => "Invalid data"]);
            break;
        }

        // В автономном режиме сохранение не поддерживается
        if ($elementId === 0) {
            echo Json::encode(["error" => "Save not available in standalone mode"]);
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

    case "loadConfig":
        // Поддержка автономного режима
        if ($element_id === 0) {
            // В автономном режиме возвращаем пустую конфигурацию
            echo Json::encode([
                "success" => true,
                "config" => null
            ]);
        } else {
            // Загрузка конфигурации товара
            $dbRes = CIBlockElement::GetProperty(
                $arElement["IBLOCK_ID"],
                $element_id,
                [],
                ["CODE" => "CUSTOM_CONFIG"]
            );
            if ($ob = $dbRes->Fetch()) {
                $config = $ob["VALUE"] ? json_decode($ob["VALUE"], true) : null;
                echo Json::encode([
                    "success" => true,
                    "config" => $config
                ]);
            } else {
                echo Json::encode([
                    "success" => true,
                    "config" => null
                ]);
            }
        }
        break;

    case "createOrder":
        // Создание заявки в инфоблоке №16
        try {
            if (!Loader::includeModule("iblock")) {
                throw new Exception("Iblock module not found");
            }

            // Подготовка полей элемента
            $arFields = Array(
                "IBLOCK_ID" => 16,
                "NAME" => "Заявка " . ($request->getPost("MIC_MODEL") ?: "Не указано") . " от " . ($request->getPost("NAME") ?: "Не указано"),
                "ACTIVE" => "Y",
                "PROPERTY_VALUES" => Array()
            );

            // Личные данные
            $arFields["PROPERTY_VALUES"]["USER"] = $request->getPost("USER");
            $arFields["PROPERTY_VALUES"]["NAME"] = $request->getPost("NAME");
            $arFields["PROPERTY_VALUES"]["LAST_NAME"] = $request->getPost("LAST_NAME");
            $arFields["PROPERTY_VALUES"]["CITY"] = $request->getPost("CITY");
            $arFields["PROPERTY_VALUES"]["COUNTRY"] = $request->getPost("COUNTRY");
            $arFields["PROPERTY_VALUES"]["EMAIL"] = $request->getPost("EMAIL");
            $arFields["PROPERTY_VALUES"]["PHONE"] = $request->getPost("PHONE");
            $arFields["PROPERTY_VALUES"]["COMMENT"] = $request->getPost("COMMENT");

            // Микрофон
            $arFields["PROPERTY_VALUES"]["MIC_MODEL"] = $request->getPost("MIC_MODEL");
            $arFields["PROPERTY_VALUES"]["MIC_SPHERES"] = $request->getPost("MIC_SPHERES");
            $arFields["PROPERTY_VALUES"]["MIC_BODY"] = $request->getPost("MIC_BODY");
            $arFields["PROPERTY_VALUES"]["MIC_LOGO_TYPE"] = $request->getPost("MIC_LOGO_TYPE");
            $arFields["PROPERTY_VALUES"]["MIC_LOGO_BG"] = $request->getPost("MIC_LOGO_BG");

            // Кейс параметры
            $arFields["PROPERTY_VALUES"]["WOODCASE_IMAGE_DESK"] = $request->getPost("WOODCASE_IMAGE_DESK");

            // Подвес
            $arFields["PROPERTY_VALUES"]["SHOCKMOUNT_COLOR"] = $request->getPost("SHOCKMOUNT_COLOR");
            $arFields["PROPERTY_VALUES"]["SHOCKMOUNT_PINS"] = $request->getPost("SHOCKMOUNT_PINS");

            // Финансы
            $arFields["PROPERTY_VALUES"]["PRICE"] = $request->getPost("PRICE");

            // Обработка файлов
            if (!empty($_FILES)) {
                foreach ($_FILES as $code => $file) {
                    if ($file["error"] == 0) {
                        $arFields["PROPERTY_VALUES"][$code] = $file;
                    }
                }
            }

            // Создание элемента
            $obElement = new CIBlockElement();
            $elementId = $obElement->Add($arFields, false, true, true);

            if ($elementId > 0) {
                echo Json::encode([
                    "success" => true,
                    "orderId" => $elementId,
                    "message" => "Заявка успешно создана"
                ]);
            } else {
                echo Json::encode([
                    "success" => false,
                    "error" => "Ошибка при создании заявки: " . $obElement->LAST_ERROR
                ]);
            }

        } catch (Exception $e) {
            echo Json::encode([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
        break;

    default:
        echo Json::encode(["error" => "Unknown action"]);
        break;
}

require_once($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/epilog_after.php");
