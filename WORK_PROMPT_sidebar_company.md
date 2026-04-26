# Sidebar / Company 기능 현황 및 다음 작업 프롬프트 (최신)

## 현재 구현 상태 (코드 기준)
- Company CRUD(Add/Edit/Delete) 동작 중이며 `createdAt` 보존, `updatedAt` 갱신 규칙이 적용되어 있습니다.
- 저장소 키는 단일 키 `alan-crm-companies`를 사용합니다.
- 멀티 필드 데이터 모델이 적용되어 있습니다:
  - `businessField`, `buyerType`, `status`, `priority`, `nextActionDate`, `tags`
- 레거시 데이터 로드시 마이그레이션/정규화가 수행됩니다(기존 데이터 유지).
- Saved View가 존재합니다:
  - `all`, `needsAction`, `aesthetics`, `bioOem`, `aiSoftware`, `dormant`
- KPI 카드가 존재합니다:
  - Total Companies, Visible Rows, Needs Action, High Priority
- `escapeHtml` 보안 헬퍼가 존재하며 user-provided 값 렌더 시 적용됩니다.
- 검색은 포커스를 잃지 않도록 table-only 업데이트 방식으로 동작합니다.
- 검색/정렬은 saved view 내부에서도 동작합니다.

## 남은 갭(다음 라운드 후보)
1. **테이블 UX 정리**
   - 열 밀도/가독성 개선, 정보 우선순위 재정렬, 반응형 축약 규칙 정리.
2. **폼 라벨/가독성 개선**
   - placeholder 중심 입력을 명시적 라벨 구조로 개선.
3. **미래 Import/Export 고려**
   - CSV import/export 및 충돌 정책(merge/skip/overwrite) 설계.
4. **렌더러/컨트롤러 분리 가능성**
   - `index.html` 단일 파일 구조를 단계적으로 모듈화하는 계획 수립.
5. **실사용 전 백업/내보내기 안전장치**
   - localStorage 사용 한계 대비 수동 백업/복구 UX 제공.

---

## 다음 구현 프롬프트 (복사 사용)
```text
You are working in /workspace/solvia_codex-version.
Source of truth is index.html.
Do not move runtime logic to script.js/style.css.
Keep localStorage key exactly: alan-crm-companies.

Goal:
Polish Partners table/form UX and add safe practical data portability without changing the single master DB principle.

Current baseline already exists and must be preserved:
- CRUD, duplicate validation, saved views, KPI cards, search-focus stability, sort, migration, escapeHtml.

Implement next:
1) Table UX refinement
   - Improve column readability and metadata hierarchy.
2) Form readability
   - Add explicit labels and lightweight grouping.
3) Data portability
   - Add CSV export first (import optional), with clear field mapping.
4) Safety
   - Add a simple backup/export reminder banner for localStorage-based data.

Acceptance:
- No regression in CRUD/saved-view/search/sort.
- No additional DB key or per-category DB split.
- Existing data remains compatible.
```
