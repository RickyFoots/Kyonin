import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import inlineWorkerPlugin from "esbuild-plugin-inline-worker";
import { sassPlugin } from "esbuild-sass-plugin";
import { config } from "dotenv";

config();

const filteredWarnings = [
    "a11y-click-events-have-key-events",
    "security-anchor-rel-noreferrer"
];
const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";

const dir = prod ? "./" : process.env.OUTDIR;

esbuild
    .build({
        banner: {
            js: banner
        },
        entryPoints: ["src/main.ts", "src/styles.css"],
        bundle: true,
        external: [
            "obsidian",
            "electron",
            "codemirror",
            "@codemirror/autocomplete",
            "@codemirror/closebrackets",
            "@codemirror/collab",
            "@codemirror/commands",
            "@codemirror/comment",
            "@codemirror/fold",
            "@codemirror/gutter",
            "@codemirror/highlight",
            "@codemirror/history",
            "@codemirror/language",
            "@codemirror/lint",
            "@codemirror/matchbrackets",
            "@codemirror/panel",
            "@codemirror/rangeset",
            "@codemirror/rectangular-selection",
            "@codemirror/search",
            "@codemirror/state",
            "@codemirror/stream-parser",
            "@codemirror/text",
            "@codemirror/tooltip",
            "@codemirror/view",
            "@lezer/common",
            /* "@lezer/lr", */
            "@lezer/highlight",
            ...builtins
        ],
        format: "cjs",
        watch: !prod,
        target: "es2020",
        logLevel: "info",
        sourcemap: prod ? false : "inline",
        minify: prod,
        treeShaking: true,
        outdir: dir,
        plugins: [
            sassPlugin(),
            sveltePlugin({
                compilerOptions: { css: true },
                preprocess: sveltePreprocess(),
                filterWarnings: (warning) => {
                    return !filteredWarnings.includes(warning.code);
                }
            }),
            inlineWorkerPlugin()
        ]
    })
    .catch(() => {
        process.exit(1);
    });