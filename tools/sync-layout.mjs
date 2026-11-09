import { readFileSync, writeFileSync } from 'node:fs';

const argumentsToScript = process.argv.slice(2);
const checkOnly = argumentsToScript.length === 1 && argumentsToScript[0] === '--check';
if (argumentsToScript.length && !checkOnly) {
    console.error('Usage: node tools/sync-layout.mjs [--check]');
    process.exit(1);
}

const navigation = [
    ['index.html', 'Home'],
    ['events.html', 'Events'],
    ['teams.html', 'Teams'],
    ['players.html', 'Players'],
    ['rankings.html', 'Rankings'],
    ['contact.html', 'Community'],
    ['profile.html', 'Account'],
];
const pages = [...navigation.map(([file]) => file), 'account.html'];
const sections = ['header', 'page-tools', 'footer', 'subscription'];

function readTemplate(name) {
    const url = new URL(`layout/${name}.html`, import.meta.url);
    return readFileSync(url, 'utf8').replaceAll('\r\n', '\n').trimEnd();
}

function indent(text, spaces) {
    return text.split('\n').map((line) => line ? spaces + line : '').join('\n');
}

function renderNavigation(page) {
    const currentPage = page === 'account.html' ? 'profile.html' : page;
    return navigation.map(([href, label]) => {
        const isCurrent = href === currentPage;
        const ariaCurrent = isCurrent ? ' aria-current="page"' : '';
        const profile = href === 'profile.html' ? ' nav-profile' : '';
        const active = isCurrent ? ' active' : '';
        return `<li class="nav-item mb-0">
    <a${ariaCurrent} class="nav-link${profile} px-sm-2 py-2${active}" href="${href}">${label}</a>
</li>`;
    }).join('\n');
}

function replaceSection(html, page, section, content) {
    const start = `<!-- layout:${section} -->`;
    const end = `<!-- /layout:${section} -->`;
    const region = new RegExp(`^( *)${start}\\n[\\s\\S]*?^\\1${end}$`, 'm');
    if (html.split(start).length !== 2 || html.split(end).length !== 2 || !region.test(html)) {
        throw new Error(`${page} must contain one complete layout region for ${section}.`);
    }
    return html.replace(region, (_, spaces) =>
        `${spaces}${start}\n${indent(content, spaces)}\n${spaces}${end}`
    );
}

const templates = Object.fromEntries(sections.map((name) => [name, readTemplate(name)]));
const homeNickname = readTemplate('home-nickname');

// Validate every page before writing so a broken marker cannot produce a partial sync.
const changes = [];
for (const page of pages) {
    const url = new URL(`../${page}`, import.meta.url);
    const original = readFileSync(url, 'utf8');
    let updated = original.replaceAll('\r\n', '\n');
    const content = {
        ...templates,
        header: templates.header.replace('{{navigation}}', () => indent(renderNavigation(page), ' '.repeat(20))),
        'page-tools': templates['page-tools'].replace('\n{{nickname}}',
            () => page === 'index.html' ? '\n' + indent(homeNickname, ' '.repeat(8)) : ''),
    };
    for (const section of sections) {
        updated = replaceSection(updated, page, section, content[section]);
    }
    if (original.includes('\r\n')) updated = updated.replaceAll('\n', '\r\n');
    if (updated !== original) changes.push({ page, url, updated });
}

if (!changes.length) {
    console.log(`Shared layout is in sync across ${pages.length} pages.`);
} else if (checkOnly) {
    console.error(`Shared layout is out of sync in: ${changes.map(({ page }) => page).join(', ')}.`);
    console.error('Run node tools/sync-layout.mjs and commit the updated HTML.');
    process.exitCode = 1;
} else {
    for (const { url, updated } of changes) writeFileSync(url, updated);
    console.log(`Updated shared layout in: ${changes.map(({ page }) => page).join(', ')}.`);
}
