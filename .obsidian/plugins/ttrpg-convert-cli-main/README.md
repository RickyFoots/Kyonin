# TTRPG convert CLI

![GitHub all releases](https://img.shields.io/github/downloads/ebullient/ttrpg-convert-cli/total?color=success)

A Command-Line Interface designed to convert TTRPG data from 5eTools and Pf2eTools into crosslinked, tagged, and formatted markdown optimized for [Obsidian.md](https://obsidian.md).

<table><tr>
<td>Jump</td>
<td><a href="#install-the-ttrpg-convert-cli">⬇ Download</a></td>
<td><a href="docs/configuration.md">⚙️ Configuration</a></td>
<td><a href="examples/templates">🎨 Templates</a></td>
</tr><tr>
<td><a href="CHANGELOG.md">🚜 Changelog</a></td>
<td><a href="#convert-5etools-json-data">📖 5eTools</a></td>
<td><a href="#convert-pf2etools-json-data">📖 Pf2eTools</a></td>
<td><a href="#convert-homebrew-json-data">📖 Homebrew</a></td>
</tr></table>

I use [Obsidian](https://obsidian.md) to keep track of my campaign notes. This project parses json sources for materials that I own from the 5etools mirror to create linked and formatted markdown that I can reference in my notes.

> [!TIP]
> - 🚜 [**Review the changelog**](CHANGELOG.md) for new capabilities (✨) and breaking changes (🔥💥).
> - 🔮 Check out [**Conventions**](#conventions) and  [**Recommendations**](#recommendations-for-using-the-cli)

## Using the Command Line

This tool works in the command line, which is a text-based way to give instructions to your computer.
If you're new to it, we have resources to help you get started below.

If you don't have a favorite method already, or you don't know what those words mean, here are some resources to get you started:

- For MacOS / OSX Users:
    - Start with the built-in `Terminal` application.
    - [Learn the Mac OS X Command Line][]
- For Windows Users:
    - Use the native [Command Prompt][]
    - [Open a command prompt in a folder (Windows)][]
    - [Running executables from the command line (Windows)][]
    - To show emoji in Windows Commmand Prompt: `chcp 65001` and choose a font with emoji support (Consolas is one).

[Learn the Mac OS X Command Line]: https://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line
[Command Prompt]: https://www.digitaltrends.com/computing/how-to-use-command-prompt/
[Open a command prompt in a folder (Windows)]: https://www.lifewire.com/open-command-prompt-in-a-folder-5185505
[Running executables from the command line (Windows)]: https://www.techwalla.com/articles/how-to-use-quotcdquot-command-in-command-prompt-window

## Install the TTRPG Convert CLI

There are several options for running `ttrpg-convert`. Choose whichever you are the most comfortable with:

- [Use a pre-built platform binary](#use-pre-built-platform-binary) (no Java required)
- [Use JBang](docs/alternateRun.md#use-jbang) (hides Java invocation; sets up command aliases)
- [Use Java to run the jar](docs/alternateRun.md#use-java-to-run-the-jar)
- [Build from source](docs/alternateRun.md#build-and-run-from-source)
- **Using Windows?**
    - See the [Windows README](README-WINDOWS.md)
    - Obsidian TTRPG Tutorials: [TTRPG-Convert-CLI 5e][] or [TTRPG-Convert-CLI PF2e][]

[TTRPG-Convert-CLI 5e]: https://obsidianttrpgtutorials.com/Obsidian+TTRPG+Tutorials/Plugin+Tutorials/TTRPG-Convert-CLI/TTRPG-Convert-CLI+5e
[TTRPG-Convert-CLI PF2e]: https://obsidianttrpgtutorials.com/Obsidian+TTRPG+Tutorials/Plugin+Tutorials/TTRPG-Convert-CLI/TTRPG-Convert-CLI+PF2e

### Use pre-built platform binary

> [!NOTE]
> 📝 *Where do these binaries come from?*
>
> They are built on GitHub managed CI runners using the workflow defined [here](https://github.com/ebullient/ttrpg-convert-cli/blob/main/.github/workflows/release.yml), which compiles a Quarkus application (Java) into a platform-native binary using [GraalVM](https://www.graalvm.org/). I build and upload the mac arm64 binary myself (not supported by GH CI) using [this script](https://github.com/ebullient/ttrpg-convert-cli/blob/main/.github/augment-release.sh).

[Download the latest release](https://github.com/ebullient/ttrpg-convert-cli/releases/latest) of the zip or tgz for your platform. Extract the archive. A `ttrpg-convert` binary executable will be in the extracted bin directory.

In a terminal or command shell, navigate to the directory where you extracted the archive and run the command:

```shell
ttrpg-convert --help
```

We'll use this command in the instructions below.

Notes:

- Folks familar with command line tools can add the `bin` directory to their path to make the command available from anywhere.
- *MacOS permission checking* (unverified executable): `xattr -r -d com.apple.quarantine <path/to>/ttrpg-convert`

**Looking for a different method?**

See [Other ways to run the CLI](docs/alternateRun.md) for more options to download and run the CLI.

## Recommendations for using the CLI

- 🔐 Treat generated content as a big ball of mud. Stick it in a corner of your vault *treat it as read-only*.

    Trust us, you will want to regenerate content from time to time. It is cheap and easy to do if you don't have your own edits to worry about.

- 🔎 Have the CLI generate output into a separate directory and use a comparison tool to preview changes.  

    You can use `git diff` to compare arbitrary directories, for example:

    ```bash
    git diff --no-index vault/compendium/bestiary generated/compendium/bestiary
    ```

- 📑 Use a copy tool that only updates modified files, like [rsync][], to avoid unnecessary file copying when updating your vault. Use the checksum option (`-c`) to compare file contents; the file modification date is meaningless given generated files are recreated when the tool is run. We have some suggestions in [discussion #220][sync-discussion], but it is very much a work in progress.

[rsync]: https://stackoverflow.com/a/19540611
[sync-discussion]: https://github.com/ebullient/ttrpg-convert-cli/discussions/220

### Required plugins

- **Admonitions** ([git](https://github.com/javalent/admonitions)/[obsidian](obsidian://show-plugin?id=obsidian-admonition)): The admonitions plugin supports a codeblock style that is used for more complicated content like statblocks. See [Admonition plugin notes](docs/README.md#admonitions) for more recommendations.

### Recommended plugins

- **Force note view mode by front matter** ([git](https://github.com/bwydoogh/obsidian-force-view-mode-of-note)/[obsidian](obsidian://show-plugin?id=obsidian-view-mode-by-frontmatter)): I use this plugin to treat these generated notes as essentially read-only. See [Force note view mode plugin settings](docs/README.md#force-note-view-mode-by-front-matter) for recommendations.

- **Fantasy Statblocks** ([git](https://github.com/javalent/fantasy-statblocks)/[obsidian](obsidian://show-plugin?id=obsidian-5e-statblocks)): Templates for rendering monsters can define a `statblock` in the document body or provide a full or abridged yaml monster in the document header to update monsters in the plugin's bestiary.
    - See [Fantasy Statblocks plugin settings](docs/README.md#fantasy-statblocks) for recommendations.
    - See [Templates](examples/templates) for related template customization.

- **Initiative Tracker** ([git](https://github.com/javalent/initiative-tracker)/[obsidian](obsidian://show-plugin?id=initiative-tracker)): Templates for rendering monsters can include information in the header to define monsters that initiative tracker can use when constructing encounters. See [Initiative Tracker plugin settings](docs/README.md#initiative-tracker) for recommendations.

## Conventions

- **Links.** Documents generated by this plugin will use markdown links rather than wiki links. A [css snippet](examples/css-snippets/hide-markdown-link-url.css) can make these links less invasive in edit mode by hiding the URL portion of the string.

- **File names.** To avoid conflicts and issues with different operating systems, all file names are slugified (all lower case, symbols stripped, and spaces replaced by dashes). This is a familiar convention for those used to jekyll, hugo, or other blogging systems.

    - File names for resources outside of the core books (PHB, MM, and DMG) have the abbreviated source name appended to the end to avoid file collisions.
    - All files have an `aliases` attribute that contains the original name of the resource.

- **Organization.** Files are generated in two roots: `compendium` and `rules`. The location of these roots is [configurable](docs/configuration.md#specify-target-paths-with-the-paths-key). These directories will be populated depending on the sources you have enabled.

    - `compendium` contains files for items, spells, monsters, etc.
    The `compendium` directory is further organized into subdirectories for each type of content. For example, all items are in the `compendium/items` directory.  

    - `rules` contains files for conditions, weapon properties, variant rules, etc.

    - `css-snippets` will contain **CSS files for special fonts** used by some content. You will need to copy these snippets into your vault (`.obsidian/snippets`) and enable them (`Appearance -> Snippets`) to ensure all content in your vault is styled correctly.

- **Styles.** Every document has a `cssclasses` attribute that assigns a CSS class. We have some [CSS snippets](examples/css-snippets/) that you can use to customize elements of the compendium.
    - 5e tools: `json5e-background`, `json5e-class`, `json5e-deck`, `json5e-deity`, `json5e-feat`, `json5e-hazard`, `json5e-item`, `json5e-monster`, `json5e-note`, `json5e-object`, `json5e-psionic`, `json5e-race`, `json5e-reward`, `json5e-spell`, and `json5e-vehicle`.
    - pf2e tools: `pf2e`, `pf2e-ability`, `pf2e-action`, `pf2e-affliction`, `pf2e-archetype`, `pf2e-background`, `pf2e-book`, `pf2e-delity`, `pf2e-feat`, `pf2e-hazard`, `pf2e-index`, `pf2e-item`, `pf2e-note`, `pf2e-ritual`, `pf2e-sleep`, `pf2e-trait`.

- **Admonitions.** Generated content uses code-block-style [Admonitions](docs/README.md#admonitions) in addition to Obsidian callouts. We have [Admonition definitions](examples/admonitions/) that you can import to ensure these admonition/callout types are defined.
    - `ad-statblock`
    - 5e tools: `ad-flowchart`, `ad-gallery`, `ad-embed-action`, `ad-embed-feat`, `ad-embed-monster`, `ad-embed-object`, `ad-embed-race`, `ad-embed-spell`, `ad-embed-table`
    - pf2e tools: `ad-embed-ability`, `ad-embed-action`, `ad-embed-affliction`, `ad-embed-avatar`, `ad-embed-disease`, `ad-embed-feat`, `ad-embed-item`, `ad-pf2-note`, `ad-pf2-ritual`.

## Convert 5eTools JSON data

1. Create a shallow clone of the 5eTools mirror repo (which can/should be deleted afterwards):

    ```shell
    git clone --depth 1 https://github.com/5etools-mirror-1/5etools-mirror-1.github.io.git
    ```

2. Invoke the CLI. In this first example, let's generate indexes and markdown for SRD content:

    ```shell
    ttrpg-convert \
      --index \
      -o dm \
      5etools-mirror-1.github.io/data
    ```

    - `--index` Create `all-index.json` containing all of the touched artifact ids, and `src-index.json` that shows the filtered/allowed artifact ids. These files are useful when tweaking exclude rules (as shown below).
    - `-o dm` The target output directory (`dm` in this case). Files will be created in this directory.

    The rest of the command-line specifies input files:

    - `5etools-mirror-1.github.io/data` Path to the 5etools `data` directory (from a clone or release of the repo)

    This should produce a set of markdown files in the `dm` directory.

3. Invoke the command again, this time including source files and custom items:

    ```shell
    ttrpg-convert \
        --index \
        -o dm \
        -c dm-sources.json \
        5etools-mirror-1.github.io/data \
        5etools-mirror-1.github.io/data/adventure/adventure-lox.json \
        5etools-mirror-1.github.io/data/book/book-aag.json \
        my-items.json
    ```

    - `-s PHB,DMG,SCAG` Will include content from the Player's Handbook, the Dungeon Master's Guide, and the Sword Coast Adventurer's Guide (all sources I own).
    - `5etools-mirror-1.github.io/data` Path to the 5etools `data` directory (from a clone or release of the repo)
    - `/adventure/adventure-lox.json` is an adventure to include (full-text)
    - `/book/book-aag.json` is a book to include (full-text)
    - `my-items.json` defines custom items for my campaign in [5etools JSON][] format.

## Convert Pf2eTools JSON data

🚜 🚧 🚜 🚧 🚜 🚧 🚜 🚧

1. Download a release of the Pf2eTools mirror, or create a shallow clone of the repo (which can/should be deleted afterwards):

    ```shell
    git clone --depth 1 https://github.com/Pf2eToolsOrg/Pf2eTools.git
    ```

2. Invoke the CLI. In this first example, let's generate indexes and use only SRD content (using the alias set up when [installing the cli](#install-the-ttrpg-convert-cli):

    ```shell
    ttrpg-convert \
      -g pf2e \
      --index \
      -o dm \
      Pf2eTools/data
    ```

    - `-g p2fe` The game system! Pathfinder 2e!
    - `--index` Create `all-index.json` containing all of the touched artifact ids, and `src-index.json` that shows the filtered/allowed artifact ids. These files are useful when tweaking exclude rules (as shown below).
    - `-o dm` The target output directory. Files will be created in this directory.

    The rest of the command-line specifies input files:

    - `Pf2eTools/data` Path to the Pf2eTools `data` directory (from a clone or release of the repo)

## Convert Homebrew JSON data

The CLI tool also has the ability to import homebrewed content, though this content must still fit the json standards that are set by in the [5eTools json spec][5etools JSON] or the PF2eTools json spec (coming soon, similar to 5eTools).

Perhaps the simplest thing to do to import homebrew is to use already existing homebrew data from the 5etools homebrew github repo: <https://github.com/TheGiddyLimit/homebrew>.

> [!TIP]
> 🍺 *You only need the particular file you wish to import*.
>
> Homebrew data is different from the 5etools data. Each homebrew file is a complete reference. If you compare it to cooking: the 5etools mirror repo is organized by ingredient (all of the carrots, all of the onions, ... ); homebrew data is organized by prepared meal / complete receipe.

So, for example, if you wanted to use Benjamin Huffman's popular homebrewed [Pugilist class](https://www.dmsguild.com/product/184921/The-Pugilist-Class) (and if so please make sure you have supported Benjamin by purchasing the content!)

1. Download a copy of the [Pugilist json file](https://github.com/TheGiddyLimit/homebrew/blob/master/class/Benjamin%20Huffman%3B%20Pugilist.json)
2. Run the command like so:

    ``` shell
    ttrpg-convert  --index -s 'SterlingVermin' -o hb-compendium "path/to/Benjamin Huffman; Pugilist.json"
    ```

    - `-o hb-compendium` is the output directory for generated content.
    - `-s 'SterlingVermin'`  *identifier* (see below) command line option for [`from`](docs/configuration.md#select-data-sources-with-the-from-key). You need to provide the  for the homebrew you are importing.
    - `"path/to/Benjamin Huffman; Pugilist.json"` is the path to the downloaded json file.

If you use the CLI tool with a config, then you would (staying with our example from above) put `SterlingVermin` in the `from` field of the config and add the path to the pugilist json file to your build command.

The process is similar for other homebrew, including your own, so long as it is broadly compatible with the [5e-tools json spec](https://wiki.tercept.net/en/Homebrew/FromZeroToHero).

### Homebrew identifier or abbreviation

The 5eTools website has a homebrew view, and it will display an "abbreviation", but we need to use the `json` source identifier.

If we look inside the Pugilist class:

```json
"_meta": {
    "sources": [
        {
            "json": "SterlingVermin",
            "abbreviation": "SVM",
            "full": "The Pugilist Class",
            "authors": [
                "Benjamin Huffman"
            ],
```

- `SVM` is the abbreviation that will be shown in the 5eTools web interface
- The *identifier* is `SterlingVermin` (`_meta` -> `sources` -> `json`)

## Where to find help

- There is a `#cli-support` thread in the `#tabletop-games` channel of the [Obsidian Discord](https://discord.gg/veuWUTm).
- There is a `TTRPG-convert-help` post in the `obsidian-support` forum of the [Obsidian TTRPG Community Discord](https://discord.gg/Zpmr37Uv).
- There is a TTRPG-convert tutorial (currently aimed at Windows users, but much of it is helpful no matter your OS) at [Obsidian TTRPG Tutorials](https://obsidianttrpgtutorials.com/Obsidian+TTRPG+Tutorials/Plugin+Tutorials/TTRPG-Convert-CLI/TTRPG-Convert-CLI+5e).

### Want to help fix it?

- If you're familiar with the command line and are comfortable running the tool, I hope you'll consider running [unreleased snapshots](docs/alternateRun.md#using-unreleased-snapshots) and reporting issues.
- If you want to contribute, I'll take help of all kinds: documentation, examples, sample templates, stylesheets are just as important as Java code. See [CONTRIBUTING](CONTRIBUTING.md).

## Other notes

This project uses Quarkus, the Supersonic Subatomic Java Framework. If you want to learn more about Quarkus, please visit its website: <https://quarkus.io/>.

This project is a derivative of [fc5-convert-cli](https://github.com/ebullient/fc5-convert-cli), which focused on working to and from FightClub5 Compendium XML files. It has also stolen some bits and pieces from [pockets-cli](https://github.com/ebullient/pockets-cli).

[5etools JSON]: https://wiki.tercept.net/en/Homebrew/FromZeroToHero

<a href="https://www.buymeacoffee.com/ebullient" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>