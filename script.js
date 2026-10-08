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
