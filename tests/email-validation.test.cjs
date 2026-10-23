const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { window: {}, URL };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/email-validation.js'), 'utf8'), context);
const { validate } = context.window.EsportsHubEmail;

const validAddresses = [
    'player@example.com',
    'a@b.kz',
    'first.last@example.co.uk',
    'player+team@example.technology',
    "o'connor+tag@example.com",
    '!#$%&\'*+-/=?^_`{|}~@example.com',
    'Player.Name+Tag@EXAMPLE.COM',
    '123@123.example.com',
    'player@my-team.example.com',
    'player@xn--bcher-kva.de',
    'player@xn--e1afmkfd.xn--p1ai',
    `${'a'.repeat(64)}@example.com`,
    `a@${'b'.repeat(63)}.com`,
    `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(61)}`,
];
for (const address of validAddresses) {
    test(`accepts a supported address: ${address}`, () => {
        assert.equal(validate(address).valid, true);
    });
}

const invalidAddresses = [
    '', ' ', 'not-an-email', 'player', 'player@', '@example.com',
    'player@@example.com', 'player@example.com@other.com',
    '.player@example.com', 'player.@example.com', 'first..last@example.com',
    'first last@example.com', 'player@exam ple.com',
    'player@localhost', 'player@example', 'player@example.c',
    'player@example.123', 'player@127.0.0.1', 'player@[127.0.0.1]',
    'player@[IPv6:2001:db8::1]', 'player@example.com.',
    'player@.example.com', 'player@example..com',
    'player@-example.com', 'player@example-.com', 'player@exam_ple.com',
    'player@example.com/path', 'player@example.com:443',
    'player@example.com?subject=test', 'player@example.com#part',
    'player@example%2ecom', 'player@xn--a.com',
    'Player <player@example.com>', 'a@example.com,b@example.com',
    '"player.name"@example.com', 'player(comment)@example.com',
    'first\\last@example.com', '<img>@example.com',
    'player\n@example.com', 'player@example.com\r\nBcc:x@other.com',
    'player@example.com\t', '\tplayer@example.com',
    'player\u0000@example.com', 'player\u007f@example.com',
    'player\u0085@example.com', 'player\u00a0@example.com',
    '\u00a0player@example.com', 'player@example.com\u00a0',
    'player\u200b@example.com', 'player@example.com\ufeff',
    'player\u202e@example.com', 'player\u2028@example.com',
    'игрок@example.com', 'player@пример.рф', 'player＠example.com',
    `${'a'.repeat(65)}@example.com`,
    `a@${'b'.repeat(64)}.com`,
    `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(62)}`,
];
for (const address of invalidAddresses) {
    test(`rejects an unsupported or malformed address: ${JSON.stringify(address)}`, () => {
        const result = validate(address);
        assert.equal(result.valid, false);
        assert.equal(result.value, '');
        assert(result.error.length > 0);
    });
}

test('normalizes only outer ASCII spaces and domain case', () => {
    const result = validate(' Player.Name+Tag@EXAMPLE.COM ');
    assert.equal(result.valid, true);
    assert.equal(result.value, 'Player.Name+Tag@example.com');
    assert.equal(result.error, '');
});

test('does not rewrite provider-specific mailbox names', () => {
    assert.equal(validate('First.Last+Team@GMAIL.COM').value, 'First.Last+Team@gmail.com');
});

test('allows an empty optional field but still rejects malformed optional values', () => {
    assert.equal(validate('', { required: false }).valid, true);
    assert.equal(validate('wrong', { required: false }).valid, false);
});

test('rejects non-string input and oversized input without throwing', () => {
    for (const value of [null, undefined, 42, {}, [], 'a'.repeat(1000000) + '@example.com', 'a' + ' '.repeat(1000000) + 'b@example.com']) {
        assert.equal(validate(value).valid, false);
    }
});
