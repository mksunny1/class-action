import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
// import typescript from '@rollup/plugin-typescript';

import { writeFile, mkdir } from "fs/promises";

function createPackage(src) {
    const pkg = { types: `./${src}.d.ts` };
    return {
        name: `${src}`,
        buildEnd: async () => {
            await mkdir(`dist/esm`, { recursive: true });
            await writeFile(`./dist/esm/package.json`, JSON.stringify(pkg, null, 2));
        },
    };
}

function createCommonJsPackage(src) {
    const pkg = { type: "commonjs" };
    return {
        name: "cjs-package",
        buildEnd: async () => {
            await mkdir(`dist/cjs`, { recursive: true });
            await writeFile(`./dist/cjs/package.json`, JSON.stringify(pkg, null, 2));
        },
    };
}

const sources = [ "class-action" ];

const exports = [];
for (let [i, src] of sources.entries()) {
    exports.push({
        input: `./src/${src}.js`,
        output: [
            { format: "es", file: `./dist/esm/${src}.js`},
            { format: "cjs", file: `./dist/cjs/${src}.js`},
        ],
        plugins: [
            createPackage(src),
            createCommonJsPackage(src),
            terser()
        ]

    }, {
        input: `./src/${src}.ts`,
        plugins: [dts()],
        output: [
            { format: "es", file: `./dist/esm/${src}.d.ts`},
            { format: "cjs", file: `./dist/cjs/${src}.d.ts`},
        ]
    })
}

export default exports;

