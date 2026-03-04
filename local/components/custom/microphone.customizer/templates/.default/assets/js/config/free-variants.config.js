// ============================================
// КОНФИГУРАЦИЯ БЕСПЛАТНЫХ ВАРИАНТОВ
// ============================================

export const FREE_VARIANTS = {
    spheres: [
        { label: "Матовый черный", hex: "#2d2d2d", isCustomRal: true, ralCode: "9005" },
        { label: "Классическая латунь", hex: "#D4AF37", isNonRal: true },
        { label: "Сатинированная сталь", hex: "#A1A1A0", isNonRal: true }
    ],
    body: [
        { label: "Матовый черный", hex: "#2d2d2d", isCustomRal: true, ralCode: "9005" },
        { label: "Жемчужно-белый", hex: "#F5F5DC", isCustomRal: true, ralCode: "1013" },
        { label: "Сатинированная сталь", hex: "#A1A1A0", isNonRal: true }
    ],
    logobg: [
        { label: "RAL 9005 Матовый черный", hex: "#131516", ralCode: "9005" },
        { label: "RAL 3001 Сигнальный красный", hex: "#8F1E24", ralCode: "3001" },
        { label: "RAL 3005 Винный красный", hex: "#561E27", ralCode: "3005" },
        { label: "RAL 5017 Ультрамариновый синий", hex: "#0F518A", ralCode: "5017" },
        { label: "RAL 6001 Изумрудный зеленый", hex: "#40693A", ralCode: "6001" },
        { label: "RAL 9010 Чистый белый", hex: "#EFEEE5", ralCode: "9010" }
    ],
    shockmount: [
        { label: "RAL 9010 Чистый белый", hex: "#EFEEE5", ralCode: "9010" },
        { label: "RAL 1013 Жемчужно-белый", hex: "#DFDBC7", ralCode: "1013" },
        { label: "RAL 9005 Матовый черный", hex: "#131516", ralCode: "9005" }
    ],
    shockmountPins: [
        { label: "Полированная латунь", hex: "#D4AF37", isNonRal: true },
        { label: "RAL 9006 Белый алюминий", hex: "#9A9D9D", isCustomRal: true, ralCode: "9006" },
        { label: "RAL 9010 Чистый белый", hex: "#EFEEE5", ralCode: "9010" },
        { label: "RAL 1013 Жемчужно-белый", hex: "#DFDBC7", ralCode: "1013" },
        { label: "RAL 9005 Матовый черный", hex: "#131516", ralCode: "9005" }
    ],
    case: [
        { label: "Матовый черный", hex: "#2d2d2d", isCustomRal: true, ralCode: "9005" },
        { label: "Классическая латунь", hex: "#D4AF37", isNonRal: true },
        { label: "Сатинированная сталь", hex: "#A1A1A0", isNonRal: true }
    ]
};

// ============================================
// УТИЛИТЫ ДЛЯ РАБОТЫ С БЕСПЛАТНЫМИ ВАРИАНТАМИ
// ============================================

export function getAllFreeRalCodes() {
    const codes = new Set();
    Object.values(FREE_VARIANTS).forEach(variants => {
        variants.forEach(v => { if (v.ralCode) codes.add(v.ralCode); });
    });
    return codes;
}

export function isFreeVariant(section, value) {
    const variants = FREE_VARIANTS[section];
    if (!variants) return false;
    
    return variants.some(v => {
        if (v.ralCode) return v.ralCode === value;
        if (v.isNonRal) return value === v.label.toLowerCase().replace(/\s+/g, '-');
        return v.label.toLowerCase().replace(/\s+/g, '-') === value;
    });
}

export function getFreeVariantByValue(section, value) {
    const variants = FREE_VARIANTS[section];
    if (!variants) return null;
    
    return variants.find(v => {
        if (v.ralCode) return v.ralCode === value;
        if (v.isNonRal) return value === v.label.toLowerCase().replace(/\s+/g, '-');
        return v.label.toLowerCase().replace(/\s+/g, '-') === value;
    });
}

export function getFreeVariantPrice(section, value) {
    const variant = getFreeVariantByValue(section, value);
    return variant ? 0 : null; // Бесплатные варианты всегда стоят 0
}
