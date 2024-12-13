export interface Preset {
  id: string
  name: string
}

export const presets: Preset[] = [
  {
    id: "personalstatementwriting",
    name: "Personal Statement Writing",
  },
  {
    id: "nexusletterwriting",
    name: "Nexus Letter Writing",
  },
  {
    id: "researchpod",
    name: "Research Pod",
  },
  {
    id: "strategyplanning",
    name: "Strategy Planning Pod",
  }]