<?php
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");

header('Content-Type: application/json; charset=utf-8');

$action = $_POST['action'] ?? '';

try {
    if ($action === 'createOrder') {
        $result = createOrder($_POST, $_FILES);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    } else {
        throw new Exception('Unknown action');
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

function createOrder($post, $files) {
    global $USER;

    // Authorization check
    if (!$USER->IsAuthorized()) {
        throw new Exception('User not authorized');
    }

    // Data validation
    $required = ['LAST_NAME', 'NAME', 'EMAIL', 'PHONE', 'MIC_MODEL'];
    foreach ($required as $field) {
        if (empty($post[$field])) {
            throw new Exception("Field {$field} is required");
        }
    }

    // Process files
    $fileIds = processFiles($files);

    // Get infoblock ID from settings
    $iblockId = COption::GetOptionString('custom', 'microphone_orders_iblock_id');
    if (!$iblockId) {
        throw new Exception('Orders infoblock not configured');
    }

    // Infoblock data
    $arFields = [
        'IBLOCK_ID' => $iblockId,
        'NAME' => 'Order #' . date('Y-m-d H:i:s'),
        'ACTIVE' => 'Y',
        'PROPERTY_VALUES' => [
            'LAST_NAME' => $post['LAST_NAME'],
            'NAME' => $post['NAME'],
            'CITY' => $post['CITY'] ?? '',
            'COUNTRY' => $post['COUNTRY'] ?? '',
            'EMAIL' => $post['EMAIL'],
            'PHONE' => $post['PHONE'],
            'COMMENT' => $post['COMMENT'] ?? '',
            'MIC_MODEL' => $post['MIC_MODEL'],
            'MIC_SPHERES' => $post['MIC_SPHERES'] ?? '',
            'MIC_BODY' => $post['MIC_BODY'] ?? '',
            'MIC_LOGO_TYPE' => $post['MIC_LOGO_TYPE'] ?? '',
            'MIC_LOGO_BG' => $post['MIC_LOGO_BG'] ?? '',
            'SHOCKMOUNT_ENABLED' => $post['SHOCKMOUNT_ENABLED'] ?? 'N',
            'SHOCKMOUNT_COLOR' => $post['SHOCKMOUNT_COLOR'] ?? '',
            'SHOCKMOUNT_PINS' => $post['SHOCKMOUNT_PINS'] ?? '',
            'WOODCASE_VARIANT' => $post['WOODCASE_VARIANT'] ?? '',
            'WOODCASE_IMAGE_DESK' => $post['WOODCASE_IMAGE_DESK'] ?? '',
            'PRICE' => $post['PRICE'] ?? '',
        ]
    ];

    // Add files to properties (if properties exist)
    if (!empty($fileIds['WOODCASE_IMAGE'])) {
        $arFields['PROPERTY_VALUES']['WOODCASE_IMAGE'] = $fileIds['WOODCASE_IMAGE'];
    }

    if (!empty($fileIds['PREVIEW_MIC_CUSTOM'])) {
        $arFields['PROPERTY_VALUES']['PREVIEW_MIC_CUSTOM'] = $fileIds['PREVIEW_MIC_CUSTOM'];
    }

    // Create element
    $el = new CIBlockElement();
    $elementId = $el->Add($arFields);

    if (!$elementId) {
        throw new Exception($el->LAST_ERROR);
    }

    return [
        'success' => true,
        'orderId' => $elementId,
        'message' => 'Order created successfully',
        'files' => $fileIds
    ];
}

function processFiles($files) {
    $result = [];
    $allowedExtensions = ['svg', 'png', 'jpg', 'jpeg', 'webp'];

    // Process woodcase logo
    if (isset($files['WOODCASE_IMAGE']) && $files['WOODCASE_IMAGE']['error'] === UPLOAD_ERR_OK) {
        $fileInfo = $files['WOODCASE_IMAGE'];
        $extension = strtolower(pathinfo($fileInfo['name'], PATHINFO_EXTENSION));

        if (in_array($extension, $allowedExtensions)) {
            $fileArray = [
                'name' => $fileInfo['name'],
                'size' => $fileInfo['size'],
                'tmp_name' => $fileInfo['tmp_name'],
                'type' => $fileInfo['type'],
                'error' => $fileInfo['error']
            ];

            $fileId = CFile::SaveFile($fileArray, 'customizer_orders');
            if ($fileId) {
                $result['WOODCASE_IMAGE'] = $fileId;
            }
        }
    }

    // Process microphone preview
    if (isset($files['PREVIEW_MIC_CUSTOM']) && $files['PREVIEW_MIC_CUSTOM']['error'] === UPLOAD_ERR_OK) {
        $fileInfo = $files['PREVIEW_MIC_CUSTOM'];
        $extension = strtolower(pathinfo($fileInfo['name'], PATHINFO_EXTENSION));

        if (in_array($extension, $allowedExtensions)) {
            $fileArray = [
                'name' => $fileInfo['name'],
                'size' => $fileInfo['size'],
                'tmp_name' => $fileInfo['tmp_name'],
                'type' => $fileInfo['type'],
                'error' => $fileInfo['error']
            ];

            $fileId = CFile::SaveFile($fileArray, 'customizer_orders');
            if ($fileId) {
                $result['PREVIEW_MIC_CUSTOM'] = $fileId;
            }
        }
    }

    return $result;
}
?>
