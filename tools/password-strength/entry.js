import { ZxcvbnFactory } from '@zxcvbn-ts/core';
import * as common from '@zxcvbn-ts/language-common';
import * as english from '@zxcvbn-ts/language-en';

const estimator = new ZxcvbnFactory({
    maxLength: 256,
    translations: english.translations,
    graphs: common.adjacencyGraphs,
    dictionary: { ...common.dictionary, ...english.dictionary },
});

window.EsportsHubStrength = Object.freeze({
    estimate(password, userInputs = []) {
        if (typeof password !== 'string' || password.length > 256) {
            throw new TypeError('Password input is outside the supported bounds.');
        }
        const result = estimator.check(password, userInputs);
        // Expose feedback only; do not retain or expose the submitted password.
        return { score: result.score, feedback: result.feedback };
    },
});
