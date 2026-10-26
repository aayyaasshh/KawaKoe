// KawaKoe Coffee Menu Catalog (Without artificial stock restrictions)

export const INITIAL_PRODUCTS = [
  // Signature Coffee
  {
    id: 'prod-sig-1',
    name: 'Kopi Susu KawaKoe Aren',
    category: 'signature',
    price: 28000,
    costPrice: 11000,
    sku: 'KWK-SIG-01',
    image: '/src/assets/images/kawakoe_signature_drink_1792989555641.jpg',
    description: 'Espresso Arabica KawaKoe dengan gula aren organik dan susu segar creamy khas.',
    popular: true,
    isCoffee: true,
    isCustomizable: true
  },
  {
    id: 'prod-sig-2',
    name: 'Pandan Coconut Cold Brew',
    category: 'signature',
    price: 34000,
    costPrice: 13000,
    sku: 'KWK-SIG-02',
    image: '/src/assets/images/kawakoe_signature_drink_1792989555641.jpg',
    description: 'Cold brew 16 jam diekstrak lembut dengan toasted kelapa dan wangi pandan.',
    popular: true,
    isCoffee: true,
    isCustomizable: true
  },
  {
    id: 'prod-sig-3',
    name: 'Butterscotch Sea Salt Latte',
    category: 'signature',
    price: 36000,
    costPrice: 14000,
    sku: 'KWK-SIG-03',
    image: '/src/assets/images/kawakoe_signature_drink_1792989555641.jpg',
    description: 'Espresso halus dengan karamel butterscotch kental dan foam garam laut Maldon.',
    popular: true,
    isCoffee: true,
    isCustomizable: true
  },
  {
    id: 'prod-sig-4',
    name: 'Spanish Cinnamon Dolce',
    category: 'signature',
    price: 32000,
    costPrice: 12000,
    sku: 'KWK-SIG-04',
    image: '/src/assets/images/kawakoe_hero_espresso_1792989554253.jpg',
    description: 'Double espresso dengan susu kental manis lembut dan taburan kayu manis Sumatera.',
    popular: false,
    isCoffee: true,
    isCustomizable: true
  },

  // Espresso Bar
  {
    id: 'prod-esp-1',
    name: 'Double Espresso Romano',
    category: 'espresso',
    price: 22000,
    costPrice: 7000,
    sku: 'KWK-ESP-01',
    image: '/src/assets/images/kawakoe_hero_espresso_1792989554253.jpg',
    description: 'Ekstraksi 36g espresso intens dengan crema tebal keemasan dan kulit lemon.',
    popular: false,
    isCoffee: true,
    isCustomizable: true
  },
  {
    id: 'prod-esp-2',
    name: 'Americano / Long Black',
    category: 'espresso',
    price: 25000,
    costPrice: 7500,
    sku: 'KWK-ESP-02',
    image: '/src/assets/images/kawakoe_hero_espresso_1792989554253.jpg',
    description: 'Espresso ganda dipadu dengan air mineral panas atau es batu kristal segar.',
    popular: true,
    isCoffee: true,
    isCustomizable: true
  },
  {
    id: 'prod-esp-3',
    name: 'Café Latte Artisan',
    category: 'espresso',
    price: 30000,
    costPrice: 11000,
    sku: 'KWK-ESP-03',
    image: '/src/assets/images/kawakoe_hero_espresso_1792989554253.jpg',
    description: 'Espresso seimbang dengan microfoam susu lembut berpola latte art indah.',
    popular: true,
    isCoffee: true,
    isCustomizable: true
  },
  {
    id: 'prod-esp-4',
    name: 'Cappuccino Cinnamon Dust',
    category: 'espresso',
    price: 30000,
    costPrice: 11000,
    sku: 'KWK-ESP-04',
    image: '/src/assets/images/kawakoe_hero_espresso_1792989554253.jpg',
    description: 'Busa susu tebal dengan rasio seimbang dan taburan dark cocoa/cinnamon.',
    popular: false,
    isCoffee: true,
    isCustomizable: true
  },
  {
    id: 'prod-esp-5',
    name: 'Flat White Single Origin',
    category: 'espresso',
    price: 32000,
    costPrice: 12000,
    sku: 'KWK-ESP-05',
    image: '/src/assets/images/kawakoe_hero_espresso_1792989554253.jpg',
    description: 'Ristretto pekat berlapis susu velvety microfoam gaya Melbourne.',
    popular: false,
    isCoffee: true,
    isCustomizable: true
  },

  // Manual Brew
  {
    id: 'prod-mb-1',
    name: 'V60 Gayo Winey Natural',
    category: 'manual-brew',
    price: 38000,
    costPrice: 15000,
    sku: 'KWK-MB-01',
    image: '/src/assets/images/kawakoe_manual_brew_1792989555251.jpg',
    description: 'Notes: Blackberry, fermentasi anggur matang, bergamot, sweetness tinggi.',
    popular: true,
    isCoffee: true,
    isCustomizable: true
  },
  {
    id: 'prod-mb-2',
    name: 'V60 Kerinci Honey Anaerobic',
    category: 'manual-brew',
    price: 38000,
    costPrice: 15000,
    sku: 'KWK-MB-02',
    image: '/src/assets/images/kawakoe_manual_brew_1792989555251.jpg',
    description: 'Notes: Orange blossom, peach, aroma madu hutan, acidity sangat bersih.',
    popular: false,
    isCoffee: true,
    isCustomizable: true
  },
  {
    id: 'prod-mb-3',
    name: 'Japanese Cold Drip Flores',
    category: 'manual-brew',
    price: 36000,
    costPrice: 14000,
    sku: 'KWK-MB-03',
    image: '/src/assets/images/kawakoe_manual_brew_1792989555251.jpg',
    description: 'Diseduh langsung di atas es batu kristal. Notes: Dark chocolate, caramel nutty.',
    popular: true,
    isCoffee: true,
    isCustomizable: true
  },
  {
    id: 'prod-mb-4',
    name: 'Kawa Daun Heritage Brew',
    category: 'manual-brew',
    price: 28000,
    costPrice: 8000,
    sku: 'KWK-MB-04',
    image: '/src/assets/images/kawakoe_manual_brew_1792989555251.jpg',
    description: 'Seduhan daun kopi sangrai warisan Nusantara dengan rempah kapulaga & cengkeh.',
    popular: true,
    isCoffee: true,
    isCustomizable: true
  },

  // Non-Coffee
  {
    id: 'prod-nc-1',
    name: 'Ceremonial Uji Matcha Latte',
    category: 'non-coffee',
    price: 35000,
    costPrice: 15000,
    sku: 'KWK-NC-01',
    image: '/src/assets/images/kawakoe_signature_drink_1792989555641.jpg',
    description: 'Pure Matcha Uji Kyoto grade seremonial dipadu dengan susu segar lembut.',
    popular: true,
    isCoffee: false,
    isCustomizable: true
  },
  {
    id: 'prod-nc-2',
    name: 'Earl Grey Lavender Tea',
    category: 'non-coffee',
    price: 28000,
    costPrice: 9000,
    sku: 'KWK-NC-02',
    image: '/src/assets/images/kawakoe_manual_brew_1792989555251.jpg',
    description: 'Black tea bergamot harum dipadu aroma bunga lavender kering menenangkan.',
    popular: false,
    isCoffee: false,
    isCustomizable: true
  },
  {
    id: 'prod-nc-3',
    name: 'Artisan Dark Chocolate Java 70%',
    category: 'non-coffee',
    price: 32000,
    costPrice: 12000,
    sku: 'KWK-NC-03',
    image: '/src/assets/images/kawakoe_hero_espresso_1792989554253.jpg',
    description: 'Kakao Jawa asli 70% kaya antioksidan dengan tekstur creamy lembut.',
    popular: false,
    isCoffee: false,
    isCustomizable: true
  },

  // Pastry & Light Bites
  {
    id: 'prod-pas-1',
    name: 'Artisan Butter Croissant',
    category: 'pastry-snack',
    price: 26000,
    costPrice: 11000,
    sku: 'KWK-PAS-01',
    image: '/src/assets/images/kawakoe_pastry_croissant_1792989556304.jpg',
    description: 'Croissant renyah berlapis dengan mentega Prancis aromatik berongga sempurna.',
    popular: true,
    isCoffee: false,
    isCustomizable: false
  },
  {
    id: 'prod-pas-2',
    name: 'Pain au Chocolat Belgia',
    category: 'pastry-snack',
    price: 30000,
    costPrice: 13000,
    sku: 'KWK-PAS-02',
    image: '/src/assets/images/kawakoe_pastry_croissant_1792989556304.jpg',
    description: 'Pastry mentega renyah dengan isian batang dark chocolate Belgia meleleh.',
    popular: true,
    isCoffee: false,
    isCustomizable: false
  },
  {
    id: 'prod-pas-3',
    name: 'KawaKoe Toast Kaya Butter',
    category: 'pastry-snack',
    price: 25000,
    costPrice: 9000,
    sku: 'KWK-PAS-03',
    image: '/src/assets/images/kawakoe_pastry_croissant_1792989556304.jpg',
    description: 'Roti bakar arang dengan selai srikaya buatan tangan dan butter dingin.',
    popular: false,
    isCoffee: false,
    isCustomizable: false
  },
  {
    id: 'prod-pas-4',
    name: 'Crispy Cireng Rujak Dip',
    category: 'pastry-snack',
    price: 24000,
    costPrice: 8000,
    sku: 'KWK-PAS-04',
    image: '/src/assets/images/kawakoe_pastry_croissant_1792989556304.jpg',
    description: 'Cireng kenyal renyah di luar disajikan dengan saus rujak pedas manis.',
    popular: true,
    isCoffee: false,
    isCustomizable: false
  },
  {
    id: 'prod-pas-5',
    name: 'Truffle Parmesan Hand-cut Fries',
    category: 'pastry-snack',
    price: 32000,
    costPrice: 12000,
    sku: 'KWK-PAS-05',
    image: '/src/assets/images/kawakoe_pastry_croissant_1792989556304.jpg',
    description: 'Kentang goreng gurih beraroma minyak truffle putih dan keju parmesan parut.',
    popular: false,
    isCoffee: false,
    isCustomizable: false
  },

  // Beans & Merchandise
  {
    id: 'prod-bm-1',
    name: 'House Blend Beans (250g)',
    category: 'beans-merch',
    price: 95000,
    costPrice: 50000,
    sku: 'KWK-BN-01',
    image: '/src/assets/images/kawakoe_hero_espresso_1792989554253.jpg',
    description: 'Biji kopi sangrai 70% Arabica Aceh Gayo + 30% Flores Medium-Dark roast.',
    popular: true,
    isCoffee: false,
    isCustomizable: false
  }
];
