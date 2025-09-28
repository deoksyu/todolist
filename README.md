# ToDoList (Vanilla JS, LocalStorage)

간단하고 가벼운 ToDo 리스트 웹앱입니다. 서버 없이 동작하며 브라우저 `localStorage`에 데이터를 저장합니다. `index.html`을 브라우저로 열면 바로 사용할 수 있습니다.

## 데모/실행 방법
- 로컬에서 실행: 파일을 더블클릭하거나 VS Code의 Live Server 등으로 `index.html`을 엽니다.
- 데이터는 브라우저 `localStorage` 키 `todolist.tasks.v1`에 저장됩니다.

## 주요 기능
- **할 일 추가/수정/삭제**: 입력창과 리스트 인터랙션으로 CRUD 수행
- **완료 체크 토글**: 체크박스로 `done` 상태 변경 및 취소선 표시
- **자동 저장/복원**: 변경 시 즉시 저장, 새로고침 후에도 유지
- **간단 키보드 UX**
  - 입력창에서 Enter → 추가
  - 항목 더블클릭 → 인라인 편집 시작
  - 편집 중 Enter → 저장, Esc → 취소

## 스크린샷(예시)
> 첫 화면에서 입력 후 추가하면 리스트에 항목이 생성됩니다. 완료 체크 시 취소선이 표시됩니다.

## 프로젝트 구조
```
/ (프로젝트 루트)
├─ index.html
├─ styles/
│  └─ main.css
├─ scripts/
│  ├─ app.js         # 부트스트랩, 이벤트 바인딩, 편집/추가/삭제 핸들러
│  ├─ state.js       # 메모리 상태(tasks[])와 add/toggle/update/delete
│  ├─ storage.js     # localStorage load/save 래퍼
│  ├─ renderer.js    # 상태 기반 DOM 렌더링
│  └─ utils.js       # uuid, DOM 헬퍼(qs/qsa)
└─ docs/
   ├─ prd.md         # 요구사항(PRD)
   ├─ arch.md        # 아키텍처 설명(mermaid 포함)
   └─ checklist.md   # 개발 체크리스트
```

## 아키텍처 개요
```mermaid
flowchart TD
  subgraph Browser[Web Browser]
    UI[UI Layer (HTML/CSS)]
    CTRL[Controller (Events/Handlers)]
    STATE[State (In-memory)]
    STORE[Storage (localStorage)]
    RENDER[Renderer (DOM Update)]
  end

  UI <---> CTRL
  CTRL <--> STATE
  STATE <--> STORE
  CTRL --> RENDER
  STATE --> RENDER
```

## 동작 원리
- `scripts/storage.js`의 `StorageAPI.load()`로 초기 데이터 로드
- `scripts/state.js`의 `AppState.init()`으로 메모리 상태 초기화
- `scripts/renderer.js`의 `Renderer.render()`로 최초 렌더
- 이후 `scripts/app.js`에서 이벤트 처리(추가/토글/편집/삭제) → `AppState` 변경 → `StorageAPI.save()` → `Renderer.render()` 순으로 반영

## 데이터 모델
```ts
interface Task {
  id: string;       // uuid
  text: string;     // 내용
  done: boolean;    // 완료 여부
  createdAt: string;// ISO8601
  updatedAt: string;// ISO8601
}
```
저장 형태:
```json
{
  "version": 1,
  "tasks": [ { "id": "...", "text": "...", "done": false, "createdAt": "...", "updatedAt": "..." } ]
}
```

## 개발 가이드
- 의존성 없음(순수 HTML/CSS/JS). 빌드 과정 없이 실행 가능.
- 빠른 개발을 위해 전체 리스트 재렌더 방식을 기본으로 사용.
- 접근성: 체크박스와 레이블 연결, 포커스 스타일 유지, 최소 터치 타겟 36px.

## 로드맵(향후 개선)
- 필터: 전체/완료/미완료
- 드래그 앤 드롭 정렬
- 기한/태그 필드 추가 및 필터링
- 다크 모드 토글

## 문제해결(FAQ)
- "저장이 안 돼요": 시크릿 모드 또는 `localStorage` 차단 환경인지 확인하세요. 콘솔에 저장 실패 로그가 표시됩니다.
- "편집 저장/취소 단축키?": Enter 저장, Esc 취소입니다.
- "데이터 초기화하고 싶어요": 브라우저 `localStorage`에서 `todolist.tasks.v1` 키를 삭제하세요.

## 라이선스
- 필요한 경우 `LICENSE` 파일을 추가해 주세요. 현재는 명시되지 않았습니다.

## 참고 문서
- 요구사항: `docs/prd.md`
- 아키텍처: `docs/arch.md`
- 체크리스트: `docs/checklist.md`
