# 🧠 Mind Storage

> 매일의 감정을 기록하고 돌아보는 공간

당신의 하루를 기억하는 가장 따뜻한 방법

---

## ✨ 주요 기능

### 📅 시간 여행 방식의 기록 탐색
- **년도 선택** → **월 선택** → **날짜 선택** → **감정 기록**
- 직관적인 3단계 네비게이션으로 과거의 기록을 쉽게 찾아볼 수 있어요
- 좌우 화살표로 이전/다음 날짜로 빠르게 이동

### 😊 😢 두 가지 감정 기록
- **행복했던 일 :)** 
  - 좋았던 순간들을 자유롭게 기록
  - 회색 배경의 편안한 입력창
  
- **속상했던 일 :(** 
  - 힘들었던 순간도 솔직하게 기록
  - 붉은 배경으로 구분되는 특별한 공간
  - 작성 후 **반창고로 덮어서 보호**할 수 있어요

### 🩹 반창고 기능 (핵심 기능!)
- 속상한 기억은 반창고 이미지로 가릴 수 있어요
- 다시 보고 싶을 때만 반창고를 열어볼 수 있어요
- 감정을 보호하면서도 기록할 수 있는 따뜻한 기능

### 🎨 시각적 달력 시스템
기록한 날짜를 색상으로 한눈에 확인:
- ⚫ **검정색** - 기록이 있는 날/월/년도
- 🔴 **빨간색** - 속상한 기억이 포함된 날
- ⚪ **회색** - 아직 기록하지 않은 날

이 색상 시스템은 년도, 월, 날짜 모든 화면에서 일관되게 적용돼요!

### 💾 자동 저장
- 타이핑하는 즉시 자동으로 저장
- 별도의 저장 버튼을 누를 필요 없어요
- 언제든 앱을 닫아도 안전하게 보관돼요

### 🔐 안전한 로그인 시스템
3가지 로그인 방법 지원:
- 📧 이메일 로그인
- 🔵 Google 로그인
- 🍎 Apple 로그인 -추가 예정

### 🎯 스마트한 초기 화면
- **처음 가입한 사용자** → 년도 선택 화면부터 시작
- **기존 사용자** → 오늘 날짜 화면으로 바로 이동

### 🗑️ 기록 관리
- 각 기록마다 "..." 메뉴로 개별 삭제 가능
- 행복한 기록과 속상한 기록을 따로 삭제할 수 있어요

### 📱 반응형 디자인
- 모바일과 데스크톱 모두에서 최적화된 경험
- 터치 친화적인 큰 버튼과 넉넉한 여백

---

## 🎨 디자인 철학

### 미니멀한 디자인
- 불필요한 요소는 모두 제거
- 흑백 기조의 깔끔한 인터페이스
- Anton 폰트로 강렬한 타이포그래피

### 감성적인 디테일
- 월 선택 화면의 숫자들이 자연스럽게 기울어져 있어요
- 반창고로 감정을 보호하는 은유적 표현
- 빨간색과 회색으로 감정의 온도를 시각화

---

## 🛠️ 기술 스택

### Frontend
- **React 18** - 사용자 인터페이스
- **Vite** - 빠른 개발 환경
- **Tailwind CSS** - 유틸리티 기반 스타일링

### Backend
- **Supabase** 
  - PostgreSQL 데이터베이스
  - 실시간 인증 시스템
  - Row Level Security (RLS)로 데이터 보호
  - 사용자는 오직 자신의 데이터만 접근 가능

### 보안
- 비밀번호 암호화 저장
- Row Level Security로 데이터 격리
- HTTPS 통신으로 안전한 데이터 전송

---

## 📂 프로젝트 구조

```
mind_storage/
├── src/
│   ├── App.jsx              # 메인 앱 (모든 화면 포함)
│   ├── lib/
│   │   └── supabase.js      # Supabase 클라이언트 설정
│   ├── main.jsx             # 앱 진입점
│   └── index.css            # 글로벌 스타일
│
├── public/
│   ├── images/
│   │   └── bandaid.png      # 반창고 이미지
│   └── privacy-policy.html  # 개인정보 처리방침
│
└── ...설정 파일들
```

---

## 🚀 시작하기

### 설치

```bash
# 저장소 클론
git clone [repository-url]
cd mind_storage

# 의존성 설치
npm install
```

### 환경 변수 설정

`.env` 파일 생성:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 프로덕션 빌드

```bash
npm run build
```

---

## 📊 데이터베이스 스키마

```sql
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  happy TEXT,                    -- 행복한 기록
  sad TEXT,                      -- 속상한 기록
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)          -- 하루에 하나의 기록만
);

-- Row Level Security 정책
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own entries"
  ON entries FOR ALL
  USING (auth.uid() = user_id);
```

---

## 🎯 사용 시나리오

### 처음 사용하는 경우
1. 회원가입 (이메일, Google, 또는 Apple)
2. 년도 선택 화면이 나타남
3. 원하는 년도 → 월 → 날짜 선택
4. 오늘의 감정을 기록

### 이미 사용 중인 경우
1. 로그인하면 오늘 날짜 화면으로 바로 이동
2. 바로 오늘의 일기 작성 시작
3. 좌우 화살표로 어제/내일로 이동 가능

### 과거 기록 찾아보기
1. 'back' 버튼으로 날짜 → 월 → 년도 화면으로 이동
2. 검정색으로 표시된 날짜들은 기록이 있는 날
3. 빨간색 날짜는 속상한 기억이 포함된 날

---

## 💡 개발 의도

Mind Storage는 단순히 일기를 쓰는 앱이 아니에요.

**"속상한 기억도 소중하지만, 너무 자주 보면 아플 수 있다"**

이 생각에서 시작했어요. 반창고로 속상한 기억을 가릴 수 있는 기능은 감정을 기록하면서도 스스로를 보호할 수 있도록 도와줘요.

색상으로 감정을 시각화하고, 시간 여행하듯 기록을 탐색하는 경험을 통해 자신의 감정 패턴을 자연스럽게 돌아볼 수 있어요.

---

## 📱 모바일 앱

iOS 앱으로도 사용 가능해요!

```bash
npm run ios:build
```

자세한 내용은 프로젝트 개발자에게 문의해주세요.

---

## 🔮 향후 계획

- [ ] Android 앱 지원
- [ ] 오프라인 모드
- [ ] 감정 통계 및 인사이트
- [ ] 다크 모드
- [ ] 기록 내보내기 (PDF, 텍스트)
- [ ] 태그 시스템

---

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

## 👤 개발자

**Jisoo Shin**

감정을 기록하고 돌아보는 경험을 디자인했어요.

---

## 🙏 사용 기술

- [React](https://react.dev) - UI 라이브러리
- [Vite](https://vitejs.dev) - 빌드 도구
- [Tailwind CSS](https://tailwindcss.com) - CSS 프레임워크
- [Supabase](https://supabase.com) - 백엔드 서비스
- [Capacitor](https://capacitorjs.com) - 네이티브 앱 변환

---

**Made with ❤️ for everyone who wants to remember their days**
