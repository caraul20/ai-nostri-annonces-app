// Types pentru wizard-ul de adăugare anunțuri

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface CategoryWithSubcategories {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentCategoryId: string;
  customFields: CustomField[];
}

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'textarea' | 'checkbox' | 'date' | 'file';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface WizardFormData {
  // Etapa 1: Categoria
  categoryId?: string;
  categoryName?: string;
  
  // Etapa 2: Subcategoria
  subcategoryId?: string;
  subcategoryName?: string;
  
  // Etapa 3: Detalii de bază
  title?: string;
  description?: string;
  price?: number;
  locationId?: string;
  phone?: string;
  images?: string[];
  
  // Etapa 4: Câmpuri personalizate
  customFields?: { [fieldId: string]: any };
}

export interface WizardState {
  currentStep: number;
  steps: WizardStep[];
  formData: WizardFormData;
  isLoading: boolean;
  errors: { [key: string]: string[] };
}

// Configurația categoriilor cu subcategorii și câmpuri personalizate
export const CATEGORY_CONFIG: CategoryWithSubcategories[] = [
  {
    id: 'imobiliare',
    name: 'Imobiliare',
    slug: 'imobiliare',
    description: 'Apartamente, case, camere de închiriat',
    icon: '🏠',
    subcategories: [
      {
        id: 'apartamente-vanzare',
        name: 'Apartamente de vânzare',
        slug: 'apartamente-vanzare',
        parentCategoryId: 'imobiliare',
        icon: '🏢',
        customFields: [
          {
            id: 'suprafata',
            name: 'suprafata',
            label: 'Suprafața (m²)',
            type: 'number',
            required: true,
            validation: { min: 10, max: 1000 }
          },
          {
            id: 'camere',
            name: 'camere',
            label: 'Numărul de camere',
            type: 'select',
            required: true,
            options: [
              { value: '1', label: '1 cameră' },
              { value: '2', label: '2 camere' },
              { value: '3', label: '3 camere' },
              { value: '4', label: '4 camere' },
              { value: '5+', label: '5+ camere' }
            ]
          },
          {
            id: 'etaj',
            name: 'etaj',
            label: 'Etajul',
            type: 'text',
            required: false,
            placeholder: 'Ex: 2/4, Parter, Mansardă'
          },
          {
            id: 'an_constructie',
            name: 'an_constructie',
            label: 'Anul construcției',
            type: 'number',
            required: false,
            validation: { min: 1900, max: 2024 }
          },
          {
            id: 'dotari',
            name: 'dotari',
            label: 'Dotări',
            type: 'multiselect',
            required: false,
            options: [
              { value: 'balcon', label: 'Balcon' },
              { value: 'terasa', label: 'Terasă' },
              { value: 'parcare', label: 'Loc de parcare' },
              { value: 'pivnita', label: 'Pivniță' },
              { value: 'lift', label: 'Lift' },
              { value: 'centrala', label: 'Centrală termică' }
            ]
          }
        ]
      },
      {
        id: 'apartamente-inchiriere',
        name: 'Apartamente de închiriat',
        slug: 'apartamente-inchiriere',
        parentCategoryId: 'imobiliare',
        icon: '🔑',
        customFields: [
          {
            id: 'suprafata',
            name: 'suprafata',
            label: 'Suprafața (m²)',
            type: 'number',
            required: true,
            validation: { min: 10, max: 1000 }
          },
          {
            id: 'camere',
            name: 'camere',
            label: 'Numărul de camere',
            type: 'select',
            required: true,
            options: [
              { value: '1', label: '1 cameră' },
              { value: '2', label: '2 camere' },
              { value: '3', label: '3 camere' },
              { value: '4', label: '4 camere' },
              { value: '5+', label: '5+ camere' }
            ]
          },
          {
            id: 'mobilat',
            name: 'mobilat',
            label: 'Mobilat',
            type: 'select',
            required: true,
            options: [
              { value: 'da', label: 'Da, complet mobilat' },
              { value: 'partial', label: 'Parțial mobilat' },
              { value: 'nu', label: 'Nu, nemobilat' }
            ]
          },
          {
            id: 'perioada_minima',
            name: 'perioada_minima',
            label: 'Perioada minimă de închiriere',
            type: 'select',
            required: false,
            options: [
              { value: '1_luna', label: '1 lună' },
              { value: '3_luni', label: '3 luni' },
              { value: '6_luni', label: '6 luni' },
              { value: '1_an', label: '1 an' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'vehicule',
    name: 'Vehicule',
    slug: 'vehicule',
    description: 'Mașini, motociclete, biciclete',
    icon: '🚗',
    subcategories: [
      {
        id: 'masini',
        name: 'Mașini',
        slug: 'masini',
        parentCategoryId: 'vehicule',
        icon: '🚙',
        customFields: [
          {
            id: 'marca',
            name: 'marca',
            label: 'Marca',
            type: 'select',
            required: true,
            options: [
              { value: 'audi', label: 'Audi' },
              { value: 'bmw', label: 'BMW' },
              { value: 'mercedes', label: 'Mercedes-Benz' },
              { value: 'volkswagen', label: 'Volkswagen' },
              { value: 'renault', label: 'Renault' },
              { value: 'peugeot', label: 'Peugeot' },
              { value: 'citroen', label: 'Citroën' },
              { value: 'dacia', label: 'Dacia' },
              { value: 'altele', label: 'Altele' }
            ]
          },
          {
            id: 'model',
            name: 'model',
            label: 'Modelul',
            type: 'text',
            required: true,
            placeholder: 'Ex: A4, 320d, C-Class'
          },
          {
            id: 'an_fabricatie',
            name: 'an_fabricatie',
            label: 'Anul fabricației',
            type: 'number',
            required: true,
            validation: { min: 1990, max: 2024 }
          },
          {
            id: 'kilometraj',
            name: 'kilometraj',
            label: 'Kilometraj',
            type: 'number',
            required: true,
            validation: { min: 0, max: 1000000 }
          },
          {
            id: 'combustibil',
            name: 'combustibil',
            label: 'Combustibil',
            type: 'select',
            required: true,
            options: [
              { value: 'benzina', label: 'Benzină' },
              { value: 'diesel', label: 'Diesel' },
              { value: 'hibrid', label: 'Hibrid' },
              { value: 'electric', label: 'Electric' },
              { value: 'gpl', label: 'GPL' }
            ]
          },
          {
            id: 'transmisie',
            name: 'transmisie',
            label: 'Transmisia',
            type: 'select',
            required: true,
            options: [
              { value: 'manuala', label: 'Manuală' },
              { value: 'automata', label: 'Automată' }
            ]
          },
          {
            id: 'motiv_vanzare',
            name: 'motiv_vanzare',
            label: 'Motivul vânzării',
            type: 'select',
            required: false,
            options: [
              { value: 'intoarcere_tara', label: 'Întoarcere în țară' },
              { value: 'schimb_masina', label: 'Schimb cu altă mașină' },
              { value: 'nevoie_bani', label: 'Nevoie de bani' },
              { value: 'altele', label: 'Altele' }
            ]
          }
        ]
      },
      {
        id: 'motociclete',
        name: 'Motociclete',
        slug: 'motociclete',
        parentCategoryId: 'vehicule',
        icon: '🏍️',
        customFields: [
          {
            id: 'marca',
            name: 'marca',
            label: 'Marca',
            type: 'text',
            required: true,
            placeholder: 'Ex: Honda, Yamaha, Kawasaki'
          },
          {
            id: 'model',
            name: 'model',
            label: 'Modelul',
            type: 'text',
            required: true
          },
          {
            id: 'cilindree',
            name: 'cilindree',
            label: 'Cilindree (cc)',
            type: 'number',
            required: true,
            validation: { min: 50, max: 2000 }
          },
          {
            id: 'an_fabricatie',
            name: 'an_fabricatie',
            label: 'Anul fabricației',
            type: 'number',
            required: true,
            validation: { min: 1990, max: 2024 }
          }
        ]
      }
    ]
  },
  {
    id: 'electronice',
    name: 'Electronice',
    slug: 'electronice',
    description: 'Telefoane, laptopuri, TV-uri',
    icon: '📱',
    subcategories: [
      {
        id: 'telefoane',
        name: 'Telefoane mobile',
        slug: 'telefoane',
        parentCategoryId: 'electronice',
        icon: '📱',
        customFields: [
          {
            id: 'marca',
            name: 'marca',
            label: 'Marca',
            type: 'select',
            required: true,
            options: [
              { value: 'apple', label: 'Apple' },
              { value: 'samsung', label: 'Samsung' },
              { value: 'huawei', label: 'Huawei' },
              { value: 'xiaomi', label: 'Xiaomi' },
              { value: 'oneplus', label: 'OnePlus' },
              { value: 'altele', label: 'Altele' }
            ]
          },
          {
            id: 'model',
            name: 'model',
            label: 'Modelul',
            type: 'text',
            required: true,
            placeholder: 'Ex: iPhone 14 Pro, Galaxy S23'
          },
          {
            id: 'capacitate',
            name: 'capacitate',
            label: 'Capacitatea de stocare',
            type: 'select',
            required: true,
            options: [
              { value: '64gb', label: '64 GB' },
              { value: '128gb', label: '128 GB' },
              { value: '256gb', label: '256 GB' },
              { value: '512gb', label: '512 GB' },
              { value: '1tb', label: '1 TB' }
            ]
          },
          {
            id: 'stare',
            name: 'stare',
            label: 'Starea',
            type: 'select',
            required: true,
            options: [
              { value: 'nou', label: 'Nou (sigilat)' },
              { value: 'foarte_buna', label: 'Foarte bună' },
              { value: 'buna', label: 'Bună' },
              { value: 'acceptabila', label: 'Acceptabilă' },
              { value: 'defect', label: 'Defect' }
            ]
          },
          {
            id: 'garantie',
            name: 'garantie',
            label: 'Garanție',
            type: 'checkbox',
            required: false
          }
        ]
      },
      {
        id: 'laptopuri',
        name: 'Laptopuri',
        slug: 'laptopuri',
        parentCategoryId: 'electronice',
        icon: '💻',
        customFields: [
          {
            id: 'marca',
            name: 'marca',
            label: 'Marca',
            type: 'select',
            required: true,
            options: [
              { value: 'apple', label: 'Apple' },
              { value: 'asus', label: 'ASUS' },
              { value: 'hp', label: 'HP' },
              { value: 'dell', label: 'Dell' },
              { value: 'lenovo', label: 'Lenovo' },
              { value: 'acer', label: 'Acer' },
              { value: 'altele', label: 'Altele' }
            ]
          },
          {
            id: 'procesor',
            name: 'procesor',
            label: 'Procesorul',
            type: 'text',
            required: true,
            placeholder: 'Ex: Intel i7, AMD Ryzen 5, M1'
          },
          {
            id: 'ram',
            name: 'ram',
            label: 'Memoria RAM',
            type: 'select',
            required: true,
            options: [
              { value: '4gb', label: '4 GB' },
              { value: '8gb', label: '8 GB' },
              { value: '16gb', label: '16 GB' },
              { value: '32gb', label: '32 GB' }
            ]
          },
          {
            id: 'stocare',
            name: 'stocare',
            label: 'Stocarea',
            type: 'select',
            required: true,
            options: [
              { value: '256gb_ssd', label: '256 GB SSD' },
              { value: '512gb_ssd', label: '512 GB SSD' },
              { value: '1tb_ssd', label: '1 TB SSD' },
              { value: '1tb_hdd', label: '1 TB HDD' },
              { value: '2tb_hdd', label: '2 TB HDD' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'casa-gradina',
    name: 'Casă & Grădină',
    slug: 'casa-gradina',
    description: 'Mobilier, decorațiuni, unelte',
    icon: '🪑',
    subcategories: [
      {
        id: 'mobilier',
        name: 'Mobilier',
        slug: 'mobilier',
        parentCategoryId: 'casa-gradina',
        icon: '🛋️',
        customFields: [
          {
            id: 'tip_mobilier',
            name: 'tip_mobilier',
            label: 'Tipul mobilierului',
            type: 'select',
            required: true,
            options: [
              { value: 'canapea', label: 'Canapea' },
              { value: 'fotoliu', label: 'Fotoliu' },
              { value: 'masa', label: 'Masă' },
              { value: 'scaun', label: 'Scaun' },
              { value: 'dulap', label: 'Dulap' },
              { value: 'pat', label: 'Pat' },
              { value: 'comoda', label: 'Comodă' },
              { value: 'altele', label: 'Altele' }
            ]
          },
          {
            id: 'material',
            name: 'material',
            label: 'Materialul',
            type: 'select',
            required: false,
            options: [
              { value: 'lemn', label: 'Lemn' },
              { value: 'metal', label: 'Metal' },
              { value: 'plastic', label: 'Plastic' },
              { value: 'sticla', label: 'Sticlă' },
              { value: 'piele', label: 'Piele' },
              { value: 'textil', label: 'Textil' }
            ]
          },
          {
            id: 'stare',
            name: 'stare',
            label: 'Starea',
            type: 'select',
            required: true,
            options: [
              { value: 'nou', label: 'Nou' },
              { value: 'foarte_buna', label: 'Foarte bună' },
              { value: 'buna', label: 'Bună' },
              { value: 'acceptabila', label: 'Acceptabilă' },
              { value: 'pentru_piese', label: 'Pentru piese' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'moda',
    name: 'Modă',
    slug: 'moda',
    description: 'Haine, încălțăminte, accesorii',
    icon: '👕',
    subcategories: [
      {
        id: 'haine-femei',
        name: 'Haine femei',
        slug: 'haine-femei',
        parentCategoryId: 'moda',
        icon: '👗',
        customFields: [
          {
            id: 'marime',
            name: 'marime',
            label: 'Mărimea',
            type: 'select',
            required: true,
            options: [
              { value: 'xs', label: 'XS' },
              { value: 's', label: 'S' },
              { value: 'm', label: 'M' },
              { value: 'l', label: 'L' },
              { value: 'xl', label: 'XL' },
              { value: 'xxl', label: 'XXL' }
            ]
          },
          {
            id: 'tip_haina',
            name: 'tip_haina',
            label: 'Tipul hainei',
            type: 'select',
            required: true,
            options: [
              { value: 'rochie', label: 'Rochie' },
              { value: 'bluza', label: 'Bluză' },
              { value: 'pantaloni', label: 'Pantaloni' },
              { value: 'fusta', label: 'Fustă' },
              { value: 'jacheta', label: 'Jachetă' },
              { value: 'palton', label: 'Palton' },
              { value: 'altele', label: 'Altele' }
            ]
          },
          {
            id: 'marca',
            name: 'marca',
            label: 'Marca',
            type: 'text',
            required: false,
            placeholder: 'Ex: Zara, H&M, Mango'
          },
          {
            id: 'stare',
            name: 'stare',
            label: 'Starea',
            type: 'select',
            required: true,
            options: [
              { value: 'nou', label: 'Nou (cu etichetă)' },
              { value: 'foarte_buna', label: 'Foarte bună' },
              { value: 'buna', label: 'Bună' },
              { value: 'acceptabila', label: 'Acceptabilă' }
            ]
          }
        ]
      },
      {
        id: 'haine-barbati',
        name: 'Haine bărbați',
        slug: 'haine-barbati',
        parentCategoryId: 'moda',
        icon: '👔',
        customFields: [
          {
            id: 'marime',
            name: 'marime',
            label: 'Mărimea',
            type: 'select',
            required: true,
            options: [
              { value: 'xs', label: 'XS' },
              { value: 's', label: 'S' },
              { value: 'm', label: 'M' },
              { value: 'l', label: 'L' },
              { value: 'xl', label: 'XL' },
              { value: 'xxl', label: 'XXL' }
            ]
          },
          {
            id: 'tip_haina',
            name: 'tip_haina',
            label: 'Tipul hainei',
            type: 'select',
            required: true,
            options: [
              { value: 'camasa', label: 'Cămașă' },
              { value: 'tricou', label: 'Tricou' },
              { value: 'pantaloni', label: 'Pantaloni' },
              { value: 'jeans', label: 'Jeans' },
              { value: 'costum', label: 'Costum' },
              { value: 'jacheta', label: 'Jachetă' },
              { value: 'altele', label: 'Altele' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sport',
    name: 'Sport',
    slug: 'sport',
    description: 'Echipamente sportive, biciclete',
    icon: '⚽',
    subcategories: [
      {
        id: 'echipamente-fotbal',
        name: 'Echipamente fotbal',
        slug: 'echipamente-fotbal',
        parentCategoryId: 'sport',
        icon: '⚽',
        customFields: [
          {
            id: 'tip_echipament',
            name: 'tip_echipament',
            label: 'Tipul echipamentului',
            type: 'select',
            required: true,
            options: [
              { value: 'tricou', label: 'Tricou' },
              { value: 'pantaloni', label: 'Pantaloni scurți' },
              { value: 'ghete', label: 'Ghete de fotbal' },
              { value: 'minge', label: 'Minge' },
              { value: 'echipament_complet', label: 'Echipament complet' }
            ]
          },
          {
            id: 'echipa',
            name: 'echipa',
            label: 'Echipa',
            type: 'select',
            required: false,
            options: [
              { value: 'romania', label: 'România' },
              { value: 'real_madrid', label: 'Real Madrid' },
              { value: 'barcelona', label: 'Barcelona' },
              { value: 'psg', label: 'PSG' },
              { value: 'steaua', label: 'FCSB' },
              { value: 'dinamo', label: 'Dinamo' },
              { value: 'altele', label: 'Altele' }
            ]
          },
          {
            id: 'marime',
            name: 'marime',
            label: 'Mărimea',
            type: 'select',
            required: true,
            options: [
              { value: 'xs', label: 'XS' },
              { value: 's', label: 'S' },
              { value: 'm', label: 'M' },
              { value: 'l', label: 'L' },
              { value: 'xl', label: 'XL' },
              { value: 'xxl', label: 'XXL' }
            ]
          }
        ]
      }
    ]
  }
];
