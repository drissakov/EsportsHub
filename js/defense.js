/* A standalone multiple-choice practice session. No personal data is stored. */
(() => {
    'use strict';
    const data = window.JSPracticeData;
    const $ = (selector) => document.querySelector(selector);
    const topicSelect = $('#topic-select');
    const form = $('#quiz-form');
    const options = $('#answer-options');
    const checkButton = $('#check-answer');
    const nextButton = $('#next-question');
    const feedback = $('#answer-feedback');
    const tabs = [$('#tab-test'), $('#tab-theory')];
    let pool = [];
    let cursor = 0;
    let checked = false;
    let history = [];
    let retryMode = false;

    function element(tag, text, className) {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        if (className) node.className = className;
        return node;
    }

    function showView(view) {
        tabs.forEach((tab) => {
            const active = tab.id === `tab-${view}`;
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
        });
        $('#test-panel').hidden = view !== 'test';
        $('#theory-panel').hidden = view !== 'theory';
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => showView(index === 0 ? 'test' : 'theory'));
        tab.addEventListener('keydown', (event) => {
            let target;
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') target = 1 - index;
            else if (event.key === 'Home') target = 0;
            else if (event.key === 'End') target = 1;
            else return;
            event.preventDefault();
            showView(target === 0 ? 'test' : 'theory');
            tabs[target].focus();
        });
    });

    function shuffled(items) {
        const copy = [...items];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function updateProgress() {
        $('#quiz-correct').textContent = String(history.filter((answer) => answer.correct).length);
        $('#quiz-answered').textContent = String(history.length);
        $('#progress-label').textContent = `${history.length} из ${pool.length}`;
        $('#quiz-progress').max = pool.length;
        $('#quiz-progress').value = history.length;
        const map = $('#question-map');
        map.replaceChildren();
        pool.forEach((question, index) => {
            const answer = history[index];
            const item = element('li', String(index + 1));
            let status = 'ещё не пройден';
            if (index === cursor) { item.classList.add('current'); status = 'текущий'; }
            if (answer) {
                item.classList.add(answer.correct ? 'correct' : 'wrong');
                status = answer.correct ? 'верно' : 'ошибка';
            }
            item.setAttribute('aria-label', `Вопрос ${index + 1}: ${status}`);
            map.append(item);
        });
    }

    function renderQuestion(moveFocus = false) {
        const question = pool[cursor];
        checked = false;
        $('#question-panel').hidden = false;
        $('#results-panel').hidden = true;
        $('#question-panel').dataset.questionId = question.id;
        $('#question-topic').textContent = data.topics[question.topic];
        $('#quiz-position').textContent = `Вопрос ${cursor + 1} из ${pool.length}`;
        $('#question-title').textContent = question.question;
        $('#question-title').tabIndex = -1;
        $('#question-code').hidden = !question.code;
        $('#question-code code').textContent = question.code || '';
        options.replaceChildren();
        question.options.forEach((text, index) => {
            const label = element('label', undefined, 'answer-option');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'answer';
            radio.value = String(index);
            radio.id = `answer-${index}`;
            radio.required = true;
            label.htmlFor = radio.id;
            label.append(radio, element('span', text, 'option-text'), element('span', '', 'option-result'));
            options.append(label);
        });
        checkButton.disabled = true;
        checkButton.hidden = false;
        nextButton.hidden = true;
        nextButton.textContent = cursor === pool.length - 1 ? 'Посмотреть результат →' : 'Следующий вопрос →';
        feedback.hidden = true;
        $('#open-theory').hidden = true;
        $('#choice-hint').textContent = 'Выбери один из четырёх вариантов';
        updateProgress();
        if (moveFocus) $('#question-title').focus();
    }

    function startSession(customPool = null, moveFocus = true) {
        retryMode = customPool !== null;
        const selected = data.questions.filter((question) => topicSelect.value === 'all' || question.topic === topicSelect.value);
        pool = shuffled(customPool || selected);
        cursor = 0;
        history = [];
        showView('test');
        $('.session-footnote').textContent = retryMode
            ? 'Повторение ошибок. Сейчас в тесте только вопросы, в которых ты ошибся.'
            : 'В каждом вопросе один правильный ответ. Порядок вопросов меняется в новой попытке.';
        renderQuestion(moveFocus);
    }

    form.addEventListener('change', () => { if (!checked) checkButton.disabled = !form.querySelector('input[name="answer"]:checked'); });
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (checked) return;
        const selected = form.querySelector('input[name="answer"]:checked');
        if (!selected) return;
        const question = pool[cursor];
        const selectedIndex = Number(selected.value);
        const correct = selectedIndex === question.correct;
        checked = true;
        history.push({ question, selected: selectedIndex, correct });
        options.querySelectorAll('input').forEach((input) => {
            input.disabled = true;
            const label = input.closest('label');
            const marker = label.querySelector('.option-result');
            if (Number(input.value) === question.correct) {
                label.classList.add('correct');
                marker.textContent = 'Верный ответ';
            } else if (input.checked) {
                label.classList.add('wrong');
                marker.textContent = 'Твой ответ';
            }
        });
        feedback.className = `answer-feedback ${correct ? 'correct' : 'wrong'}`;
        $('#feedback-title').textContent = correct ? 'Верно' : 'Пока неверно. Разберёмся.';
        $('#feedback-correct').hidden = correct;
        $('#feedback-correct').textContent = `Правильный ответ: ${question.options[question.correct]}`;
        $('#feedback-explanation').textContent = question.explanation;
        feedback.hidden = false;
        $('#open-theory').hidden = false;
        checkButton.hidden = true;
        checkButton.disabled = true;
        nextButton.hidden = false;
        $('#choice-hint').textContent = 'Проверь объяснение перед следующим вопросом';
        updateProgress();
        nextButton.focus({ preventScroll: true });
        feedback.scrollIntoView({ block: 'nearest' });
    });

    function showResults() {
        const correct = history.filter((answer) => answer.correct).length;
        const mistakes = history.filter((answer) => !answer.correct);
        $('#question-panel').hidden = true;
        $('#results-panel').hidden = false;
        $('#result-percent').textContent = `${Math.round(correct / pool.length * 100)}%`;
        $('#result-score').textContent = `${correct} из ${pool.length} верно`;
        $('#result-summary').textContent = mistakes.length
            ? `Вопросов для повторения: ${mistakes.length}. Ниже — твои ответы, правильные варианты и объяснения.`
            : 'Все ответы верны. Можно выбрать другую тему или начать новую попытку.';
        $('#retry-mistakes').hidden = mistakes.length === 0;
        const review = $('#review-list');
        review.replaceChildren();
        mistakes.forEach((answer) => {
            const item = element('article', undefined, 'review-item');
            item.append(element('h3', answer.question.question));
            if (answer.question.code) {
                const pre = element('pre');
                pre.tabIndex = 0;
                pre.append(element('code', answer.question.code));
                item.append(pre);
            }
            item.append(element('p', `Твой ответ: ${answer.question.options[answer.selected]}`));
            item.append(element('p', `Правильно: ${answer.question.options[answer.question.correct]}`, 'review-correct'));
            item.append(element('p', answer.question.explanation));
            review.append(item);
        });
        $('#results-title').focus();
    }

    nextButton.addEventListener('click', () => {
        if (!checked) return;
        if (cursor === pool.length - 1) showResults();
        else { cursor++; renderQuestion(true); }
    });
    topicSelect.addEventListener('change', () => startSession());
    $('#restart-quiz').addEventListener('click', () => startSession());
    document.querySelectorAll('[data-restart]').forEach((button) => button.addEventListener('click', () => startSession()));
    $('#retry-mistakes').addEventListener('click', () => {
        const mistakes = history.filter((answer) => !answer.correct).map((answer) => answer.question);
        if (mistakes.length) startSession(mistakes);
    });

    data.theory.forEach((lesson, index) => {
        const article = element('article', undefined, 'theory-card');
        article.id = `theory-${lesson.id}`;
        article.dataset.theory = lesson.id;
        article.tabIndex = -1;
        const title = element('h3', lesson.title);
        title.id = `theory-title-${lesson.id}`;
        article.setAttribute('aria-labelledby', title.id);
        article.append(element('span', `ТЕМА ${String(index + 1).padStart(2, '0')}`, 'small-label'), title, element('p', lesson.intro));
        const list = element('ul');
        lesson.points.forEach((point) => list.append(element('li', point)));
        article.append(list);
        if (lesson.code) {
            const pre = element('pre');
            pre.tabIndex = 0;
            pre.setAttribute('aria-label', `Пример: ${lesson.title}`);
            pre.append(element('code', lesson.code));
            article.append(pre);
        }
        $('#theory-content').append(article);
    });

    function filterTheory() {
        const term = $('#theory-search').value.trim().toLocaleLowerCase('ru');
        let visible = 0;
        document.querySelectorAll('[data-theory]').forEach((article) => {
            article.hidden = !article.textContent.toLocaleLowerCase('ru').includes(term);
            if (!article.hidden) visible++;
        });
        $('#theory-count').textContent = `Показано тем: ${visible} из ${data.theory.length}`;
        $('#theory-empty').hidden = visible > 0;
    }
    function openTheory(topic = null) {
        showView('theory');
        if (topic) {
            $('#theory-search').value = '';
            filterTheory();
            $(`#theory-${topic}`).focus();
        } else $('#theory-search').focus();
    }
    $('#theory-search').addEventListener('input', filterTheory);
    $('#open-theory').addEventListener('click', () => openTheory(pool[cursor].topic));
    document.querySelectorAll('[data-open-theory]').forEach((button) => button.addEventListener('click', () => openTheory()));
    filterTheory();
    startSession(null, false);
})();
