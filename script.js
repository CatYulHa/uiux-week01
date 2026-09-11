// 목표는 서버로 전송하거나 저장하지 않고 현재 화면에만 표시합니다.
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

const goalForm = document.getElementById('goal-form');
const goalInput = document.getElementById('learning-goal');
const goalFeedback = document.getElementById('goal-feedback');
const goalNext = document.getElementById('goal-next');
document.getElementById('goal-submit').disabled = false;

goalInput.addEventListener('input', () => {
  goalInput.setCustomValidity('');
  goalFeedback.textContent = '';
  goalNext.hidden = true;
});

goalForm.addEventListener('submit', event => {
  event.preventDefault();
  const goal = goalInput.value.trim();
  if (!goal) {
    goalInput.setCustomValidity('공백 대신 오늘 배우고 싶은 내용을 적어주세요.');
    goalInput.reportValidity();
    return;
  }
  goalInput.value = goal;
  goalFeedback.textContent = `오늘의 목표: “${goal}”. 아래 링크에서 학습을 시작해 보세요.`;
  goalNext.hidden = false;
});
