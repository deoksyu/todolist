# ToDoList 개발 체크리스트 (1시간 완성 목표)

본 체크리스트는 `docs/prd.md`와 `docs/arch.md`를 기반으로, 60분 내 MVP를 구축하기 위한 실행 계획입니다.

## 0. 준비 (5분)
- [x] 프로젝트 루트에 기본 구조 생성: `index.html`, `styles/main.css`, `scripts/`
- [x] 스크립트 파일 생성: `scripts/app.js`, `scripts/state.js`, `scripts/storage.js`, `scripts/renderer.js`, `scripts/utils.js`
- [x] `index.html`에 CSS/JS 연결 및 기본 마크업(입력창, 추가 버튼, 리스트 컨테이너) 추가

## 1. 유틸 & 스토리지 (10분)
- [x] `utils.js`: `uuid()` 구현(간단 랜덤 문자열 or crypto 기반), `qs()`/`qsa()` 헬퍼
- [x] `storage.js`:
  - [x] `const STORAGE_KEY = 'todolist.tasks.v1'`
  - [x] `load(): {version:1,tasks:[]}` 기본 반환, try/catch 파싱
  - [x] `save(state)` 구현(실패 시 에러 반환)

## 2. 상태 관리 (10분)
- [x] `state.js`:
  - [x] 상태 구조: `{ tasks: Task[] }`
  - [x] `init(initial)`
  - [x] `addTask(text)` (검증은 컨트롤러/호출부에서), `toggleTask(id)`, `updateTask(id, text)`, `deleteTask(id)`
  - [x] 각 변경 시 새로운 배열/객체로 불변 업데이트

## 3. 렌더러 (10분)
- [x] `renderer.js`:
  - [x] `render(state)` 최초 전체 렌더(입력 영역 + 리스트)
  - [x] `renderTaskItem(task)` 항목 DOM 생성(체크박스, 텍스트, 삭제 버튼)
  - [x] 완료시 `.done` 클래스 토글 및 취소선 CSS
  - [x] 부분 업데이트 함수(선택): `updateItem(id)` 또는 전체 리스트 재렌더(시간 절약용)

## 4. 컨트롤러/부트스트랩 (15분)
- [x] `app.js`:
  - [x] 초기화: `storage.load()` → `state.init()` → `renderer.render(state)`
  - [x] 이벤트 바인딩(이벤트 위임):
    - [x] 입력창 Enter → 추가
    - [x] "추가" 버튼 → 추가
    - [x] 리스트의 체크박스 클릭 → 완료 토글
    - [x] 텍스트 편집(간단 방식): 더블클릭 시 `contenteditable`로 전환, Enter 저장/Blur 저장, Esc 취소(단축 가능)
    - [x] 삭제 버튼 클릭 → 삭제
  - [x] 모든 변경 후 `storage.save(state)` 호출 및 렌더 갱신
  - [x] 빈 입력 방지 및 간단 경고 표시

## 5. 스타일 (5분)
- [x] `styles/main.css`:
  - [x] 베이스 레이아웃(상단 입력 영역 고정, 리스트 여백)
  - [x] 리스트 아이템 정렬(체크박스-텍스트-삭제 버튼)
  - [x] `.done { text-decoration: line-through; color: #888; }`
  - [x] 포커스 스타일/버튼 크기(터치 타겟 >= 36px)

## 6. 최소 테스트 & 폴리시 (5분)
- [ ] 5개 항목 추가/수정/삭제/토글 동작 확인(새로고침 포함)
- [ ] 빈 입력 시 추가 안됨 검증
- [ ] 로컬스토리지 차단/오류 try/catch 로그 확인(가능 시 안내 문구 노출)

## 선택 개선(시간이 남을 경우)
- [ ] 리스트 부분 업데이트 최적화(단일 항목 DOM 갱신)
- [ ] 편집 UX 마감(Enter 저장/ESC 취소 명확화)
- [ ] 간단 배너 컴포넌트로 에러 안내

---
체크리스트 완료 후, `index.html`에서 기본 플로우(추가→토글→수정→삭제→새로고침 유지)를 데모하여 PRD의 성공 기준을 충족했는지 확인하십시오.

