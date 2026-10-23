const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');

const source = fs.readFileSync(path.join(__dirname, '../js/password-validation.js'), 'utf8');
function helper(strength) {
    const context = { window: { EsportsHubStrength: strength } };
    vm.runInNewContext(source, context);
    return context.window.EsportsHubPassword;
}
const calls = [];
const policy = helper({ estimate(value, context) { calls.push({ length: value.length, context }); return { score: 4 }; } });

test('requires a nonempty password without coercing other types', () => {
    for (const value of ['', '   ', '\u00a0'.repeat(15), null, undefined, 123, {}, []]) assert.equal(policy.validate(value).valid, false);
});
test('enforces the 14/15 and 128/129 character boundaries in JavaScript', () => {
    assert.match(policy.validate('a'.repeat(14)).error, /at least 15/);
    assert.equal(policy.validate('a'.repeat(15)).valid, true);
    assert.equal(policy.validate('a'.repeat(128)).valid, true);
    assert.match(policy.validate('a'.repeat(129)).error, /at most 128/);
});
test('counts Unicode code points, not UTF-16 units', () => {
    assert.match(policy.validate('🚀'.repeat(14)).error, /at least 15/);
    assert.equal(policy.validate('🚀'.repeat(15)).valid, true);
    assert.equal(policy.validate('🚀'.repeat(128)).valid, true);
    assert.match(policy.validate('🚀'.repeat(129)).error, /at most 128/);
});
test('does not impose upper-case, digit or symbol composition rules', () => {
    for (const value of ['copper meadow lantern orbit', 'Сиреневый маяк рядом с рекой', ' sushi comet meadow 🔭 ']) assert.equal(policy.validate(value).valid, true);
});
test('rejects controls and unpaired surrogates', () => {
    for (const character of ['\u0000', '\t', '\r', '\n', '\u007f', '\u0085', '\ud800', '\udfff']) {
        assert.equal(policy.validate('fifteen safe chars' + character).valid, false);
    }
});
test('blocks published example phrases, including simple separators and compatibility forms', () => {
    for (const value of ['CorrectHorseBatteryStaple', 'correct horse battery staple', 'Correct-Horse-Battery-Staple!',
        'this is a very strong password', 'passwordpasswordpassword', 'ＣｏｒｒｅｃｔＨｏｒｓｅＢａｔｔｅｒｙＳｔａｐｌｅ']) {
        assert.match(policy.validate(value).error, /published example/);
    }
});
test('rejects unsupported length before calling the estimator', () => {
    calls.length = 0;
    assert.equal(policy.validate('x'.repeat(1000000)).valid, false);
    assert.equal(calls.length, 0);
});
test('bounds the context and preserves exact password spelling', () => {
    let observed;
    const checking = helper({ estimate(value, context) { observed = { value, context }; return { score: 4 }; } });
    const value = ' Space Case Phrase 27! ';
    assert.equal(checking.validate(value, ['Name', 'name@example.com', null, ...Array(30).fill('x'.repeat(500))]).valid, true);
    assert.equal(observed.value, value);
    assert.equal(observed.context.length, 30);
    assert(observed.context.includes('correct horse battery staple'));
    assert(observed.context.includes('Name'));
    assert(observed.context.every((item) => typeof item === 'string' && item.length <= 128));
});
test('fails closed when the estimator is missing, broken or returns an invalid score', () => {
    for (const strength of [undefined, {}, { estimate() { throw new Error('unavailable'); } },
        ...[NaN, -1, 5, '4', undefined].map((score) => ({ estimate() { return { score }; } }))]) {
        assert.equal(helper(strength).validate('A sufficiently long phrase!').valid, false);
    }
});
test('only estimator score 4 passes the strength threshold', () => {
    for (const score of [0, 1, 2, 3, 4]) {
        const checking = helper({ estimate() { return { score }; } });
        assert.equal(checking.validate('A sufficiently long phrase!').valid, score === 4);
    }
});

const context = { window: {}, Intl, performance, atob, btoa, TextDecoder, TextEncoder };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/vendor/password-strength.min.js'), 'utf8'), context);
vm.runInNewContext(source, context);
const real = context.window.EsportsHubPassword;
const weak = ['aaaaaaaaaaaaaaa', '12345678901234567890', 'qwertyuiopasdfghjkl', 'Password123456789!',
    'passwordpasswordpassword', '1111111111111111', 'Summer2026Summer2026!', '1qaz2wsx3edc4rfv'];
weak.forEach((value, index) => test(`real estimator rejects weak sample ${index + 1}`, () => assert.equal(real.validate(value).valid, false)));
const examplesWithSuffixes = ['CorrectHorseBatteryStaple1', 'CorrectHorseBatteryStaple123!',
    'correct horse battery staple123!', 'this is a very strong password1!'];
examplesWithSuffixes.forEach((value, index) => test(`real estimator rejects a predictable edit to published example ${index + 1}`, () => assert.equal(real.validate(value).valid, false)));
const strong = ['violet comet harbor lantern 74', 'copper zeppelin meadow orbit 63!', 'Фиолетовый маяк возле кратера 74!'];
strong.forEach((value, index) => test(`real estimator accepts unrelated phrase ${index + 1}`, () => assert.equal(real.validate(value).valid, true)));
test('real estimator penalizes the supplied name and service context', () => {
    assert.equal(real.validate('DamirIssakov2026!', ['Damir', 'Issakov', 'Damir Issakov', 'EsportsHub']).valid, false);
    assert.equal(real.validate('EsportsHub20262026!', ['EsportsHub']).valid, false);
});
test('public estimator result does not expose the password or pattern matches', () => {
    assert.deepEqual(Object.keys(context.window.EsportsHubStrength.estimate(strong[0])).sort(), ['feedback', 'score']);
});
