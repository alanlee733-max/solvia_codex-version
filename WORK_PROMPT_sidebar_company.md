# Sidebar / Company 최신 구조 메모

## 현재 구조 (구현 반영)
- Runtime source of truth: `index.html`
- 단일 저장소 키: `alan-crm-companies`
- 단일 master `companiesData`를 사용하며, 카테고리/필드별 별도 DB/별도 localStorage key는 없습니다.
- Company CRUD(Add/Edit/Delete), 중복검증, 검색 포커스 유지, 정렬, KPI 카드가 동작합니다.
- `escapeHtml` 헬퍼를 사용해 user-provided 텍스트 렌더를 보호합니다.

## Sidebar Saved View 구조
### Company 그룹
- All Companies (`all`)
- Needs Action (`needsAction`)
- Priority (`priority`) → `priority === "A"`
- Paused Leads (`pausedLeads`) → `status === "Dormant"`

### Fields 그룹
- Aesthetics (`fieldAesthetics`)
- Bio/OEM (`fieldBioOem`)
- AI/Software (`fieldAiSoftware`)
- Trade (`fieldTrade`)
- Other (`fieldOther`)

## 동작 규칙 핵심
- 메인 Company 버튼 클릭 시 Partners로 이동하면서 saved view를 `all`로 리셋합니다.
- Saved-view 버튼은 같은 `companiesData`에 필터만 적용합니다.
- Needs Action은 actionable 상태만 포함합니다(Archived/Dormant 제외 + nextActionDate 도래).
- Priority는 UI 레이블이며 저장값은 기존 `A/B/C`를 그대로 사용합니다.
- Paused Leads는 UI 레이블이며 내부 상태값은 기존 `Dormant`를 그대로 사용합니다.

## 남은 갭 (다음 라운드)
1. 테이블 UX 정리(열 우선순위/가독성)
2. 폼 라벨/가독성 개선
3. import/export(백업) 기능 검토
4. renderer/controller 분리 여부 검토
5. 실사용 전 localStorage 백업/내보내기 가이드 강화
