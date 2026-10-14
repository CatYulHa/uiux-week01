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
