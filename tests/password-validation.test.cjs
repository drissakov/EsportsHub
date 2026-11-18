const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/password-validation.js'), 'utf8'), context);
const { validate } = context.window.EsportsHubPassword;

test('requires a password supplied as a string', () => {
    for (const value of ['', '   ', null, undefined, 123, {}, []]) assert.equal(validate(value).valid, false);
});

test('accepts 8 to 128 characters and rejects both outside boundaries', () => {
    assert.match(validate('a'.repeat(6) + '1').error, /at least 8/);
    assert.equal(validate('a'.repeat(7) + '1').valid, true);
    assert.equal(validate('a'.repeat(127) + '1').valid, true);
    assert.match(validate('a'.repeat(128) + '1').error, /at most 128/);
    assert.equal(validate('x'.repeat(1000000)).valid, false);
});

test('requires a letter and a decimal digit, including Unicode', () => {
    assert.match(validate('12345678').error, /letter and one number/);
    assert.match(validate('abcdefgh!').error, /letter and one number/);
    assert.equal(validate('турнир７４').valid, true);
    assert.equal(validate('a1' + '🚀'.repeat(126)).valid, true);
    assert.equal(validate('a1' + '🚀'.repeat(127)).valid, false);
});

test('accepts spaces and printable punctuation and rejects control characters', () => {
    assert.equal(validate(' A b 2 !').valid, true);
    for (const character of ['\u0000', '\t', '\r', '\n', '\u007f', '\u0085', '\ud800', '\udfff']) {
        assert.equal(validate('Matchday42' + character).valid, false);
    }
});
