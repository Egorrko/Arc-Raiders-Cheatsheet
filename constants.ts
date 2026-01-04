import { ProjectPhase, Workshop, Rarity } from './types';

export const PROJECT_PHASES: ProjectPhase[] = [
  {
    id: 1,
    name: "Foundation",
    requirements: [
      { name: "Metal Parts", count: 150, rarity: Rarity.COMMON, icon: "🔩" },
      { name: "Arc Alloy", count: 80, rarity: Rarity.UNCOMMON, icon: "💠" },
    ]
  },
  {
    id: 2,
    name: "Core Systems",
    requirements: [
      { name: "Rubber Parts", count: 200, rarity: Rarity.UNCOMMON, icon: "🍩" },
      { name: "Steel Spring", count: 15, rarity: Rarity.UNCOMMON, icon: "🌀" },
    ]
  },
  {
    id: 3,
    name: "Framework",
    requirements: [
      { name: "Durable Cloth", count: 35, rarity: Rarity.UNCOMMON, icon: "🧣" },
      { name: "Electrical Components", count: 20, rarity: Rarity.RARE, icon: "🔌" },
      { name: "Wires", count: 25, rarity: Rarity.RARE, icon: "➰" },
      { name: "Cooling Coil", count: 4, rarity: Rarity.RARE, icon: "❄️" },
      { name: "Light Bulb", count: 4, rarity: Rarity.RARE, icon: "💡" },
      { name: "Shredder Gyro", count: 10, rarity: Rarity.RARE, icon: "⚙️" },
      { name: "Battery", count: 30, rarity: Rarity.UNCOMMON, icon: "🔋" },
      { name: "Exodus Modules", count: 1, rarity: Rarity.EPIC, icon: "💾" },
    ]
  },
  {
    id: 4,
    name: "Outfitting",
    requirements: [
      { name: "Frequency Modulation Box", count: 5, rarity: Rarity.EPIC, icon: "📻" },
      { name: "Ion Sputter", count: 3, rarity: Rarity.EPIC, icon: "🎇" },
    ]
  },
  {
    id: 5,
    name: "Load Stage",
    requirements: [
      { name: "Advanced Electrical Components", count: 5, rarity: Rarity.EPIC, icon: "🖥️" },
      { name: "Leaper Pulse Unit", count: 3, rarity: Rarity.EPIC, icon: "💓" },
    ]
  }
];

export const WORKSHOPS: Workshop[] = [
  {
    id: "gunsmith",
    name: "Gunsmith",
    maxLevel: 3,
    levels: [
      {
        level: 2,
        requirements: [
          { name: "Mechanical Components", count: 5, rarity: Rarity.UNCOMMON, icon: "🔧" },
          { name: "Rusted Tools", count: 3, rarity: Rarity.COMMON, icon: "🔨" },
          { name: "Wasp Driver", count: 8, rarity: Rarity.RARE, icon: "🐝" },
        ]
      },
      {
        level: 3,
        requirements: [
          { name: "Rusted Gear", count: 3, rarity: Rarity.COMMON, icon: "⚙️" },
          { name: "Advanced Mechanical Components", count: 5, rarity: Rarity.EPIC, icon: "🗜️" },
          { name: "Sentinel Firing Core", count: 4, rarity: Rarity.EPIC, icon: "🧿" },
        ]
      }
    ]
  },
  {
    id: "gear_bench",
    name: "Gear Bench",
    maxLevel: 3,
    levels: [
      {
        level: 2,
        requirements: [
          { name: "Electrical Components", count: 5, rarity: Rarity.RARE, icon: "🔌" },
          { name: "Power Cable", count: 3, rarity: Rarity.RARE, icon: "🔌" },
          { name: "Hornet Driver", count: 5, rarity: Rarity.RARE, icon: "🦗" },
        ]
      },
      {
        level: 3,
        requirements: [
          { name: "Industrial Battery", count: 3, rarity: Rarity.RARE, icon: "🔋" },
          { name: "Advanced Electrical Components", count: 5, rarity: Rarity.EPIC, icon: "🖥️" },
          { name: "Bastion Cell", count: 6, rarity: Rarity.EPIC, icon: "🛡️" },
        ]
      }
    ]
  },
  {
    id: "medical_lab",
    name: "Medical Lab",
    maxLevel: 3,
    levels: [
      {
        level: 2,
        requirements: [
          { name: "Durable Cloth", count: 5, rarity: Rarity.UNCOMMON, icon: "🧣" },
          { name: "Tick Pod", count: 8, rarity: Rarity.UNCOMMON, icon: "🐞" },
          { name: "Cracked Bioscanner", count: 2, rarity: Rarity.RARE, icon: "📟" },
        ]
      },
      {
        level: 3,
        requirements: [
          { name: "Rusted Shut Medical Kit", count: 1, rarity: Rarity.COMMON, icon: "⚕️" },
          { name: "Antiseptic", count: 8, rarity: Rarity.EPIC, icon: "🧴" },
          { name: "Surveyor Vault", count: 5, rarity: Rarity.RARE, icon: "📡" },
        ]
      }
    ]
  },
  {
    id: "refiner",
    name: "Refiner",
    maxLevel: 3,
    levels: [
      {
        level: 2,
        requirements: [
          { name: "Fireball Burner", count: 8, rarity: Rarity.UNCOMMON, icon: "🔥" },
          { name: "ARC Motion Core", count: 5, rarity: Rarity.RARE, icon: "⚛️" },
          { name: "Toaster", count: 3, rarity: Rarity.COMMON, icon: "🍞" },
        ]
      },
      {
        level: 3,
        requirements: [
          { name: "Motor", count: 3, rarity: Rarity.RARE, icon: "🏎️" },
          { name: "ARC Circuitry", count: 10, rarity: Rarity.RARE, icon: "💾" },
          { name: "Bombardier Cell", count: 6, rarity: Rarity.EPIC, icon: "💣" },
        ]
      }
    ]
  },
  {
    id: "utility_station",
    name: "Utility Station",
    maxLevel: 3,
    levels: [
      {
        level: 2,
        requirements: [
          { name: "Switch Scanner", count: 6, rarity: Rarity.UNCOMMON, icon: "🎛️" },
          { name: "Electrical Components", count: 5, rarity: Rarity.RARE, icon: "🔌" },
          { name: "Damaged Heat Sink", count: 2, rarity: Rarity.COMMON, icon: "♨️" },
        ]
      },
      {
        level: 3,
        requirements: [
          { name: "Fried Motherboard", count: 3, rarity: Rarity.RARE, icon: "📠" },
          { name: "Advanced Electrical Components", count: 5, rarity: Rarity.EPIC, icon: "🖥️" },
          { name: "Leaper Pulse Unit", count: 4, rarity: Rarity.EPIC, icon: "💓" },
        ]
      }
    ]
  },
  {
    id: "explosives_station",
    name: "Explosives Station",
    maxLevel: 3,
    levels: [
      {
        level: 2,
        requirements: [
          { name: "Pop Trigger", count: 5, rarity: Rarity.UNCOMMON, icon: "🧨" },
          { name: "Crude Explosives", count: 5, rarity: Rarity.COMMON, icon: "💣" },
          { name: "Synthesized Fuel", count: 3, rarity: Rarity.EPIC, icon: "⛽" },
        ]
      },
      {
        level: 3,
        requirements: [
          { name: "Laboratory Reagents", count: 3, rarity: Rarity.RARE, icon: "🧪" },
          { name: "Explosive Compound", count: 5, rarity: Rarity.RARE, icon: "💥" },
          { name: "Rocketeer Driver", count: 3, rarity: Rarity.EPIC, icon: "🚀" },
        ]
      }
    ]
  },
  {
    id: "scrappy",
    name: "Scrappy",
    maxLevel: 5,
    levels: [
      {
        level: 2,
        requirements: [
          { name: "Dog Collar", count: 1, rarity: Rarity.RARE, icon: "🐕" },
        ]
      },
      {
        level: 3,
        requirements: [
          { name: "Lemon", count: 3, rarity: Rarity.UNCOMMON, icon: "🍋" },
          { name: "Apricot", count: 3, rarity: Rarity.UNCOMMON, icon: "🍑" },
        ]
      },
      {
        level: 4,
        requirements: [
          { name: "Prickly Pear", count: 6, rarity: Rarity.EPIC, icon: "🌵" },
          { name: "Olives", count: 6, rarity: Rarity.EPIC, icon: "🫒" },
          { name: "Cat Bed", count: 1, rarity: Rarity.COMMON, icon: "🐱" },
        ]
      },
      {
        level: 5,
        requirements: [
          { name: "Mushroom", count: 12, rarity: Rarity.UNCOMMON, icon: "🍄" },
          { name: "Apricot", count: 12, rarity: Rarity.UNCOMMON, icon: "🍑" },
          { name: "Very Comfortable Pillow", count: 3, rarity: Rarity.UNCOMMON, icon: "🛌" },
        ]
      }
    ]
  }
];
