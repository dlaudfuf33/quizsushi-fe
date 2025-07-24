# 🍣 QuizSushi - Frontend
### 📂 관련 링크

- 🔗 **Backend Repository**: [quizsushi-be (Spring)](https://github.com/dlaudfuf33/quizsushi-be)
- 🚀 **배포 주소**: [https://quizsushi.cmdlee.com](https://quizsushi.cmdlee.com)


## 🛠️ 기술 스택

| 카테고리 | 라이브러리 | 설명 |
| :--- | :--- | :--- |
| **Framework**      | Next.js 14             | React 기반의 SSR 및 파일 기반 라우팅 프레임워크 |
| **Language**       | TypeScript             | 정적 타입을 제공하는 JavaScript 확장 언어 |
| **Styling**        | Tailwind CSS           | Utility-first CSS 프레임워크 |




## 🗂️ 주요 페이지

### `/` - 메인 페이지
서비스의 홈. 퀴즈 목록과 주요 기능 진입점 역할을 합니다.  

<p align="center">
  <img width="800" height="600" alt="main" src="https://github.com/user-attachments/assets/6685cce9-9b5d-47f9-a463-c786ab911f25" />
</p>

---

### `/quiz/create` - 퀴즈 생성 페이지  
사용자가 퀴즈를 직접 만들 수 있으며, JSON, AI 자동 생성 기능도 포함됩니다.

<p align="center">
  <img width="450" height="600" alt="filequiz" src="https://github.com/user-attachments/assets/392f1f22-3c25-47fd-b534-fa6b51a642ca" />
  <img width="450" height="600" alt="aiquiz" src="https://github.com/user-attachments/assets/a566d037-62b1-4bd6-87e4-ad9d00440541" />
</p>

---

### `/quiz/solve/[id]` - 퀴즈 풀이 페이지  
선택한 퀴즈를 푸는 페이지. 문제와 보기, 채점 결과를 보여줍니다.

<p align="center">
  <img width="450" height="600" alt="solve" src="https://github.com/user-attachments/assets/22f78f79-c1cd-4862-ba6f-d4129f3b5522" />
</p>

---

### `/quiz/challenge` - 실시간 챌린지
다른 사용자들과 실시간 퀴즈 대결을 위한 페이지입니다.

<p align="center">
  <img width="400" height="600" src="https://github.com/user-attachments/assets/2975bb8c-6160-4f89-a14c-5c1a5aefdf4a" />
  <img width="400" height="600" src="https://github.com/user-attachments/assets/1264684a-dc35-4df2-b30d-31c69d9ce5b0" />
</p>


---

### `/quiz/categories` - 카테고리 탐색 페이지  
카테고리별 퀴즈를 탐색할 수 있습니다.

<p align="center">
  <img width="800" src="https://github.com/user-attachments/assets/9980e199-2c48-4c70-ac19-461f5eb533cf" />
</p>

---

### `/profile/**` - 마이페이지  
내가 푼 퀴즈, 만든 퀴즈, 활동 내역을 확인할 수 있습니다.

<p align="center">
  <img width="800" src="https://github.com/user-attachments/assets/88c37aee-a385-47d0-afb2-34fc491a4b85" />
</p>


---


### `/admin/cmdlee/dashboard` - 관리자 대시보드  
서비스 통계 및 주요 지표를 시각화한 페이지입니다.

<p align="center">
  <img width="800" height="600" alt="solve" src="https://github.com/user-attachments/assets/fa22fcad-4f85-46ab-8b9d-87f3e67387be" />
</p>



## **주요 기능**

- **OAuth 로그인 연동**: 카카오, 구글 소셜 계정을 통한 간편 가입/로그인.
- **퀴즈 풀기 + 결과 확인**: 다양한 유형의 퀴즈를 풀고, 즉각적인 채점 및 결과 확인.
- **실시간 WebSocket 통신**: STOMP 프로토콜을 통해 퀴즈 챌린지 게임 상태 및 채팅 동기화.
- **퀴즈 생성 (AI 활용)**: 사용자가 직접 퀴즈를 생성하거나 JSON파일 혹은 AI를 활용한 문제 자동 생성 기능 포함.
- **관리자 대시보드 및 관리 기능**: 사용자, 퀴즈, 신고 등 서비스 전반을 관리하는 대시보드 및 상세 관리 기능 제공.
- **사용자 프로필 관리**: 개인 정보 조회 및 관리, 활동 내역(생성/풀이 퀴즈) 확인.
- **카테고리별 퀴즈 탐색**: 다양한 카테고리별로 퀴즈를 쉽게 찾아볼 수 있는 기능.
- **라이트/다크 모드 지원**: 사용자 선호에 따른 테마 변경 기능.
- **풍부한 콘텐츠 표시**: 마크다운 렌더링 및 코드 구문 강조를 통해 퀴즈 설명 등 복잡한 콘텐츠를 가독성 높게 표시.




