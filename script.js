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

// 12주차: 방향키로 옮길 다음 위치. 예제 탭, 코드 탭(learning.js), 아코디언이 함께 씀
// 위·아래(가로 배치면 왼쪽·오른쪽도), Home, End. 해당 키가 아니면 -1
function getArrowIndex(key, index, length, isHorizontal) {
  if (key === 'ArrowDown' || (isHorizontal && key === 'ArrowRight')) return (index + 1) % length;
  if (key === 'ArrowUp' || (isHorizontal && key === 'ArrowLeft')) return (index - 1 + length) % length;
  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;
  return -1;
}

// 방향키, Home, End로 탭 이동
function handleTabKeydown(event) {
  const tabList = [...demoTabs];
  const nextIndex = getArrowIndex(event.key, tabList.indexOf(event.currentTarget), tabList.length, true);
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
// 13주차: 작성 중인 계획의 임시 보관함과 안내 (함수는 아래 13주차 부분)
const planDraft = createDraftStore('hy-uiux-plan-draft-v1', draft => typeof draft.goal === 'string' && Number.isInteger(draft.step));
const planDraftNotice = getDraftNotice('plan-draft-notice');

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
  // 13주차: 임시 보관한 계획도 지움
  planDraft.clear();
  showDraftNotice(planDraftNotice, '처음부터 다시 세울 수 있습니다.', 'cleared');
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
// 다시 세우기: 퀴즈도 처음 상태로 (13주차: '처음부터 다시 세우기' 버튼도 함께 씀)
function resetPlanQuiz() {
  resetQuiz();
  quiz.hidden = true;
  currentQuizSet = null;
  updatePlanQuiz();
}
document.querySelector('#plan-restart').addEventListener('click', resetPlanQuiz);

// 9주차: 학습 기록 폼 (입력 조건 안내 → 검사 → 저장 중 → 완료·실패)
const recordForm = document.querySelector('#record-form');
const recordExample = document.querySelector('#record-example');
const recordLearned = document.querySelector('#record-learned');
const recordHasQuestion = document.querySelector('#record-has-question');
const recordQuestionField = document.querySelector('#record-question-field');
const recordQuestion = document.querySelector('#record-question');
const recordStatus = document.querySelector('#record-status');
const recordSubmit = document.querySelector('#record-submit');
const recordSubmitLabel = recordSubmit.querySelector('.button-label');
const recordReset = document.querySelector('#record-reset');
const recordList = document.querySelector('#record-list');
const recordEmpty = document.querySelector('#record-empty');
// 12주차: 카드 안내(화면 읽기용), 기록 상세 창(모달)
const recordLive = document.querySelector('#record-live');
const recordDialog = document.querySelector('#record-dialog');
const recordDialogTitle = document.querySelector('#record-dialog-title');
const recordDialogTime = document.querySelector('#record-dialog-time');
const recordDialogBadge = document.querySelector('#record-dialog-badge');
const recordDialogLearned = document.querySelector('#record-dialog-learned');
const recordDialogQuestionRow = document.querySelector('#record-dialog-question-row');
const recordDialogQuestion = document.querySelector('#record-dialog-question');
const recordDialogActions = document.querySelector('#record-dialog-actions');
const recordDeleteButton = document.querySelector('#record-delete');
const recordDeleteConfirm = document.querySelector('#record-delete-confirm');
const recordDeleteMessage = document.querySelector('#record-delete-message');
const recordDeleteCancel = document.querySelector('#record-delete-cancel');
const recordDeleteYes = document.querySelector('#record-delete-yes');
// 13주차: 작성 중인 기록의 임시 보관함과 안내 (함수는 아래 13주차 부분)
const recordDraft = createDraftStore('hy-uiux-record-draft-v1', draft => typeof draft.learned === 'string');
const recordDraftNotice = getDraftNotice('record-draft-notice');
// 10주차: 기록 필터, 결과 수, 빈 결과 안내
const recordFilter = document.querySelector('#record-filter');
const recordFilterButtons = document.querySelectorAll('.filter-button');
const recordResult = document.querySelector('#record-result');
const recordEmptyTitle = document.querySelector('#record-empty-title');
const recordEmptyHelp = document.querySelector('#record-empty-help');
const recordEmptyWrite = document.querySelector('#record-empty-write');
const recordEmptyAll = document.querySelector('#record-empty-all');

// String: 브라우저 저장 키
const recordStorageKey = 'hy-uiux-records';
// Number: 저장에 걸리는 시간(ms), 목록에 보여 줄 개수
const recordSaveDelay = 800;
const recordShowCount = 5;
// Object: 글자 수 조건이 있는 입력칸
const recordTextRules = {
  learned: { input: recordLearned, name: '오늘 배운 점', min: 10 },
  question: { input: recordQuestion, name: '헷갈린 부분', min: 5 }
};
// Object: 안내 문구에 쓰는 항목 이름
const recordFieldNames = {
  'record-example': '실습한 예제',
  'record-learned': '오늘 배운 점',
  'record-question': '헷갈린 부분'
};
// Boolean: 저장 중인지
let isRecordSaving = false;
// String: 고른 필터. all은 전체, 나머지는 예제 값(concept, structure, practice)
let currentRecordFilter = 'all';
// Object: 12주차. 복습 상태별 라벨과 버튼 문구 (헷갈린 부분이 없는 기록은 상태 없음)
const reviewStates = {
  todo: { label: '복습 필요', action: '복습 완료로 표시' },
  done: { label: '복습 완료', action: '다시 복습하기' }
};
// String: 12주차. 상세 창에 열려 있는 기록의 id
let openRecordId = '';
// String: 결과 문구 종류 (none, invalid 입력 확인, loading, success, error)
let recordStatusType = 'none';

function getRecordField(input) {
  return input.closest('.record-field');
}

// 오류 표시: 문구, aria-invalid, 테두리 색
function showFieldError(input, message) {
  const field = getRecordField(input);
  field.querySelector('.field-error').textContent = message;
  field.classList.add('is-invalid');
  field.classList.remove('is-valid');
  input.setAttribute('aria-invalid', 'true');
  return false;
}

function clearFieldError(input) {
  const field = getRecordField(input);
  field.querySelector('.field-error').textContent = '';
  field.classList.remove('is-invalid');
  input.setAttribute('aria-invalid', 'false');
}

// 예제 선택 검사
function validateRecordExample() {
  if (recordExample.value === '') return showFieldError(recordExample, '실습한 예제를 골라 주세요.');
  clearFieldError(recordExample);
  getRecordField(recordExample).classList.add('is-valid');
  return true;
}

// 선택을 바꾸면 성공 표시. 오류가 없던 칸은 빈 값으로 돌려도 오류를 띄우지 않음
function handleRecordExampleChange() {
  const field = getRecordField(recordExample);
  if (recordExample.value !== '' || field.classList.contains('is-invalid')) {
    validateRecordExample();
  } else {
    field.classList.remove('is-valid');
  }
  if (recordStatusType === 'invalid') updateRecordSummary();
}

// 글자 수 검사. 빈 값과 짧은 값은 다른 문구
function validateRecordText(rule) {
  const value = rule.input.value.trim();
  if (value === '') return showFieldError(rule.input, `${rule.name}을 입력해 주세요.`);
  if (value.length < rule.min) return showFieldError(rule.input, `${rule.name}을 ${rule.min}자 이상 적어 주세요.`);
  clearFieldError(rule.input);
  getRecordField(rule.input).classList.add('is-valid');
  return true;
}

// 입력 중: 글자 수와 조건 충족 여부. 오류가 있던 칸만 다시 검사
function updateRecordText(rule) {
  const field = getRecordField(rule.input);
  const help = field.querySelector('.field-help');
  const length = rule.input.value.trim().length;
  field.querySelector('.field-count').textContent = `${rule.input.value.length} / ${rule.input.maxLength}자`;
  if (length === 0) {
    help.textContent = help.dataset.default;
  } else if (length < rule.min) {
    help.textContent = `${rule.min}자 이상 적어 주세요. ${rule.min - length}자 더 필요합니다.`;
  } else {
    help.textContent = '입력 조건을 충족했습니다.';
  }
  field.classList.toggle('is-valid', length >= rule.min);
  if (field.classList.contains('is-invalid')) validateRecordText(rule);
  if (recordStatusType === 'invalid') updateRecordSummary();
}

// 체크했을 때만 헷갈린 부분 칸 표시. 숨기면 disabled로 제출에서 제외
function updateQuestionField() {
  const isOn = recordHasQuestion.checked;
  recordHasQuestion.setAttribute('aria-expanded', String(isOn));
  recordQuestionField.hidden = !isOn;
  recordQuestion.disabled = !isOn;
  if (!isOn) clearFieldError(recordQuestion);
  if (recordStatusType === 'invalid') updateRecordSummary();
}

// 결과 문구와 색
function showRecordStatus(message, result) {
  recordStatusType = result;
  recordStatus.textContent = message;
  recordStatus.classList.toggle('is-loading', result === 'loading');
  recordStatus.classList.toggle('is-success', result === 'success');
  recordStatus.classList.toggle('is-error', result === 'error' || result === 'invalid');
}

// 오류가 남은 항목을 안내. 모두 고치면 문구를 지우고 0을 돌려줌
function updateRecordSummary() {
  const invalid = [recordExample, recordLearned, recordQuestion].filter(function (input) {
    return !input.disabled && getRecordField(input).classList.contains('is-invalid');
  });
  if (invalid.length === 0) {
    showRecordStatus('', 'none');
  } else {
    showRecordStatus(`${invalid.length}개 항목을 확인해 주세요: ${invalid.map(input => recordFieldNames[input.id]).join(', ')}`, 'invalid');
  }
  return invalid;
}

// 버튼 상태: idle 기본, loading 저장 중, retry 실패 후
function setRecordSubmitState(state) {
  isRecordSaving = state === 'loading';
  recordSubmit.disabled = isRecordSaving;
  recordReset.disabled = isRecordSaving;
  // 13주차: 저장하는 동안에는 '처음부터 다시 쓰기'도 잠금
  recordDraftNotice.discard.disabled = isRecordSaving;
  recordForm.setAttribute('aria-busy', String(isRecordSaving));
  if (state === 'loading') {
    recordSubmitLabel.textContent = '저장 중…';
  } else if (state === 'retry') {
    recordSubmitLabel.textContent = '다시 저장하기';
  } else {
    recordSubmitLabel.textContent = '기록 저장하기';
  }
}

// 브라우저 저장소에서 기록 읽기. 쓸 수 없거나 값이 깨졌으면 빈 목록
function loadRecords() {
  try {
    const records = JSON.parse(localStorage.getItem(recordStorageKey));
    return Array.isArray(records) ? records : [];
  } catch (error) {
    return [];
  }
}

// 기록 목록 저장. 저장소를 쓸 수 없으면 false (사이트 데이터 차단, 저장 공간 부족 등)
function saveRecords(records) {
  try {
    localStorage.setItem(recordStorageKey, JSON.stringify(records));
    return true;
  } catch (error) {
    return false;
  }
}

// 새 기록을 맨 앞에 저장
function saveRecord(record) {
  const records = loadRecords();
  records.unshift(record);
  return saveRecords(records);
}

// 12주차: 기록 id는 저장한 시각(ms)
function getRecordId(record) {
  return String(record.savedAt);
}

function findRecord(id) {
  return loadRecords().find(record => getRecordId(record) === id) || null;
}

// 12주차: 기록 한 건 고치기·지우기. 저장하지 못하면 false
function updateRecord(id, changes) {
  return saveRecords(loadRecords().map(record => (getRecordId(record) === id ? { ...record, ...changes } : record)));
}

function deleteRecord(id) {
  return saveRecords(loadRecords().filter(record => getRecordId(record) !== id));
}

function getExampleName(value) {
  const option = [...recordExample.options].find(item => item.value === value && value !== '');
  return option ? option.textContent : '예제';
}

function formatRecordTime(time) {
  const date = new Date(time);
  const pad = number => String(number).padStart(2, '0');
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 10주차: 고른 예제의 기록만 남김. all이면 전체
function getVisibleRecords(records) {
  if (currentRecordFilter === 'all') return records;
  return records.filter(record => record.example === currentRecordFilter);
}

// 10주차: 지금 보이는 기록 수 안내
function updateRecordResult(total, matched, shown) {
  const name = currentRecordFilter === 'all' ? '전체' : getExampleName(currentRecordFilter);
  const count = matched > shown ? `${matched}개 중 최근 ${shown}개 표시` : `${shown}개 표시`;
  recordResult.textContent = currentRecordFilter === 'all' ? `${name} ${count}` : `${name} ${count} · 전체 ${total}개`;
}

// 10주차: 빈 결과 안내. 기록이 하나도 없을 때와 고른 예제의 기록만 없을 때를 나눔
function updateRecordEmpty(total, matched) {
  const isFilteredEmpty = total > 0 && matched === 0;
  recordEmpty.hidden = matched > 0;
  recordEmpty.classList.toggle('is-filtered', isFilteredEmpty);
  if (isFilteredEmpty) {
    recordEmptyTitle.textContent = `${getExampleName(currentRecordFilter)} 기록이 없습니다.`;
    recordEmptyHelp.textContent = '다른 예제를 고르거나 전체 기록을 보세요.';
  } else {
    recordEmptyTitle.textContent = '아직 저장한 기록이 없습니다.';
    recordEmptyHelp.textContent = '실습한 예제와 배운 점을 적어 첫 기록을 남겨 보세요.';
  }
  recordEmptyWrite.hidden = isFilteredEmpty;
  recordEmptyAll.hidden = !isFilteredEmpty;
}

// 12주차: 태그, 클래스, 글로 요소 만들기. textContent라 입력한 글이 HTML로 해석되지 않음
function createText(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

// 12주차: 카드 버튼 만들기. 모양은 .button + 변형 클래스, 할 일은 data-action, 대상 기록은 data-id
// 카드마다 같은 글자의 버튼이 생기므로 읽는 이름(aria-label)에 어느 기록인지 덧붙임
function createActionButton(text, variant, action, id, label) {
  const button = createText('button', `button ${variant}`, text);
  button.type = 'button';
  button.dataset.action = action;
  button.dataset.id = id;
  button.setAttribute('aria-label', label);
  return button;
}

// 12주차: 복습 상태. 헷갈린 부분이 있으면 todo(복습 필요) 또는 done(복습 완료), 없으면 none
function getReviewState(record) {
  if (!record.question) return 'none';
  return record.reviewed ? 'done' : 'todo';
}

// 12주차: 상태 라벨. 카드와 상세 창이 함께 씀
function createBadge(state) {
  return createText('span', `badge badge-${state}`, reviewStates[state].label);
}

// 12주차: 기록 한 건 → 카드 한 장. 상태에 따라 클래스, 라벨, 버튼 문구가 달라짐
function createRecordCard(record, isNew) {
  const id = getRecordId(record);
  const state = getReviewState(record);
  const name = getExampleName(record.example);
  const timeText = formatRecordTime(record.savedAt);
  const card = document.createElement('li');
  card.className = `record-item is-${state}`;
  card.classList.toggle('is-new', isNew);

  const head = createText('p', 'record-item-head', '');
  const time = createText('time', '', timeText);
  time.dateTime = new Date(record.savedAt).toISOString();
  head.append(createText('strong', '', name), time);
  card.append(head);
  if (state !== 'none') card.append(createBadge(state));
  card.append(createText('p', 'record-item-learned', record.learned));

  const actions = createText('div', 'record-item-actions', '');
  actions.append(createActionButton('자세히 보기', 'button-secondary', 'open', id, `${name} ${timeText} 기록 자세히 보기`));
  if (state !== 'none') {
    const actionText = reviewStates[state].action;
    actions.append(createActionButton(actionText, 'button-text', 'toggle', id, `${name} ${timeText} 기록 ${actionText}`));
  }
  card.append(actions);
  return card;
}

// 저장한 기록 목록. 고른 예제의 기록을 최근 것부터 카드로 표시
function renderRecords(isNew) {
  const records = loadRecords();
  const matched = getVisibleRecords(records);
  const shown = matched.slice(0, recordShowCount);
  recordList.replaceChildren();
  shown.forEach(function (record, index) {
    recordList.append(createRecordCard(record, isNew && index === 0));
  });
  updateRecordResult(records.length, matched.length, shown.length);
  updateRecordEmpty(records.length, matched.length);
  recordList.hidden = shown.length === 0;
}

// 10주차: 필터 버튼의 선택 표시와 aria-pressed 변경
function selectRecordFilter(filter) {
  currentRecordFilter = filter;
  recordFilterButtons.forEach(function (button) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
  });
}

// 10주차: 필터를 고르면 선택 표시와 목록을 함께 바꿈
function setRecordFilter(filter) {
  selectRecordFilter(filter);
  renderRecords(false);
}

// 입력값, 조건부 칸, 오류, 글자 수 초기화
function clearRecordForm() {
  recordForm.reset();
  updateQuestionField();
  [recordExample, recordLearned, recordQuestion].forEach(function (input) {
    clearFieldError(input);
    getRecordField(input).classList.remove('is-valid');
  });
  updateRecordText(recordTextRules.learned);
  updateRecordText(recordTextRules.question);
}

// 저장 결과 처리. 실패하면 입력값 유지, 다시 저장 가능
function finishRecordSave(data) {
  const record = {
    example: data.get('example'),
    learned: data.get('learned').trim(),
    question: data.has('question') ? data.get('question').trim() : '',
    savedAt: Date.now()
  };
  if (!saveRecord(record)) {
    setRecordSubmitState('retry');
    showRecordStatus('저장하지 못했습니다. 브라우저 저장소를 쓸 수 없습니다. 입력한 내용은 그대로 있으니 다시 저장해 주세요.', 'error');
    recordSubmit.focus();
    return;
  }
  // 13주차: 최종 저장에 성공하면 임시 보관한 작성 내용을 지움 (실패하면 남겨 둠)
  recordDraft.clear();
  showDraftNotice(recordDraftNotice, '', 'none');
  // 10주차: 고른 필터에 새 기록이 안 보이면 전체 보기로 바꿈
  const isHiddenByFilter = currentRecordFilter !== 'all' && currentRecordFilter !== record.example;
  if (isHiddenByFilter) selectRecordFilter('all');
  renderRecords(true);
  clearRecordForm();
  setRecordSubmitState('idle');
  if (isHiddenByFilter) {
    showRecordStatus('학습 기록을 저장했습니다. 새 기록이 보이도록 전체 보기로 바꿨습니다.', 'success');
  } else {
    showRecordStatus('학습 기록을 저장했습니다. 저장한 기록 목록에서 볼 수 있습니다.', 'success');
  }
  recordStatus.focus();
}

// 제출: 모든 칸을 검사하고, 오류가 있으면 저장하지 않고 첫 오류 칸으로 이동
function handleRecordSubmit(event) {
  event.preventDefault();
  if (isRecordSaving) return;
  validateRecordExample();
  validateRecordText(recordTextRules.learned);
  if (!recordQuestion.disabled) validateRecordText(recordTextRules.question);
  const invalid = updateRecordSummary();
  if (invalid.length > 0) {
    invalid[0].focus();
    return;
  }
  // disabled인 칸은 FormData에 들어가지 않음
  const data = new FormData(recordForm);
  setRecordSubmitState('loading');
  showRecordStatus('학습 기록을 저장하고 있습니다.', 'loading');
  setTimeout(function () {
    finishRecordSave(data);
  }, recordSaveDelay);
}

// 다시 작성: 입력값, 안내 문구, 버튼 상태 초기화 (13주차: '처음부터 다시 쓰기'도 같은 함수)
function handleRecordReset() {
  if (isRecordSaving) return;
  recordDraft.clear();
  showDraftNotice(recordDraftNotice, '처음부터 다시 쓸 수 있습니다.', 'cleared');
  clearRecordForm();
  showRecordStatus('', 'none');
  setRecordSubmitState('idle');
  recordExample.focus();
}

// 계획 완료 화면에서 오면 계획의 예제를 미리 선택 (비어 있을 때만)
function handlePlanRecordClick() {
  const example = document.querySelector('input[name="plan-example"]:checked');
  if (example !== null && recordExample.value === '') {
    recordExample.value = example.value;
    validateRecordExample();
  }
  // 주소 이동 후 배운 점 칸으로 초점 이동
  setTimeout(() => recordLearned.focus({ preventScroll: true }));
}

document.querySelectorAll('#record-form .field-help').forEach(function (help) {
  help.dataset.default = help.textContent;
});
recordExample.addEventListener('change', handleRecordExampleChange);
recordLearned.addEventListener('input', function () {
  updateRecordText(recordTextRules.learned);
});
recordQuestion.addEventListener('input', function () {
  updateRecordText(recordTextRules.question);
});
recordHasQuestion.addEventListener('change', updateQuestionField);
recordForm.addEventListener('submit', handleRecordSubmit);
recordReset.addEventListener('click', handleRecordReset);
document.querySelector('#plan-record').addEventListener('click', handlePlanRecordClick);

recordFilterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    setRecordFilter(button.dataset.filter);
  });
});
// 빈 결과의 다음 행동: 전체 기록 보기, 첫 기록 남기기
recordEmptyAll.addEventListener('click', function () {
  setRecordFilter('all');
  document.querySelector('.filter-button[data-filter="all"]').focus();
});
recordEmptyWrite.addEventListener('click', function () {
  recordExample.focus();
});

recordSubmit.disabled = false;
recordFilter.hidden = false;
updateQuestionField();
renderRecords(false);

// 12주차: 공통 대화상자(모달). showModal로 열면 뒤 화면은 조작할 수 없고 Esc로 닫힘
// data-dialog-close 버튼과 바깥 어두운 영역을 눌러도 닫히고, 닫으면 연 버튼으로 초점이 돌아감
const dialogOpeners = new WeakMap();

function openDialog(dialog, opener) {
  dialogOpeners.set(dialog, opener);
  dialog.showModal();
}

// getFallbackFocus: 연 버튼이 사라졌을 때(기록 삭제 등) 초점을 보낼 요소를 돌려주는 함수
function setupDialog(dialog, getFallbackFocus) {
  let pressedOnBackdrop = false;
  dialog.addEventListener('pointerdown', function (event) {
    pressedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener('click', function (event) {
    const isBackdrop = event.target === dialog && pressedOnBackdrop;
    if (isBackdrop || event.target.closest('[data-dialog-close]')) dialog.close();
  });
  dialog.addEventListener('close', function () {
    const opener = dialogOpeners.get(dialog);
    const target = opener && opener.isConnected ? opener : getFallbackFocus();
    if (target) target.focus();
  });
}

// 12주차: 카드 동작 결과를 화면 읽기 프로그램에 알림
function announceRecord(message) {
  recordLive.textContent = message;
}

// 12주차: 삭제 확인 펼치기·접기. 펼치면 지우기 전에 한 번 더 묻고 '삭제 취소'에 초점
function showDeleteConfirm(isOpen) {
  recordDeleteConfirm.hidden = !isOpen;
  recordDialogActions.hidden = isOpen;
  recordDeleteMessage.textContent = '이 기록을 삭제할까요? 삭제하면 되돌릴 수 없습니다.';
}

// 12주차: 기록 상세 창 열기. 고른 기록의 내용을 채우고 삭제 확인은 접은 채로 시작
function openRecordDialog(record, opener) {
  const state = getReviewState(record);
  openRecordId = getRecordId(record);
  recordDialogTitle.textContent = getExampleName(record.example);
  recordDialogTime.textContent = formatRecordTime(record.savedAt);
  recordDialogTime.dateTime = new Date(record.savedAt).toISOString();
  recordDialogBadge.replaceChildren();
  if (state !== 'none') recordDialogBadge.append(createBadge(state));
  recordDialogBadge.hidden = state === 'none';
  recordDialogLearned.textContent = record.learned;
  recordDialogQuestion.textContent = record.question;
  recordDialogQuestionRow.hidden = !record.question;
  showDeleteConfirm(false);
  openDialog(recordDialog, opener);
}

// 12주차: 복습 상태 바꾸기 → 저장 → 목록 다시 그리기 → 같은 카드의 버튼으로 초점 복귀
function toggleRecordReview(record) {
  const id = getRecordId(record);
  const nextState = record.reviewed ? 'todo' : 'done';
  if (!updateRecord(id, { reviewed: !record.reviewed })) {
    announceRecord('상태를 저장하지 못했습니다. 브라우저 저장소를 쓸 수 없습니다.');
    return;
  }
  renderRecords(false);
  announceRecord(`${getExampleName(record.example)} 기록을 ${reviewStates[nextState].label}로 바꿨습니다.`);
  const button = recordList.querySelector(`[data-action="toggle"][data-id="${id}"]`);
  if (button) button.focus();
}

// 12주차: 카드마다 이벤트를 달지 않고 목록 하나에서 처리. data-action으로 할 일, data-id로 기록을 찾음
function handleRecordListClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const record = findRecord(button.dataset.id);
  if (record === null) return;
  if (button.dataset.action === 'open') openRecordDialog(record, button);
  if (button.dataset.action === 'toggle') toggleRecordReview(record);
}

// 12주차: 기록 삭제. 목록을 다시 그린 뒤 창을 닫으면 초점은 고른 필터로 감
function handleRecordDelete() {
  const record = findRecord(openRecordId);
  if (record === null || !deleteRecord(openRecordId)) {
    recordDeleteMessage.textContent = '삭제하지 못했습니다. 브라우저 저장소를 쓸 수 없습니다.';
    return;
  }
  renderRecords(false);
  recordDialog.close();
  announceRecord(`${getExampleName(record.example)} 기록을 삭제했습니다.`);
}

recordList.addEventListener('click', handleRecordListClick);
setupDialog(recordDialog, function () {
  return document.querySelector('.filter-button[aria-pressed="true"]');
});
recordDeleteButton.addEventListener('click', function () {
  showDeleteConfirm(true);
  recordDeleteCancel.focus();
});
recordDeleteCancel.addEventListener('click', function () {
  showDeleteConfirm(false);
  recordDeleteButton.focus();
});
recordDeleteYes.addEventListener('click', handleRecordDelete);

// 12주차: 아코디언. data-accordion이 붙은 곳마다 같은 함수로 연결
// 질문 버튼의 aria-expanded와 답 영역의 hidden을 함께 바꿈
function setAccordionItem(button, isOpen) {
  button.setAttribute('aria-expanded', String(isOpen));
  document.getElementById(button.getAttribute('aria-controls')).hidden = !isOpen;
}

function initAccordion(accordion) {
  const buttons = [...accordion.querySelectorAll('.accordion-button')];
  // JavaScript가 켜지면 모두 접은 채로 시작
  buttons.forEach(function (button) {
    setAccordionItem(button, false);
  });
  accordion.addEventListener('click', function (event) {
    const button = event.target.closest('.accordion-button');
    if (button) setAccordionItem(button, button.getAttribute('aria-expanded') !== 'true');
  });
  // 위·아래 방향키, Home, End로 질문 사이 이동
  accordion.addEventListener('keydown', function (event) {
    const nextIndex = getArrowIndex(event.key, buttons.indexOf(event.target), buttons.length, false);
    if (!event.target.matches('.accordion-button') || nextIndex === -1) return;
    event.preventDefault();
    buttons[nextIndex].focus();
  });
}

document.querySelectorAll('[data-accordion]').forEach(initAccordion);

// 10주차: 상단 메뉴 (현재 위치 표시, 모바일 메뉴 열기·닫기)
const siteHeader = document.querySelector('.site-header');
const mainNav = document.querySelector('#main-nav');
const menuToggle = document.querySelector('#menu-toggle');
const menuToggleLabel = menuToggle.querySelector('.menu-label');
const navLinks = [...mainNav.querySelectorAll('a')];
// Array: 메뉴가 가리키는 영역 (#about, #features, #steps, #start, #record)
const navSections = navLinks.map(link => document.querySelector(link.hash));
// MediaQueryList: 메뉴 버튼을 쓰는 좁은 화면
const narrowScreen = window.matchMedia('(max-width: 768px)');
// Number: 스크롤이 멈춘 뒤 현재 위치를 다시 계산하기까지 기다리는 시간(ms)
const navScrollDelay = 150;
let navScrollTimer = 0;
// String: 11주차. 기본 탭 제목. 현재 메뉴 이름을 앞에 붙임
const baseTitle = document.title;

// 주소의 #id가 들어 있는 메뉴 영역. #concept → features, 메뉴 영역 밖(#top 등)이면 null
function getNavSectionId(hash) {
  let target = null;
  try {
    target = document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch (error) {
    return null;
  }
  if (target === null) return null;
  const section = navSections.find(item => item.contains(target));
  return section ? section.id : null;
}

// 현재 위치 표시: 해당 메뉴에만 aria-current, 다른 메뉴에서는 제거
function setCurrentNav(sectionId) {
  navLinks.forEach(function (link) {
    if (link.hash === `#${sectionId}`) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  // 11주차: 브라우저 탭 제목도 현재 위치에 맞춤 (예: 학습 기록 | UI/UX 프로그래밍 · 11주차 과제)
  const currentLink = navLinks.find(link => link.getAttribute('aria-current') === 'page');
  document.title = currentLink ? `${currentLink.textContent.trim()} | ${baseTitle}` : baseTitle;
}

// 화면에 보이는 영역: 화면 위에서 40% 선을 지난 마지막 영역. 첫 화면이면 null
function getSectionIdInView() {
  const line = window.innerHeight * 0.4;
  let sectionId = null;
  navSections.forEach(function (section) {
    if (section.getBoundingClientRect().top <= line) sectionId = section.id;
  });
  // 페이지 끝이라 더 내려갈 수 없을 때는 화면에 보이는 주소의 영역을 따름
  const hashId = getNavSectionId(location.hash);
  const isPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (isPageEnd && hashId !== null) {
    const rect = document.getElementById(hashId).getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return hashId;
  }
  return sectionId;
}

// 스크롤이 멈추면 메뉴와 주소를 보이는 영역에 맞춤. replaceState라 뒤로 가기 기록은 늘지 않음
function syncNavWithScroll() {
  const sectionId = getSectionIdInView();
  setCurrentNav(sectionId);
  if (sectionId === getNavSectionId(location.hash)) return;
  history.replaceState(history.state, '', sectionId === null ? location.pathname + location.search : `#${sectionId}`);
}

// 메뉴 클릭·뒤로 가기로 주소가 바뀌면 바로 표시
function handleNavHashChange() {
  setCurrentNav(getNavSectionId(location.hash));
}

function handleNavScroll() {
  clearTimeout(navScrollTimer);
  navScrollTimer = setTimeout(syncNavWithScroll, navScrollDelay);
}

// 메뉴 열기·닫기: 실제 표시, 버튼 문구, aria-expanded를 함께 바꿈
function setMenuOpen(isOpen) {
  mainNav.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggleLabel.textContent = isOpen ? '메뉴 닫기' : '메뉴 열기';
}

function isMenuOpen() {
  return menuToggle.getAttribute('aria-expanded') === 'true';
}

// Esc로 닫고 버튼으로 초점 이동
function handleMenuKeydown(event) {
  if (event.key !== 'Escape' || !isMenuOpen()) return;
  setMenuOpen(false);
  menuToggle.focus();
}

// 메뉴 밖을 누르면 닫기
function handleMenuOutsideClick(event) {
  if (isMenuOpen() && !siteHeader.contains(event.target)) setMenuOpen(false);
}

// 11주차: Tab으로 헤더 밖으로 나가면 닫기. 열린 메뉴가 초점 받은 내용을 가리지 않게 함
function handleMenuFocusOut(event) {
  if (isMenuOpen() && event.relatedTarget !== null && !siteHeader.contains(event.relatedTarget)) setMenuOpen(false);
}

menuToggle.addEventListener('click', function () {
  setMenuOpen(!isMenuOpen());
});
// 목적지를 고르면 메뉴를 닫음. 이동은 링크 기본 동작으로
navLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    setMenuOpen(false);
  });
});
document.addEventListener('keydown', handleMenuKeydown);
document.addEventListener('click', handleMenuOutsideClick);
siteHeader.addEventListener('focusout', handleMenuFocusOut);
// 화면 폭이 바뀌면 열린 상태 초기화
narrowScreen.addEventListener('change', function () {
  setMenuOpen(false);
});
window.addEventListener('hashchange', handleNavHashChange);
window.addEventListener('scroll', handleNavScroll, { passive: true });
window.addEventListener('resize', handleNavScroll);

// JavaScript가 켜져 있을 때만 좁은 화면에서 메뉴를 접음
menuToggle.hidden = false;
siteHeader.classList.add('has-menu-toggle');
setCurrentNav(getNavSectionId(location.hash));

// 13주차: 작성 중 상태 복구
// 작성 중인 값은 현재 탭(sessionStorage)에 임시 보관하고, 같은 탭에서 새로고침하면 불러옴
// 저장한 학습 기록 목록(localStorage)과는 따로 관리. 학습 계획과 학습 기록 폼이 같은 함수를 씀

// String: 임시 보관에 실패했을 때 안내
const draftErrorMessage = '작성 내용을 임시 보관하지 못했습니다. 새로고침하면 입력이 사라질 수 있습니다.';

// 임시 보관함 만들기. key는 저장 이름, isValid는 꺼낸 값이 쓸 수 있는 모양인지 검사하는 함수
// 저장소를 쓸 수 없거나 값이 깨졌으면 save는 false, read는 null을 돌려주고 화면 코드는 계속 실행됨
function createDraftStore(key, isValid) {
  return {
    save(value) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        return false;
      }
    },
    read() {
      try {
        const value = JSON.parse(sessionStorage.getItem(key));
        return value && isValid(value) ? value : null;
      } catch (error) {
        return null;
      }
    },
    clear() {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        // 저장소를 쓸 수 없으면 지울 값도 없음
      }
    }
  };
}

// 안내 영역: 문구(role="status")와 '처음부터' 버튼
function getDraftNotice(id) {
  const box = document.getElementById(id);
  return { box, status: box.querySelector('.draft-status'), discard: box.querySelector('button') };
}

// 안내 바꾸기. state: restored 불러옴, cleared 처음부터, error 보관 실패, none 안내 없음
// '처음부터' 버튼은 불러온 뒤에 나타나고, 처음부터 시작하거나 저장을 마치면 숨김
function showDraftNotice(notice, message, state) {
  if (notice.status.textContent !== message) notice.status.textContent = message;
  notice.box.dataset.state = state;
  if (state === 'restored') notice.discard.hidden = false;
  if (state === 'cleared' || state === 'none') notice.discard.hidden = true;
}

// 보관 결과 처리. 실패하면 경고, 다시 성공하면 경고를 지움
function handleDraftSaveResult(notice, isSaved) {
  if (!isSaved) {
    showDraftNotice(notice, draftErrorMessage, 'error');
  } else if (notice.box.dataset.state === 'error') {
    showDraftNotice(notice, '', 'none');
  }
}

// 학습 계획: 목표 입력값, 정한 목표, 고른 예제, 학습 시간, 현재 단계(1~4)
function getPlanDraft() {
  const example = document.querySelector('input[name="plan-example"]:checked');
  return { goal: goalInput.value, savedGoal, example: example ? example.value : '', time: planTime.value, step: currentPlanStep };
}

// 시작 화면이거나 아무것도 쓰지 않은 1단계는 보관하지 않음
function hasPlanInput(draft) {
  return draft.step >= 1 && (draft.goal.trim() !== '' || draft.savedGoal !== '' || draft.example !== '' || draft.time !== defaultPlanTime);
}

function savePlanDraft() {
  const draft = getPlanDraft();
  if (!hasPlanInput(draft)) {
    planDraft.clear();
    return;
  }
  handleDraftSaveResult(planDraftNotice, planDraft.save(draft));
}

// 새로고침 뒤 계획 불러오기. 값을 먼저 채우고, 갈 수 있는 단계인지 확인한 뒤 그 단계를 표시
function restorePlanDraft() {
  const draft = planDraft.read();
  if (draft === null) return;
  const timeValues = [...planTime.options].map(option => option.value);
  goalInput.value = draft.goal.slice(0, goalInput.maxLength);
  savedGoal = typeof draft.savedGoal === 'string' && draft.savedGoal.trim().length >= minGoalLength ? draft.savedGoal.trim().slice(0, goalInput.maxLength) : '';
  // 글자 수, 목표 안내, 버튼 상태, '다음' 버튼을 입력값에 맞춤
  handleGoalInput();
  planExamples.forEach(function (radio) {
    radio.checked = radio.value === draft.example;
  });
  updatePlanOptions();
  planTime.value = timeValues.includes(draft.time) ? draft.time : defaultPlanTime;

  // 2단계부터는 정한 목표, 3단계부터는 고른 예제가 있어야 함. 조건이 맞지 않으면 1단계
  const example = document.querySelector('input[name="plan-example"]:checked');
  const canReach = [false, true, savedGoal !== '', savedGoal !== '' && example !== null, savedGoal !== '' && example !== null];
  const step = canReach[draft.step] ? draft.step : 1;
  if (step >= 3) fillPlanSummary(example);
  showPlanStep(step);
  const message = step === planDoneStep
    ? '확정한 학습 계획을 불러왔습니다. 새로 세우려면 처음부터 다시 세우기를 누르세요.'
    : `작성하던 학습 계획을 불러왔습니다. ${step}단계 ${planStepNames[step - 1]}부터 이어서 하세요.`;
  showDraftNotice(planDraftNotice, message, 'restored');
}

// 학습 기록 폼: 고른 예제, 배운 점, 헷갈린 부분 체크와 내용
function getRecordDraft() {
  return { example: recordExample.value, learned: recordLearned.value, hasQuestion: recordHasQuestion.checked, question: recordQuestion.value };
}

function hasRecordInput(draft) {
  return draft.example !== '' || draft.learned.trim() !== '' || draft.hasQuestion || draft.question.trim() !== '';
}

function saveRecordDraft() {
  if (isRecordSaving) return;
  const draft = getRecordDraft();
  if (!hasRecordInput(draft)) {
    recordDraft.clear();
    return;
  }
  handleDraftSaveResult(recordDraftNotice, recordDraft.save(draft));
}

// 새로고침 뒤 기록 폼 불러오기. 값을 채운 뒤 헷갈린 부분 칸, 글자 수, 조건 안내를 맞춤
function restoreRecordDraft() {
  const draft = recordDraft.read();
  if (draft === null) return;
  const exampleValues = [...recordExample.options].map(option => option.value);
  recordExample.value = exampleValues.includes(draft.example) ? draft.example : '';
  recordLearned.value = draft.learned.slice(0, recordLearned.maxLength);
  recordHasQuestion.checked = draft.hasQuestion === true;
  recordQuestion.value = String(draft.question || '').slice(0, recordQuestion.maxLength);
  updateQuestionField();
  if (recordExample.value !== '') validateRecordExample();
  updateRecordText(recordTextRules.learned);
  updateRecordText(recordTextRules.question);
  showDraftNotice(recordDraftNotice, '작성하던 학습 기록을 불러왔습니다. 이어서 쓰고 저장하세요.', 'restored');
}

// 입력하거나 고르거나 단계를 옮길 때마다 보관 (단계 이동 버튼은 클릭이 목록까지 올라온 뒤 저장)
['input', 'change', 'submit'].forEach(function (type) {
  planFlow.addEventListener(type, savePlanDraft);
});
planFlow.addEventListener('click', function (event) {
  if (event.target.closest('button')) savePlanDraft();
});
recordForm.addEventListener('input', saveRecordDraft);
recordForm.addEventListener('change', saveRecordDraft);

// '처음부터' 버튼: 임시값을 지우고 빈 첫 단계로
planDraftNotice.discard.addEventListener('click', function () {
  resetPlan();
  resetPlanQuiz();
});
recordDraftNotice.discard.addEventListener('click', handleRecordReset);

restorePlanDraft();
restoreRecordDraft();
