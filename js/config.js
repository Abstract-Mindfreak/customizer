export const CONFIG = {
    basePrice: 129990,
    optionPrice: 1500,
    scaleFactor: 0.8584,
    shockmountPrice: 10000,
    pxPerMm: 3.2909
    // cases: {
    //     '017-tube': {
    //         image: 'https://i.imgur.com/5wV54OG.png',
    //         clipPath: 'M0 0C710.035 0 1103.97 8.48338 1814 8.48338L1811.99 947.644L22.5809 1021L0 0Z',
    //         corners: [
    //             { x: 163.6, y: 201.4 },  // TL
    //             { x: 1069.9, y: 256.8 }, // TR
    //             { x: 1069.9, y: 1176.9 },// BR
    //             { x: 163.6, y: 1252.2 }  // BL
    //         ],
    //         width: 1810,
    //         height: 938,
    //         realWidth: 550,
    //         realHeight: 285
    //     },
    //     '017-fet': {
    //         image: 'https://i.imgur.com/I4kOALU.png',
    //         clipPath: 'M0.999283 0L0 787L670.519 734.768L675 33.5854L0.999283 0Z',
    //         corners: [
    //             { x: 163.6, y: 201.4 },  // TL
    //             { x: 1069.9, y: 256.8 }, // TR
    //             { x: 1069.9, y: 1176.9 },// BR
    //             { x: 163.6, y: 1252.2 }  // BL
    //         ],
    //         width: 935,
    //         height: 889,
    //         realWidth: 284,
    //         realHeight: 270
    //     },
    //     '023-dlx': {
    //         image: 'https://i.imgur.com/gErOPnd.png',
    //         clipPath: 'M0 19L5 772.5L377 787L370.5 0L0 19Z',
    //         corners: [
    //             { x: 163.6, y: 201.4 },  // TL
    //             { x: 1069.9, y: 256.8 }, // TR
    //             { x: 1069.9, y: 1176.9 },// BR
    //             { x: 163.6, y: 1252.2 }  // BL
    //         ],
    //         width: 842,
    //         height: 783,
    //         realWidth: 256,
    //         realHeight: 238
    //     },
    //     '023-the-bomblet': {
    //         image: 'https://i.imgur.com/VUnnOg7.png',
    //         clipPath: 'M0 0L457 0L457 787L0 787Z',
    //         corners: [
    //             { x: 163.6, y: 201.4 },  // TL
    //             { x: 1069.9, y: 256.8 }, // TR
    //             { x: 1069.9, y: 1176.9 },// BR
    //             { x: 163.6, y: 1252.2 }  // BL
    //         ],
    //         width: 457,
    //         height: 787,
    //         realWidth: 139,
    //         realHeight: 239
    //     }
    // }
};

export const MALFA_SILVER_RAL = '9006'; // White Aluminium
export const MALFA_GOLD_RAL = '1036'; // Pearl Gold

export const FREE_LOGO_RALS = ['9005', '3001', '3005', '5017', '6001', '9010', MALFA_SILVER_RAL, MALFA_GOLD_RAL];
export const FREE_SHOCKMOUNT_BODY_RALS = ['1013', '9010', '9005'];
export const FREE_SHOCKMOUNT_PINS_RALS = ['1013', '9010', '9005'];
export const RAL_PALETTE = {
  "1000": "#C5BB8A", "1001": "#C6B286", "1002": "#C7AE72", "1003": "#E6B019",
  "1004": "#D2A40E", "1005": "#BC9611", "1006": "#CF9804", "1007": "#D49300",
  "1011": "#A38454", "1012": "#CFB539", "1013": "#DFDBC7", "1014": "#D4C79C",
  "1015": "#DED3B6", "1016": "#E8E253", "1017": "#E4AF56", "1018": "#EBD346",
  "1019": "#9C917B", "1020": "#999167", "1021": "#E5C000", "1023": "#E6BE05",
  "1024": "#AD9451", "1026": "#FFFF00", "1027": "#998420", "1028": "#F2A500",
  "1032": "#CFA81E", "1033": "#E4A02D", "1034": "#D9A156", "1035": "#898271",
  "1036": "#746341", "1037": "#DB9A17",
  
  "2000": "#C7750F", "2001": "#A74D23", "2002": "#AC3721", "2003": "#E17C30",
  "2004": "#CC5608", "2005": "#FF4612", "2007": "#FFAD19", "2008": "#D66C21",
  "2009": "#C9560D", "2010": "#BC602D", "2011": "#CF7421", "2012": "#C2674F",
  "2013": "#954527", "2017": "#FA4402",
  
  "3000": "#962A27", "3001": "#8F1E24", "3002": "#8D1F24", "3003": "#7C0D24",
  "3004": "#651927", "3005": "#561E27", "3007": "#3D2326", "3009": "#643730",
  "3011": "#6E2124", "3012": "#B7856E", "3013": "#8A2F28", "3014": "#BC6F72",
  "3015": "#CC9EA4", "3016": "#963D2F", "3017": "#B9535B", "3018": "#B63C49",
  "3020": "#AB1519", "3022": "#BE6954", "3024": "#EE1729", "3026": "#F71027",
  "3027": "#9E1B3C", "3028": "#B92726", "3031": "#973238", "3032": "#661925",
  "3033": "#94352D",
  
  "4001": "#7C5B80", "4002": "#823A4B", "4003": "#B65A88", "4004": "#5F1837",
  "4005": "#746395", "4006": "#852E6F", "4007": "#44263C", "4008": "#7C477D",
  "4009": "#95838F", "4010": "#AC3B71", "4011": "#685C80", "4012": "#67657A",
  
  "5000": "#35496B", "5001": "#294763", "5002": "#193278", "5003": "#203151",
  "5004": "#1E222C", "5005": "#134A85", "5007": "#466589", "5008": "#2F3A44",
  "5009": "#215F78", "5010": "#0E457A", "5011": "#222C3E", "5012": "#457FB3",
  "5013": "#212F51", "5014": "#667691", "5015": "#3172AD", "5017": "#0F518A",
  "5018": "#47848D", "5019": "#1A5784", "5020": "#113E4D", "5021": "#216D76",
  "5022": "#282C58", "5023": "#4D648A", "5024": "#6C8DAA", "5025": "#3C6379",
  "5026": "#1B2B4D",
  
  "6000": "#4A7363", "6001": "#40693A", "6002": "#3B5B2F", "6003": "#4F553E",
  "6004": "#214245", "6005": "#234235", "6006": "#3C3D32", "6007": "#2E3526",
  "6008": "#333327", "6009": "#2A372C", "6010": "#4E6E39", "6011": "#6A7C5B",
  "6012": "#2F3B39", "6013": "#777659", "6014": "#454339", "6015": "#3C3F38",
  "6016": "#256753", "6017": "#5C8144", "6018": "#689A45", "6019": "#B8CFAD",
  "6020": "#3B4634", "6021": "#899B79", "6022": "#3B382E", "6024": "#3A8258",
  "6025": "#5D703E", "6026": "#0D5951", "6027": "#88B5B3", "6028": "#3D5547",
  "6029": "#226C45", "6032": "#417E57", "6033": "#568480", "6034": "#86A9AD",
  "6035": "#2E4F31", "6036": "#27514A", "6037": "#3F8C3D", "6038": "#20A339",
  "6039": "#B3C43E",
  
  "7000": "#7E8B92", "7001": "#8B949B", "7002": "#7D7965", "7003": "#76776A",
  "7004": "#969799", "7005": "#696D6B", "7006": "#716C60", "7008": "#6C6040",
  "7009": "#5B6058", "7010": "#575B57", "7011": "#535A5E", "7012": "#595E60",
  "7013": "#545146", "7015": "#51535A", "7016": "#3B4044", "7021": "#323537",
  "7022": "#4C4C47", "7023": "#7D7F76", "7024": "#45494E", "7026": "#394345",
  "7030": "#8C8C83", "7031": "#5D676D", "7032": "#B1B1A1", "7033": "#7C8273",
  "7034": "#8C8870", "7035": "#C2C6C3", "7036": "#949292", "7037": "#797B7B",
  "7038": "#ADB0A9", "7039": "#68675F", "7040": "#969CA1", "7042": "#8C9190",
  "7043": "#4F5352", "7044": "#B3B2A9", "7045": "#8C9094", "7046": "#7C8287",
  "7047": "#C5C5C5", "7048": "#7A7871",
  
  "8000": "#816D44", "8001": "#8F6833", "8002": "#704F40", "8003": "#74502F",
  "8004": "#814D37", "8007": "#67492F", "8008": "#694F2B", "8011": "#533A29",
  "8012": "#5C3128", "8014": "#453729", "8015": "#57332B", "8016": "#483026",
  "8017": "#42332E", "8019": "#3B3736", "8022": "#201F20", "8023": "#965D33",
  "8024": "#6F543C", "8025": "#6E5B4B", "8028": "#4C3E30", "8029": "#764537",
  
  "9001": "#E5E1D4", "9002": "#D4D5CD", "9003": "#EBECEA", "9004": "#2F3133",
  "9005": "#131516", "9006": "#9A9D9D", "9007": "#828280", "9010": "#EFEEE5",
  "9011": "#25282A", "9012": "#F2F1E1", "9016": "#EFF0EB", "9017": "#262625",
  "9018": "#C6CBC6", "9022": "#818382", "9023": "#767779"
};
export const DEFAULT_MIC_CONFIGS = {
    '023-the-bomblet': {
        spheres: { variant: '2', color: null, colorValue: '#a1a1a0' },
        body: { variant: '2', color: null, colorValue: '#a1a1a0' },
        logo: { variant: 'silver', bgColor: '3001', bgColorValue: RAL_PALETTE['3001'], customLogo: null },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: false, variant: 'white', color: null, colorValue: '#ffffff' }
    },
    'malfa': {
        spheres: { variant: '2', color: null, colorValue: '#a1a1a0' },
        body: { variant: '3', color: null, colorValue: '#000000' },
        logo: { variant: 'malfa', bgColor: MALFA_SILVER_RAL, bgColorValue: RAL_PALETTE[MALFA_SILVER_RAL], customLogo: null },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: 'white', color: null, colorValue: '#ffffff' }
    },
    '023-dlx': {
        spheres: { variant: '2', color: null, colorValue: '#a1a1a0' },
        body: { variant: '2', color: null, colorValue: '#a1a1a0' },
        logo: { variant: 'silver', bgColor: '3001', bgColorValue: RAL_PALETTE['3001'], customLogo: null },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: 'white', color: null, colorValue: '#ffffff' }
    },
    '017-fet': {
        spheres: { variant: '1', color: null, colorValue: '#d4af37' },
        body: { variant: '1', color: 'RAL 1013', colorValue: RAL_PALETTE['1013'] },
        logo: { variant: 'gold', bgColor: '6001', bgColorValue: RAL_PALETTE['6001'], customLogo: null },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: 'white', color: null, colorValue: '#ffffff' }
    },
    '017-tube': {
        spheres: { variant: '1', color: null, colorValue: '#d4af37' },
        body: { variant: '1', color: 'RAL 1013', colorValue: RAL_PALETTE['1013'] },
        logo: { variant: 'gold', bgColor: '5017', bgColorValue: RAL_PALETTE['5017'], customLogo: null },
        case: { variant: 'standard', customLogo: null, logoTransform: { x: 40, y: 26, scale: 1.2 } },
        shockmount: { enabled: true, variant: 'white', color: null, colorValue: '#ffffff' }
    }
};

export const variantNames = {
    '1': 'Классическая латунь',
    '2': 'Сатинированная сталь',
    '3': 'Матовый антрацит'
};
