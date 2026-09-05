import type { MapSiteType } from "@/lib/oromia-map";
import caveImg from "@/assets/scenes/cave.jpg";
import forestImg from "@/assets/scenes/forest.jpg";
import lakeImg from "@/assets/scenes/lake.jpg";
import mountainImg from "@/assets/scenes/mountain.jpg";
import museumImg from "@/assets/scenes/museum.jpg";
import springImg from "@/assets/scenes/spring.jpg";

function commonsFile(file: string, width = 960) {
  return `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(file)}&width=${width}`;
}

/** Real photographs of Oromia / Ethiopian sites used in pictorial games. */
export const sitePhotos: Record<
  MapSiteType,
  { src: string; fallback: string; credit: string; place: string }
> = {
  cave: {
    src: commonsFile("Sof Omar Cave, Ethiopia (10116690765).jpg"),
    fallback: caveImg,
    credit: "Rod Waddington / Wikimedia Commons",
    place: "Sof Umar Cave",
  },
  lake: {
    src: commonsFile("Wonchi crater lake.jpg"),
    fallback: lakeImg,
    credit: "Wikimedia Commons",
    place: "Wanchi crater lake",
  },
  forest: {
    src: commonsFile("Harenna Forest and Bale Mountains.jpg"),
    fallback: forestImg,
    credit: "Wikimedia Commons",
    place: "Harenna Forest, Bale",
  },
  waterfall: {
    src: commonsFile("Blue Nile Falls, Ethiopia.jpg"),
    fallback: commonsFile("Blue Nile Falls - Ethiopia.jpg"),
    credit: "Wikimedia Commons",
    place: "Tis Issat falls",
  },
  mountain: {
    src: commonsFile("Sanetti Plateau, Ethiopia (10668417294).jpg"),
    fallback: mountainImg,
    credit: "Rod Waddington / Wikimedia Commons",
    place: "Sanetti Plateau, Bale",
  },
  gada: {
    src: commonsFile("Irreecha Festival.jpg"),
    fallback: commonsFile("Oromo Irrecha.jpg"),
    credit: "Mohammed Kassahun / Wikimedia Commons",
    place: "Irreechaa festival",
  },
  heritage: {
    src: commonsFile("King Abba Jifar Palace, Jimma, Ethiopia (15045604967).jpg"),
    fallback: commonsFile("Abbajifar palace from Jimma-september 2022.jpg"),
    credit: "Rod Waddington / Wikimedia Commons",
    place: "Abba Jifar Palace, Jimma",
  },
  spring: {
    src: commonsFile("Wondo Genet Hot Springs - panoramio.jpg"),
    fallback: springImg,
    credit: "Wikimedia Commons",
    place: "Wondo Genet hot springs",
  },
  gorge: {
    src: commonsFile("Holuca, Sof Omar Caves.jpg"),
    fallback: commonsFile("Big Rapids Dry Season, Sof Omar Caves.JPG"),
    credit: "Wikimedia Commons",
    place: "Sof Umar cave passage",
  },
  museum: {
    src: commonsFile("National Museum of Ethiopia.jpg"),
    fallback: museumImg,
    credit: "Wikimedia Commons",
    place: "National Museum of Ethiopia",
  },
};
