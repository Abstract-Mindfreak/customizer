<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Loader;
use Bitrix\Main\Localization\Loc;

class MicrophoneCustomizerComponent extends CBitrixComponent
{
    public function onPrepareComponentParams($arParams)
    {
        $arParams["IBLOCK_ID"] = (int)$arParams["IBLOCK_ID"];
        $arParams["ELEMENT_ID"] = (int)$arParams["ELEMENT_ID"];
        if (empty($arParams["PROPERTY_CODE"])) {
            $arParams["PROPERTY_CODE"] = "CUSTOM_CONFIG";
        }
        return $arParams;
    }

    public function executeComponent()
    {
        try {
            if (!Loader::includeModule("iblock")) {
                throw new Exception("Module iblock not found");
            }

            if ($this->arParams["ELEMENT_ID"] > 0) {
                $this->arResult["ELEMENT"] = $this->getElement($this->arParams["ELEMENT_ID"]);
            }

            $this->includeComponentTemplate();
        } catch (Exception $e) {
            ShowError($e->getMessage());
        }
    }

    protected function getElement($elementId)
    {
        $res = CIBlockElement::GetList(
            [],
            ["IBLOCK_ID" => $this->arParams["IBLOCK_ID"], "ID" => $elementId],
            false,
            false,
            ["ID", "IBLOCK_ID", "NAME", "PROPERTY_" . $this->arParams["PROPERTY_CODE"]]
        );

        if ($ob = $res->GetNextElement()) {
            $arFields = $ob->GetFields();
            $arFields["CUSTOM_CONFIG"] = $arFields["PROPERTY_" . $this->arParams["PROPERTY_CODE"] . "_VALUE"];
            return $arFields;
        }

        return null;
    }
}
