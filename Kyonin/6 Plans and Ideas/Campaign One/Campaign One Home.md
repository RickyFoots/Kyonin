---
banners: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
---

```meta-bind-button
style: destructive
label: Reload Current Vault
id: Reload
hidden: true
actions:
  - type: command
    command: app:reload
```

``BUTTON[Reload]`` ``BUTTON[Web]`` 

```dataviewjs
// Calculate days since first note
const files = dv.pages()
const oldestFile = files.sort(f => f.file.ctime)[0]
const daysSinceStart = Math.floor((Date.now() - oldestFile.file.ctime) / (1000 * 60 * 60 * 24))
// Count total notes
const totalNotes = files.length
// Count unique tags
const allTags = files.flatMap(p => p.file.tags).distinct()
const totalTags = allTags.length
// Create a visually appealing display that works in both light and dark modes
dv.paragraph(`<div style="
  background-color: transparent;
  text-align: center;
  font-family: var(--font-text);
  color: var(--text-normal);
">
  <h2 style="color: var(--text-normal);">📊 Obsidian Stats</h2>
  <p style="font-size: 16px; margin: 10px 0;">
    🗓️ You've been using Obsidian for <strong>${daysSinceStart}</strong> days
  </p>
  <p style="font-size: 16px; margin: 10px 0;">
    📝 You have <strong>${totalNotes}</strong> notes
  </p>
  <p style="font-size: 16px; margin: 10px 0;">
    🏷️ You're using <strong>${totalTags}</strong> unique tags
  </p>
</div>`)
```

``````tabs
left
tab: ### Information
# Episode count
1. ("**Date Unknown**")
2. ("**Date Unknown**")
3. ("**Date Unknown**")
4. **07/21/23**
5. **09/22/23**
6. **10/06/23**
7. **10/13/23**
8. **11/17/23**
9.
`````tabs
tab: ### Exists in World
````col
```col-md
- **Animals**
	- Neigh Mysterio - <u>Horse</u>
- **Disease**
	- The Clap
	- `~Soul Death~`
- **Drugs**
	- "Fantasy Weed" - <u>Weed</u>

```

```col-md

- **Food**
	- *Cheeses*
	- *Fruits*
		- Peaches 
		- Lemons 
		- Apples
	- *Milk* - <u>Measured in Yards</u> 
	- *Misc*
		- Muffins
		- Gatorade
	- *Tea* 
		- Green 
		- Black 
		- Peach 
	- *Toast* 
		- Choast - <u>Cheese on Toast</u>
		- Boast - <u>Banana on Toast</u>
	- *Veg*
		- Carrots
		- Celery

```

```col-md

- **MISC**
	- Base-jumping
	- Customs - <u>Agency that protects cities and nations</u>
	- Skiing
	- Calisthenics
	- Ballet
- **People**
	- Jarred Letto - Write Backstory 
	- O.J. Simpson 
	- Walkins
- **Plants**
	- *Trees*
		- Douglas Fir
```
````
tab: ### Misc World Facts
- Yards are equal to Teaspoons
- 4 *Silver* for porn/smut
- **City Facts**
	- [[The Republic of Solaris]]
		- Has specialty healing potions flavors:
			- Cookies and cream

tab: ### **Does NOT** exist
-
`````
tab: ### Tools
`````tabs
tab: #### Map
![[Map of Golarian]]

tab: #### Encounters
![[Encounters]]
`````
tab: ### Notes
**No more Jeffery**

`````tabs
tab: #### Story Beats
![[Story Beats]]

tab: #### Ideas
![[Ideas]]
`````
tab: ### Party
![[Party Finances]]
`````tabs
left
tab: ### Claire Clover
```tabs
tab: #### Fun Facts
#Pinkertons/Claire
1. Favorite color is pink. 
2. Favorite food is a specific carrot stew that *only* her **maid** knew how to make. 
3. Has a life goal to fight an [[Owlbear]].
4. <span style="background:#ff4d4f">If she has a lot of caffeine she passes out</span>
5. Once took a job to clear out a Squirrel infestation
6. Favorite season is winter, loves snow and blending in.
7. <u>Never been to the beach.</u>
8. Does not know what to think about babies
9. 

tab: #### Character History
![[Claire Clover]]

tab: #### Notes
- 

```
tab: ### Elsbeth Vordr
```tabs
tab: #### Fun Facts
#Pinkertons/Elsbeth
1. Mom died in childbirth. 
2. Can't keep a plant alive. 
3. Was a champion chariot racer in the junior division.
4. Is allergic to all mushrooms, gets a rash.
5. Can give pretty decent haircuts/head on the spot 
6. Had a caretaker as a child but went off to the "country side"
7. There was a rumor her father set her up with a marriage
8. <span style="background:#ff4d4f">Has never had sex</span>
9. 

tab: #### Character History
![[Elsbeth Vordr]]

tab: #### Notes
- 

```
tab: ### Hawthorne "The Hammer" Bittlesby
```tabs
tab: #### Fun Facts
#Pinkertons/Hawthorne
1. Doesn't know how to ride a horse. 
2. Has never won a hand of poker because of his luck. 
3. Likes romance novels, fluffy and cute, <u>not smut</u>
4. Favorite tree is the Douglas Fir
5. Is a pretty decent skier
6. Socially liberal but fiscally conservative
7. Has only ever done calisthenics.
8. Original stage name was <u>Hawthorne the Halberd</u>
9. 

tab: #### Character History
![[Hawthorne the Hammer]]

tab: #### Notes
- 

```
tab: ### Jolene
```tabs
tab: #### Fun Facts
#Pinkertons/Jolene
1. Has a half sleeve tattoo of flowers on her left arm. 
2. Is scared of <u>horses</u>. 
3. Was a ballerina, trained from 10-18yrs, this is how she ended up [[Talavon]].
4. Learned how to play violin from her Dad 
5. Has been straight fucking - It's been awhile
6. Makes killer apple cinnamon muffins
7. Doesn't like carrots.
8. Not a natural red head
9. 

tab: #### Character History
![[Jolene]]

tab: #### Notes
- 

```
tab: ### Monk Kee
```tabs
tab: #### Fun Facts
#Pinkertons/Ki
1. Former general in the army. 
2. Favorite color is yellow. 
3. Was in space for 2 years before meeting [[Rylanor Torlek]].
4. Doesn't get the hype around Choast
5. Has anger issues
6. Suffers from tremendous guilt, see [[-High on Life-]]
7. Hates humans passionately 
8. Short humans are the absolute worst
9. 

tab: #### Character History
![[Monk Kee]]

tab: #### Notes
- 

```
tab: ### Ricochet Whitetail
```tabs
tab: #### Fun Facts
#Pinkertons/Ricochet
1. ==Loves== cheese 
2. Shot himself in the foot the first time he held a bow.
3. Is a cat person.
4. When Ricochet drinks Caffeine he bounces off the wall
5. Is non-plused about squirrels
6. Not a communist, but definitely a communist 
7. Ricochet is part demigod - God that's funny.
8. Does not care for carrots
9. 

tab: #### Character History
![[Ricochet Whitetail]]

tab: #### Notes
- 

```
tab: ### Rylanor Torlek
```tabs
tab: #### Fun Facts
#Pinkertons/Rylanor
1. Smokes "Fantasy Weed" 
2. Blew up his dads lab trying to make gunpowder.
3. Learned how to distill petroleum. He figured this out "accidentally"
4. Was taught business tactics from Goblins and Dwarves
5. Has been banned from a bar 
6. Very libertarian
7. Hates celery (With a passion)
8. <span style="background:#ff4d4f">Deeply unnerved by open ocean</span>
9. 

tab: #### Character History
![[Rylanor Torlek]]

tab: #### Notes
- 

```
`````
``````

## Late night rolls
- [#] This is honestly only here to freak my players out:
- [ ] 
