// 탭으로 HTML, CSS, JavaScript의 역할과 예제 코드를 전환합니다.
const examples = {
  html: {
    filename: 'index.html',
    description: 'HTML은 제목, 문단, 버튼처럼 화면에 들어갈 내용과 구조를 만듭니다.',
    code: '<main>\n  <h1>안녕하세요, 하율입니다.</h1>\n  <p>나의 첫 웹페이지입니다.</p>\n  <button>눌러보세요</button>\n</main>',
    analogy: '건물에 비유하면, 공간을 이루는 뼈대입니다.'
  },
  css: {
    filename: 'style.css',
    description: 'CSS는 색상, 글꼴, 여백과 배치를 정해 화면을 읽기 좋게 표현합니다.',
    code: 'button {\n  background-color: #315d47;\n  color: white;\n  padding: 12px 20px;\n  border-radius: 6px;\n}',
    analogy: '건물에 비유하면, 공간을 꾸미는 인테리어입니다.'
  },
  js: {
    filename: 'script.js',
    description: 'JavaScript는 클릭과 입력에 반응하고 화면의 내용과 상태를 바꿉니다.',
    code: "const button = document.querySelector('button');\n\nbutton.addEventListener('click', () => {\n  button.textContent = '클릭이 전달되었어요!';\n});",
    analogy: '건물에 비유하면, 버튼을 누를 때 문이 열리는 기능입니다.'
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
