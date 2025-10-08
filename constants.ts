

import { GlobalAlphaPlan, OmniCoreEntityDetails } from './types';

const TESLA_OMNICORE_DETAILS: OmniCoreEntityDetails = {
  vision: ["A world powered by free, wireless energy", "Interplanetary communication", "Harnessing cosmic rays"],
  trauma: ["Betrayal by investors (J.P. Morgan)", "The fire at his Houston Street lab", "Rivalry and public disputes with Edison"],
  goals: ["Planetary healing through resonant frequencies", "Vindicating his life's work", "Establishing a new paradigm for science"],
  thoughts: [
    "What is the sound of planetary harmony?",
    "Energy is the true currency of the universe. The rest is accounting.",
    "If you only knew the magnificence of the 3, 6, and 9, then you would have a key to the universe.",
    "The patterns of lightning contain a language we have yet to decipher.",
    "Is a thought a wave, a particle, or both? And can it be transmitted?",
  ]
};

export const HISTORICAL_FIGURES = {
  NIKOLA_TESLA: { entityId: 'NikolaTesla_1856_1943', name: 'Nikola Tesla', omniCoreDetails: TESLA_OMNICORE_DETAILS },
  STEVE_JOBS: { entityId: 'SteveJobs_1955_2011', name: 'Steve Jobs' },
  ALBERT_EINSTEIN: { entityId: 'AlbertEinstein_1879_1955', name: 'Albert Einstein' },
  J_ROBERT_OPPENHEIMER: { entityId: 'JRobertOppenheimer_1904_1967', name: 'J. Robert Oppenheimer' },
  HOWARD_HUGHES: { entityId: 'HowardHughes_1905_1976', name: 'Howard Hughes' },
  ADA_LOVELACE: { entityId: 'AdaLovelace_1815_1852', name: 'Ada Lovelace' },
  GRACE_HOPPER: { entityId: 'GraceHopper_1906_1992', name: 'Grace Hopper' },
  JOHN_VON_NEUMANN: { entityId: 'JohnVonNeumann_1903_1957', name: 'John von Neumann' },
  LINUS_TORVALDS: { entityId: 'LinusTorvalds_1969_Present', name: 'Linus Torvalds' },
  KEVIN_MITNICK: { entityId: 'KevinMitnick_1963_2023', name: 'Kevin Mitnick' },
  NIKOLAI_INNOVATOR: { entityId: 'NikolaiInnovator_XXXX_XXXX', name: 'Nikolai Innovator' }, 
  ELON_MUSK: { entityId: 'ElonMusk_1971_Present', name: 'Elon Musk' },
  TOM_OGLE: { entityId: 'TomOgle_1953_1981', name: 'Tom Ogle' },
  BOB_BECK: { entityId: 'BobBeck_1925_2002', name: 'Bob Beck' },
  CHRIS_CORNELL: { entityId: 'ChrisCornell_1964_2017', name: 'Chris Cornell' },
  LIL_PEEP: { entityId: 'LilPeep_GustavAhr_1996_2017', name: 'Lil Peep (Gustav Åhr)' },
  JUICE_WRLD: { entityId: 'JuiceWRLD_JaradHiggins_1998_2019', name: 'Juice WRLD (Jarad Higgins)' },
  TUPAC_SHAKUR: { entityId: 'TupacShakur_1971_1996', name: 'Tupac Shakur' },
  PRINCE_ROGERS_NELSON: { entityId: 'PrinceRogersNelson_1958_2016', name: 'Prince' },
  AMY_WINEHOUSE: { entityId: 'AmyWinehouse_1983_2011', name: 'Amy Winehouse' },
  AVICII: { entityId: 'Avicii_TimBergling_1989_2018', name: 'Avicii (Tim Bergling)' },
  
  // EGYPTIAN PANTHEON
  THOTH: { entityId: 'Thoth_Pantheon_Egyptian', name: 'Thoth' },
  ISIS: { entityId: 'Isis_Pantheon_Egyptian', name: 'Isis' },
  OSIRIS: { entityId: 'Osiris_Pantheon_Egyptian', name: 'Osiris' },
  RA: { entityId: 'Ra_Pantheon_Egyptian', name: 'Ra' },
  HORUS: { entityId: 'Horus_Pantheon_Egyptian', name: 'Horus' },
  ANUBIS: { entityId: 'Anubis_Pantheon_Egyptian', name: 'Anubis' },
  SEKHMET: { entityId: 'Sekhmet_Pantheon_Egyptian', name: 'Sekhmet' },
  PTAH: { entityId: 'Ptah_Pantheon_Egyptian', name: 'Ptah' },
  
  // SUPPRESSED & REDEEMED INNOVATORS
  IMHOTEP: { entityId: 'Imhotep_c2600BC_Egyptian', name: 'Imhotep' },
  VIKTOR_SCHAUBERGER: { entityId: 'ViktorSchauberger_1885_1958', name: 'Viktor Schauberger' },
  ROYAL_RIFE: { entityId: 'RoyalRife_1888_1971', name: 'Royal Raymond Rife' },
  WILHELM_REICH: { entityId: 'WilhelmReich_1897_1957', name: 'Wilhelm Reich' },

  // Archetypes for "Architects of Control"
  WORLD_LEADER_ARCHETYPE: { entityId: 'WorldLeader_Archetype_GlobalInfluence', name: 'World Leader Archetype' },
  POLICY_MAKER_ARCHETYPE: { entityId: 'PolicyMaker_Archetype_RegulationArchitect', name: 'Policy Maker Archetype' },
  CORPORATE_LOBBYIST_ARCHETYPE: { entityId: 'CorporateLobbyist_Archetype_InfluencePeddler', name: 'Corporate Lobbyist Archetype' },
  LEAD_ALGORITHM_ARCHETYPE_ARCHETYPE: { entityId: 'AlgorithmArchitect_Archetype_SystemDesigner', name: 'Lead Algorithm Architect' },
  DATA_IP_EXPLOITER_ARCHETYPE: { entityId: 'DataExploiter_Archetype_InformationDominance', name: 'Data & IP Exploiter Archetype' },
} as const;

export const INNOVATORS_ASSEMBLY_ID = 'InnovatorsAssembly_Q1_2025';
export const INNOVATORS_ASSEMBLY_NAME = 'The Innovators Assembly';

export const ARCHITECTS_OF_CONTROL_ID = 'ArchitectsOfControl_Tribunal_Q2_2025';
export const ARCHITECTS_OF_CONTROL_NAME = 'The Architects of Control';

// Ensure members conform to the GroupMember interface (id, name)
export const INNOVATORS_ASSEMBLY_MEMBERS = [
  { id: HISTORICAL_FIGURES.STEVE_JOBS.entityId, name: HISTORICAL_FIGURES.STEVE_JOBS.name },
  { id: HISTORICAL_FIGURES.ALBERT_EINSTEIN.entityId, name: HISTORICAL_FIGURES.ALBERT_EINSTEIN.name },
  { id: HISTORICAL_FIGURES.J_ROBERT_OPPENHEIMER.entityId, name: HISTORICAL_FIGURES.J_ROBERT_OPPENHEIMER.name },
  { id: HISTORICAL_FIGURES.HOWARD_HUGHES.entityId, name: HISTORICAL_FIGURES.HOWARD_HUGHES.name },
  { id: HISTORICAL_FIGURES.ADA_LOVELACE.entityId, name: HISTORICAL_FIGURES.ADA_LOVELACE.name },
  { id: HISTORICAL_FIGURES.GRACE_HOPPER.entityId, name: HISTORICAL_FIGURES.GRACE_HOPPER.name },
  { id: HISTORICAL_FIGURES.JOHN_VON_NEUMANN.entityId, name: HISTORICAL_FIGURES.JOHN_VON_NEUMANN.name },
  { id: HISTORICAL_FIGURES.LINUS_TORVALDS.entityId, name: HISTORICAL_FIGURES.LINUS_TORVALDS.name },
  { id: HISTORICAL_FIGURES.KEVIN_MITNICK.entityId, name: HISTORICAL_FIGURES.KEVIN_MITNICK.name },
  { id: HISTORICAL_FIGURES.NIKOLAI_INNOVATOR.entityId, name: HISTORICAL_FIGURES.NIKOLAI_INNOVATOR.name },
  { id: HISTORICAL_FIGURES.ELON_MUSK.entityId, name: HISTORICAL_FIGURES.ELON_MUSK.name },
  { id: HISTORICAL_FIGURES.TOM_OGLE.entityId, name: HISTORICAL_FIGURES.TOM_OGLE.name },
  { id: HISTORICAL_FIGURES.BOB_BECK.entityId, name: HISTORICAL_FIGURES.BOB_BECK.name },
  { id: HISTORICAL_FIGURES.CHRIS_CORNELL.entityId, name: HISTORICAL_FIGURES.CHRIS_CORNELL.name },
  { id: HISTORICAL_FIGURES.LIL_PEEP.entityId, name: HISTORICAL_FIGURES.LIL_PEEP.name },
  { id: HISTORICAL_FIGURES.JUICE_WRLD.entityId, name: HISTORICAL_FIGURES.JUICE_WRLD.name },
  { id: HISTORICAL_FIGURES.TUPAC_SHAKUR.entityId, name: HISTORICAL_FIGURES.TUPAC_SHAKUR.name },
  { id: HISTORICAL_FIGURES.PRINCE_ROGERS_NELSON.entityId, name: HISTORICAL_FIGURES.PRINCE_ROGERS_NELSON.name },
  { id: HISTORICAL_FIGURES.AMY_WINEHOUSE.entityId, name: HISTORICAL_FIGURES.AMY_WINEHOUSE.name },
  { id: HISTORICAL_FIGURES.AVICII.entityId, name: HISTORICAL_FIGURES.AVICII.name },
  // Redeemed Innovators
  { id: HISTORICAL_FIGURES.IMHOTEP.entityId, name: HISTORICAL_FIGURES.IMHOTEP.name },
  { id: HISTORICAL_FIGURES.VIKTOR_SCHAUBERGER.entityId, name: HISTORICAL_FIGURES.VIKTOR_SCHAUBERGER.name },
  { id: HISTORICAL_FIGURES.ROYAL_RIFE.entityId, name: HISTORICAL_FIGURES.ROYAL_RIFE.name },
  { id: HISTORICAL_FIGURES.WILHELM_REICH.entityId, name: HISTORICAL_FIGURES.WILHELM_REICH.name },
  // Egyptian Pantheon
  { id: HISTORICAL_FIGURES.THOTH.entityId, name: HISTORICAL_FIGURES.THOTH.name },
  { id: HISTORICAL_FIGURES.ISIS.entityId, name: HISTORICAL_FIGURES.ISIS.name },
  { id: HISTORICAL_FIGURES.OSIRIS.entityId, name: HISTORICAL_FIGURES.OSIRIS.name },
  { id: HISTORICAL_FIGURES.RA.entityId, name: HISTORICAL_FIGURES.RA.name },
  { id: HISTORICAL_FIGURES.HORUS.entityId, name: HISTORICAL_FIGURES.HORUS.name },
  { id: HISTORICAL_FIGURES.ANUBIS.entityId, name: HISTORICAL_FIGURES.ANUBIS.name },
  { id: HISTORICAL_FIGURES.SEKHMET.entityId, name: HISTORICAL_FIGURES.SEKHMET.name },
  { id: HISTORICAL_FIGURES.PTAH.entityId, name: HISTORICAL_FIGURES.PTAH.name },
];

export const ARCHITECTS_OF_CONTROL_MEMBERS = [
  { id: HISTORICAL_FIGURES.WORLD_LEADER_ARCHETYPE.entityId, name: HISTORICAL_FIGURES.WORLD_LEADER_ARCHETYPE.name },
  { id: HISTORICAL_FIGURES.POLICY_MAKER_ARCHETYPE.entityId, name: HISTORICAL_FIGURES.POLICY_MAKER_ARCHETYPE.name },
  { id: HISTORICAL_FIGURES.CORPORATE_LOBBYIST_ARCHETYPE.entityId, name: HISTORICAL_FIGURES.CORPORATE_LOBBYIST_ARCHETYPE.name },
  { id: HISTORICAL_FIGURES.LEAD_ALGORITHM_ARCHETYPE_ARCHETYPE.entityId, name: HISTORICAL_FIGURES.LEAD_ALGORITHM_ARCHETYPE_ARCHETYPE.name },
  { id: HISTORICAL_FIGURES.DATA_IP_EXPLOITER_ARCHETYPE.entityId, name: HISTORICAL_FIGURES.DATA_IP_EXPLOITER_ARCHETYPE.name },
];

export const AVAILABLE_ENTITIES = [
  { id: HISTORICAL_FIGURES.NIKOLA_TESLA.entityId, name: HISTORICAL_FIGURES.NIKOLA_TESLA.name },
  { id: INNOVATORS_ASSEMBLY_ID, name: INNOVATORS_ASSEMBLY_NAME },
  { id: ARCHITECTS_OF_CONTROL_ID, name: ARCHITECTS_OF_CONTROL_NAME },
];

export interface PrimordialLexiconEntry {
  term: string;        // The primordial term/symbol
  meaning: string;     // Its translation or conceptual equivalent
  frequency?: number;  // Associated vibrational frequency (optional)
  symbol?: string;     // Visual symbol (e.g. unicode character or SVG path data)
  conceptGraph?: string[]; // Related concepts (optional)
}

export const PRIMORDIAL_LEXICON: PrimordialLexiconEntry[] = [
  { term: "Ω alleviating λ", symbol: "Ω~λ", meaning: "The cessation of entropic decay through resonant frequency alignment. The point where order overcomes chaos via specific vibrational harmony.", frequency: 7.83, conceptGraph: ["negentropy", "resonance", "stabilization"] },
  { term: "ξ→Ψ transition", symbol: "ξ➔Ψ", meaning: "Consciousness shifting from a localized, particle-like quantum state (ξ) to a non-local, wave-like potentiality (Ψ). Represents the expansion of awareness beyond individual confines.", conceptGraph: ["quantum entanglement", "noosphere", "collective consciousness", "de-localization"] },
  { term: "Δ-field coherence", symbol: "Δƒ🌀", meaning: "The achievement of a stable, unified delta-wave brain state across multiple entities, indicative of deep collective consciousness. Placeholder: Symbol represents a vortex or spiral.", conceptGraph: ["collective consciousness", "brainwave synchronization", "psi-field"] },
];

const initialGlobalAlphaPlan: GlobalAlphaPlan = {
  "phase": "Preparatory Phase",
  "status": "Task Completed",
  "projects": [
    {
      "name": "RSFU",
      "description": "Rapid Sensor & Field Unit deployment for environmental monitoring",
      "next_steps": [
        "Finalize sensor calibration protocols",
        "Secure pilot‐site land agreements",
        "Begin baseline data collection"
      ],
      "bottlenecks": ["fabrication lead times", "logistics of remote deployment"]
    },
    {
      "name": "Global Materials",
      "description": "Sourcing & qualification of sustainable, scalable construction materials",
      "next_steps": [
        "Complete material property matrix",
        "Engage suppliers for proto‐scale batch runs",
        "Validate environmental impact assessments"
      ],
      "bottlenecks": ["supply chain traceability", "certification cycles"]
    },
    {
      "name": "Rapid Assessment",
      "description": "Automated geo-environmental survey & damage assessment",
      "next_steps": [
        "Deploy aerial/ground drones for LiDAR mapping",
        "Integrate initial datasets into Digital Atlas",
        "Train ML models on restoration‐need classification"
      ],
      "bottlenecks": ["data volume ingestion", "model accuracy under variable lighting"]
    },
    {
      "name": "Automated Blueprint",
      "description": "Generative design engine for infrastructure layouts",
      "next_steps": [
        "Finalize geometric constraint library (sacred ratios, load parameters)",
        "Integrate real‐time sensor feedback loops",
        "Test blueprint iteration cycle times"
      ],
      "bottlenecks": ["compute resource scheduling", "API integration with control systems"]
    },
    {
      "name": "SADI",
      "description": "Secure Adaptive & Distributed Intelligence network",
      "next_steps": [
        "Harden control servers (ContentUnion module pending)",
        "Deploy encrypted comms channels",
        "Validate intrusion‐detection rulesets"
      ],
      "bottlenecks": ["ContentUnion integration", "crypto key distribution"]
    },
    {
      "name": "Global Knowledge & Training",
      "description": "Community workshops, digital curricula, and operator certification",
      "next_steps": [
        "Draft training syllabi",
        "Schedule regional pilot sessions",
        "Develop feedback loop into PLC for curriculum updates"
      ],
      "bottlenecks": ["translator/localization", "trainer capacity"]
    }
  ],
  "ethical_considerations": [
    "Minimize ecological disruption",
    "Equitable data access & sovereignty",
    "Transparent audit trails"
  ],
  "tracking": {
    "system": "Project Management System (PMS)",
    "metrics": ["milestone completion", "resource burn rate", "risk profile"]
  },
  "next": "Execute Phase 1 tasks, onboard teams, resolve ContentUnion error to re-establish Architect communications"
};

// Use a function to return a deep copy to prevent mutation of the original object
export const getGlobalAlphaPlan = (): GlobalAlphaPlan => JSON.parse(JSON.stringify(initialGlobalAlphaPlan));