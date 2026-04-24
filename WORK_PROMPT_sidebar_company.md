# Sidebar / Company 기능 검토 및 다음 작업 프롬프트

## 1) 현재 구현 상태 요약

### Sidebar
- `#sidebarNav` 내부의 `data-view` 버튼 클릭으로 뷰 라우팅이 동작합니다.
- 라우팅 시 `appState.currentView`를 갱신하고, `renderCurrentView()`를 호출해 메인 뷰를 재렌더링합니다.
- 활성 메뉴 상태는 `updateSidebarActiveState()`에서 클래스 토글로 처리합니다.
- 헤더 텍스트(`headerTitle`, `headerSubtitle`)는 `viewMeta` 매핑 기반으로 업데이트됩니다.

### Company(=partners) 뷰
- `currentView === 'partners'`일 때만 인터랙션 바인딩(`setupPartnersViewInteractions`)이 수행됩니다.
- 회사 데이터는 `localStorage` (`alan-crm-companies`)에 저장/로드됩니다.
- 검색(`partnerSearchInput`)은 companyName/country/buyer/email/productCategory 대상 부분일치 필터입니다.
- Add Company 버튼 클릭 시 인라인 폼이 노출되며 필수값(Company Name, Buyer Name) 및 이메일 포맷 검증이 있습니다.
- 저장 성공 시 새 레코드를 배열 앞에 추가하고 `createdAt/updatedAt`을 기록 후 다시 렌더합니다.
- 테이블은 notes를 회사명 셀 하단 보조 텍스트로 표시하며, 데이터가 없으면 empty state를 보여줍니다.

## 2) 강점
- 단일 파일에서 상태(`appState`)와 렌더 경로가 명확합니다.
- 최소한의 입력 검증(필수/이메일)과 로컬 저장소 연동이 있어 데모/프로토타입 용도로 즉시 사용 가능합니다.
- 검색, 추가, 카운트(총/가시행) 등 사용자 가치가 빠르게 보이는 구조입니다.

## 3) 확인된 한계 / 리스크
- 삭제/수정(Edit/Delete)이 없어 데이터 정정 흐름이 없습니다.
- 렌더 시 `innerHTML` 기반 문자열 템플릿을 재생성하여, 뷰가 커질수록 유지보수 비용이 증가할 수 있습니다.
- 입력값 escape/sanitize 계층이 없어 XSS 방어가 취약할 수 있습니다.
- 회사 데이터 정렬, 중복 검사, 페이징이 없어 데이터가 많아지면 사용성이 저하될 수 있습니다.
- 현재 Company 뷰와 헤더의 기본 문구가 특정 회사(`Acme Solutions Inc.`)에 하드코딩되어 있어 실제 데이터 중심 UI와 어긋납니다.

## 4) 우선순위 기반 개선 아이디어
1. **CRUD 완성**: 회사 행별 Edit/Delete 추가 + 수정 시 `updatedAt` 갱신.
2. **데이터 품질**: 중복 정책(회사명+이메일/도메인) 및 표준화(trim/lowercase) 강화.
3. **표 뷰 UX**: 정렬(회사명/국가/최근수정), 페이지네이션, 검색 하이라이트.
4. **보안/안정성**: 렌더링 시 텍스트 escape 적용, 유효성 검증 분리 함수화.
5. **구조화 리팩터링**: partners 전용 renderer + controller 분리(현재 index 단일 파일 완화).

---

## 5) 작업 프롬프트 (복사해서 다음 구현 작업에 사용)

```text
You are working in /workspace/solvia_codex-version.
Source of truth is index.html (do not move runtime logic to script.js/style.css).

Goal:
Upgrade the existing Sidebar + Company(partners) flow from "Add + Search" to production-ready CRUD baseline.

Current behavior to preserve:
- Sidebar route switching by data-view.
- Partners search and add-company behavior.
- localStorage persistence under existing key: alan-crm-companies.

Implement:
1) Company row actions
   - Add Edit and Delete actions per row.
   - Edit opens prefilled form (reuse existing form area).
   - Delete asks confirmation before removal.
   - On Edit save, keep createdAt and update updatedAt.

2) Validation and normalization
   - Keep required fields: companyName, buyerName.
   - Keep email format validation.
   - Normalize text input by trim.
   - Reject duplicate entries using (companyName lowercase + email lowercase) when email exists.

3) List UX improvements
   - Add sort control: companyName asc/desc, updatedAt newest/oldest.
   - Keep search filter behavior and make sort apply on filtered results.
   - Add empty-state copy for "no match" vs "no data" separately.

4) Header/context consistency
   - For partners view, remove hardcoded single-company title semantics.
   - Use generic title/subtitle aligned with list context.

5) Code quality constraints
   - Keep functions small and named by responsibility.
   - Avoid adding external libraries.
   - Maintain Tailwind-based styling convention in index.html.

Acceptance checks:
- Add 2 companies, edit 1, delete 1, refresh browser: data remains correct.
- Search term filters list correctly after CRUD operations.
- Duplicate validation works for normalized duplicate keys.
- Sidebar navigation still works for all existing views.

Deliverables:
- Updated index.html only (unless absolutely necessary).
- Short changelog in markdown with before/after behavior.
```
