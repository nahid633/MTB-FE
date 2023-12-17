import {ProcessTypesEnum} from "../../models/test-types.enum";

export const TestTypeOptions = [
  {name:ProcessTypesEnum.SIMULATION, label: 'Online Simulation', price: '100$'},
  // {name:ProcessTypesEnum.CERTIFICATION, label: 'Certification', price: '10,000$'},
  {name:ProcessTypesEnum.IN_PLACE, label: 'Testing', price: '200'},
  {name:ProcessTypesEnum.IN_PLACE_AR, label: 'AR Testing', price: '250$'},
];

export const dateTimeOptions = ['09: 00', '10: 00', '11: 00','12: 00','13: 00','14: 00','15: 00','16: 00','17: 00','18: 00'];
export const vehiclesMakesOptions = [
  {"name": "audi", "label": "Audi"},
  {"name": "bmw", "label": "BMW"},
  {"name": "mercedes-benz", "label": "Mercedes-Benz"},
  {"name": "porsche", "label": "Porsche"},
  {"name": "volkswagen", "label": "Volkswagen"},
  {"name": "opel", "label": "Opel"}
];

export const vehiclesModelsOptions: Record<string, { model: string }[]> =
  {
    "audi": [
      {"model": "Audi A6"},
      {"model": "Audi Q5"},
      {"model": "Audi A3"},
      {"model": "Audi Q8"},
      {"model": "Audi e-tron"}
    ],
    "bmw": [
      {"model": "BMW 3 Series"},
      {"model": "BMW X5"},
      {"model": "BMW 5 Series"},
      {"model": "BMW i4"},
      {"model": "BMW X3"}
    ],
    "mercedes-benz": [
      {"model": "Mercedes-Benz C-Class"},
      {"model": "Mercedes-Benz E-Class"},
      {"model": "Mercedes-Benz S-Class"},
      {"model": "Mercedes-Benz GLC"},
      {"model": "Mercedes-Benz EQS"}
    ],
    "porsche": [
      {"model": "Porsche 911"},
      {"model": "Porsche Cayenne"},
      {"model": "Porsche Taycan"},
      {"model": "Porsche Macan"},
      {"model": "Porsche Panamera"}
    ],
    "volkswagen": [
      {"model": "Volkswagen Golf"},
      {"model": "Volkswagen Tiguan"},
      {"model": "Volkswagen Passat"},
      {"model": "Volkswagen ID.4"},
      {"model": "Volkswagen Polo"}
    ],
    'opel': [
      {"model": "Opel Corsa"},
      {"model": "Opel Astra"},
      {"model": "Opel Mokka"},
      {"model": "Opel Crossland"},
      {"model": "Opel Insignia"}
    ]
  };
