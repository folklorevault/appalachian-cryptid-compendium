// Images are now served from public/cryptids/

export interface Testimony {
  id: string;
  witness: string;
  date: string;
  location: string;
  account: string;
}

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
  gridImage: string;
  tags: string[];
  region: string;
  // Extended details
  physicalDescription: string;
  behavior: string;
  habitat: string;
  diet: string;
  testimonies: Testimony[];
  notableSightings: string;
  bureauNotes: string;
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
    image: "/cryptids/mothman.webp",
    gridImage: "/cryptids/mothmangrid.webp",
    tags: ["Winged", "Nocturnal", "Omen"],
    region: "appalachia",
    physicalDescription: "Stands approximately 6-7 feet tall with a humanoid body structure. Most distinctive features are enormous moth-like wings spanning 10+ feet and large, luminous red eyes that glow intensely in darkness. Body appears gray or brown with a muscular build. No visible head or neck - eyes positioned directly in torso area.",
    behavior: "Primarily nocturnal. Often observed before major disasters or tragedies. Exhibits intelligence and seems aware of human presence. Known to follow vehicles at high speeds (100+ mph). Emits high-pitched screech. Generally non-aggressive but presence induces fear and anxiety in witnesses.",
    habitat: "Abandoned industrial areas, especially near the TNT area in Point Pleasant. Frequently sighted near bridges and waterways. Prefers areas with minimal human activity during daylight hours.",
    diet: "Unknown. No feeding behavior documented.",
    testimonies: [
      {
        id: "t1",
        witness: "Roger Scarberry & Steve Mallette",
        date: "November 15, 1966",
        location: "TNT Area, Point Pleasant, WV",
        account: "We were driving near the old TNT plant when we saw it. This thing was standing by the road, at least seven feet tall. When our headlights hit it, these red eyes just lit up like reflectors, but brighter. It had wings folded against its back. When we sped up, it took off and followed us - flying right above the car at 100 miles per hour. We've never been so terrified in our lives."
      },
      {
        id: "t2",
        witness: "Linda Scarberry",
        date: "November 15, 1966",
        location: "TNT Area, Point Pleasant, WV",
        account: "Those eyes - I'll never forget those eyes. They were hypnotic, red and glowing. The creature was gray, shaped like a man but bigger. The wings were the worst part - huge, like a moth's but so much larger. I still have nightmares about it chasing our car."
      },
      {
        id: "t3",
        witness: "Marcella Bennett",
        date: "November 16, 1966",
        location: "Point Pleasant, WV",
        account: "I was visiting family when I saw it near the car. It was a large gray figure with glowing red eyes. It rose up behind the car - I dropped my baby's bottle and ran. My daughter started screaming. That thing was real, and it was terrifying. I was so scared I couldn't speak for hours."
      }
    ],
    notableSightings: "1966: First documented sighting near TNT plant in Point Pleasant, WV. Over 100 sightings reported during a 13-month period. 1967: Silver Bridge collapse coincides with abrupt cessation of sightings. 1985: Sighting resurgence begins across West Virginia. 2001: Multiple sightings reported before 9/11 attacks. 2007: Sightings reported before Minnesota bridge collapse. 2023: Recent sighting near abandoned factory in Point Pleasant.",
    bureauNotes: "CLASSIFICATION: HARBINGER. Subject demonstrates consistent correlation with catastrophic events. Recommend continued monitoring of Point Pleasant area. Field agents advised to document all sightings with precise timestamps. DO NOT ENGAGE. Report immediately to Regional Director."
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
    image: "/cryptids/wampuscat.webp",
    gridImage: "/cryptids/wampuscatgrid.webp",
    tags: ["Feline", "Aggressive", "Cherokee Legend"],
    region: "appalachia",
    physicalDescription: "Large feline approximately 4-5 feet in length with six legs - four in normal positions plus two additional front legs. Covered in dark, matted fur. Eyes are yellowish-green and reflect light powerfully. Pronounced canine teeth. Muscular build, estimated weight 200-300 pounds. Moves with unnatural fluidity.",
    behavior: "Extremely territorial and aggressive when encountered. Capable of supernatural speed and can run on four or six legs. Hunts at night. Known to attack livestock and occasionally threaten humans. Emits bloodcurdling screams. Cherokee legend associates it with a woman cursed for spying on sacred rituals.",
    habitat: "Dense Appalachian forests, particularly in Eastern Tennessee. Prefers mountainous terrain with heavy tree cover. Often found near caves or rock formations. Territory ranges 50+ square miles.",
    diet: "Carnivorous. Preys on deer, wild boar, livestock. Evidence of cattle mutilations attributed to Wampus Cat attacks.",
    testimonies: [
      {
        id: "t1",
        witness: "James Whitaker",
        date: "March 1978",
        location: "Cherokee National Forest, TN",
        account: "I was hunting at dusk when I heard the most god-awful scream. Then I saw it - this huge cat, but it had too many legs. Six legs. It moved like nothing I'd ever seen, faster than should be possible. Those eyes... they glowed green in my flashlight. It circled me for what felt like hours before disappearing into the brush."
      },
      {
        id: "t2",
        witness: "Sarah Running Deer",
        date: "October 1995",
        location: "Great Smoky Mountains, TN",
        account: "My grandmother told me stories about the Wampus Cat - about the woman who was cursed. I never believed until I saw it with my own eyes. It killed two of our calves in one night. We found tracks - six-toed prints, each as big as my hand. The elders say it's a warning when the Wampus Cat returns."
      }
    ],
    notableSightings: "Pre-1800s: Cherokee oral traditions establish Wampus Cat legend. 1920s: First documented encounter by settlers in Eastern Tennessee. 1978: Hunter's terrifying encounter with six-legged cat in Cherokee National Forest. 1995: Livestock killings attributed to Wampus Cat near Great Smoky Mountains. 2012: Trail camera captures unclear six-legged figure. 2023: Recent sighting with photographic evidence in Polk County, TN.",
    bureauNotes: "CLASSIFICATION: APEX PREDATOR. Extreme caution advised. Subject displays territorial aggression and supernatural speed. Cherokee cultural advisors consulted - recommend respecting traditional boundaries. Livestock owners in affected areas have been provided cover story. Armed response authorized only in defense of human life."
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
    image: "/cryptids/mooneyedperson.webp",
    gridImage: "/cryptids/mooneyedgrid.webp",
    tags: ["Humanoid", "Nocturnal", "Ancient"],
    region: "appalachia",
    physicalDescription: "Humanoid beings standing 5-6 feet tall with unusually pale, almost luminescent skin. Most striking feature is oversized eyes adapted for nocturnal vision - reportedly sensitive to daylight. Slender build with delicate features. Some accounts describe them wearing primitive clothing or animal skins.",
    behavior: "Nocturnal and extremely reclusive. Avoid human contact whenever possible. Cherokee legends describe them as peaceful, living in organized communities. Built sophisticated stone structures. Allegedly fled or were driven out by Cherokee ancestors. Photophobic - cannot tolerate direct sunlight.",
    habitat: "Originally inhabited areas now part of Cherokee National Forest and surrounding Appalachian regions. Associated with ancient stone formations and structures predating known Native American settlements. Prefer caves and dense forest areas for daytime shelter.",
    diet: "Believed to be omnivorous. Historical accounts suggest they cultivated crops and foraged. Possibly hunted small game at night.",
    testimonies: [
      {
        id: "t1",
        witness: "Dr. Benjamin Harmon",
        date: "August 1987",
        location: "Cherokee National Forest, NC",
        account: "As an anthropologist studying Cherokee oral histories, I never expected to encounter what they described. During a night survey near ancient stone structures, I saw three pale figures moving between the trees. Their eyes reflected my flashlight with an unusual silver glow. They moved silently, deliberately, and when they noticed me, they vanished into the forest with remarkable speed."
      },
      {
        id: "t2",
        witness: "Cherokee Elder Thomas Swimmer",
        date: "June 2001",
        location: "Western North Carolina",
        account: "My grandfather's grandfather told stories of the Moon-Eyed People. They were here before us, building in stone. They couldn't bear the sun and lived in darkness. The old stories say they were driven west, but some believe they went underground, into the deep caves. Sometimes, on dark nights near the old stone walls, people still see them."
      }
    ],
    notableSightings: "Pre-1000 AD: Moon-Eyed People allegedly inhabit region, build stone structures. 1000s: Cherokee oral traditions describe displacement of Moon-Eyed People. 1797: First written account by Benjamin Smith Barton. 1920s: Archaeological interest in pre-Cherokee stone structures increases. 1987: Anthropologist encounters pale humanoid figures in Cherokee National Forest. 2024: Recent night sighting near ancient stone formation in Murphy, NC.",
    bureauNotes: "CLASSIFICATION: INDIGENOUS REMNANT. Non-hostile. Subject population appears to be surviving members of pre-Cherokee civilization. Photophobic condition confirmed. Bureau maintains protective surveillance of known habitation sites. Archaeological excavation requests to be denied under Cultural Preservation Protocol 7-C. Contact attempts NOT authorized."
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
    image: "/cryptids/skunkape.webp",
    gridImage: "/cryptids/skunkapegrid.webp",
    tags: ["Bipedal", "Primate", "Malodorous"],
    region: "southeast",
    physicalDescription: "Large bipedal primate standing 6-8 feet tall, weighing an estimated 300-500 pounds. Covered in reddish-brown to dark brown hair with lighter coloring on chest and face. Pronounced brow ridge, flat nose, and powerful build. Leaves 15-17 inch footprints. Most distinctive characteristic is overwhelming sulfurous odor.",
    behavior: "Primarily nocturnal but occasionally active during day in remote areas. Generally avoids human contact but has been known to investigate campsites and residential areas. Not typically aggressive but has charged at humans when surprised. Territorial behavior observed. Strong swimmer, often seen near water.",
    habitat: "Florida Everglades and surrounding swamplands. Also reported in Big Cypress National Preserve and Myakka River State Park. Prefers dense vegetation near water sources. Constructs rudimentary shelters from vegetation.",
    diet: "Omnivorous. Diet includes fish, berries, roots, small mammals. Known to raid agricultural areas for crops. Several accounts of Skunk Apes taking fish from coolers and approaching houses for food.",
    testimonies: [
      {
        id: "t1",
        witness: "Anonymous Sarasota Resident",
        date: "September 2000",
        location: "Myakka River, Sarasota, FL",
        account: "The smell hit us first - like rotten eggs and death. Then we saw it in our yard, this huge ape-like thing. I took photos - you can see it clear as day. It was at least seven feet tall, covered in dark reddish hair. When it noticed us, it just walked off into the swamp. My husband wanted to follow but that smell... nobody could stand being that close."
      },
      {
        id: "t2",
        witness: "Dave Shealy",
        date: "July 1998",
        location: "Ochopee, FL",
        account: "I've been tracking the Skunk Ape for years. That day, I finally got my chance. I was on my airboat when I saw it crossing through shallow water about 50 yards away. It was massive, walking on two legs like a man but covered in dark hair. I grabbed my camera and got several shots before it disappeared into the sawgrass. The smell lingered for hours."
      }
    ],
    notableSightings: "1818: Early Spanish explorer accounts of 'devil monkeys' in Florida. 1960s: Modern Skunk Ape reports begin to increase across South Florida. 1974: Multiple sightings lead to organized searches in Everglades. 1998: Dave Shealy captures video footage in Ochopee. 2000: Famous Myakka photographs taken in Sarasota County. 2023: Trail camera captures large bipedal figure in Big Cypress Preserve.",
    bureauNotes: "CLASSIFICATION: PRIMATE UNKNOWN. Subject appears to be surviving population of undocumented great ape species. Distinctive odor useful for early detection. Florida Fish & Wildlife cooperating under Operation Swamp Watch. Public attribution to 'escaped exotic animals' effective. Capture attempts suspended after 1974 incident - observe and document only."
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
    image: "/cryptids/lizardman.webp",
    gridImage: "/cryptids/lizardmangrid.webp",
    tags: ["Reptilian", "Aggressive", "Bipedal"],
    region: "southeast",
    physicalDescription: "Bipedal reptilian humanoid standing 7 feet tall. Muscular build estimated at 300 pounds. Covered in green scaly skin with texture resembling alligator hide. Head features include glowing red eyes, no visible nose or ears. Hands have three fingers with sharp claws. Feet are three-toed with webbing. Tail reported in some sightings.",
    behavior: "Highly aggressive and territorial. Exhibits unusual strength - capable of causing significant damage to vehicles. Primarily nocturnal hunter. Shows intelligence in stalking behavior. Known to attack vehicles that enter its territory. May be attracted to water sources and prey animals.",
    habitat: "Scape Ore Swamp area in Lee County, South Carolina. Prefers dense swampland with heavy vegetation. Often sighted near abandoned buildings and bridges over water. Territory appears to center around specific section of swamp.",
    diet: "Carnivorous predator. Evidence suggests diet includes fish, small mammals, and possibly livestock. Powerful jaws indicate capability to consume large prey.",
    testimonies: [
      {
        id: "t1",
        witness: "Christopher Davis",
        date: "June 29, 1988",
        location: "Scape Ore Swamp, Bishopville, SC",
        account: "I was driving home at 2 AM when I had a blowout near the swamp. While I was changing the tire, I heard something running towards me. This thing came out of the darkness - seven feet tall, green scales, red eyes. It jumped on my car and tried to get in! I could see three claws on each hand scraping the roof. I drove away with it still hanging on. It finally jumped off but left deep scratches in the metal."
      },
      {
        id: "t2",
        witness: "Tom & Mary Waye",
        date: "August 1988",
        location: "Lee County, SC",
        account: "We woke up to our car alarm going off. When Tom went outside, the car was damaged - deep scratches and dents like something attacked it. The chrome was partially ripped off. We found three-toed tracks in the mud leading to the swamp. Our neighbor said he saw a large green creature the week before. We don't go near that swamp anymore."
      }
    ],
    notableSightings: "1988: Christopher Davis encounter launches modern legend at Scape Ore Swamp. Multiple vehicle attacks reported in two-month period across Lee County. 1990: Sightings reported along Lynches River. 2008: Couple reports sighting near swamp at night in Bishopville. 2015: Trail camera captures unclear bipedal figure. 2023: Fresh three-toed tracks found near Scape Ore Swamp.",
    bureauNotes: "CLASSIFICATION: HOSTILE ENTITY. EXTREME CAUTION. Subject displays unprecedented aggression toward vehicles and humans. Possible territorial behavior centered on Scape Ore Swamp. Night travel through affected area strongly discouraged. Local law enforcement briefed under Protocol Red. Physical evidence (vehicle damage, tracks) to be collected and catalogued. Armed field teams on standby."
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
    image: "/cryptids/foukemonster.webp",
    gridImage: "/cryptids/foukemonstergrid.webp",
    tags: ["Bipedal", "Primate", "Large"],
    region: "southern",
    physicalDescription: "Massive bipedal creature standing 7-10 feet tall with estimated weight of 250-400 pounds. Covered in long dark hair or fur, appearing reddish-brown in sunlight. Broad shoulders and muscular build. Long arms extending past knees. Face shows ape-like features. Leaves distinctive three-toed footprints measuring up to 14 inches.",
    behavior: "Primarily nocturnal but sometimes active at dusk. Known to approach human habitations, particularly isolated houses. Has attacked buildings and reached through windows. Generally avoids direct confrontation but displays aggressive behavior when cornered or surprised. Emits loud howls and grunts.",
    habitat: "Boggy Creek area near Fouke, Arkansas. Prefers dense bottomland forests and swampy areas. Often sighted near water sources. Has established territory in remote sections of Miller County. Associated with Sulphur River bottoms.",
    diet: "Omnivorous. Diet believed to include fish, small mammals, roots, and berries. Has raided chicken coops and pig pens. Some accounts describe it catching fish with its hands.",
    testimonies: [
      {
        id: "t1",
        witness: "Bobby Ford",
        date: "May 1971",
        location: "Fouke, Arkansas",
        account: "That thing attacked our house. I was asleep when my wife started screaming. This creature - it had to be eight feet tall - was reaching through the window trying to grab her. I got my gun and fired at it. It roared and ran off into the woods. We found huge three-toed tracks in the mud around our house. The whole screen was ripped off the window."
      },
      {
        id: "t2",
        witness: "D.C. Woods Jr.",
        date: "May 1971",
        location: "Near Fouke, AR",
        account: "My brother Bobby and I went out looking for that thing after it attacked their house. We tracked it to Boggy Creek. The smell was terrible - like a wet dog times a hundred. We heard it moving through the brush, breaking branches. Then we saw it - massive, covered in dark hair, walking upright. It let out this howl that made our blood run cold. We got out of there fast."
      }
    ],
    notableSightings: "1851: First reported encounter in Arkansas bottomlands, Miller County. 1946: Sightings reported near Jonesville. 1971: Famous attacks on Ford house in Fouke, AR. 1972: Documentary film 'The Legend of Boggy Creek' brings national attention. 1997: Renewed sightings lead to investigation. 2023: Trail camera captures large bipedal figure in Boggy Creek region.",
    bureauNotes: "CLASSIFICATION: PRIMATE UNKNOWN - AGGRESSIVE. Subject has demonstrated willingness to approach and attack human habitations. Unlike other Sasquatch-type entities, shows reduced fear of humans. Boggy Creek bottomlands designated Restricted Research Zone. Local tourism has complicated containment - cover story maintained via 'legend' narrative. Field agents deployed during high-activity periods."
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
    image: "/cryptids/tailypo.webp",
    gridImage: "/cryptids/tailypogrid.webp",
    tags: ["Small", "Persistent", "Folklore"],
    region: "appalachia",
    physicalDescription: "Small to medium-sized creature described as cat-like in appearance. Covered in black or dark gray fur. Most distinctive feature is an extremely long, sinuous tail. Eyes glow yellow or amber in darkness. Size estimates vary from house cat to medium dog. Elongated face with pronounced teeth. Moves with unnatural fluidity.",
    behavior: "Nocturnal and persistent. Legend describes relentless pursuit of lost tail. Capable of entering homes through small openings. Produces distinctive vocalization: 'Tailypo, tailypo, all I want's my tailypo.' Shows single-minded determination and inability to be deterred. Not overtly aggressive unless provoked, but presence is deeply unsettling.",
    habitat: "Deep Appalachian forests, particularly in Tennessee and North Carolina mountains. Associated with isolated cabins and remote settlements. Prefers areas with minimal human presence. Often heard but rarely seen clearly.",
    diet: "Unknown. Original legend suggests it may have entered cabin seeking food. No confirmed feeding behavior documented.",
    testimonies: [
      {
        id: "t1",
        witness: "Adapted from traditional folktale",
        date: "1800s (legendary)",
        location: "Tennessee mountains",
        account: "An old man living alone in the mountains was cooking stew when this creature came in through a crack. He caught it and cut off its tail for his supper. That night, he heard scratching and a voice calling 'Tailypo, tailypo, give me my tailypo.' Each night it came back, getting closer. By the third night, it was in his cabin, on his bed. His dogs tried to chase it but never could catch it. Some say the old man was never seen again."
      },
      {
        id: "t2",
        witness: "Margaret Atkins",
        date: "October 1978",
        location: "Cocke County, TN",
        account: "We heard scratching on our cabin walls for three nights straight. Each night, we'd hear this voice - raspy, inhuman - calling out 'Where's my tail, where's my tail.' On the third night, I saw it through the window. Small, dark, with these glowing eyes and a tail that seemed too long for its body. We left the next morning and never went back to that cabin."
      }
    ],
    notableSightings: "1800s: Original legend established in Appalachian oral tradition across Tennessee/North Carolina mountains. 1920s: First written versions of tale published. 1978: Modern encounter reported near remote cabin in Cocke County, TN. 1990s: Researchers collect multiple similar accounts across Appalachian region. 2015: Hikers report hearing 'tailypo' calls in Great Smoky Mountains. 2024: Recent sighting near isolated mountain cabin in Eastern Tennessee.",
    bureauNotes: "CLASSIFICATION: PERSISTENCE ENTITY. Subject exhibits behavior consistent with obsessive retrieval patterns. Vocalizations confirmed by multiple independent witnesses. Bureau theory: possible psychic imprint phenomenon rather than biological entity. Remote cabin locations remain highest risk. Agents advised: if encounter occurs, DO NOT take any physical samples or souvenirs from subject. See Case File TLP-1889 for context."
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
    image: "/cryptids/graftonmonster.webp",
    gridImage: "/cryptids/graftonmonstergrid.webp",
    tags: ["Large", "White", "Docile"],
    region: "appalachia",
    physicalDescription: "Massive humanoid entity standing 8-9 feet tall. Chalk white or pale gray in color with smooth, seal-like skin. Most unusual feature is apparent lack of head - eyes and mouth appear to be embedded directly in the torso/shoulder area. No visible neck. Large, muscular body. Moves with surprising grace despite size. Some accounts describe a foul odor.",
    behavior: "Rarely aggressive despite imposing appearance. Generally flees when confronted by humans. Curious behavior observed - approaches vehicles and observers before departing. Nocturnal activity. Shows intelligence in avoiding capture or prolonged observation. No documented attacks despite fearsome appearance.",
    habitat: "Originally sighted in Grafton, West Virginia area. Associated with rural roads and abandoned buildings. Prefers areas near water. Has been reported across Taylor County. Not territorial - seems to wander widely.",
    diet: "Unknown. No feeding behavior ever documented. Lack of visible mouth structure makes diet a mystery.",
    testimonies: [
      {
        id: "t1",
        witness: "Robert Cockrell",
        date: "June 16, 1964",
        location: "Riverside Drive, Grafton, WV",
        account: "I was driving home late when my headlights hit this thing standing by the road. It was huge - maybe nine feet tall and white as a sheet. The weird part? It didn't have a head. The face was in its chest or something. These eyes just stared at me from where the neck should be. I floored it and got out of there. I've never been so terrified in my life."
      },
      {
        id: "t2",
        witness: "Reporter from Grafton Sentinel",
        date: "June 1964",
        location: "Grafton, WV",
        account: "We interviewed multiple witnesses following the initial sighting. The descriptions were remarkably consistent - a tall, white, apparently headless figure. The witnesses were clearly shaken. Whatever they saw, it was real to them. The town was in an uproar for weeks. People were afraid to go out at night."
      }
    ],
    notableSightings: "1964: First documented sighting by Robert Cockrell in Grafton, WV. Multiple sightings follow in June and July across Taylor County. 1965: Sporadic reports continue in Grafton area. 1994: Sighting reported near abandoned factory. 2015: Late-night encounter on rural road in Taylor County. 2023: Recent sighting matches original description near Grafton.",
    bureauNotes: "CLASSIFICATION: ANOMALOUS HUMANOID. Non-aggressive despite fearsome appearance. Anatomical structure defies known biology - apparent 'headless' configuration requires further study. Subject demonstrates curiosity toward vehicles and human observers. No recorded attacks in 60+ years of documentation. Approach with caution but lethal force NOT authorized. Priority: photographic documentation of facial/sensory arrangement."
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
    image: "/cryptids/whitescreamer.webp",
    gridImage: "/cryptids/whitescreamergrid.webp",
    tags: ["Vocal", "Elusive", "Mountain"],
    region: "appalachia",
    physicalDescription: "Ghostly white or pale apparition, typically described as deer-like in form though details are difficult to confirm due to mist-like quality. Size varies in reports from normal deer size to much larger. Most notable feature is the spectral white coloration and seeming ability to blend with fog or mist. Some accounts describe glowing eyes. Movement appears unnatural, sometimes seeming to float.",
    behavior: "Produces bloodcurdling, anguished screams that echo through mountain valleys. Rarely seen but frequently heard. Appears in or near thick fog or mist. Generally flees if approached. Screams often described as combining human and animal qualities. Most active during early morning hours. May be territorial, as screams often heard in same locations repeatedly.",
    habitat: "High elevations in Appalachian mountains, particularly in Tennessee and North Carolina. Associated with misty valleys and fog-prone areas. Often sighted near mountain gaps and passes. Prefers remote, isolated areas away from human habitation.",
    diet: "Unknown. If the creature is indeed similar to deer, diet would be herbivorous, but this is speculation.",
    testimonies: [
      {
        id: "t1",
        witness: "Harold Jenkins",
        date: "November 1982",
        location: "Cades Cove, TN",
        account: "I was hunting before dawn when I heard the most terrible scream. It echoed through the valley - not like any animal I've ever heard. Then I saw it through the mist, this white shape moving between the trees. It looked like a deer but wrong somehow, too pale, moving too smoothly. When it screamed again, every hair on my body stood up. I've hunted these mountains for forty years and I've never heard anything like it."
      },
      {
        id: "t2",
        witness: "Sarah McKenzie",
        date: "March 2010",
        location: "Blue Ridge Parkway, NC",
        account: "My husband and I were camping when we woke to this screaming. It sounded almost human but more primal, anguished. We looked outside and saw this pale white figure in the fog. It was hard to make out details but it seemed to be floating above the ground. The screaming went on for maybe two minutes, then it was gone. We packed up and left at first light."
      }
    ],
    notableSightings: "1920s: Early accounts emerge in Appalachian folklore across Tennessee mountains. 1950s: Multiple hikers report mysterious screams in Great Smoky Mountains. 1982: Hunter encounters white figure in mist at Cades Cove. 1995: Audio recording captures unexplained screams along Appalachian Trail. 2010: Campers witness screaming white apparition near Blue Ridge Parkway. 2024: Recent reports of early morning screams at Roan Mountain, TN.",
    bureauNotes: "CLASSIFICATION: ATMOSPHERIC PHENOMENON. Subject may represent intersection of wildlife and meteorological conditions, though biological origin not ruled out. Screams recorded at frequencies outside normal cervid range. Mist-association suggests possible dimensional aspect - cross-reference with Appalachian 'thin places' research. Audio capture remains priority. Witnesses report profound emotional response - psychological support protocols in place for affected field agents."
  }
];
