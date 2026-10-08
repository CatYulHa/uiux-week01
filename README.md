# UI/UX · 1–6주차 학습 기록

- 수업: UI/UX 프로그래밍
- 2주차 주제: HTML로 사용자 경험의 구조 만들기
- 3주차 주제: CSS로 정보 위계와 레이아웃 만들기
- 4주차 주제: 화면 크기에 따라 레이아웃 재구성하기
- 5주차 주제: JavaScript로 사용자 행동에 반응하기
- 6주차 주제: 이벤트 처리와 동적 UI 구현

## 제출 주소

- GitHub Repository URL: https://github.com/CatYulHa/uiux-week01
- Published Website URL: https://catyulha.github.io/uiux-week01/
- 연결된 학습실: https://catyulha.github.io/uiux-week01/learn.html

## UI/UX 프로그래밍 · 1주차

- 주제: UI/UX 프로그래밍의 이해와 웹 인터페이스의 기본 구조

### 구성

- `index.html`: UI와 UX 설명, 좋은 경험의 5원칙, 웹 기술 소개, 인터랙션 실습
- `style.css`: 녹색 계열 디자인, 모바일 반응형 레이아웃, 키보드 포커스 표시
- `script.js`: 기술 소개 탭 전환, 키보드 탐색, 클릭 카운터와 초기화


## 2주차 UX 기획

- 사용자: UI와 UX, 웹의 기본 구조를 처음 배움
- 목적: 서비스의 학습 내용과 이용 방법을 이해하고 첫 웹 학습
- 행동: 페이지 안에서 필요한 정보를 찾고, 오늘의 학습 목표를 입력한 뒤 학습실을 이용
- 순서: 서비스 이름과 한 줄 소개 → 서비스 소개 → 주요 기능 3개 → 이용 방법 3단계 → 학습 목표 입력 → 하단 정보.


## 3주차 CSS 변경

- 변경: 과제 소개와 실습 내용 카드에 `display: flex`와 `gap`을 적용했습니다.
- 이유: 세 가지 실습을 같은 그룹으로 묶고, 글과 이미지를 나란히 비교하기 쉽게 하기 위해서입니다.

- 변경: 메뉴, 학습 목표 입력창, 버튼에 hover·focus·active 상태와 transition을 추가했습니다.
- 이유: 현재 조작 위치와 클릭 결과를 확인하고 상태 변화를 자연스럽게 연결하기 위해서입니다.


## 4주차 반응형 CSS

- viewport: `width=device-width, initial-scale=1.0` 메타 태그 사용
- 유동 너비: 콘텐츠 영역 `width: calc(100% - 64px)`, `max-width: 1120px` / 이미지 `width: 100%`, `max-width: 100%`
- Grid: 실습 내용 카드를 `repeat(auto-fit, minmax(260px, 1fr))`로 배치
- `@media (max-width: 768px)`: 메뉴 세로 배치, 카드 한 열, 입력창과 버튼 세로 배치, 글자 크기와 여백 조정
- 확인: 1100px, 768px, 390px에서 가로 스크롤과 잘림 없음


## 5주차 JavaScript

- 연결: `</body>` 앞에서 `script.js`, `learning.js` 불러오기
- 요소 선택: `querySelector`로 학습 목표 폼·입력창·버튼·결과 문구 선택
- 함수·이벤트: `submit`에 `handleGoalSubmit`, `input`에 `handleGoalInput` 연결 / `event.preventDefault()`로 새로고침 방지
- 변수·조건문: `const minGoalLength = 5`, `let savedGoal = ''` / `if`·`else`로 빈 입력, 5자 미만, 처음 정한 목표, 바꾼 목표 구분
- 피드백: `textContent`로 안내 문구, `classList`로 `is-success`·`is-error` 색, `disabled`로 버튼 완료 상태 표시
- 확인: 1100px, 768px, 390px에서 입력·제출·버튼 상태 변화 확인


## 6주차 이벤트와 탭 UI

- click: 실습 내용 탭 3개 전환 / `오늘 학습 마치기` 버튼 → 완료 문구·완료 배경색·버튼 `disabled`
- input: 학습 목표 입력 → 글자 수 `N / 80자` 문구 갱신, 5자 이상이면 `is-ready` 초록색
- change: 실습 순서 체크박스 → `N / 3단계 완료` 문구·진행 막대·단계 ✓ 표시, 세 단계를 모두 체크하면 마치기 버튼 활성화
- 탭: `querySelectorAll`·`forEach`로 탭 3개에 click 연결, 선택한 탭만 `is-active`·`aria-selected="true"`, `data-target` 패널만 표시 / 방향키·Home·End 이동
- 테스트 결과 (1100px·768px·390px, 모두 통과)
  - 탭: 3개 모두 전환, 선택한 탭과 패널이 1개씩만 표시, 768px 이하에서 세로 배치
  - input: 입력·삭제할 때 글자 수 0–80 즉시 일치, 80자 넘는 입력 막힘
  - change·click: 체크·해제할 때 문구·막대·버튼 상태가 함께 바뀜, 마치기 후 버튼 비활성화
  - 키보드: Tab·Enter·Space·방향키로 탭·체크박스·버튼 조작
  - 화면: 가로 스크롤과 잘림 없음


## 파일 구성

```text
uiux-week01/
├── index.html                # UX 기획 주석
├── learn.html                # 학습실
├── style.css                 # 디자인·Flexbox·Grid·반응형·상태 피드백
├── script.js                 # 탭 전환·학습 목표 제출·실습 순서 체크
├── learning.js               # 클릭·초기화
├── assets/images/service.png # 서비스 화면
└── README.md                 # 소개
```
