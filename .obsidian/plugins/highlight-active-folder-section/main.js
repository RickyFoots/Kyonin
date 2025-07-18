/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);

// folderHighlighter.ts
var import_obsidian2 = require("obsidian");

// settings.ts
var DEFAULT_SETTINGS = {
  autoScroll: true,
  useImportantTags: false,
  autoCollapseOtherFolders: false,
  lightHighlightedFolderColor: "rgba(238, 238, 238, 1)",
  lightHighlightFolderTitleColor: false,
  lightHighlightedFolderTitleColor: "rgba(255, 255, 255, 0)",
  lightHighlightedFolderTextColor: "rgba(0, 0, 0, 1)",
  lightHighlightedParentFolderColor: "rgba(221, 221, 221, 1)",
  lightHighlightedParentFolderTextColor: "rgba(0, 0, 0, 1)",
  previousLightHighlightedFolderTitleColor: "rgba(255, 255, 255, 0.8)",
  darkHighlightedFolderColor: "rgba(51, 51, 51, 1)",
  darkHighlightFolderTitleColor: false,
  darkHighlightedFolderTitleColor: "rgba(51, 51, 51, 1)",
  darkHighlightedFolderTextColor: "rgba(255, 255, 255, 1)",
  darkHighlightedParentFolderColor: "rgba(68, 68, 68, 1)",
  darkHighlightedParentFolderTextColor: "rgba(255, 255, 255, 1)",
  previousDarkHighlightedFolderTitleColor: "rgba(51, 51, 51, 1)",
  highlightParentFolder: false,
  highlightedFolderBorderRadius: "5px",
  highlightedParentFolderBorderRadius: "5px",
  highlightedFolderFontWeight: "bold",
  highlightedParentFolderFontWeight: "bold",
  editingDarkTheme: document.body.classList.contains("theme-dark")
};

// folderHighlighterSettingTab.ts
var import_obsidian = require("obsidian");
var FolderHighlighterSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.colorSettings = [];
    this.extractRgbaComponents = (rgba) => {
      const m = rgba.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
      );
      return m ? {
        r: parseInt(m[1]),
        g: parseInt(m[2]),
        b: parseInt(m[3]),
        a: m[4] ? parseFloat(m[4]) : 1
      } : { r: 0, g: 0, b: 0, a: 1 };
    };
    this.hexToRgb = (hex) => {
      const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return r ? {
        r: parseInt(r[1], 16),
        g: parseInt(r[2], 16),
        b: parseInt(r[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    this.rgbToHex = (rgba) => "#" + ((1 << 24) + (rgba.r << 16) + (rgba.g << 8) + rgba.b).toString(16).slice(1);
    this.getCurrentThemeSetting = (key) => this.plugin.settings[this.plugin.settings.editingDarkTheme ? `dark${key}` : `light${key}`];
    this.setThemeSetting = (key, value) => {
      this.plugin.settings[`light${key}`] = value;
      this.plugin.settings[`dark${key}`] = value;
    };
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    this.colorSettings = [];
    const themeHeaderEl = containerEl.createEl("div", {
      cls: "theme-header"
    });
    themeHeaderEl.createEl("h2", {
      text: this.plugin.settings.editingDarkTheme ? "Dark Theme" : "Light Theme",
      cls: "theme-title"
    });
    this.themeToggleButton = themeHeaderEl.createEl("div", {
      cls: "theme-toggle-button"
    });
    this.updateThemeToggleIcon();
    this.themeToggleButton.addEventListener("click", async () => {
      this.containerEl.addClass("theme-transition");
      this.plugin.settings.editingDarkTheme = !this.plugin.settings.editingDarkTheme;
      await this.plugin.saveSettings();
      setTimeout(() => {
        this.display();
        setTimeout(
          () => this.containerEl.removeClass("theme-transition"),
          850
        );
      }, 150);
    });
    this.createGeneralSettings(containerEl);
    this.createActiveFolderSettings(containerEl);
    this.createRootFolderSettings(containerEl);
  }
  createGeneralSettings(containerEl) {
    new import_obsidian.Setting(containerEl).setName("Override theme styles").setDesc("Use !important for style definitions").addToggle(
      (t) => t.setValue(this.plugin.settings.useImportantTags).onChange(async (v) => {
        this.plugin.settings.useImportantTags = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Center active file on scroll").setDesc(
      "Additionally scrolls the active file to the center of the explorer. Works best with Obsidian's native 'Auto-reveal current file' setting enabled."
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.autoScroll).onChange(async (v) => {
        this.plugin.settings.autoScroll = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Auto-collapse other folders").setDesc(
      "Collapse all folders not in the path to the active file. Works best with Obsidian's native 'Auto-reveal current file' setting enabled."
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.autoCollapseOtherFolders).onChange(async (v) => {
        this.plugin.settings.autoCollapseOtherFolders = v;
        await this.plugin.saveSettings();
      })
    );
  }
  createActiveFolderSettings(containerEl) {
    new import_obsidian.Setting(containerEl).setName("Active Folder").setHeading();
    const settingContainer = containerEl.createEl("div", {
      cls: "setting-indent"
    });
    new import_obsidian.Setting(settingContainer).setName("Enable title background").addToggle(
      (t) => t.setValue(
        this.getCurrentThemeSetting("highlightFolderTitleColor")
      ).onChange(async (v) => {
        this.setThemeSetting("highlightFolderTitleColor", v);
        if (!v) {
          this.plugin.settings.previousLightHighlightedFolderTitleColor = this.plugin.settings.lightHighlightedFolderTitleColor;
          this.plugin.settings.previousDarkHighlightedFolderTitleColor = this.plugin.settings.darkHighlightedFolderTitleColor;
          this.plugin.settings.lightHighlightedFolderTitleColor = "rgba(0,0,0,0)";
          this.plugin.settings.darkHighlightedFolderTitleColor = "rgba(0,0,0,0)";
        } else {
          this.plugin.settings.lightHighlightedFolderTitleColor = this.plugin.settings.previousLightHighlightedFolderTitleColor !== "rgba(0,0,0,0)" ? this.plugin.settings.previousLightHighlightedFolderTitleColor : DEFAULT_SETTINGS.lightHighlightedFolderTitleColor;
          this.plugin.settings.darkHighlightedFolderTitleColor = this.plugin.settings.previousDarkHighlightedFolderTitleColor !== "rgba(0,0,0,0)" ? this.plugin.settings.previousDarkHighlightedFolderTitleColor : DEFAULT_SETTINGS.darkHighlightedFolderTitleColor;
        }
        await this.plugin.saveSettings();
        this.display();
      })
    );
    if (this.getCurrentThemeSetting("highlightFolderTitleColor"))
      this.createColorSetting(
        settingContainer,
        "Title background color",
        "",
        "HighlightedFolderTitleColor"
      );
    this.createColorSetting(
      settingContainer,
      "Folder background",
      "",
      "HighlightedFolderColor"
    );
    this.createColorSetting(
      settingContainer,
      "Text color",
      "",
      "HighlightedFolderTextColor"
    );
    new import_obsidian.Setting(settingContainer).setName("Font weight").setDesc(createFragment((frag) => {
      frag.createEl("small", { text: "Note: This might be overridden by your current theme." });
    })).addDropdown((d) => d.addOptions({ "200": "Thin", "400": "Normal", "700": "Bold" }).setValue(this.plugin.settings.highlightedFolderFontWeight).onChange(async (v) => {
      this.plugin.settings.highlightedFolderFontWeight = v;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(settingContainer).setName("Border radius").setDesc(createFragment((frag) => {
      frag.createEl("small", { text: "Note: This might be overridden by your current theme." });
    })).addSlider((s) => {
      s.setLimits(0, 50, 1);
      s.setValue(parseInt(this.plugin.settings.highlightedFolderBorderRadius));
      s.onChange(async (v) => {
        this.plugin.settings.highlightedFolderBorderRadius = `${v}px`;
        await this.plugin.saveSettings();
      });
      s.setDynamicTooltip();
      return s;
    });
  }
  createRootFolderSettings(containerEl) {
    new import_obsidian.Setting(containerEl).setName("Root Folder").setHeading();
    new import_obsidian.Setting(containerEl).setName("Highlight root folders").addToggle(
      (t) => t.setValue(this.plugin.settings.highlightParentFolder).onChange(async (v) => {
        this.plugin.settings.highlightParentFolder = v;
        await this.plugin.saveSettings();
        this.display();
      })
    );
    if (this.plugin.settings.highlightParentFolder) {
      const settingContainer = containerEl.createEl("div", {
        cls: "setting-indent"
      });
      this.createColorSetting(
        settingContainer,
        "Root background",
        "",
        "HighlightedParentFolderColor"
      );
      this.createColorSetting(
        settingContainer,
        "Root text color",
        "",
        "HighlightedParentFolderTextColor"
      );
      new import_obsidian.Setting(settingContainer).setName("Root font weight").setDesc(createFragment((frag) => {
        frag.createEl("small", { text: "Note: This might be overridden by your current theme." });
      })).addDropdown((d) => d.addOptions({ "200": "Thin", "400": "Normal", "700": "Bold" }).setValue(this.plugin.settings.highlightedParentFolderFontWeight).onChange(async (v) => {
        this.plugin.settings.highlightedParentFolderFontWeight = v;
        await this.plugin.saveSettings();
      }));
      new import_obsidian.Setting(settingContainer).setName("Root border radius").addSlider((s) => {
        s.setLimits(0, 50, 1);
        s.setValue(parseInt(this.plugin.settings.highlightedParentFolderBorderRadius));
        s.onChange(async (v) => {
          this.plugin.settings.highlightedParentFolderBorderRadius = `${v}px`;
          await this.plugin.saveSettings();
        });
        s.setDynamicTooltip();
        return s;
      });
    }
  }
  createColorSetting(containerEl, name, desc, baseKey) {
    const theme = this.plugin.settings.editingDarkTheme ? "dark" : "light";
    const key = `${theme}${baseKey}`;
    const value = this.plugin.settings[key];
    const rgba = this.extractRgbaComponents(value);
    new import_obsidian.Setting(containerEl).setName(name).setDesc(desc).addColorPicker(
      (c) => c.setValue(this.rgbToHex(rgba)).onChange(async (nc) => {
        const nr = this.hexToRgb(nc);
        this.plugin.settings[key] = `rgba(${nr.r}, ${nr.g}, ${nr.b}, ${rgba.a})`;
        await this.plugin.saveSettings();
      })
    ).addExtraButton(
      (b) => b.setIcon("reset").onClick(async () => {
        this.plugin.settings[key] = DEFAULT_SETTINGS[`${theme}${baseKey}`];
        await this.plugin.saveSettings();
        this.display();
      })
    );
    const tc = containerEl.createEl("div", {
      cls: "transparency-slider-container"
    });
    tc.createEl("div", { cls: "setting-item-info", text: "Transparency" });
    const s = tc.createEl("input", {
      cls: "transparency-slider",
      attr: {
        type: "range",
        min: "0",
        max: "100",
        value: Math.round((1 - rgba.a) * 100).toString()
      }
    });
    const vd = tc.createEl("span", {
      cls: "transparency-value",
      text: `${Math.round((1 - rgba.a) * 100)}%`
    });
    s.addEventListener("input", async (e) => {
      const tv = parseInt(e.target.value);
      const na = 1 - tv / 100;
      vd.textContent = `${tv}%`;
      const cr = this.extractRgbaComponents(
        this.plugin.settings[key]
      );
      this.plugin.settings[key] = `rgba(${cr.r}, ${cr.g}, ${cr.b}, ${na})`;
      await this.plugin.saveSettings();
    });
  }
  updateThemeToggleIcon() {
    this.themeToggleButton.empty();
    this.themeToggleButton.innerHTML = this.plugin.settings.editingDarkTheme ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  }
};

// folderHighlighter.ts
var FolderHighlighter = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.isProcessing = false;
    this.operationQueue = [];
    this.lastExplorerClickTime = 0;
    this.USER_INTERACTION_DEBOUNCE = 300;
    this.getParentPath = (filePath) => {
      const parts = filePath.split("/");
      parts.pop();
      return parts.join("/");
    };
    this.getParentFolderElement = (filePath) => {
      const p = this.getParentPath(filePath);
      if (p) {
        const el = document.querySelector(`[data-path="${p}"]`);
        return (el == null ? void 0 : el.closest(".nav-folder")) || null;
      }
      return null;
    };
    this.getRootFolderInPath = (filePath) => {
      var _a;
      const p = filePath.split("/")[0];
      return ((_a = document.querySelector(`[data-path="${p}"]`)) == null ? void 0 : _a.closest(".nav-folder")) || null;
    };
    this.getIntermediateFoldersInPath = (filePath) => {
      const i = [];
      const p = this.getParentPath(filePath).split("/");
      while (p.length > 1) {
        p.pop();
        const n = p.join("/");
        const e = document.querySelector(`[data-path="${n}"]`);
        if (e)
          i.push(e.closest(".nav-folder"));
      }
      return i;
    };
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new FolderHighlighterSettingTab(this.app, this));
    this.updateStyles();
    this.registerEvent(
      this.app.workspace.on(
        "file-open",
        () => this.debouncedHandleFileChange()
      )
    );
    this.registerEvent(
      this.app.workspace.on(
        "active-leaf-change",
        () => this.debouncedHandleFileChange()
      )
    );
    this.app.workspace.onLayoutReady(() => {
      this.addFileExplorerClickListener();
      setTimeout(() => {
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile)
          this.queueOperation(() => this.executeSequentially());
      }, 1e3);
    });
    this.registerEvent(
      this.app.workspace.on(
        "layout-change",
        () => this.addFileExplorerClickListener()
      )
    );
  }
  addFileExplorerClickListener() {
    const explorerLeaf = this.app.workspace.getLeavesOfType("file-explorer")[0];
    if (explorerLeaf && explorerLeaf.view.containerEl) {
      this.registerDomEvent(
        explorerLeaf.view.containerEl,
        "click",
        () => {
          this.lastExplorerClickTime = Date.now();
        }
      );
    }
  }
  debouncedHandleFileChange() {
    if (this.debounceTimer)
      clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(
      () => this.queueOperation(() => this.executeSequentially()),
      150
    );
  }
  async queueOperation(operation) {
    this.operationQueue.push(operation);
    if (!this.isProcessing)
      await this.processQueue();
  }
  async processQueue() {
    if (this.isProcessing || this.operationQueue.length === 0)
      return;
    this.isProcessing = true;
    try {
      const lastOperation = this.operationQueue.pop();
      this.operationQueue = [];
      if (lastOperation)
        await lastOperation();
    } catch (error) {
      console.error("Error processing operation queue:", error);
    } finally {
      this.isProcessing = false;
    }
  }
  async executeSequentially() {
    try {
      const newFile = this.app.workspace.getActiveFile();
      if (!newFile)
        return;
      const now = Date.now();
      const isRecentUserInteraction = now - this.lastExplorerClickTime < this.USER_INTERACTION_DEBOUNCE;
      if (this.settings.autoCollapseOtherFolders && !isRecentUserInteraction) {
        await this.collapseFolders(newFile.path);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      if (this.settings.autoScroll && !isRecentUserInteraction) {
        await this.scrollToActiveFile();
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      this.highlightFolders();
      const activeView = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
      if (activeView == null ? void 0 : activeView.editor)
        activeView.editor.focus();
    } catch (error) {
      console.error("Error in executeSequentially:", error);
    }
  }
  async collapseFolders(activeFilePath) {
    var _a;
    const fileExplorerView = (_a = this.app.workspace.getLeavesOfType(
      "file-explorer"
    )[0]) == null ? void 0 : _a.view;
    if (!fileExplorerView || !fileExplorerView.containerEl)
      return;
    const pathsToKeepOpen = /* @__PURE__ */ new Set();
    let currentPath = "";
    for (const segment of this.getParentPath(activeFilePath).split("/")) {
      if (!segment && currentPath !== "")
        continue;
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      pathsToKeepOpen.add(currentPath);
    }
    const allFolders = fileExplorerView.containerEl.querySelectorAll(".nav-folder");
    allFolders.forEach((folderEl) => {
      const folderTitleEl = folderEl.querySelector(
        ".nav-folder-title"
      );
      if (!folderTitleEl)
        return;
      const folderPath = folderTitleEl.getAttribute("data-path");
      const isCollapsed = folderEl.classList.contains("is-collapsed");
      if (folderPath && pathsToKeepOpen.has(folderPath)) {
        if (isCollapsed)
          folderTitleEl.click();
      } else {
        if (!isCollapsed)
          folderTitleEl.click();
      }
    });
  }
  async scrollToActiveFile() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile)
          return resolve();
        const fileEl = document.querySelector(
          `[data-path="${activeFile.path}"]`
        );
        if (fileEl)
          fileEl.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        resolve();
      }, 100);
    });
  }
  async onunload() {
    if (this.debounceTimer)
      clearTimeout(this.debounceTimer);
    this.operationQueue = [];
    this.isProcessing = false;
  }
  highlightFolders() {
    document.querySelectorAll(
      ".nav-folder.highlighted-folder, .nav-folder.highlighted-parent-folder"
    ).forEach(
      (el) => el.classList.remove(
        "highlighted-folder",
        "highlighted-parent-folder"
      )
    );
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile)
      return;
    const currentFolder = this.getParentFolderElement(activeFile.path);
    if (currentFolder) {
      currentFolder.classList.add("highlighted-folder");
      if (this.settings.highlightParentFolder) {
        const rootFolder = this.getRootFolderInPath(activeFile.path);
        if (rootFolder && rootFolder !== currentFolder) {
          rootFolder.classList.add("highlighted-parent-folder");
        }
      }
    }
  }
  updateStyles() {
    const rootEl = document.documentElement;
    const important = this.settings.useImportantTags ? " !important" : "";
    const properties = {
      "--light-highlighted-folder-color": this.settings.lightHighlightedFolderColor,
      "--light-highlighted-folder-title-color": this.settings.lightHighlightedFolderTitleColor,
      "--light-highlighted-folder-text-color": this.settings.lightHighlightedFolderTextColor,
      "--light-highlighted-parent-folder-color": this.settings.lightHighlightedParentFolderColor,
      "--light-highlighted-parent-folder-text-color": this.settings.lightHighlightedParentFolderTextColor,
      "--dark-highlighted-folder-color": this.settings.darkHighlightedFolderColor,
      "--dark-highlighted-folder-title-color": this.settings.darkHighlightedFolderTitleColor,
      "--dark-highlighted-folder-text-color": this.settings.darkHighlightedFolderTextColor,
      "--dark-highlighted-parent-folder-color": this.settings.darkHighlightedParentFolderColor,
      "--dark-highlighted-parent-folder-text-color": this.settings.darkHighlightedParentFolderTextColor,
      "--fh-folder-border-radius": `${this.settings.highlightedFolderBorderRadius}${important}`,
      "--fh-folder-font-weight": `${this.settings.highlightedFolderFontWeight}${important}`,
      "--fh-parent-folder-border-radius": `${this.settings.highlightedParentFolderBorderRadius}${important}`,
      "--fh-parent-folder-font-weight": `${this.settings.highlightedParentFolderFontWeight}${important}`
    };
    Object.entries(properties).forEach(
      ([key, value]) => rootEl.style.setProperty(key, value)
    );
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.updateStyles();
    this.highlightFolders();
  }
};

// main.ts
var main_default = FolderHighlighter;

/* nosourcemap */