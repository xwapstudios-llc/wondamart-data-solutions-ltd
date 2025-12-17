import {defineConfig} from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],     // Entry point of your functions
    splitting: false,            // Firebase hates code-splitting
    sourcemap: true,
    clean: true,                 // Clears dist before build
    format: ["esm"],             // Functions v7 requires ESM
    target: "node22",            // Matches your engine
    outDir: "dist",              // Firebase looks here
    minify: false,               // Keep readable stack traces
    dts: false,


    // 🚨 CRITICAL: prevent bundling Node/Firebase internals
    external: [
        "firebase-admin",
        "firebase-functions",
        "@grpc/grpc-js",
        "@grpc/proto-loader",
        "process",
        "path",
        "fs",
        "util",
        "url"
    ],

    noExternal: undefined, // ensure nothing forces these back in

    // Ensure all files in dist resolve relative imports properly
    shims: false,
});

