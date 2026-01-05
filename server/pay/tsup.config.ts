import {defineConfig} from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],     // Entry point of your functions
    splitting: true,
    sourcemap: true,
    clean: true,                 // Clears dist before build
    format: ["cjs"],
    target: "es2022",
    outDir: "dist",
    minify: false,
    dts: false,

    external: ["firebase", "firebase-admin", "express"],

    // Ensure all files in dist resolve relative imports properly
    shims: false,
});

