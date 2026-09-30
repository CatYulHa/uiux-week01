// 내부 링크로 예제에 도착하면 접힌 내용을 펼칩니다.
function openExample(hash) {
  const target = document.getElementById(hash.slice(1));
  if (!(target instanceof HTMLDetailsElement)) return null;
  target.open = true;
  return target;
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const example = openExample(link.hash);
  if (example) example.querySelector('summary').focus({ preventScroll: true });
});

function revealFragment() {
  const example = openExample(location.hash);
  if (example) requestAnimationFrame(() => example.scrollIntoView());
}
window.addEventListener('hashchange', revealFragment);
revealFragment();

// 5주차: 학습 목표 폼의 제출을 감지하고, 입력값과 상태에 맞는 결과를 보여줍니다.
// 목표는 서버로 전송하거나 저장하지 않고 현재 화면에만 표시합니다.
const goalForm = document.querySelector('#goal-form');
const goalInput = document.querySelector('#learning-goal');
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

// 목표를 정한 뒤 내용을 고치면 다시 제출할 수 있게 합니다.
function handleGoalInput() {
  const goal = goalInput.value.trim();

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
