# 🎯 Mind Storage

행복했던 기억과 슬펐던 기억을 기록하는 마음의 저장소

## ✨ 주요 기능

- 📅 **연도별 기록**: 2020년부터 현재까지 기록 가능
- 📆 **월별/일별 탐색**: 직관적인 네비게이션
- 😊 **행복한 기억**: 긍정적인 순간들을 기록
- 😢 **슬픈 기억**: 감정을 숨기고 보호할 수 있는 기능
- 🎨 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원
- 🔐 **인증 시스템**: 안전한 개인 기록 보관

## 🚀 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 3. 빌드

```bash
npm run build
```

## 🛠 기술 스택

- **Frontend**: React 18
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Database**: Supabase (예정)
- **Fonts**: Anton, Abhaya Libre

## 📁 프로젝트 구조

```
mind_storage/
├── src/
│   ├── App.jsx          # 메인 앱 컴포넌트
│   ├── main.jsx         # 진입점
│   └── index.css        # 글로벌 스타일
├── public/              # 정적 파일
├── package.json         # 의존성 관리
└── vite.config.js       # Vite 설정
```

## 🎨 디자인 특징

- **Anton 폰트**: 제목, 날짜에 사용
- **Abhaya Libre 폰트**: 월 숫자에 사용
- **색상 시스템**:
  - 회색: 기록 없음
  - 검정: 행복한 기억만 있음
  - 빨강: 슬픈 기억 포함
- **밴드 모양**: 슬픈 기억을 보호하는 UI

## 🔜 다음 단계

- [ ] Supabase 인증 연동
- [ ] 데이터베이스 연동
- [ ] Google/Apple 소셜 로그인
- [ ] PWA 지원
- [ ] 모바일 앱 빌드 (Capacitor)

## 📝 라이선스

MIT

---

Made with ❤️ by the best team
