// HTML, CSS, JavaScript 코드 예제 탭
const examples = {
  html: {
    filename: 'index.html',
    description: 'HTML은 제목, 문단, 링크로 구조를 만듭니다.',
    code: '<section id="about">\n  <h2>과제 소개</h2>\n  <p>HTML 구조와 내부 이동 실습</p>\n  <a href="#features">실습 내용 보기</a>\n</section>',
    analogy: '이 페이지에서 찾기 · 과제 소개와 실습 내용 영역'
  },
  css: {
    filename: 'style.css',
    description: 'CSS는 색, 글꼴, 여백, 배치를 정합니다.',
    code: '.feature-grid {\n  display: grid;\n  grid-template-columns:\n    repeat(auto-fit, minmax(260px, 1fr));\n  gap: 20px;\n}\n\n@media (max-width: 768px) {\n  .feature-grid {\n    grid-template-columns: 1fr;\n  }\n}',
    analogy: '이 페이지에서 찾기 · 실습 내용 카드'
  },
  js: {
    filename: 'script.js',
    description: 'JavaScript는 클릭과 입력에 반응해 화면을 바꿉니다.',
    code: "function showPlanStep(step) {\n  planSteps.forEach(function (item) {\n    item.hidden = Number(item.dataset.step) !== step;\n  });\n}\n\nfunction handlePlanCheck() {\n  if (example === null) {\n    showExampleError('예제를 하나 골라 주세요.');\n    return;\n  }\n  showPlanStep(3);\n}",
    analogy: '이 페이지에서 찾기 · 학습 계획 세우기'
  }
};

const tabs = [...document.querySelectorAll('.tech-tabs [role="tab"]')];
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
  // 위/아래 방향키, Home, End로 탭 이동
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

// 클릭 횟수와 메시지 표시
let clickCount = 0;
const counter = document.getElementById('click-count');
const feedback = document.getElementById('feedback-message');
const resetButton = document.getElementById('reset-button');
document.getElementById('experience-button').addEventListener('click', () => {
  clickCount += 1;
  counter.textContent = clickCount;
  feedback.textContent = `${clickCount}번 클릭했습니다.`;
  resetButton.disabled = false;
});
resetButton.addEventListener('click', () => {
  clickCount = 0;
  counter.textContent = '0';
  feedback.textContent = '초기화했습니다.';
  resetButton.disabled = true;
  document.getElementById('experience-button').focus();
});
