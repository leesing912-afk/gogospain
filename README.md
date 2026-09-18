# ✈️ 이베리아 14박 15일 신혼여행 투어 플래너

서유럽(스페인 & 포르투갈) 여행투어 전문 가이드의 세심한 디테일과 풀스택 웹 개발자의 기술력을 결합하여 완성된 **React + Spring Boot** 기반의 여행 일정 플래너 웹 애플리케이션입니다.

---

## 🌟 주요 기능 소개

### 1. 전 일정 완벽 편집 & 관리 (CRUD)
- **보딩패스 헤더**: 항공편(IN BCN / OUT OPO), 여행 날짜, 기간, 교통편 즉시 수정
- **한눈에 보기 요약**: 전체 도시별 일정 요약 추가/수정/삭제
- **도시별 일정표 (바르셀로나, 그라나다·코르도바, 세비야, 리스본, 포르투)**:
  - 날짜별 일정(Day 1 ~ Day 15) 아코디언 카드
  - 세부 일정 항목별 더블클릭 또는 `[수정]`, `[삭제]`, `[+ 세부 일정 추가]`
  - 새로운 일차(Day) 카드 추가 지원
  - 추천 숙소 및 다음 구간 이동 정보 수정/추가/삭제
- **스마트 예산 계산기**: 숙박, 식비, 교통, 입장료/투어 항목별 금액 편집 및 총액 실시간 관리
- **장단점 & 주의사항**: 가이드 추천 주의사항(예약, 시차, 소매치기, 시에스타 등) 편집
- **여행 가이드 체크리스트**:
  - 체크박스 클릭 시 완료 여부 실시간 저장
  - 가이드 엄선 필수 준비물(여권, 알함브라 티켓, 소매치기 스프링줄, 상비약 등) 카테고리별 제공
  - 사용자 맞춤 체크리스트 항목 추가/수정/삭제 및 달성률(%) 프로그레스 바 제공

### 2. 위지윅 에디팅 및 단축키 지원
- **볼드(굵게)**: `Ctrl + B` (Windows) / `Cmd + B` (Mac)
- **글자 크기 조절 (사이즈 쉼표 컨트롤 쉬프트)**:
  - `Ctrl + Shift + ,` (작게: 키보드 `<` 위치)
  - `Ctrl + Shift + .` (크게: 키보드 `>` 위치)
- **기타 서식**: `Ctrl + I` (기울임), `Ctrl + U` (밑줄)
- **빠른 저장 / 취소**: `Ctrl + Enter` (저장), `Esc` (취소)
- 마우스나 모바일 터치로도 손쉽게 사용할 수 있는 직관적인 에디터 툴바 탑재

### 3. DB 대체 실시간 파일 영속성 (JSON & 메모장 저장)
- **브라우저 자동 보관**: 모든 변경사항이 즉시 `LocalStorage`에 저장되어 새로고침해도 유지
- **💾 JSON 파일 저장**: 편집한 전체 여행 계획을 1클릭으로 `honeymoon_plan.json` 파일 다운로드
- **📝 메모장(TXT) 내보내기**: 스마트폰 카카오톡, 메모장에 복사하거나 인쇄하기 좋은 포맷의 텍스트 파일(`honeymoon_itinerary.txt`) 다운로드
- **📂 파일 불러오기**: 이전에 저장해둔 JSON 파일을 업로드하여 언제든 여정 복원
- **🔄 초기화**: 원본 15일 이베리아 일정으로 되돌리기

---

## 🚀 실행 방법

### 1) React 프론트엔드 실행 (로컬 개발)
```bash
cd frontend
npm install
npm run dev
```
- 브라우저에서 `http://localhost:5173` 접속

### 2) Spring Boot 백엔드 실행 (선택 사항)
```bash
cd backend
./gradlew bootRun    # (Windows: gradlew.bat bootRun)
```
- 백엔드 실행 시 `backend/data/honeymoon_plan.json` 및 `backend/data/honeymoon_itinerary.txt`에 실시간으로 파일이 기록됩니다.
- 백엔드가 없거나 꺼져 있어도 프론트엔드는 로컬 스토리지와 브라우저 파일 다운로드로 100% 정상 작동합니다 (하이브리드 지원).

---

## 🌐 GitHub 커밋 및 Vercel 배포 가이드

### Step 1. GitHub 저장소에 푸시
```bash
git init
git add .
git commit -m "feat: Iberian honeymoon travel planner with React and Spring Boot"
git branch -M main
git remote add origin <사용자님의_깃허브_레포_주소>
git push -u origin main
```

### Step 2. Vercel 배포 (원클릭 자동 감지)
1. [Vercel](https://vercel.com)에 로그인 후 **"Add New... -> Project"** 클릭
2. 방금 푸시한 GitHub 저장소를 선택(Import)
3. 루트 디렉토리에 이미 `vercel.json`이 설정되어 있으므로 별도의 설정 변경 없이 **Deploy** 버튼 클릭!
   - (참고: Framework Preset은 `Vite`, Root Directory는 `./` 또는 `frontend` 자동 지원)
4. 배포가 완료되면 생성된 Vercel 도메인(`https://your-project.vercel.app`)에서 모바일 및 PC로 언제든 접속하실 수 있습니다.

---

## 📁 프로젝트 구조
```
Hello/
├── frontend/                        # React (Vite) 프론트엔드
│   ├── src/
│   │   ├── components/              # 패스, 도시, 예산, 체크리스트, 에디터 등
│   │   ├── data/defaultPlan.js      # 원본 15일 이베리아 여행 데이터
│   │   ├── services/api.js          # 파일/로컬 스토리지 하이브리드 연동
│   │   └── services/fileExport.js   # JSON 및 메모장(TXT) 파일 다운/업로드
│   └── vercel.json                  # Vercel 배포 설정
├── backend/                         # Spring Boot 백엔드 (파일 기반 REST API)
│   ├── data/                        # JSON 및 TXT 데이터 파일 저장소
│   └── src/main/java/               # Spring Boot 컨트롤러 및 파일 스토리지 서비스
├── vercel.json                      # 모노레포 루트 Vercel 빌드 설정
└── honeymoon.html                   # 원본 HTML 백업
```
