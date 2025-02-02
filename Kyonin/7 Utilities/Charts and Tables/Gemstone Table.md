---
exampleProperty:
  - Azurite
  - Banded agate
Cost: __
Gem: 50
Damage: 
---

# [[Gemstone Table]]
## **Perfect** & **Huge**

| Roll |                                                                                                                                                  Gem (Description)                                                                                                                                                  | Cost (Norm), | Cost (Low), | Cost (High), |
| :--: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ------------ | ----------- | ------------ |
|  1   | *Azurite* (deep blue), *Banded agate* (Brown / Blue), *Blue Quartz* (pale blue), *Eye Agate* (circles, gray / blue), *Lapis Lazuli* (blue with yellow), *Malachite* (striated greens), *Moss Agate* (pale, moss marks), *Obsidian* (opaque black), *Tiger Eye* (brown, gold center), *Turquoise* (light blue-green) | 10G          | 8G          | 20G          |
|  2   |                                             *Bloodstone* (gray with red), *Citrine* (pale yellow-brown), *Jasper* (blue, black, or brown), *Moonstone* (white and glow), *Onyx* (black, white, or both), *Quartz* (transparent range), *Star Rose Quartz* (white star)                                              | 50G          | 40G         | 100G         |
|  3   |                                                                                        *Amber* (watery gold), *Amethyst* (deep purple), *Garnet* (red, or violet), *Jade* (green to white), *Pearl* (lustrous white to pink)                                                                                        | 100G         | 80G         | 200G         |
|  4   |                                                                                                  *Aquamarine* (pale green-blue), *Black Pearl* (pure black), *Peridot* (rich olive green), *Topaz* (golden yellow)                                                                                                  | 500G         | 400G        | 1,000G       |
|  5   |                             *Black Opal* (translucent green), *Blue Sapphire* (shades of blue), *Emerald* (deep bright green), *Fire Opal* (fiery red), *Opal* (pale blue with green), *Star Ruby* (ruby with star), *Star Sapphire* (blue with star), *Yellow Sapphire* (fiery yellow)                             | 1,000G       | 800G        | 2,000G       |
|  6   |                                                                                                                 *Black Sapphire* (lustrous black), *Diamond* (transparent), *Ruby* (shades of red)                                                                                                                  | 5,000G       | 4,000G      | 10,000G      |
<center>Reroll on 6's</center>
````col
```col-md

## **Damage**
|**Roll**| **Rank** | **Cost Reduction** | 
| -- | -------- | -------- | 
|1| *Perfect* | -0%G |
|2| *Scratched* | -`dice:2d10`%G |
|3| *Chipped* | -`dice:4d10`%G |
|4| *Broken* | -`dice:6d10`%G |
|5| *Shattered* | -`dice:8d10`%G |

```
```col-md

## **Size**
|**Roll**| **Rank** | **Cost Reduction** |
| -- | -------- | -------- | 
|1| *Huge* | -0%G | 
|2| *Large* | -20%G |
|3| *Average* | -40%G |
|4| *Medium* | -60%G |
|5| *Small* | -80%G |

```
````

### Calculations
Results: `VIEW[{Gem} - {Damage}% - {Size}% ][math]`

Cost:`INPUT[inlineSelect(option(__),option(Norm), option(Low), option(High)):Cost]`  Damage:`INPUT[number:Damage]`
