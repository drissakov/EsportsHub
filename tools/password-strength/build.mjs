import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const output = 'dist/password-strength.min.js';
await mkdir('dist', { recursive: true });
const result = await build({
    entryPoints: ['entry.js'],
    outfile: output,
    bundle: true,
    minify: true,
    format: 'iife',
    platform: 'browser',
    target: ['chrome100', 'edge100', 'firefox100', 'safari15.4'],
    legalComments: 'inline',
    metafile: true,
    banner: { js: '/*! zxcvbn-ts core 4.2.0, language-common 4.1.3, language-en 4.1.1 | MIT | https://github.com/zxcvbn-ts/zxcvbn | Full licenses: password-strength-LICENSE.txt */' },
});
const bytes = await readFile(output);
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const packages = [
    ['@zxcvbn-ts/core', 'LICENSE.txt'],
    ['@zxcvbn-ts/language-common', 'LICENSE.txt'],
    ['@zxcvbn-ts/language-en', 'LICENSE.txt'],
    ['@zxcvbn-ts/dictionary-compression', 'LICENSE'],
    ['fastest-levenshtein', 'LICENSE.md'],
];
const sources = [];
const licenseTexts = [];
for (const [name, licenseFile] of packages) {
    const root = `node_modules/${name}`;
    const metadata = JSON.parse(await readFile(`${root}/package.json`, 'utf8'));
    const locked = lock.packages[root];
    const license = await readFile(`${root}/${licenseFile}`, 'utf8');
    licenseTexts.push(`${name} ${metadata.version}\n${'='.repeat(72)}\n${license.trim()}\n`);
    sources.push({
        name,
        version: metadata.version,
        license: metadata.license,
        repository: metadata.repository?.url,
        tarball: locked.resolved,
        integrity: locked.integrity,
    });
}
await writeFile('dist/password-strength-LICENSE.txt', licenseTexts.join('\n'));
await writeFile('dist/password-strength-sources.json', JSON.stringify({
    documentation: 'https://zxcvbn-ts.github.io/zxcvbn/guide/getting-started/',
    sourceProject: 'https://github.com/zxcvbn-ts/zxcvbn',
    packageRegistry: 'https://registry.npmjs.org/',
    rebuild: ['npm ci --ignore-scripts --no-audit --no-fund', 'npm run build'],
    buildTool: { name: 'esbuild', version: lock.packages['node_modules/esbuild'].version },
    wrapper: 'entry.js',
    output: 'password-strength.min.js',
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    runtimePackages: sources,
}, null, 2) + '\n');
await writeFile('dist/metafile.json', JSON.stringify(result.metafile, null, 2) + '\n');
await writeFile('dist/bundle-hash.json', JSON.stringify({
    file: 'password-strength.min.js',
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
}, null, 2) + '\n');
console.log(`Built ${output}: ${bytes.length} bytes`);
