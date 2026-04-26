# Sidebar / Company 기능 검토 및 다음 작업 프롬프트

## 1) 현재 구현 상태 요약 (업데이트됨)

### Sidebar
- `#sidebarNav` 내부의 `data-view` 버튼 클릭으로 뷰 라우팅이 동작합니다.
- 라우팅 시 `appState.currentView`를 갱신하고, `renderCurrentView()`를 호출해 메인 뷰를 재렌더링합니다.
- 활성 메뉴 상태는 `updateSidebarActiveState()`에서 클래스 토글로 처리합니다.
- 헤더 텍스트(`headerTitle`, `headerSubtitle`)는 `viewMeta` 매핑 기반으로 업데이트됩니다.

### Company(=partners) 뷰
- `currentView === 'partners'`일 때만 인터랙션 바인딩(`setupPartnersViewInteractions`)이 수행됩니다.
- 회사 데이터는 `localStorage` (`alan-crm-companies`)에 저장/로드되며, 로드시 레거시 레코드 마이그레이션(누락 `id/createdAt/updatedAt` 보정)이 동작합니다.
- 검색(`partnerSearchInput`)은 companyName, buyerName, email, website, country, productCategory, notes 부분일치 필터입니다.
- Add/Edit는 동일 인라인 폼을 재사용하며, edit 시 기존값 prefill + `createdAt` 보존 + `updatedAt` 갱신 규칙을 따릅니다.
- 행 단위 `Edit/Delete`가 있으며, Delete는 확인(confirm) 후 즉시 반영됩니다.
- 정렬(`partnerSortSelect`)이 존재하며 회사명 오름/내림, updatedAt 최신/오래된순을 지원합니다.
- 중복 검증(회사명+이메일 normalize key)이 add/edit 모두에 적용됩니다(편집 중 자기 자신 레코드는 제외).
- Empty state는 no data / no match가 분리되어 있습니다.

## 2) 강점
- 단일 파일에서 상태(`appState`)와 렌더 경로가 명확합니다.
- 최소한의 입력 검증(필수/이메일)과 로컬 저장소 연동이 있어 데모/프로토타입 용도로 즉시 사용 가능합니다.
- 검색, 추가, 카운트(총/가시행) 등 사용자 가치가 빠르게 보이는 구조입니다.

## 3) 남은 한계 / 리스크 (현행 기준)
- 렌더 시 `innerHTML` 기반 문자열 템플릿을 재생성하여, 뷰가 커질수록 유지보수 비용이 증가할 수 있습니다.
- 입력값 escape/sanitize 계층이 없어 XSS 방어가 취약할 수 있습니다.
- `productCategory` 단일 필드 중심이라 향후 다중 카테고리/태그 구조 확장 시 모델 재설계가 필요할 수 있습니다.
- 필드 구조(예: buyer/contact 분리, notes 구조화, 상태/태그 체계)는 아직 도메인 확장 전제에 맞춘 표준화가 부족합니다.

## 4) 우선순위 기반 개선 아이디어
1. **보안/안정성**: 렌더링 시 텍스트 escape 적용, 유효성 검증 분리 함수화.
2. **데이터 모델 진화**: 카테고리/취급 품목을 다중값 구조로 확장할지 결정(태그/배열/참조 테이블).
3. **표 뷰 UX 확장**: 페이지네이션, 검색 하이라이트, 다중 정렬.
4. **구조화 리팩터링**: partners 전용 renderer + controller 분리(현재 index 단일 파일 완화).

---

## 5) 다음 작업 프롬프트 (복사해서 다음 구현 작업에 사용)

```text
You are working in /workspace/solvia_codex-version.
Source of truth is index.html (do not move runtime logic to script.js/style.css).

Goal:
Harden the existing CRUD baseline for Sidebar + Company(partners) with security and data-model cleanup.

Current behavior to preserve (already implemented):
- Sidebar route switching by data-view.
- Partners CRUD (add/edit/delete), sort, and search behavior.
- localStorage persistence under existing key: alan-crm-companies.
- createdAt preserved on edit; updatedAt refreshed on edit.
- duplicate validation by normalized (companyName + email) identity.

Implement:
1) Security rendering pass
   - Add safe text escaping/output strategy for user-provided fields rendered in table/form.
   - Keep UI behavior unchanged while removing XSS injection surface.

2) Data model cleanup plan
   - Propose next-step structure for product/category fields (single -> multi value).
   - Keep backward compatibility for existing `productCategory` records.

3) Search/sort hardening
   - Keep current search scope (companyName, buyerName, email, website, country, productCategory, notes).
   - Keep current sort options and ensure stable behavior with migrated legacy records.

4) Code quality constraints
   - Keep functions small and named by responsibility.
   - Avoid adding external libraries.
   - Maintain Tailwind-based styling convention in index.html.

Acceptance checks:
- Existing CRUD still works after refactor/hardening.
- Search scope remains unchanged and complete.
- Sidebar navigation still works for all existing views.
- localStorage key stays `alan-crm-companies`.
- No regression in migration of old records.

Deliverables:
- Updated index.html only (unless absolutely necessary).
- Short changelog in markdown with risk and mitigation notes.
```
