# 🔐 Supabase 연동 가이드

## 1️⃣ Supabase 프로젝트 설정

### Supabase 프로젝트 생성
1. https://supabase.com 접속
2. "New Project" 클릭
3. 프로젝트 이름, 비밀번호 설정
4. 리전 선택 (Northeast Asia - Seoul 추천)

### API Keys 확인
1. 프로젝트 대시보드 → Settings → API
2. **Project URL** 복사
3. **anon public** key 복사

---

## 2️⃣ 환경 변수 설정

`.env` 파일을 열어서 값을 입력하세요:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 3️⃣ 데이터베이스 테이블 생성

1. Supabase 대시보드 → SQL Editor
2. `supabase_setup.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣고 **RUN** 클릭

---

## 4️⃣ 소셜 로그인 설정

### Google 로그인 설정
1. Supabase 대시보드 → Authentication → Providers
2. Google 찾아서 **Enable** 클릭
3. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
   - https://console.cloud.google.com/apis/credentials
   - 승인된 리디렉션 URI 추가: `https://your-project.supabase.co/auth/v1/callback`
4. Client ID와 Client Secret를 Supabase에 입력

### Apple 로그인 설정
1. Supabase 대시보드 → Authentication → Providers
2. Apple 찾아서 **Enable** 클릭
3. Apple Developer에서 설정
   - https://developer.apple.com/account/resources/identifiers/list/serviceId
   - Service ID 생성
   - Return URLs: `https://your-project.supabase.co/auth/v1/callback`
4. Service ID, Team ID, Key ID, Private Key를 Supabase에 입력

---

## 5️⃣ 패키지 설치 및 실행

```bash
# Supabase 클라이언트가 이미 package.json에 포함되어 있습니다
npm install

# 개발 서버 실행
npm run dev
```

---

## ✅ 테스트

1. 앱을 열고 "login" 또는 "sign up" 클릭
2. 이메일로 회원가입 또는 로그인
3. Google/Apple 버튼으로 소셜 로그인 테스트
4. 기록을 작성하면 Supabase DB에 자동 저장됩니다!

---

## 🐛 문제 해결

### "Invalid API key" 에러
- `.env` 파일에 올바른 URL과 Key가 입력되었는지 확인
- 개발 서버를 재시작하세요 (`npm run dev`)

### 로그인 후 데이터가 안 보임
- Supabase SQL Editor에서 `supabase_setup.sql` 실행했는지 확인
- RLS 정책이 제대로 설정되었는지 확인

### 소셜 로그인이 안 됨
- Supabase 대시보드에서 해당 Provider가 **Enabled** 상태인지 확인
- Redirect URL이 정확한지 확인
- Google/Apple Developer Console 설정 확인

---

## 📱 다음 단계

- [ ] 이메일 인증 활성화
- [ ] 비밀번호 재설정 기능
- [ ] 카카오 로그인 추가 (커스텀 OAuth)
- [ ] 프로필 관리 기능
- [ ] 데이터 백업/복원

---

궁금한 점이 있으면 언제든 물어보세요! 🚀
