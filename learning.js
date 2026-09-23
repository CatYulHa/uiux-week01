// 탭으로 HTML, CSS, JavaScript의 역할과 예제 코드를 전환합니다.
const examples = {
  html: {
    filename: 'index.html',
    description: 'HTML은 제목, 문단, 이동 링크에 의미와 구조를 부여합니다.',
    code: '<section id="about">\n  <h2>과제 소개</h2>\n  <p>HTML 구조와 내부 이동 실습</p>\n  <a href="#features">실습 내용 보기</a>\n</section>',
    analogy: '이 페이지에서 찾기 · 과제 소개와 실습 내용 영역'
  },
  css: {
    filename: 'style.css',
    description: 'CSS는 색상, 글꼴, 여백과 배치를 정해 화면을 읽기 좋게 표현합니다.',
    code: '.feature-grid {\n  display: grid;\n  grid-template-columns:\n    repeat(auto-fit, minmax(260px, 1fr));\n  gap: 20px;\n}\n\n@media (max-width: 768px) {\n  .feature-grid {\n    grid-template-columns: 1fr;\n  }\n}',
    analogy: '이 페이지에서 찾기 · 화면 너비에 따라 열 수가 바뀌는 실습 내용 카드'
  },
  js: {
    filename: 'script.js',
    description: 'JavaScript는 클릭과 입력에 반응하고 화면의 내용과 상태를 바꿉니다.',
    code: "const button = document.querySelector('button');\n\nbutton.addEventListener('click', () => {\n  button.textContent = '클릭이 전달되었어요!';\n});",
    analogy: '이 페이지에서 찾기 · 클릭에 반응하는 숫자와 학습 목표 메시지'
  }
};

const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const example = examples[tab.dataset.tech];
  document.getElementById('tech-panel').setAttribute('aria-labelledby', tab.id);
  document.getElementById('code-filename').textContent = example.filename;
  document.getElementById('tech-description').textContent = example.description;
  document.getElementById('code-example').textContent = example.code;
  document.getElementById('tech-analogy').textContent = example.analogy;
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  // 키보드 사용자도 위/아래 방향키와 Home/End로 탭을 탐색합니다.
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectTab(tabs[next]);
    tabs[next].focus();
  });
});

// 사용자의 클릭에 숫자와 메시지로 즉시 피드백을 제공합니다.
let clickCount = 0;
const counter = document.getElementById('click-count');
const feedback = document.getElementById('feedback-message');
const resetButton = document.getElementById('reset-button');
document.getElementById('experience-button').addEventListener('click', () => {
  clickCount += 1;
  counter.textContent = clickCount;
  feedback.textContent = `${clickCount}번째 클릭이 전달되었어요! 화면의 반응이 바로 피드백입니다.`;
  resetButton.disabled = false;
});
resetButton.addEventListener('click', () => {
  clickCount = 0;
  counter.textContent = '0';
  feedback.textContent = '초기화했어요. 새로운 인터랙션을 시작해 보세요.';
  resetButton.disabled = true;
  document.getElementById('experience-button').focus();
});
