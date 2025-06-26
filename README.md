# QuizSushi Frontend


## 주요 기술 스택

- **Next.js 15** (App Router)
- **TypeScript**
- **pnpm**
- **Tailwind CSS** 및 **Radix UI**
- Axios 기반 API 모듈

## 핵심 기능

- OAuth2 기반 소셜 로그인과 회원 관리
- 퀴즈 생성·편집·삭제 및 문제 풀이 기능
- CSV/JSON 업로드와 AI를 이용한 문제 자동 생성
- 관리자 대시보드(통계 차트, 신고 처리, 회원/관리자 관리)
- 다크 모드 지원 및 반응형 UI

## 폴더 구조

- `app/` – Next.js 라우트. `(user)`와 `(admin)` 그룹으로 나뉩니다.
- `components/` – 재사용 가능한 UI 컴포넌트 모음
- `context/` – 사용자·관리자 인증 컨텍스트
- `lib/` – API 래퍼, 서버 유틸리티, CSV/JSON 파서 등
- `hooks/` – 커스텀 훅
- `types/` – 타입 정의 파일
- `public/` – 정적 자원

## 시작하기

1. 프로젝트 루트에 `.env.local` 파일을 만들고 다음과 같이 API 주소를 설정합니다.

```bash
NEXT_PUBLIC_API_URL=<백엔드 API 주소>
NEXT_PUBLIC_ADMIN_API_URL=<관리자 API 주소>
```

2. 의존성 설치

```bash
pnpm install
```

3. 개발 서버 실행

```bash
pnpm dev
```

로컬 HTTPS가 필요하다면 `ssl/` 디렉터리에 있는 인증서를 사용할 수 있습니다.

## 사용 가능한 스크립트

- `pnpm dev` – 개발 서버 시작
- `pnpm build` – 프로덕션 빌드 생성
- `pnpm start` – 빌드 결과 실행
- `pnpm lint` – ESLint 검사

## 다음 단계

- `lib/api/`의 각 파일을 읽어 백엔드 API 구조를 파악하세요.
- `context/AuthContext.tsx`와 `context/AdminContext.tsx`에서 인증 플로우를 살펴보세요.
- `components/`와 `app/` 하위 폴더를 탐색하여 페이지와 레이아웃 구성을 익히면 빠르게 기능을 확장할 수 있습니다.

이 프로젝트는 기본적인 퀴즈 플랫폼 기능을 갖추고 활용하기 좋습니다. 필요에 맞게 커스터마이즈하여 자신만의 프로젝트로 발전시켜 보세요.
