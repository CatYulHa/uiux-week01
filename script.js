// 6주차: 실습 예제 탭
const demoTabList = document.querySelector('.demo-tabs');
const demoTabs = document.querySelectorAll('.demo-tab');
const demoPanels = document.querySelectorAll('.demo-panel');

// 모든 탭 선택 해제, 모든 패널 숨김
function resetTabsAndPanels() {
  demoTabs.forEach(function (tab) {
    tab.classList.remove('is-active');
    tab.setAttribute('aria-selected', 'false');
    tab.tabIndex = -1;
  });
  demoPanels.forEach(function (panel) {
    panel.classList.remove('is-active');
    panel.hidden = true;
  });
}

// 선택한 탭과 data-target 패널만 표시
function activateTab(selectedTab) {
  const targetPanel = document.querySelector(selectedTab.dataset.target);
  selectedTab.classList.add('is-active');
  selectedTab.setAttribute('aria-selected', 'true');
  selectedTab.tabIndex = 0;
  targetPanel.classList.add('is-active');
  targetPanel.hidden = false;
}

function selectDemoTab(tab) {
  resetTabsAndPanels();
  activateTab(tab);
}

function handleTabClick(event) {
  selectDemoTab(event.currentTarget);
}

// 방향키, Home, End로 탭 이동
function handleTabKeydown(event) {
  const tabList = [...demoTabs];
  const index = tabList.indexOf(event.currentTarget);
  let nextIndex = -1;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabList.length;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabList.length) % tabList.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = tabList.length - 1;
  if (nextIndex === -1) return;
  event.preventDefault();
  selectDemoTab(tabList[nextIndex]);
  tabList[nextIndex].focus();
}

demoTabs.forEach(function (tab) {
  tab.addEventListener('click', handleTabClick);
  tab.addEventListener('keydown', handleTabKeydown);
});

// 탭 목록 표시, 첫 번째 예제 선택
demoTabList.hidden = false;
selectDemoTab(demoTabs[0]);

// #concept 같은 링크로 오면 해당 탭 열기
function openExample(hash) {
  const panel = document.getElementById(hash.slice(1));
  if (!panel || !panel.classList.contains('demo-panel')) return null;
  const tab = document.querySelector(`.demo-tab[data-target="#${panel.id}"]`);
  selectDemoTab(tab);
  return tab;
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const tab = openExample(link.hash);
  // 주소 이동 후 탭으로 초점 이동
  if (tab) setTimeout(() => tab.focus({ preventScroll: true }));
});

function revealFragment() {
  const tab = openExample(location.hash);
  if (tab) requestAnimationFrame(() => document.getElementById(location.hash.slice(1)).scrollIntoView());
}
window.addEventListener('hashchange', revealFragment);
revealFragment();

// 5주차: 학습 목표 폼. 목표는 저장하지 않고 화면에만 표시
const goalForm = document.querySelector('#goal-form');
const goalInput = document.querySelector('#learning-goal');
const goalCount = document.querySelector('#goal-count');
const goalSubmit = document.querySelector('#goal-submit');
const goalFeedback = document.querySelector('#goal-feedback');
const goalNext = document.querySelector('#goal-next');
const goalSubmitLabel = goalSubmit.querySelector('.button-label');
const goalSubmitIcon = goalSubmit.querySelector('.button-icon');

// Number: 최소 글자 수
const minGoalLength = 5;
// String: 정한 목표. 비어 있으면 아직 정하기 전
let savedGoal = '';

goalSubmit.disabled = false;

// 오류 문구 반환. 문제가 없으면 빈 문자열
function getGoalError(goal) {
  if (goal === '') {
    return '학습 목표를 입력해 주세요.';
  } else if (goal.length < minGoalLength) {
    return `목표를 ${minGoalLength}자 이상 적어 주세요.`;
  }
  return '';
}

// 안내 문구와 색 변경
function showGoalMessage(message, result) {
  goalFeedback.textContent = message;
  goalFeedback.classList.toggle('is-success', result === 'success');
  goalFeedback.classList.toggle('is-error', result === 'error');
  goalInput.setAttribute('aria-invalid', String(result === 'error'));
}

// 6주차: 글자 수 표시. 5자 이상이면 초록색
function updateGoalCount() {
  goalCount.textContent = `${goalInput.value.length} / ${goalInput.maxLength}자`;
  goalCount.classList.toggle('is-ready', goalInput.value.trim().length >= minGoalLength);
}

// 버튼 문구와 상태 변경
function updateGoalButton(isDone) {
  goalSubmit.disabled = isDone;
  goalSubmit.classList.toggle('is-success', isDone);
  if (isDone) {
    goalSubmitLabel.textContent = '목표 설정 완료';
    goalSubmitIcon.textContent = '✓';
  } else if (savedGoal === '') {
    goalSubmitLabel.textContent = '학습 목표 정하기';
    goalSubmitIcon.textContent = '↗';
  } else {
    goalSubmitLabel.textContent = '목표 바꾸기';
    goalSubmitIcon.textContent = '↗';
  }
}

// 폼 제출 처리
function handleGoalSubmit(event) {
  event.preventDefault();
  const goal = goalInput.value.trim();
  const error = getGoalError(goal);

  if (error !== '') {
    showGoalMessage(error, 'error');
    goalInput.focus();
    return;
  }

  // Boolean: 처음 정하는 목표인지, 버튼으로 제출했는지
  const isFirstGoal = savedGoal === '';
  const submittedByButton = document.activeElement === goalSubmit;
  savedGoal = goal;
  goalInput.value = goal;
  updateGoalCount();

  if (isFirstGoal) {
    showGoalMessage(`목표를 정했습니다: ${goal}`, 'success');
  } else {
    showGoalMessage(`목표를 바꿨습니다: ${goal}`, 'success');
  }
  updateGoalButton(true);
  goalNext.hidden = false;
  if (submittedByButton) goalNext.focus();
}

// 입력할 때마다 글자 수와 버튼 상태 변경
function handleGoalInput() {
  const goal = goalInput.value.trim();
  updateGoalCount();

  if (savedGoal === '') {
    showGoalMessage('', 'none');
  } else if (goal === savedGoal) {
    showGoalMessage(`현재 목표: ${savedGoal}`, 'success');
    updateGoalButton(true);
  } else {
    showGoalMessage("'목표 바꾸기'를 눌러 적용해 주세요.", 'none');
    updateGoalButton(false);
  }
  // 7주차: 고친 목표를 적용하기 전에는 다음 버튼 숨김
  if (savedGoal !== '') goalNext.hidden = goal !== savedGoal;
}

goalForm.addEventListener('submit', handleGoalSubmit);
goalInput.addEventListener('input', handleGoalInput);
updateGoalCount();

// 6주차: 실습 순서 체크(change), 학습 마치기(click)
const stepChecks = document.querySelectorAll('.step-check input');
const stepsProgress = document.querySelector('#steps-progress');
const stepsBar = document.querySelector('#steps-bar');
const stepsStatus = document.querySelector('#steps-status');
const finishButton = document.querySelector('#finish-button');
const finishLabel = finishButton.querySelector('.button-label');
const finishIcon = finishButton.querySelector('.button-icon');

// Boolean: 학습 마치기를 눌렀는지
let isFinished = false;

// 체크한 단계 수에 맞춰 문구, 막대, 버튼 변경
function updateSteps() {
  let doneCount = 0;
  stepChecks.forEach(function (check) {
    check.closest('li').classList.toggle('is-done', check.checked);
    if (check.checked) doneCount += 1;
  });
  const total = stepChecks.length;
  const allDone = doneCount === total;
  // 체크를 해제하면 마치기 전으로 복귀
  if (!allDone) isFinished = false;

  stepsBar.style.width = `${(doneCount / total) * 100}%`;
  stepsProgress.classList.toggle('is-ready', allDone && !isFinished);
  stepsProgress.classList.toggle('is-complete', isFinished);
  finishButton.disabled = !allDone || isFinished;
  finishButton.classList.toggle('is-success', isFinished);

  if (isFinished) {
    stepsStatus.textContent = savedGoal === '' ? '오늘 학습을 마쳤습니다.' : `오늘 학습을 마쳤습니다. 목표: ${savedGoal}`;
    finishLabel.textContent = '학습 완료';
    finishIcon.textContent = '✓';
  } else if (allDone) {
    stepsStatus.textContent = `${doneCount} / ${total}단계 완료 · 학습을 마칠 수 있습니다.`;
    finishLabel.textContent = '오늘 학습 마치기';
    finishIcon.textContent = '↗';
  } else {
    stepsStatus.textContent = `${doneCount} / ${total}단계 완료`;
    finishLabel.textContent = '오늘 학습 마치기';
    finishIcon.textContent = '↗';
  }
}

function handleFinishClick() {
  isFinished = true;
  updateSteps();
}

stepChecks.forEach(function (check) {
  check.addEventListener('change', updateSteps);
});
finishButton.addEventListener('click', handleFinishClick);

stepsProgress.hidden = false;
updateSteps();

// 7주차: 학습 계획 흐름 (시작 → 목표 입력 → 예제·시간 선택 → 확인 → 완료)
const planFlow = document.querySelector('#plan-flow');
const planHead = document.querySelector('#plan-head');
const planSteps = document.querySelectorAll('.plan-step');
const planProgress = document.querySelector('#plan-progress');
const planTrackItems = document.querySelectorAll('.plan-track li');
const planStartLinks = document.querySelectorAll('[data-plan-start]');
const planExampleField = document.querySelector('#plan-example-field');
const planExamples = document.querySelectorAll('input[name="plan-example"]');
const planExampleError = document.querySelector('#plan-example-error');
const planTime = document.querySelector('#plan-time');
const planSummaryItems = document.querySelectorAll('[data-summary]');
const planGo = document.querySelector('#plan-go');
const planGoLabel = planGo.querySelector('.button-label');

// Array: 단계 이름
const planStepNames = ['목표 입력', '예제·시간 선택', '계획 확인'];
// Number: 완료 화면 번호
const planDoneStep = planStepNames.length + 1;
// String: 기본 학습 시간
const defaultPlanTime = '20';
// Number: 현재 단계. 0은 시작 전
let currentPlanStep = 0;

// 현재 단계만 표시하고 진행 표시 변경
function showPlanStep(step) {
  planSteps.forEach(function (item) {
    item.hidden = Number(item.dataset.step) !== step;
  });
  planTrackItems.forEach(function (item, index) {
    item.classList.toggle('is-done', index + 1 < step);
    item.classList.toggle('is-current', index + 1 === step);
  });
  currentPlanStep = step;
  planHead.hidden = step === 0;
  planFlow.classList.toggle('is-complete', step === planDoneStep);

  if (step === planDoneStep) {
    planProgress.textContent = `${planStepNames.length}단계 모두 완료`;
  } else if (step > 0) {
    planProgress.textContent = `${step} / ${planStepNames.length} · ${planStepNames[step - 1]}`;
  }
}

// 단계를 바꾸고 초점 이동 (1단계는 입력창, 나머지는 제목)
function goToPlanStep(step) {
  showPlanStep(step);
  if (step === 1) {
    goalInput.focus();
  } else {
    planFlow.querySelector(`.plan-step[data-step="${step}"] .plan-title`).focus();
  }
}

// 고른 예제에 선택 표시
function updatePlanOptions() {
  planExamples.forEach(function (radio) {
    radio.closest('.plan-option').classList.toggle('is-selected', radio.checked);
  });
}

// 예제 선택 오류 표시. 빈 문자열이면 지움
function showExampleError(message) {
  planExampleError.textContent = message;
  planExampleField.classList.toggle('has-error', message !== '');
}

// 확인·완료 화면에 목표, 예제, 시간 표시
function fillPlanSummary(example) {
  const values = {
    goal: savedGoal,
    example: example.nextElementSibling.textContent,
    time: planTime.options[planTime.selectedIndex].textContent
  };
  planSummaryItems.forEach(function (item) {
    item.textContent = values[item.dataset.summary];
  });
  planGo.href = `#${example.value}`;
  planGoLabel.textContent = `${values.example} 시작하기`;
}

function handlePlanStart() {
  goToPlanStep(1);
}

// 첫 화면 버튼으로 들어오면 바로 1단계 표시
function handlePlanLinkClick() {
  if (currentPlanStep !== 0) return;
  showPlanStep(1);
  // 주소 이동 후 입력창으로 초점 이동
  setTimeout(() => goalInput.focus({ preventScroll: true }));
}

function handleExampleChange() {
  showExampleError('');
  updatePlanOptions();
}

// 예제를 고르지 않으면 현재 단계 유지
function handlePlanCheck() {
  const example = document.querySelector('input[name="plan-example"]:checked');
  if (example === null) {
    showExampleError('예제를 하나 골라 주세요.');
    planExamples[0].focus();
    return;
  }
  showExampleError('');
  fillPlanSummary(example);
  goToPlanStep(3);
}

// 다시 세우기: 입력, 선택, 오류, 진행 상태 초기화
function resetPlan() {
  savedGoal = '';
  goalInput.value = '';
  showGoalMessage('', 'none');
  updateGoalCount();
  updateGoalButton(false);
  goalNext.hidden = true;
  planExamples.forEach(function (radio) {
    radio.checked = false;
  });
  planTime.value = defaultPlanTime;
  showExampleError('');
  updatePlanOptions();
  goToPlanStep(1);
}

document.querySelector('#plan-start').addEventListener('click', handlePlanStart);
planStartLinks.forEach(function (link) {
  link.addEventListener('click', handlePlanLinkClick);
});
goalNext.addEventListener('click', function () {
  goToPlanStep(2);
});
planExamples.forEach(function (radio) {
  radio.addEventListener('change', handleExampleChange);
});
document.querySelector('#plan-back-2').addEventListener('click', function () {
  goToPlanStep(1);
});
document.querySelector('#plan-next-2').addEventListener('click', handlePlanCheck);
document.querySelector('#plan-back-3').addEventListener('click', function () {
  goToPlanStep(2);
});
document.querySelector('#plan-confirm').addEventListener('click', function () {
  goToPlanStep(planDoneStep);
});
document.querySelector('#plan-restart').addEventListener('click', resetPlan);

updatePlanOptions();
showPlanStep(0);

// 중간고사: 이해도 확인 퀴즈 (계획 완료 → 퀴즈 → 채점 → 틀린 문제 다시 풀기 → 통과)
const quiz = document.querySelector('#quiz');
const quizForm = document.querySelector('#quiz-form');
const quizTitle = document.querySelector('#quiz-title');
const quizGoal = document.querySelector('#quiz-goal');
const quizStatus = document.querySelector('#quiz-status');
const quizSets = document.querySelectorAll('.quiz-set');
const quizItemsAll = document.querySelectorAll('.quiz-item');
const quizError = document.querySelector('#quiz-error');
const quizResult = document.querySelector('#quiz-result');
const quizBadge = document.querySelector('#quiz-badge');
const quizScore = document.querySelector('#quiz-score');
const quizActions = document.querySelector('#quiz-actions');
const quizSubmit = document.querySelector('#quiz-submit');
const quizRetry = document.querySelector('#quiz-retry');
const quizGo = document.querySelector('#quiz-go');
const quizGoLabel = quizGo.querySelector('.button-label');
const quizCancel = document.querySelector('#quiz-cancel');
const quizConfirm = document.querySelector('#quiz-confirm');
const planDone = document.querySelector(`.plan-step[data-step="${planDoneStep}"]`);
const planQuiz = document.querySelector('#plan-quiz');
const planQuizLabel = planQuiz.querySelector('.button-label');
const planQuizStatus = document.querySelector('#plan-quiz-status');

// Object: 예제별 정답 번호
const quizAnswers = {
  concept: ['2', '1', '3'],
  structure: ['2', '3', '1'],
  practice: ['3', '1', '2']
};
// String: solving 푸는 중, retry 틀린 문제 있음, passed 통과
let quizState = 'solving';
// Number: 채점 횟수, 맞힌 문제 수
let quizAttempts = 0;
let quizCorrect = 0;
// Element: 지금 푸는 예제의 문제 묶음
let currentQuizSet = null;

function getQuizItems() {
  return [...currentQuizSet.querySelectorAll('.quiz-item')];
}

function getQuizChoice(item) {
  return item.querySelector('input:checked');
}

// 답한 문제 수와 선택 표시 변경
function updateQuizStatus() {
  const items = getQuizItems();
  const answered = items.filter(item => getQuizChoice(item) !== null).length;
  quizStatus.textContent = `${answered} / ${items.length}문제 답함`;
  currentQuizSet.querySelectorAll('.plan-option').forEach(function (option) {
    option.classList.toggle('is-selected', option.querySelector('input').checked);
  });
  return answered;
}

// 답하지 않은 문제 번호로 오류 문구 만들기. 없으면 지움
function showQuizError(items) {
  const allItems = getQuizItems();
  allItems.forEach(function (item) {
    item.classList.toggle('has-error', items.includes(item));
  });
  if (items.length === 0) {
    quizError.textContent = '';
    return;
  }
  const numbers = items.map(item => `${allItems.indexOf(item) + 1}번`).join(', ');
  quizError.textContent = `${numbers} 문제의 답을 골라 주세요.`;
}

// 상태에 맞는 버튼만 표시
function updateQuizButtons() {
  quiz.dataset.state = quizState;
  quizSubmit.hidden = quizState !== 'solving';
  quizRetry.hidden = quizState !== 'retry';
  quizGo.hidden = quizState !== 'passed';
  quizCancel.hidden = quizState === 'passed';
}

// 문제 잠금. 채점한 문제는 답을 바꿀 수 없음
function lockQuizItem(item, isLocked) {
  item.classList.toggle('is-locked', isLocked);
  item.querySelectorAll('input').forEach(function (input) {
    input.disabled = isLocked;
  });
}

// 문제마다 정답·오답 표시, 점수 계산
function gradeQuiz() {
  const answers = quizAnswers[currentQuizSet.dataset.quiz];
  const items = getQuizItems();
  quizAttempts += 1;
  quizCorrect = 0;

  items.forEach(function (item, index) {
    const isCorrect = getQuizChoice(item).value === answers[index];
    const feedback = item.querySelector('.quiz-feedback');
    if (isCorrect) quizCorrect += 1;
    item.classList.remove('is-retry');
    item.classList.toggle('is-correct', isCorrect);
    item.classList.toggle('is-wrong', !isCorrect);
    feedback.textContent = isCorrect ? '정답입니다.' : `오답입니다. 힌트: ${item.dataset.hint}`;
    feedback.hidden = false;
    lockQuizItem(item, true);
  });

  quizState = quizCorrect === items.length ? 'passed' : 'retry';
  quizResult.hidden = false;
  if (quizState === 'passed') {
    quizBadge.textContent = '✓ 퀴즈 통과';
    quizScore.textContent = `${items.length}문제를 모두 맞혔습니다. 채점 ${quizAttempts}번`;
  } else {
    quizBadge.textContent = `${items.length}문제 중 ${quizCorrect}개 정답`;
    quizScore.textContent = '틀린 문제의 힌트를 보고 다시 풀어 보세요.';
  }
  quizStatus.textContent = `${quizCorrect} / ${items.length}문제 정답`;
  updateQuizButtons();
  quizResult.focus();
}

// 채점하기: 답하지 않은 문제가 있으면 채점하지 않음
function handleQuizSubmit(event) {
  event.preventDefault();
  if (quizState !== 'solving') return;
  const empty = getQuizItems().filter(item => getQuizChoice(item) === null);
  if (empty.length > 0) {
    showQuizError(empty);
    empty[0].querySelector('input').focus();
    return;
  }
  showQuizError([]);
  gradeQuiz();
}

// 답을 고르면 그 문제의 오류 표시 지움
function handleQuizChange(event) {
  const item = event.target.closest('.quiz-item');
  updateQuizStatus();
  if (item.classList.contains('has-error')) {
    showQuizError(getQuizItems().filter(other => other !== item && other.classList.contains('has-error')));
  }
}

// 틀린 문제만 답을 지우고 다시 풀기. 맞힌 문제는 유지
function handleQuizRetry() {
  const wrongItems = getQuizItems().filter(item => item.classList.contains('is-wrong'));
  wrongItems.forEach(function (item) {
    item.querySelectorAll('input').forEach(function (input) {
      input.checked = false;
    });
    item.classList.remove('is-wrong');
    item.classList.add('is-retry');
    item.querySelector('.quiz-feedback').textContent = `힌트: ${item.dataset.hint}`;
    lockQuizItem(item, false);
  });
  quizState = 'solving';
  quizResult.hidden = true;
  updateQuizButtons();
  updateQuizStatus();
  wrongItems[0].querySelector('input').focus();
}

// 퀴즈 초기화: 답, 채점 결과, 오류, 횟수
function resetQuiz() {
  quizItemsAll.forEach(function (item) {
    item.querySelectorAll('input').forEach(function (input) {
      input.checked = false;
    });
    item.classList.remove('is-correct', 'is-wrong', 'is-retry', 'has-error');
    item.querySelector('.quiz-feedback').hidden = true;
    lockQuizItem(item, false);
  });
  document.querySelectorAll('.quiz-set .plan-option').forEach(function (option) {
    option.classList.remove('is-selected');
  });
  quizState = 'solving';
  quizAttempts = 0;
  quizCorrect = 0;
  quizError.textContent = '';
  quizResult.hidden = true;
  quizConfirm.hidden = true;
  quizActions.hidden = false;
  updateQuizButtons();
  if (currentQuizSet !== null) updateQuizStatus();
}

// 완료 화면의 퀴즈 버튼 문구와 진행 상황
function updatePlanQuiz(message) {
  const items = currentQuizSet === null ? [] : getQuizItems();
  const answered = items.filter(item => getQuizChoice(item) !== null).length;
  planQuizStatus.classList.toggle('is-success', quizState === 'passed');
  if (quizState === 'passed') {
    planQuizLabel.textContent = '퀴즈 결과 보기';
    planQuizStatus.textContent = `퀴즈 통과 · 채점 ${quizAttempts}번`;
  } else if (quizState === 'retry') {
    planQuizLabel.textContent = '퀴즈 이어서 풀기';
    planQuizStatus.textContent = `퀴즈 ${quizCorrect} / ${items.length}문제 정답 · 틀린 문제가 남았습니다.`;
  } else if (answered > 0) {
    planQuizLabel.textContent = '퀴즈 이어서 풀기';
    planQuizStatus.textContent = `퀴즈 ${answered} / ${items.length}문제 답함`;
  } else {
    planQuizLabel.textContent = '이해도 퀴즈 풀기';
    planQuizStatus.textContent = message || '';
  }
}

// 퀴즈 열기: 계획에서 고른 예제의 문제와 목표 표시
function openQuiz() {
  const example = document.querySelector('input[name="plan-example"]:checked');
  const exampleName = example.nextElementSibling.textContent;
  currentQuizSet = document.querySelector(`.quiz-set[data-quiz="${example.value}"]`);
  quizSets.forEach(function (set) {
    set.hidden = set !== currentQuizSet;
  });
  quizTitle.textContent = `퀴즈 · ${exampleName}`;
  quizGoal.textContent = `목표: ${savedGoal}`;
  quizGo.href = `#${example.value}`;
  quizGoLabel.textContent = `${exampleName} 다시 보기`;
  if (quizState === 'solving') updateQuizStatus();

  planHead.hidden = true;
  planDone.hidden = true;
  quiz.hidden = false;
  quizTitle.focus();
}

// 계획 보기·그만두기: 완료 화면으로 돌아가기
function closeQuiz(message) {
  quiz.hidden = true;
  planHead.hidden = false;
  planDone.hidden = false;
  updatePlanQuiz(message);
  planQuiz.focus();
}

// 그만두기: 고른 답이 있으면 먼저 확인
function handleQuizCancel() {
  const answered = getQuizItems().some(item => getQuizChoice(item) !== null);
  if (!answered && quizAttempts === 0) {
    closeQuiz('퀴즈를 그만뒀습니다. 언제든 다시 풀 수 있습니다.');
    return;
  }
  quizActions.hidden = true;
  quizCancel.hidden = true;
  quizConfirm.hidden = false;
  document.querySelector('#quiz-keep').focus();
}

function handleQuizKeep() {
  quizConfirm.hidden = true;
  quizActions.hidden = false;
  updateQuizButtons();
  quizCancel.focus();
}

function handleQuizStop() {
  resetQuiz();
  closeQuiz('퀴즈를 그만뒀습니다. 답을 지웠습니다.');
}

planQuiz.addEventListener('click', openQuiz);
quizForm.addEventListener('submit', handleQuizSubmit);
quizForm.addEventListener('change', handleQuizChange);
quizRetry.addEventListener('click', handleQuizRetry);
document.querySelector('#quiz-back').addEventListener('click', function () {
  closeQuiz();
});
quizCancel.addEventListener('click', handleQuizCancel);
document.querySelector('#quiz-keep').addEventListener('click', handleQuizKeep);
document.querySelector('#quiz-stop').addEventListener('click', handleQuizStop);
// 다시 세우기: 퀴즈도 처음 상태로
document.querySelector('#plan-restart').addEventListener('click', function () {
  resetQuiz();
  quiz.hidden = true;
  currentQuizSet = null;
  updatePlanQuiz();
});
