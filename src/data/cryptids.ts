import mothmanImg from "@/assets/mothman.jpg";
import wampusCatImg from "@/assets/wampus-cat.jpg";
import moonEyedPeopleImg from "@/assets/moon-eyed-people.jpg";
import skunkApeImg from "@/assets/skunk-ape.jpg";
import lizardManImg from "@/assets/lizard-man.jpg";
import foukeMonsterImg from "@/assets/fouke-monster.jpg";
import tailypoImg from "@/assets/tailypo.jpg";
import graftonMonsterImg from "@/assets/grafton-monster.jpg";
import whiteScreamerImg from "@/assets/white-screamer.jpg";

export interface Cryptid {
  id: string;
  name: string;
  scientificName: string;
  location: string;
  lastSighting: string;
  dangerLevel: "Low" | "Medium" | "High";
  sightings: number;
  description: string;
  image: string;
  tags: string[];
  region: string;
}

export const cryptids: Cryptid[] = [
  {
    id: "mothman",
    name: "Mothman",
    scientificName: "Lepidoptera giganteus",
    location: "Point Pleasant, West Virginia",
    lastSighting: "November 2023",
    dangerLevel: "Medium",
    sightings: 127,
    description: "Large humanoid creature with massive wings and glowing red eyes. Often appears before disasters. Witnesses report a chilling screech and an overwhelming sense of dread.",
    image: mothmanImg,
    tags: ["Winged", "Nocturnal", "Omen"],
    region: "appalachia"
  },
  {
    id: "wampus-cat",
    name: "Wampus Cat",
    scientificName: "Felis hexapodus",
    location: "Eastern Tennessee",
    lastSighting: "August 2023",
    dangerLevel: "High",
    sightings: 89,
    description: "Six-legged feline creature of Cherokee legend. Known for supernatural speed and yellowish-green eyes that glow in darkness. Extremely territorial and aggressive when threatened.",
    image: wampusCatImg,
    tags: ["Feline", "Aggressive", "Cherokee Legend"],
    region: "appalachia"
  },
  {
    id: "moon-eyed-people",
    name: "Moon-Eyed People",
    scientificName: "Homo nocturnalis",
    location: "Cherokee National Forest, North Carolina",
    lastSighting: "March 2024",
    dangerLevel: "Low",
    sightings: 34,
    description: "Pale-skinned nocturnal humanoids with large, light-sensitive eyes. Cherokee legends describe them as peaceful but elusive beings who built ancient stone structures.",
    image: moonEyedPeopleImg,
    tags: ["Humanoid", "Nocturnal", "Ancient"],
    region: "appalachia"
  },
  {
    id: "skunk-ape",
    name: "Skunk Ape",
    scientificName: "Pongidae floridanus",
    location: "Everglades, Florida",
    lastSighting: "December 2023",
    dangerLevel: "Medium",
    sightings: 156,
    description: "Florida's answer to Bigfoot. Bipedal ape-like creature covered in reddish-brown hair. Named for its powerful, sulfurous odor that announces its presence from hundreds of feet away.",
    image: skunkApeImg,
    tags: ["Bipedal", "Primate", "Malodorous"],
    region: "southeast"
  },
  {
    id: "lizard-man",
    name: "Lizard Man of Scape Ore",
    scientificName: "Lacerta bipedis",
    location: "Scape Ore Swamp, South Carolina",
    lastSighting: "July 2023",
    dangerLevel: "High",
    sightings: 67,
    description: "Seven-foot tall reptilian humanoid with green scaly skin and three-fingered hands. Known for aggressive behavior and superhuman strength. Multiple vehicle attacks documented.",
    image: lizardManImg,
    tags: ["Reptilian", "Aggressive", "Bipedal"],
    region: "southeast"
  },
  {
    id: "fouke-monster",
    name: "Fouke Monster",
    scientificName: "Anthropoidus arkansus",
    location: "Fouke, Arkansas",
    lastSighting: "October 2023",
    dangerLevel: "Medium",
    sightings: 93,
    description: "Massive ape-like creature standing 7-10 feet tall. Covered in dark hair with broad shoulders and long arms. Leaves three-toed tracks and emits foul odor.",
    image: foukeMonsterImg,
    tags: ["Bipedal", "Primate", "Large"],
    region: "southern"
  },
  {
    id: "tailypo",
    name: "Tailypo",
    scientificName: "Caudatus mysterius",
    location: "Appalachian Mountains",
    lastSighting: "February 2024",
    dangerLevel: "Medium",
    sightings: 52,
    description: "Small, cat-like creature with yellow eyes and a distinctive long tail. Legend tells of its relentless pursuit to reclaim its severed tail. Known for its haunting cry: 'Tailypo, tailypo.'",
    image: tailypoImg,
    tags: ["Small", "Persistent", "Folklore"],
    region: "appalachia"
  },
  {
    id: "grafton-monster",
    name: "Grafton Monster",
    scientificName: "Corpus albidus",
    location: "Grafton, West Virginia",
    lastSighting: "September 2023",
    dangerLevel: "Low",
    sightings: 41,
    description: "Massive white creature standing 8-9 feet tall. Appears headless with eyes and mouth embedded in torso. Smooth, seal-like skin. Despite imposing appearance, no aggressive encounters reported.",
    image: graftonMonsterImg,
    tags: ["Large", "White", "Docile"],
    region: "appalachia"
  },
  {
    id: "white-screamer",
    name: "White Screamer",
    scientificName: "Ululans candidus",
    location: "Appalachian Highlands",
    lastSighting: "January 2024",
    dangerLevel: "Low",
    sightings: 28,
    description: "Ghostly white creature that produces bloodcurdling screams echoing through mountain valleys. Rarely seen, more often heard. Witnesses describe a deer-like form shrouded in mist.",
    image: whiteScreamerImg,
    tags: ["Vocal", "Elusive", "Mountain"],
    region: "appalachia"
  }
];
