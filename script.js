// 6주차: 실습 예제 탭 3개를 버튼과 패널로 연결합니다.
const demoTabList = document.querySelector('.demo-tabs');
const demoTabs = document.querySelectorAll('.demo-tab');
const demoPanels = document.querySelectorAll('.demo-panel');

// 모든 탭의 선택 상태를 지우고 모든 패널을 숨깁니다.
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

// 선택한 탭을 표시하고 data-target에 적힌 패널만 보여줍니다.
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

// 키보드 사용자는 방향키와 Home·End로 탭을 옮깁니다.
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

// JavaScript가 실행되면 탭을 보여주고 첫 번째 예제만 남깁니다.
demoTabList.hidden = false;
selectDemoTab(demoTabs[0]);

// 내부 링크로 예제에 도착하면 해당 예제의 탭을 엽니다.
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
  // 브라우저가 주소의 #위치로 이동한 뒤 선택한 탭으로 초점을 옮깁니다.
  if (tab) setTimeout(() => tab.focus({ preventScroll: true }));
});

function revealFragment() {
  const tab = openExample(location.hash);
  if (tab) requestAnimationFrame(() => document.getElementById(location.hash.slice(1)).scrollIntoView());
}
window.addEventListener('hashchange', revealFragment);
revealFragment();

// 5주차: 학습 목표 폼의 제출을 감지하고, 입력값과 상태에 맞는 결과를 보여줍니다.
// 목표는 서버로 전송하거나 저장하지 않고 현재 화면에만 표시합니다.
const goalForm = document.querySelector('#goal-form');
const goalInput = document.querySelector('#learning-goal');
const goalCount = document.querySelector('#goal-count');
const goalSubmit = document.querySelector('#goal-submit');
const goalFeedback = document.querySelector('#goal-feedback');
const goalNext = document.querySelector('#goal-next');
const goalSubmitLabel = goalSubmit.querySelector('.button-label');
const goalSubmitIcon = goalSubmit.querySelector('.button-icon');

// Number: 목표로 받는 최소 글자 수
const minGoalLength = 5;
// String: 마지막으로 정한 목표. 빈 문자열이면 아직 정하기 전입니다.
let savedGoal = '';

// JavaScript가 실행되면 목표 버튼을 사용할 수 있게 합니다.
goalSubmit.disabled = false;

// 입력값에 문제가 있으면 오류 문구를, 없으면 빈 문자열을 돌려줍니다.
function getGoalError(goal) {
  if (goal === '') {
    return '학습 목표를 입력해 주세요.';
  } else if (goal.length < minGoalLength) {
    return `목표를 ${minGoalLength}자 이상으로 조금 더 구체적으로 적어 주세요.`;
  }
  return '';
}

// 안내 문구를 바꾸고 결과에 맞는 스타일(is-success, is-error)을 적용합니다.
function showGoalMessage(message, result) {
  goalFeedback.textContent = message;
  goalFeedback.classList.toggle('is-success', result === 'success');
  goalFeedback.classList.toggle('is-error', result === 'error');
  goalInput.setAttribute('aria-invalid', String(result === 'error'));
}

// 6주차: 글자 수를 보여주고, 목표로 받을 수 있는 길이가 되면 초록색으로 바꿉니다.
function updateGoalCount() {
  goalCount.textContent = `${goalInput.value.length} / ${goalInput.maxLength}자`;
  goalCount.classList.toggle('is-ready', goalInput.value.trim().length >= minGoalLength);
}

// 목표를 정한 상태면 버튼을 완료 상태로 바꿔 같은 목표를 다시 제출하지 않게 합니다.
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

// 폼이 제출될 때 실행할 함수입니다.
function handleGoalSubmit(event) {
  event.preventDefault();
  const goal = goalInput.value.trim();
  const error = getGoalError(goal);

  if (error !== '') {
    showGoalMessage(error, 'error');
    goalInput.focus();
    return;
  }

  // Boolean: 처음 정하는 목표인지, 버튼을 눌러 제출했는지 확인합니다.
  const isFirstGoal = savedGoal === '';
  const submittedByButton = document.activeElement === goalSubmit;
  savedGoal = goal;
  goalInput.value = goal;
  updateGoalCount();

  if (isFirstGoal) {
    showGoalMessage(`오늘의 목표를 정했습니다: “${goal}”`, 'success');
  } else {
    showGoalMessage(`목표를 바꿨습니다: “${goal}”`, 'success');
  }
  updateGoalButton(true);
  goalNext.hidden = false;
  // 비활성화된 버튼 대신 다음 행동 링크로 초점을 옮깁니다.
  if (submittedByButton) goalNext.focus();
}

// 입력할 때마다 글자 수를 바꾸고, 목표를 정한 뒤 내용을 고치면 다시 제출할 수 있게 합니다.
function handleGoalInput() {
  const goal = goalInput.value.trim();
  updateGoalCount();

  if (savedGoal === '') {
    showGoalMessage('', 'none');
  } else if (goal === savedGoal) {
    showGoalMessage(`현재 목표: “${savedGoal}”`, 'success');
    updateGoalButton(true);
  } else {
    showGoalMessage('고친 목표를 적용하려면 ‘목표 바꾸기’를 눌러 주세요.', 'none');
    updateGoalButton(false);
  }
  // 7주차: 고친 목표를 적용하기 전에는 다음 단계 버튼을 숨깁니다.
  if (savedGoal !== '') goalNext.hidden = goal !== savedGoal;
}

// submit·input 이벤트와 처리 함수를 연결합니다.
goalForm.addEventListener('submit', handleGoalSubmit);
goalInput.addEventListener('input', handleGoalInput);
updateGoalCount();

// 6주차: 실습 순서 체크박스(change)와 학습 마치기 버튼(click)으로 진행 상황을 보여줍니다.
const stepChecks = document.querySelectorAll('.step-check input');
const stepsProgress = document.querySelector('#steps-progress');
const stepsBar = document.querySelector('#steps-bar');
const stepsStatus = document.querySelector('#steps-status');
const finishButton = document.querySelector('#finish-button');
const finishLabel = finishButton.querySelector('.button-label');
const finishIcon = finishButton.querySelector('.button-icon');

// Boolean: 학습 마치기 버튼을 눌렀는지
let isFinished = false;

// 체크한 단계 수에 맞춰 단계 표시·진행 문구·막대·버튼 상태를 함께 바꿉니다.
function updateSteps() {
  let doneCount = 0;
  stepChecks.forEach(function (check) {
    check.closest('li').classList.toggle('is-done', check.checked);
    if (check.checked) doneCount += 1;
  });
  const total = stepChecks.length;
  const allDone = doneCount === total;
  // 체크를 하나라도 해제하면 다시 마치기 전 상태로 돌아갑니다.
  if (!allDone) isFinished = false;

  stepsBar.style.width = `${(doneCount / total) * 100}%`;
  stepsProgress.classList.toggle('is-ready', allDone && !isFinished);
  stepsProgress.classList.toggle('is-complete', isFinished);
  finishButton.disabled = !allDone || isFinished;
  finishButton.classList.toggle('is-success', isFinished);

  if (isFinished) {
    stepsStatus.textContent = savedGoal === '' ? '오늘 학습을 마쳤어요. 수고했어요!' : `오늘 학습을 마쳤어요. 목표: “${savedGoal}”`;
    finishLabel.textContent = '학습 완료';
    finishIcon.textContent = '✓';
  } else if (allDone) {
    stepsStatus.textContent = `${doneCount} / ${total}단계 완료 · 버튼을 눌러 오늘 학습을 마무리하세요.`;
    finishLabel.textContent = '오늘 학습 마치기';
    finishIcon.textContent = '↗';
  } else {
    stepsStatus.textContent = `${doneCount} / ${total}단계 완료 · 세 단계를 모두 체크하면 오늘 학습을 마칠 수 있어요.`;
    finishLabel.textContent = '오늘 학습 마치기';
    finishIcon.textContent = '↗';
  }
}

function handleFinishClick() {
  isFinished = true;
  updateSteps();
}

// change·click 이벤트와 처리 함수를 연결합니다.
stepChecks.forEach(function (check) {
  check.addEventListener('change', updateSteps);
});
finishButton.addEventListener('click', handleFinishClick);

// JavaScript가 실행되면 진행 상황 영역을 보여줍니다.
stepsProgress.hidden = false;
updateSteps();

// 7주차: 시작 → 목표 입력 → 예제·시간 선택 → 계획 확인 → 완료로 이어지는 학습 계획 흐름입니다.
// 1단계는 위의 학습 목표 폼을 그대로 쓰고, 계획은 서버로 보내지 않고 현재 화면에만 표시합니다.
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

// Array: 진행 표시에 쓰는 단계 이름. 마지막 단계의 다음 번호가 완료 화면입니다.
const planStepNames = ['목표 입력', '예제·시간 선택', '계획 확인'];
const planDoneStep = planStepNames.length + 1;
// String: 다시 세울 때 되돌릴 학습 시간
const defaultPlanTime = '20';
// Number: 지금 보고 있는 단계. 0은 시작 전입니다.
let currentPlanStep = 0;

// data-step이 현재 단계와 같은 영역만 보여주고 진행 표시를 맞춥니다.
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

// 단계를 바꾼 뒤 1단계는 입력창으로, 나머지는 그 단계의 제목으로 초점을 옮깁니다.
function goToPlanStep(step) {
  showPlanStep(step);
  if (step === 1) {
    goalInput.focus();
  } else {
    planFlow.querySelector(`.plan-step[data-step="${step}"] .plan-title`).focus();
  }
}

// 고른 예제에만 선택 표시를 합니다.
function updatePlanOptions() {
  planExamples.forEach(function (radio) {
    radio.closest('.plan-option').classList.toggle('is-selected', radio.checked);
  });
}

// 예제 선택 오류 문구와 테두리를 함께 바꿉니다. 빈 문자열이면 오류를 지웁니다.
function showExampleError(message) {
  planExampleError.textContent = message;
  planExampleField.classList.toggle('has-error', message !== '');
}

// 확인·완료 화면에 정한 목표와 고른 예제·시간을 채웁니다.
function fillPlanSummary(example) {
  const values = {
    goal: savedGoal,
    example: example.nextElementSibling.textContent,
    time: planTime.options[planTime.selectedIndex].textContent
  };
  planSummaryItems.forEach(function (item) {
    item.textContent = values[item.dataset.summary];
  });
  // 완료 화면의 버튼은 고른 예제의 탭으로 이동합니다.
  planGo.href = `#${example.value}`;
  planGoLabel.textContent = `‘${values.example}’ 시작하기`;
}

function handlePlanStart() {
  goToPlanStep(1);
}

// 기존 진입 링크로 들어오면 시작 화면을 건너뛰고 1단계를 엽니다. 진행 중이면 그대로 둡니다.
function handlePlanLinkClick() {
  if (currentPlanStep !== 0) return;
  showPlanStep(1);
  // 브라우저가 #start로 이동한 뒤 입력창으로 초점을 옮깁니다.
  setTimeout(() => goalInput.focus({ preventScroll: true }));
}

function handleExampleChange() {
  showExampleError('');
  updatePlanOptions();
}

// 예제를 고르지 않았으면 현재 단계에 머물고, 골랐으면 확인 화면으로 넘어갑니다.
function handlePlanCheck() {
  const example = document.querySelector('input[name="plan-example"]:checked');
  if (example === null) {
    showExampleError('실습할 예제를 하나 골라 주세요.');
    planExamples[0].focus();
    return;
  }
  showExampleError('');
  fillPlanSummary(example);
  goToPlanStep(3);
}

// 다시 세우기: 목표·선택·오류·진행 상태를 처음으로 되돌리고 1단계로 돌아갑니다.
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

// 시작·다음·이전·확정·다시 세우기 버튼과 처리 함수를 연결합니다.
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

// JavaScript가 실행되면 시작 화면부터 보여줍니다.
updatePlanOptions();
showPlanStep(0);
