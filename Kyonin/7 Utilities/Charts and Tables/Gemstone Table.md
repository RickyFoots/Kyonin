---
exampleProperty:
  - Azurite
  - Banded agate
Cost: 
Gem: 
Damage: 
Size: 
---

# [[Gemstone Table]]
## **Perfect** & **Huge**

| Roll | Gem (Rarity) | Cost (Low) | Cost (Norm) | Cost (High) |
| :--: | :----------: | ---------- | ----------- | ----------- |
|  1   |   *Common*   | 8G         | 10G         | 20G         |
|  2   |  *Uncommon*  | 40G        | 50G         | 100G        |
|  3   |    *Rare*    | 80G        | 100G        | 200G        |
|  4   | *Very Rare*  | 400G       | 500G        | 1,000G      |
|  5   |    *Epic*    | 800G       | 1,000G      | 2,000G      |
|  6   | *Legendary*  | 4,000G     | 5,000G      | 10,000G     |

>[!multi-column]- Gems and Rarity
>>[!caution]- 1 Common 
>>## 1 Common
>>|**Roll**| **Gem** | 
>>| -- | -------- |
>>|1| *Azurite* (deep blue) |
>>|2| *Banded agate* (Brown / Blue) |
>>|3| *Blue Quartz* (pale blue) | 
>>|4| *Eye Agate* (circles, gray / blue) |
>>|5| *Lapis Lazuli* (blue with yellow) |
>>|6| *Malachite* (striated greens) | 
>>|7| *Moss Agate* (pale, moss marks) | 
>>|8| *Obsidian* (opaque black) | 
>>|9| *Tiger Eye* (brown, gold center) | 
>>|10| *Turquoise* (light blue-green) | 
>
>>[!caution]- 2 Uncommon
>>## 2 Uncommon
>>|**Roll**| **Gem** | 
>>| -- | -------- |
>>|1| *Bloodstone* (gray with red) |
>>|2| *Jasper* (blue, black, or brown) |
>>|3| *Moonstone* (white and glow) | 
>>|4| *Onyx* (black, white, or both) |
>>|5| *Quartz* (transparent range) |
>>|6| *Star Rose Quartz* (white star) | 
>
>>[!caution]- 3 Rare
>>## 3 Rare
>>|**Roll**| **Gem** | 
>>| -- | -------- |
>>|1| *Amber* (watery gold) |
>>|2| *Amethyst* (deep purple) |
>>|3| *Garnet* (red, or violet) | 
>>|4| *Pearl* (lustrous white to pink) |
>
>>[!caution]- 4 Very Rare 
>>## 4 Very Rare 
>>|**Roll**| **Gem** | 
>>| -- | -------- |
>>|1| *Aquamarine* (pale green-blue) |
>>|2| *Black Pearl* (pure black) |
>>|3| *Peridot* (rich olive green) | 
>>|4| *Topaz* (golden yellow) |
>
>>[!caution]- 5 Epic 
>>## 5 Epic 
>>|**Roll**| **Gem** | 
>>| -- | -------- |
>>|1| *Black Opal* (translucent green) |
>>|2| *Blue Sapphire* (shades of blue) |
>>|3| *Emerald* (deep bright green) | 
>>|4| *Fire Opal* (fiery red) |
>>|5| *Opal* (pale blue with green) |
>>|6| *Star Ruby* (ruby with star) | 
>>|7| *Star Sapphire* (blue with star) | 
>>|8| *Yellow Sapphire* (fiery yellow) | 
>
>>[!caution]- 6 Legendary
>>## 6 Legendary
>>|**Roll**| **Gem** | 
>>| -- | -------- |
>>|1| *Black Sapphire* (lustrous black) |
>>|2| *Jade* (green to white) |
>>|3| *Ruby* (shades of red) | 
>>|4| *Diamond* (transparent) |
---

````col
```col-md

## **Damage**
|**Roll**| **Rank** | **Cost Reduction** | 
| -- | -------- | -------- | 
|1| *Shattered* | -60%G |
|2| *Broken* | -40%G |
|3| *Chipped* | -20%G |
|4| *Scratched* | +20%G |
|5| *Scuffed* | +40%G |
|6| *Perfect* | +60%G |

```
```col-md

## **Size**
|**Roll**| **Rank** | **Cost Reduction** |
| -- | -------- | -------- | 
|1| *Small* | -60%G |
|2| *Medium* | -40%G |
|3| *Average* | -20%G |
|4| *Large* | +20%G |
|5| *Huge* | +40%G | 
|6| *Massive* | +60%G |

```
````

### Calculations
````col
```col-md

|  Category  |                                                                                   Options                                                                                    |
| :--------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Gem Rarity |    `INPUT[inlineSelect(option(null,' '),option(10,Common), option(50,Uncommon), option(100,Rare), option(500,Very Rare), option(1000,Epic), option(5000,Legendary)):Gem]`    |
|  Gem Cost  |                                                `INPUT[inlineSelect(option(null,' '), option(0,Norm), option(20,Low), option(-100,High)):Cost]`                                                 |
|   Damage   | `INPUT[inlineSelect(option(-60,Perfect), option(-40,Scuffed), option(-20,Scratched), option(null,' '), option(20,Chipped), option(40,Broken), option(60,Shattered)):Damage]` |
|    Size    |       `INPUT[inlineSelect(option(-60,Massive), option(-40,Huge), option(-20,Large), option(null,' '), option(20,Average), option(40,Medium), option(60,Small)):Size]`        |
| *Results*  |                                                           `VIEW[{Gem} - {Cost}% - {Damage}% - {Size}% ][math]`*G*                                                            |

```
````
