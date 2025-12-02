-- Seed data for Cryptid Directory
-- Run with: wrangler d1 execute cryptid-db --local --file=./db/seed.sql

-- Insert Mothman
INSERT INTO cryptids (id, name, scientific_name, location, region, last_sighting, danger_level, sightings, description, image, tags, physical_description, behavior, habitat, diet)
VALUES (
  'mothman',
  'Mothman',
  'Lepidoptera giganteus',
  'Point Pleasant, West Virginia',
  'appalachia',
  'November 2023',
  'Medium',
  127,
  'Large humanoid creature with massive wings and glowing red eyes. Often appears before disasters. Witnesses report a chilling screech and an overwhelming sense of dread.',
  '/assets/mothman.jpg',
  '["Winged", "Nocturnal", "Omen"]',
  'Stands approximately 6-7 feet tall with a humanoid body structure. Most distinctive features are enormous moth-like wings spanning 10+ feet and large, luminous red eyes that glow intensely in darkness. Body appears gray or brown with a muscular build. No visible head or neck - eyes positioned directly in torso area.',
  'Primarily nocturnal. Often observed before major disasters or tragedies. Exhibits intelligence and seems aware of human presence. Known to follow vehicles at high speeds (100+ mph). Emits high-pitched screech. Generally non-aggressive but presence induces fear and anxiety in witnesses.',
  'Abandoned industrial areas, especially near the TNT area in Point Pleasant. Frequently sighted near bridges and waterways. Prefers areas with minimal human activity during daylight hours.',
  'Unknown. No feeding behavior documented.'
);

INSERT INTO testimonies (id, cryptid_id, witness, date, location, account) VALUES
  ('mothman-t1', 'mothman', 'Roger Scarberry & Steve Mallette', 'November 15, 1966', 'TNT Area, Point Pleasant, WV', 'We were driving near the old TNT plant when we saw it. This thing was standing by the road, at least seven feet tall. When our headlights hit it, these red eyes just lit up like reflectors, but brighter. It had wings folded against its back. When we sped up, it took off and followed us - flying right above the car at 100 miles per hour. We''ve never been so terrified in our lives.'),
  ('mothman-t2', 'mothman', 'Linda Scarberry', 'November 15, 1966', 'TNT Area, Point Pleasant, WV', 'Those eyes - I''ll never forget those eyes. They were hypnotic, red and glowing. The creature was gray, shaped like a man but bigger. The wings were the worst part - huge, like a moth''s but so much larger. I still have nightmares about it chasing our car.'),
  ('mothman-t3', 'mothman', 'Marcella Bennett', 'November 16, 1966', 'Point Pleasant, WV', 'I was visiting family when I saw it near the car. It was a large gray figure with glowing red eyes. It rose up behind the car - I dropped my baby''s bottle and ran. My daughter started screaming. That thing was real, and it was terrifying. I was so scared I couldn''t speak for hours.');

INSERT INTO timeline_events (id, cryptid_id, year, event, location) VALUES
  ('mothman-e1', 'mothman', '1966', 'First documented sighting near TNT plant', 'Point Pleasant, WV'),
  ('mothman-e2', 'mothman', '1966-1967', 'Over 100 sightings reported during 13-month period', 'Point Pleasant area, WV'),
  ('mothman-e3', 'mothman', '1967', 'Silver Bridge collapse; Mothman sightings cease abruptly', 'Point Pleasant, WV'),
  ('mothman-e4', 'mothman', '1985', 'Sighting resurgence begins', 'West Virginia'),
  ('mothman-e5', 'mothman', '2001', 'Multiple sightings reported before 9/11 attacks', 'Various US locations'),
  ('mothman-e6', 'mothman', '2007', 'Sightings reported before Minnesota bridge collapse', 'Minneapolis, MN'),
  ('mothman-e7', 'mothman', '2023', 'Recent sighting near abandoned factory', 'Point Pleasant, WV');

-- Insert Wampus Cat
INSERT INTO cryptids (id, name, scientific_name, location, region, last_sighting, danger_level, sightings, description, image, tags, physical_description, behavior, habitat, diet)
VALUES (
  'wampus-cat',
  'Wampus Cat',
  'Felis hexapodus',
  'Eastern Tennessee',
  'appalachia',
  'August 2023',
  'High',
  89,
  'Six-legged feline creature of Cherokee legend. Known for supernatural speed and yellowish-green eyes that glow in darkness. Extremely territorial and aggressive when threatened.',
  '/assets/wampus-cat.jpg',
  '["Feline", "Aggressive", "Cherokee Legend"]',
  'Large feline approximately 4-5 feet in length with six legs - four in normal positions plus two additional front legs. Covered in dark, matted fur. Eyes are yellowish-green and reflect light powerfully. Pronounced canine teeth. Muscular build, estimated weight 200-300 pounds. Moves with unnatural fluidity.',
  'Extremely territorial and aggressive when encountered. Capable of supernatural speed and can run on four or six legs. Hunts at night. Known to attack livestock and occasionally threaten humans. Emits bloodcurdling screams. Cherokee legend associates it with a woman cursed for spying on sacred rituals.',
  'Dense Appalachian forests, particularly in Eastern Tennessee. Prefers mountainous terrain with heavy tree cover. Often found near caves or rock formations. Territory ranges 50+ square miles.',
  'Carnivorous. Preys on deer, wild boar, livestock. Evidence of cattle mutilations attributed to Wampus Cat attacks.'
);

INSERT INTO testimonies (id, cryptid_id, witness, date, location, account) VALUES
  ('wampus-t1', 'wampus-cat', 'James Whitaker', 'March 1978', 'Cherokee National Forest, TN', 'I was hunting at dusk when I heard the most god-awful scream. Then I saw it - this huge cat, but it had too many legs. Six legs. It moved like nothing I''d ever seen, faster than should be possible. Those eyes... they glowed green in my flashlight. It circled me for what felt like hours before disappearing into the brush.'),
  ('wampus-t2', 'wampus-cat', 'Sarah Running Deer', 'October 1995', 'Great Smoky Mountains, TN', 'My grandmother told me stories about the Wampus Cat - about the woman who was cursed. I never believed until I saw it with my own eyes. It killed two of our calves in one night. We found tracks - six-toed prints, each as big as my hand. The elders say it''s a warning when the Wampus Cat returns.');

INSERT INTO timeline_events (id, cryptid_id, year, event, location) VALUES
  ('wampus-e1', 'wampus-cat', 'Pre-1800s', 'Cherokee oral traditions establish Wampus Cat legend', 'Cherokee territories'),
  ('wampus-e2', 'wampus-cat', '1920s', 'First documented encounter by settlers', 'Eastern Tennessee'),
  ('wampus-e3', 'wampus-cat', '1978', 'Hunter''s encounter with six-legged cat', 'Cherokee National Forest'),
  ('wampus-e4', 'wampus-cat', '1995', 'Livestock killings attributed to Wampus Cat', 'Great Smoky Mountains'),
  ('wampus-e5', 'wampus-cat', '2012', 'Trail camera captures unclear six-legged figure', 'Eastern TN mountains'),
  ('wampus-e6', 'wampus-cat', '2023', 'Recent sighting with photographic evidence', 'Polk County, TN');

-- Insert Moon-Eyed People
INSERT INTO cryptids (id, name, scientific_name, location, region, last_sighting, danger_level, sightings, description, image, tags, physical_description, behavior, habitat, diet)
VALUES (
  'moon-eyed-people',
  'Moon-Eyed People',
  'Homo nocturnalis',
  'Cherokee National Forest, North Carolina',
  'appalachia',
  'March 2024',
  'Low',
  34,
  'Pale-skinned nocturnal humanoids with large, light-sensitive eyes. Cherokee legends describe them as peaceful but elusive beings who built ancient stone structures.',
  '/assets/moon-eyed-people.jpg',
  '["Humanoid", "Nocturnal", "Ancient"]',
  'Humanoid beings standing 5-6 feet tall with unusually pale, almost luminescent skin. Most striking feature is oversized eyes adapted for nocturnal vision - reportedly sensitive to daylight. Slender build with delicate features. Some accounts describe them wearing primitive clothing or animal skins.',
  'Nocturnal and extremely reclusive. Avoid human contact whenever possible. Cherokee legends describe them as peaceful, living in organized communities. Built sophisticated stone structures. Allegedly fled or were driven out by Cherokee ancestors. Photophobic - cannot tolerate direct sunlight.',
  'Originally inhabited areas now part of Cherokee National Forest and surrounding Appalachian regions. Associated with ancient stone formations and structures predating known Native American settlements. Prefer caves and dense forest areas for daytime shelter.',
  'Believed to be omnivorous. Historical accounts suggest they cultivated crops and foraged. Possibly hunted small game at night.'
);

INSERT INTO testimonies (id, cryptid_id, witness, date, location, account) VALUES
  ('moon-t1', 'moon-eyed-people', 'Dr. Benjamin Harmon', 'August 1987', 'Cherokee National Forest, NC', 'As an anthropologist studying Cherokee oral histories, I never expected to encounter what they described. During a night survey near ancient stone structures, I saw three pale figures moving between the trees. Their eyes reflected my flashlight with an unusual silver glow. They moved silently, deliberately, and when they noticed me, they vanished into the forest with remarkable speed.'),
  ('moon-t2', 'moon-eyed-people', 'Cherokee Elder Thomas Swimmer', 'June 2001', 'Western North Carolina', 'My grandfather''s grandfather told stories of the Moon-Eyed People. They were here before us, building in stone. They couldn''t bear the sun and lived in darkness. The old stories say they were driven west, but some believe they went underground, into the deep caves. Sometimes, on dark nights near the old stone walls, people still see them.');

INSERT INTO timeline_events (id, cryptid_id, year, event, location) VALUES
  ('moon-e1', 'moon-eyed-people', 'Pre-1000 AD', 'Moon-Eyed People allegedly inhabit region, build stone structures', 'Appalachian region'),
  ('moon-e2', 'moon-eyed-people', '1000s', 'Cherokee oral traditions describe displacement of Moon-Eyed People', 'Cherokee territories'),
  ('moon-e3', 'moon-eyed-people', '1797', 'First written account by Benjamin Smith Barton', 'Western North Carolina'),
  ('moon-e4', 'moon-eyed-people', '1920s', 'Archaeological interest in pre-Cherokee stone structures', 'North Carolina mountains'),
  ('moon-e5', 'moon-eyed-people', '1987', 'Anthropologist encounters pale humanoid figures', 'Cherokee National Forest'),
  ('moon-e6', 'moon-eyed-people', '2024', 'Recent night sighting near ancient stone formation', 'Murphy, NC');

-- Insert Skunk Ape
INSERT INTO cryptids (id, name, scientific_name, location, region, last_sighting, danger_level, sightings, description, image, tags, physical_description, behavior, habitat, diet)
VALUES (
  'skunk-ape',
  'Skunk Ape',
  'Pongidae floridanus',
  'Everglades, Florida',
  'southeast',
  'December 2023',
  'Medium',
  156,
  'Florida''s answer to Bigfoot. Bipedal ape-like creature covered in reddish-brown hair. Named for its powerful, sulfurous odor that announces its presence from hundreds of feet away.',
  '/assets/skunk-ape.jpg',
  '["Bipedal", "Primate", "Malodorous"]',
  'Large bipedal primate standing 6-8 feet tall, weighing an estimated 300-500 pounds. Covered in reddish-brown to dark brown hair with lighter coloring on chest and face. Pronounced brow ridge, flat nose, and powerful build. Leaves 15-17 inch footprints. Most distinctive characteristic is overwhelming sulfurous odor.',
  'Primarily nocturnal but occasionally active during day in remote areas. Generally avoids human contact but has been known to investigate campsites and residential areas. Not typically aggressive but has charged at humans when surprised. Territorial behavior observed. Strong swimmer, often seen near water.',
  'Florida Everglades and surrounding swamplands. Also reported in Big Cypress National Preserve and Myakka River State Park. Prefers dense vegetation near water sources. Constructs rudimentary shelters from vegetation.',
  'Omnivorous. Diet includes fish, berries, roots, small mammals. Known to raid agricultural areas for crops. Several accounts of Skunk Apes taking fish from coolers and approaching houses for food.'
);

INSERT INTO testimonies (id, cryptid_id, witness, date, location, account) VALUES
  ('skunk-t1', 'skunk-ape', 'Anonymous Sarasota Resident', 'September 2000', 'Myakka River, Sarasota, FL', 'The smell hit us first - like rotten eggs and death. Then we saw it in our yard, this huge ape-like thing. I took photos - you can see it clear as day. It was at least seven feet tall, covered in dark reddish hair. When it noticed us, it just walked off into the swamp. My husband wanted to follow but that smell... nobody could stand being that close.'),
  ('skunk-t2', 'skunk-ape', 'Dave Shealy', 'July 1998', 'Ochopee, FL', 'I''ve been tracking the Skunk Ape for years. That day, I finally got my chance. I was on my airboat when I saw it crossing through shallow water about 50 yards away. It was massive, walking on two legs like a man but covered in dark hair. I grabbed my camera and got several shots before it disappeared into the sawgrass. The smell lingered for hours.');

INSERT INTO timeline_events (id, cryptid_id, year, event, location) VALUES
  ('skunk-e1', 'skunk-ape', '1818', 'Early Spanish explorer accounts of ''devil monkeys''', 'Florida'),
  ('skunk-e2', 'skunk-ape', '1960s', 'Modern Skunk Ape reports begin to increase', 'South Florida'),
  ('skunk-e3', 'skunk-ape', '1974', 'Multiple sightings lead to organized searches', 'Everglades'),
  ('skunk-e4', 'skunk-ape', '1998', 'Dave Shealy captures video footage', 'Ochopee, FL'),
  ('skunk-e5', 'skunk-ape', '2000', 'Famous Myakka photographs taken', 'Sarasota County, FL'),
  ('skunk-e6', 'skunk-ape', '2023', 'Trail camera captures large bipedal figure', 'Big Cypress Preserve');

-- Insert Lizard Man
INSERT INTO cryptids (id, name, scientific_name, location, region, last_sighting, danger_level, sightings, description, image, tags, physical_description, behavior, habitat, diet)
VALUES (
  'lizard-man',
  'Lizard Man of Scape Ore',
  'Lacerta bipedis',
  'Scape Ore Swamp, South Carolina',
  'southeast',
  'July 2023',
  'High',
  67,
  'Seven-foot tall reptilian humanoid with green scaly skin and three-fingered hands. Known for aggressive behavior and superhuman strength. Multiple vehicle attacks documented.',
  '/assets/lizard-man.jpg',
  '["Reptilian", "Aggressive", "Bipedal"]',
  'Bipedal reptilian humanoid standing 7 feet tall. Muscular build estimated at 300 pounds. Covered in green scaly skin with texture resembling alligator hide. Head features include glowing red eyes, no visible nose or ears. Hands have three fingers with sharp claws. Feet are three-toed with webbing. Tail reported in some sightings.',
  'Highly aggressive and territorial. Exhibits unusual strength - capable of causing significant damage to vehicles. Primarily nocturnal hunter. Shows intelligence in stalking behavior. Known to attack vehicles that enter its territory. May be attracted to water sources and prey animals.',
  'Scape Ore Swamp area in Lee County, South Carolina. Prefers dense swampland with heavy vegetation. Often sighted near abandoned buildings and bridges over water. Territory appears to center around specific section of swamp.',
  'Carnivorous predator. Evidence suggests diet includes fish, small mammals, and possibly livestock. Powerful jaws indicate capability to consume large prey.'
);

INSERT INTO testimonies (id, cryptid_id, witness, date, location, account) VALUES
  ('lizard-t1', 'lizard-man', 'Christopher Davis', 'June 29, 1988', 'Scape Ore Swamp, Bishopville, SC', 'I was driving home at 2 AM when I had a blowout near the swamp. While I was changing the tire, I heard something running towards me. This thing came out of the darkness - seven feet tall, green scales, red eyes. It jumped on my car and tried to get in! I could see three claws on each hand scraping the roof. I drove away with it still hanging on. It finally jumped off but left deep scratches in the metal.'),
  ('lizard-t2', 'lizard-man', 'Tom & Mary Waye', 'August 1988', 'Lee County, SC', 'We woke up to our car alarm going off. When Tom went outside, the car was damaged - deep scratches and dents like something attacked it. The chrome was partially ripped off. We found three-toed tracks in the mud leading to the swamp. Our neighbor said he saw a large green creature the week before. We don''t go near that swamp anymore.');

INSERT INTO timeline_events (id, cryptid_id, year, event, location) VALUES
  ('lizard-e1', 'lizard-man', '1988', 'Christopher Davis encounter launches modern legend', 'Scape Ore Swamp, SC'),
  ('lizard-e2', 'lizard-man', '1988', 'Multiple vehicle attacks reported in two-month period', 'Lee County, SC'),
  ('lizard-e3', 'lizard-man', '1990', 'Sightings reported along Lynches River', 'South Carolina'),
  ('lizard-e4', 'lizard-man', '2008', 'Couple reports sighting near swamp at night', 'Bishopville, SC'),
  ('lizard-e5', 'lizard-man', '2015', 'Trail camera captures unclear bipedal figure', 'Lee County, SC'),
  ('lizard-e6', 'lizard-man', '2023', 'Fresh three-toed tracks found near swamp', 'Scape Ore Swamp');

-- Insert Fouke Monster
INSERT INTO cryptids (id, name, scientific_name, location, region, last_sighting, danger_level, sightings, description, image, tags, physical_description, behavior, habitat, diet)
VALUES (
  'fouke-monster',
  'Fouke Monster',
  'Anthropoidus arkansus',
  'Fouke, Arkansas',
  'southern',
  'October 2023',
  'Medium',
  93,
  'Massive ape-like creature standing 7-10 feet tall. Covered in dark hair with broad shoulders and long arms. Leaves three-toed tracks and emits foul odor.',
  '/assets/fouke-monster.jpg',
  '["Bipedal", "Primate", "Large"]',
  'Massive bipedal creature standing 7-10 feet tall with estimated weight of 250-400 pounds. Covered in long dark hair or fur, appearing reddish-brown in sunlight. Broad shoulders and muscular build. Long arms extending past knees. Face shows ape-like features. Leaves distinctive three-toed footprints measuring up to 14 inches.',
  'Primarily nocturnal but sometimes active at dusk. Known to approach human habitations, particularly isolated houses. Has attacked buildings and reached through windows. Generally avoids direct confrontation but displays aggressive behavior when cornered or surprised. Emits loud howls and grunts.',
  'Boggy Creek area near Fouke, Arkansas. Prefers dense bottomland forests and swampy areas. Often sighted near water sources. Has established territory in remote sections of Miller County. Associated with Sulphur River bottoms.',
  'Omnivorous. Diet believed to include fish, small mammals, roots, and berries. Has raided chicken coops and pig pens. Some accounts describe it catching fish with its hands.'
);

INSERT INTO testimonies (id, cryptid_id, witness, date, location, account) VALUES
  ('fouke-t1', 'fouke-monster', 'Bobby Ford', 'May 1971', 'Fouke, Arkansas', 'That thing attacked our house. I was asleep when my wife started screaming. This creature - it had to be eight feet tall - was reaching through the window trying to grab her. I got my gun and fired at it. It roared and ran off into the woods. We found huge three-toed tracks in the mud around our house. The whole screen was ripped off the window.'),
  ('fouke-t2', 'fouke-monster', 'D.C. Woods Jr.', 'May 1971', 'Near Fouke, AR', 'My brother Bobby and I went out looking for that thing after it attacked their house. We tracked it to Boggy Creek. The smell was terrible - like a wet dog times a hundred. We heard it moving through the brush, breaking branches. Then we saw it - massive, covered in dark hair, walking upright. It let out this howl that made our blood run cold. We got out of there fast.');

INSERT INTO timeline_events (id, cryptid_id, year, event, location) VALUES
  ('fouke-e1', 'fouke-monster', '1851', 'First reported encounter in Arkansas bottomlands', 'Miller County, AR'),
  ('fouke-e2', 'fouke-monster', '1946', 'Sightings reported near Jonesville', 'Arkansas'),
  ('fouke-e3', 'fouke-monster', '1971', 'Famous attacks on Ford house', 'Fouke, AR'),
  ('fouke-e4', 'fouke-monster', '1972', 'Documentary film ''The Legend of Boggy Creek'' released', 'N/A'),
  ('fouke-e5', 'fouke-monster', '1997', 'Renewed sightings lead to investigation', 'Fouke area'),
  ('fouke-e6', 'fouke-monster', '2023', 'Trail camera captures large bipedal figure', 'Boggy Creek region');

-- Insert Tailypo
INSERT INTO cryptids (id, name, scientific_name, location, region, last_sighting, danger_level, sightings, description, image, tags, physical_description, behavior, habitat, diet)
VALUES (
  'tailypo',
  'Tailypo',
  'Caudatus mysterius',
  'Appalachian Mountains',
  'appalachia',
  'February 2024',
  'Medium',
  52,
  'Small, cat-like creature with yellow eyes and a distinctive long tail. Legend tells of its relentless pursuit to reclaim its severed tail. Known for its haunting cry: ''Tailypo, tailypo.''',
  '/assets/tailypo.jpg',
  '["Small", "Persistent", "Folklore"]',
  'Small to medium-sized creature described as cat-like in appearance. Covered in black or dark gray fur. Most distinctive feature is an extremely long, sinuous tail. Eyes glow yellow or amber in darkness. Size estimates vary from house cat to medium dog. Elongated face with pronounced teeth. Moves with unnatural fluidity.',
  'Nocturnal and persistent. Legend describes relentless pursuit of lost tail. Capable of entering homes through small openings. Produces distinctive vocalization: ''Tailypo, tailypo, all I want''s my tailypo.'' Shows single-minded determination and inability to be deterred. Not overtly aggressive unless provoked, but presence is deeply unsettling.',
  'Deep Appalachian forests, particularly in Tennessee and North Carolina mountains. Associated with isolated cabins and remote settlements. Prefers areas with minimal human presence. Often heard but rarely seen clearly.',
  'Unknown. Original legend suggests it may have entered cabin seeking food. No confirmed feeding behavior documented.'
);

INSERT INTO testimonies (id, cryptid_id, witness, date, location, account) VALUES
  ('tailypo-t1', 'tailypo', 'Adapted from traditional folktale', '1800s (legendary)', 'Tennessee mountains', 'An old man living alone in the mountains was cooking stew when this creature came in through a crack. He caught it and cut off its tail for his supper. That night, he heard scratching and a voice calling ''Tailypo, tailypo, give me my tailypo.'' Each night it came back, getting closer. By the third night, it was in his cabin, on his bed. His dogs tried to chase it but never could catch it. Some say the old man was never seen again.'),
  ('tailypo-t2', 'tailypo', 'Margaret Atkins', 'October 1978', 'Cocke County, TN', 'We heard scratching on our cabin walls for three nights straight. Each night, we''d hear this voice - raspy, inhuman - calling out ''Where''s my tail, where''s my tail.'' On the third night, I saw it through the window. Small, dark, with these glowing eyes and a tail that seemed too long for its body. We left the next morning and never went back to that cabin.');

INSERT INTO timeline_events (id, cryptid_id, year, event, location) VALUES
  ('tailypo-e1', 'tailypo', '1800s', 'Original legend established in Appalachian oral tradition', 'Tennessee/North Carolina mountains'),
  ('tailypo-e2', 'tailypo', '1920s', 'First written versions of tale published', 'Appalachia'),
  ('tailypo-e3', 'tailypo', '1978', 'Modern encounter reported near remote cabin', 'Cocke County, TN'),
  ('tailypo-e4', 'tailypo', '1990s', 'Researchers collect multiple similar accounts', 'Appalachian region'),
  ('tailypo-e5', 'tailypo', '2015', 'Hikers report hearing ''tailypo'' calls', 'Great Smoky Mountains'),
  ('tailypo-e6', 'tailypo', '2024', 'Recent sighting near isolated mountain cabin', 'Eastern Tennessee');

-- Insert Grafton Monster
INSERT INTO cryptids (id, name, scientific_name, location, region, last_sighting, danger_level, sightings, description, image, tags, physical_description, behavior, habitat, diet)
VALUES (
  'grafton-monster',
  'Grafton Monster',
  'Corpus albidus',
  'Grafton, West Virginia',
  'appalachia',
  'September 2023',
  'Low',
  41,
  'Massive white creature standing 8-9 feet tall. Appears headless with eyes and mouth embedded in torso. Smooth, seal-like skin. Despite imposing appearance, no aggressive encounters reported.',
  '/assets/grafton-monster.jpg',
  '["Large", "White", "Docile"]',
  'Massive humanoid entity standing 8-9 feet tall. Chalk white or pale gray in color with smooth, seal-like skin. Most unusual feature is apparent lack of head - eyes and mouth appear to be embedded directly in the torso/shoulder area. No visible neck. Large, muscular body. Moves with surprising grace despite size. Some accounts describe a foul odor.',
  'Rarely aggressive despite imposing appearance. Generally flees when confronted by humans. Curious behavior observed - approaches vehicles and observers before departing. Nocturnal activity. Shows intelligence in avoiding capture or prolonged observation. No documented attacks despite fearsome appearance.',
  'Originally sighted in Grafton, West Virginia area. Associated with rural roads and abandoned buildings. Prefers areas near water. Has been reported across Taylor County. Not territorial - seems to wander widely.',
  'Unknown. No feeding behavior ever documented. Lack of visible mouth structure makes diet a mystery.'
);

INSERT INTO testimonies (id, cryptid_id, witness, date, location, account) VALUES
  ('grafton-t1', 'grafton-monster', 'Robert Cockrell', 'June 16, 1964', 'Riverside Drive, Grafton, WV', 'I was driving home late when my headlights hit this thing standing by the road. It was huge - maybe nine feet tall and white as a sheet. The weird part? It didn''t have a head. The face was in its chest or something. These eyes just stared at me from where the neck should be. I floored it and got out of there. I''ve never been so terrified in my life.'),
  ('grafton-t2', 'grafton-monster', 'Reporter from Grafton Sentinel', 'June 1964', 'Grafton, WV', 'We interviewed multiple witnesses following the initial sighting. The descriptions were remarkably consistent - a tall, white, apparently headless figure. The witnesses were clearly shaken. Whatever they saw, it was real to them. The town was in an uproar for weeks. People were afraid to go out at night.');

INSERT INTO timeline_events (id, cryptid_id, year, event, location) VALUES
  ('grafton-e1', 'grafton-monster', '1964', 'First documented sighting by Robert Cockrell', 'Grafton, WV'),
  ('grafton-e2', 'grafton-monster', '1964', 'Multiple sightings in June and July', 'Taylor County, WV'),
  ('grafton-e3', 'grafton-monster', '1965', 'Sporadic reports continue', 'Grafton area'),
  ('grafton-e4', 'grafton-monster', '1994', 'Sighting reported near abandoned factory', 'Grafton, WV'),
  ('grafton-e5', 'grafton-monster', '2015', 'Late-night encounter on rural road', 'Taylor County, WV'),
  ('grafton-e6', 'grafton-monster', '2023', 'Recent sighting matches original description', 'Near Grafton, WV');

-- Insert White Screamer
INSERT INTO cryptids (id, name, scientific_name, location, region, last_sighting, danger_level, sightings, description, image, tags, physical_description, behavior, habitat, diet)
VALUES (
  'white-screamer',
  'White Screamer',
  'Ululans candidus',
  'Appalachian Highlands',
  'appalachia',
  'January 2024',
  'Low',
  28,
  'Ghostly white creature that produces bloodcurdling screams echoing through mountain valleys. Rarely seen, more often heard. Witnesses describe a deer-like form shrouded in mist.',
  '/assets/white-screamer.jpg',
  '["Vocal", "Elusive", "Mountain"]',
  'Ghostly white or pale apparition, typically described as deer-like in form though details are difficult to confirm due to mist-like quality. Size varies in reports from normal deer size to much larger. Most notable feature is the spectral white coloration and seeming ability to blend with fog or mist. Some accounts describe glowing eyes. Movement appears unnatural, sometimes seeming to float.',
  'Produces bloodcurdling, anguished screams that echo through mountain valleys. Rarely seen but frequently heard. Appears in or near thick fog or mist. Generally flees if approached. Screams often described as combining human and animal qualities. Most active during early morning hours. May be territorial, as screams often heard in same locations repeatedly.',
  'High elevations in Appalachian mountains, particularly in Tennessee and North Carolina. Associated with misty valleys and fog-prone areas. Often sighted near mountain gaps and passes. Prefers remote, isolated areas away from human habitation.',
  'Unknown. If the creature is indeed similar to deer, diet would be herbivorous, but this is speculation.'
);

INSERT INTO testimonies (id, cryptid_id, witness, date, location, account) VALUES
  ('screamer-t1', 'white-screamer', 'Harold Jenkins', 'November 1982', 'Cades Cove, TN', 'I was hunting before dawn when I heard the most terrible scream. It echoed through the valley - not like any animal I''ve ever heard. Then I saw it through the mist, this white shape moving between the trees. It looked like a deer but wrong somehow, too pale, moving too smoothly. When it screamed again, every hair on my body stood up. I''ve hunted these mountains for forty years and I''ve never heard anything like it.'),
  ('screamer-t2', 'white-screamer', 'Sarah McKenzie', 'March 2010', 'Blue Ridge Parkway, NC', 'My husband and I were camping when we woke to this screaming. It sounded almost human but more primal, anguished. We looked outside and saw this pale white figure in the fog. It was hard to make out details but it seemed to be floating above the ground. The screaming went on for maybe two minutes, then it was gone. We packed up and left at first light.');

INSERT INTO timeline_events (id, cryptid_id, year, event, location) VALUES
  ('screamer-e1', 'white-screamer', '1920s', 'Early accounts in Appalachian folklore', 'Tennessee mountains'),
  ('screamer-e2', 'white-screamer', '1950s', 'Multiple hikers report mysterious screams', 'Great Smoky Mountains'),
  ('screamer-e3', 'white-screamer', '1982', 'Hunter encounters white figure in mist', 'Cades Cove, TN'),
  ('screamer-e4', 'white-screamer', '1995', 'Audio recording captures unexplained screams', 'Appalachian Trail'),
  ('screamer-e5', 'white-screamer', '2010', 'Campers witness screaming white apparition', 'Blue Ridge Parkway'),
  ('screamer-e6', 'white-screamer', '2024', 'Recent reports of early morning screams', 'Roan Mountain, TN');

