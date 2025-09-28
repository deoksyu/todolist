# ToDoList Architecture

## 1. 개요
- 목적: `docs/prd.md`의 MVP 요구사항을 충족하는 클라이언트 사이드 단일 페이지(SPA-lite) 구조
- 특징: 서버 없음, `localStorage` 기반 영속성, 가벼운 Vanilla JS로 구성

## 2. 시스템 구성도
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

## 3. 주요 컴포넌트
- UI Layer
  - 입력창, "추가" 버튼, 리스트(체크박스/텍스트/삭제 버튼)
  - 완료 항목 취소선 처리
- Controller
  - 사용자 이벤트 처리: 추가, 수정, 삭제, 완료 토글, 편집 저장/취소
  - 입력 검증(빈 문자열 방지), 키보드 단축키(Enter, Esc)
- State
  - 메모리 상의 `tasks` 배열과 파생 상태(편집 중인 id 등)
  - 변경 시 단일 진입점으로 업데이트하여 일관성 유지
- Storage
  - `localStorage` 키: `todolist.tasks.v1`
  - 직렬화/역직렬화, 버전 필드 포함
- Renderer
  - 상태 기반 DOM 재렌더(부분 업데이트 우선)
  - 최소 리플로우/리페인트 고려

## 4. 데이터 모델
```ts
// Task
interface Task {
  id: string;          // uuid
  text: string;        // 할 일 내용
  done: boolean;       // 완료 여부
  createdAt: string;   // ISO8601
  updatedAt: string;   // ISO8601
}

// Persisted Shape
interface PersistedData {
  version: 1;
  tasks: Task[];
}
```

## 5. 디렉터리 구조(제안)
```
/ (프로젝트 루트)
├─ index.html
├─ styles/
│  └─ main.css
├─ scripts/
│  ├─ app.js            // 부트스트랩, 초기화, 이벤트 바인딩
│  ├─ state.js          // 상태 관리(get/set, 불변 업데이트 헬퍼)
│  ├─ storage.js        // localStorage read/write, 마이그레이션 훅
│  ├─ renderer.js       // 리스트 렌더, 항목 DOM 생성/갱신
│  └─ utils.js          // uuid, dom helpers, 날짜 유틸
└─ docs/
   ├─ draft.md
   ├─ prd.md
   └─ arch.md
```

## 6. 상태 및 플로우
- 초기화
  1) `storage.load()`로 로컬 데이터 로드(없으면 기본값)
  2) `state.init(loaded)`로 메모리 상태 준비
  3) `renderer.render(state)`로 최초 렌더
- 사용자 상호작용
  - 추가: 입력값 검증 → `state.addTask()` → `storage.save(state)` → `renderer.updateList()`
  - 완료 토글: `state.toggleTask(id)` → 저장 → 부분 렌더(해당 li)
  - 수정: `state.updateTask(id, text)` → 저장 → 부분 렌더
  - 삭제: `state.deleteTask(id)` → 저장 → 리스트 갱신
- 키보드 UX
  - 입력창 Enter: 추가
  - 편집 중 Enter: 저장, Esc: 취소

## 7. 이벤트 핸들링 설계
- 위임(Event Delegation) 사용으로 성능 및 간결성 확보
  - 리스트 컨테이너에 클릭/체크/입력 이벤트를 바인딩하고, `event.target`으로 분기
- 모든 상태 변경은 컨트롤러에서 `state.*` API를 통해 수행
- 상태 변경 직후 반드시 저장(`storage.save`)과 렌더 호출

## 8. 렌더링 전략
- 전체 렌더는 최초 1회, 이후는 부분 갱신 우선
- 항목 템플릿 생성 함수: `renderTaskItem(task)`
- 완료 상태에 따라 클래스 토글(`.done` → CSS 취소선)
- 접근성: 체크박스와 텍스트 레이블 연결(`label for`), 포커스 링 보존

## 9. 저장소 전략(localStorage)
- 키: `todolist.tasks.v1`
- try/catch로 오류(용량/권한) 처리, 실패 시 배너 안내
- JSON 파싱 실패 시 안전 초기화(`{version:1,tasks:[]}`)
- 마이그레이션 훅: `if (data.version < CURRENT) migrate(data)` (확장 대비)

## 10. 에러 처리 & 로깅
- 사용자 오류: 입력 검증 실패 시 인라인 피드백(작은 경고 메시지)
- 시스템 오류: 저장 실패 배너, 콘솔 로그에 상세 기록(개발 단계)
- 복구: 파싱 실패 시 초기화 후 사용자 알림

## 11. 성능 & 품질
- 200개 항목까지 부드러운 스크롤/조작 목표
- DOM 조작 최소화: 프래그먼트 사용, 클래스 토글 기반 업데이트
- 불변 패턴(새 배열/객체)로 변경 감지 용이

## 12. 접근성(A11y)
- 키보드 내비게이션 가능
- 체크박스와 텍스트 레이블 연결, `aria-live`로 피드백 영역 알림 고려
- 버튼 터치 타겟 36px 이상, 명도 대비 준수

## 13. 보안/프라이버시
- 로컬 전용. 민감정보 입력 금지 안내(문서/툴팁)
- 외부 네트워크 통신 없음

## 14. 테스트 전략(경량)
- 수동 테스트 체크리스트
  - 추가/수정/삭제/토글 동작
  - 새로고침 후 상태 보존
  - 빈 입력 방지, 편집 Esc/Enter 동작
  - 저장 실패 시 안내 배너 노출
- 단위 함수는 분리(예: `utils.uuid`, `state` 메서드)하여 콘솔 기반 간단 검증 가능

## 15. 확장 포인트
- 필터(전체/완료/미완료): `derivedState(filter)`와 `renderer` 조건 렌더 추가
- 정렬(드래그 앤 드롭): 순서 필드 추가 또는 DOM 순서 기반 저장
- 기한/태그: 모델 확장(`due`, `tags: string[]`) 및 필터 UX 추가
- 다크 모드: `prefers-color-scheme` + 토글 스위치, `data-theme` 전환

---
이 아키텍처는 `docs/prd.md`의 MVP 요구사항을 충족하면서, 이후 로드맵 기능을 무리 없이 수용할 수 있도록 모듈 경계를 정의했습니다. 간단한 Vanilla JS 기반으로 시작해도 파일 분리를 통해 유지보수성을 확보합니다.
