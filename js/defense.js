/* Learning controls only. The assignment demos reuse their original scripts. */
(() => {
    'use strict';
    const roleButtons = document.querySelectorAll('[data-study-role]');
    const roleCards = document.querySelectorAll('[data-role-card]');
    roleButtons.forEach((button) => button.addEventListener('click', () => {
        const selected = button.dataset.studyRole;
        roleButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        roleCards.forEach((card) => { card.hidden = selected !== 'all' && card.dataset.roleCard !== selected; });
    }));

    const questions = Array.from(document.querySelectorAll('.question'));
    const search = document.querySelector('#question-search');
    const topic = document.querySelector('#question-topic');
    const count = document.querySelector('#question-count');
    const empty = document.querySelector('#question-empty');
    const filterQuestions = () => {
        const term = search.value.trim().toLocaleLowerCase('ru');
        let visible = 0;
        questions.forEach((question) => {
            const matchesText = question.textContent.toLocaleLowerCase('ru').includes(term);
            const matchesTopic = topic.value === 'all' || question.dataset.topic === topic.value;
            question.hidden = !matchesText || !matchesTopic;
            if (!question.hidden) visible++;
        });
        count.textContent = `Показано: ${visible} из ${questions.length}`;
        empty.hidden = visible > 0;
    };
    search.addEventListener('input', filterQuestions);
    topic.addEventListener('change', filterQuestions);
    filterQuestions();

    const practiceRole = document.querySelector('#practice-role');
    const practicePrompt = document.querySelector('#practice-prompt');
    const practiceStatus = document.querySelector('#practice-status');
    const practiceAnswer = document.querySelector('#practice-answer');
    const reveal = document.querySelector('#practice-reveal');
    const next = document.querySelector('#practice-next');
    let deck = [];
    let current = 0;

    function showQuestion() {
        const question = deck[current];
        practicePrompt.textContent = question.querySelector('summary').textContent;
        practiceStatus.textContent = `Вопрос ${current + 1} из ${deck.length} · ответь вслух, затем проверь`;
        practiceAnswer.replaceChildren(question.querySelector('.answer').cloneNode(true));
        practiceAnswer.hidden = true;
        reveal.setAttribute('aria-expanded', 'false');
        reveal.textContent = 'Показать ответ';
    }
    function resetDeck() {
        deck = questions.filter((question) => practiceRole.value === 'all' || question.dataset.owner === 'general' || question.dataset.owner === practiceRole.value);
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        current = 0;
        showQuestion();
    }
    reveal.addEventListener('click', () => {
        const expanded = reveal.getAttribute('aria-expanded') !== 'true';
        practiceAnswer.hidden = !expanded;
        reveal.setAttribute('aria-expanded', String(expanded));
        reveal.textContent = expanded ? 'Скрыть ответ' : 'Показать ответ';
    });
    next.addEventListener('click', () => {
        if (current + 1 === deck.length) resetDeck();
        else { current++; showQuestion(); }
    });
    practiceRole.addEventListener('change', resetDeck);
    reveal.disabled = false;
    next.disabled = false;
    resetDeck();

    const checks = Array.from(document.querySelectorAll('[data-ready-check]'));
    const storageKey = 'esportshub-defense-progress-v1';
    const progress = document.querySelector('#readiness-progress');
    const progressText = document.querySelector('#readiness-text');
    const storageNote = document.querySelector('#storage-note');
    let storageAvailable = true;
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (Array.isArray(saved)) checks.forEach((check) => { check.checked = saved.includes(check.id); });
    } catch { storageAvailable = false; }
    const updateProgress = (save = true) => {
        const completed = checks.filter((check) => check.checked);
        progress.max = checks.length;
        progress.value = completed.length;
        progressText.textContent = `Готово ${completed.length} из ${checks.length}`;
        if (save && storageAvailable) {
            try { localStorage.setItem(storageKey, JSON.stringify(completed.map((check) => check.id))); }
            catch { storageAvailable = false; }
        }
        storageNote.textContent = storageAvailable
            ? 'Отметки сохраняются только в этом браузере. Общая готовность команды не отслеживается.'
            : 'Отметки работают до закрытия страницы: сохранение в этом браузере недоступно.';
    };
    checks.forEach((check) => check.addEventListener('change', () => updateProgress()));
    document.querySelector('#readiness-reset').addEventListener('click', () => {
        checks.forEach((check) => { check.checked = false; });
        updateProgress();
    });
    updateProgress(false);
})();
