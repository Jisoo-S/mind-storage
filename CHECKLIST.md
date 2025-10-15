# 📋 Mind Storage 앱스토어 출시 체크리스트

단계별로 체크하면서 진행하세요!

---

## 🔧 기술적 설정

### 1️⃣ Capacitor 설치 및 설정
```bash
cd /Users/jisooshin/Desktop/file/project/mind_storage
chmod +x quick-setup-ios.sh
./quick-setup-ios.sh
```

- [ ] Capacitor 패키지 설치 완료
- [ ] Capacitor 초기화 완료
- [ ] iOS 플랫폼 추가 완료
- [ ] 첫 빌드 성공

**예상 시간**: 15-20분

---

### 2️⃣ 앱 아이콘 준비

- [ ] 1024x1024 PNG 아이콘 제작
- [ ] `resources/icon.png`에 저장
- [ ] `npx capacitor-assets generate --ios` 실행 (또는 수동 복사)
- [ ] Xcode에서 아이콘 확인

**참고**: [ICON_GUIDE.md](./ICON_GUIDE.md)

**예상 시간**: 1-3시간 (디자인에 따라)

---

### 3️⃣ Xcode 설정

- [ ] Xcode 설치 (Mac App Store)
- [ ] `npx cap open ios`로 프로젝트 열기
- [ ] "App" 프로젝트 선택
- [ ] **General 탭**:
  - [ ] Display Name: "Mind Storage"
  - [ ] Version: 1.0.0
  - [ ] Build: 1
- [ ] **Signing & Capabilities 탭**:
  - [ ] Team 선택 (Apple Developer 계정)
  - [ ] Bundle Identifier 확인: `com.mindstorage.app`

**예상 시간**: 30분

---

### 4️⃣ 실제 기기 테스트

- [ ] iPhone을 Mac에 USB로 연결
- [ ] Xcode 상단에서 본인의 iPhone 선택
- [ ] ▶️ 버튼 클릭 (Cmd+R)
- [ ] iPhone에서 "설정 > 일반 > VPN 및 기기 관리"에서 개발자 신뢰
- [ ] 앱이 정상 작동하는지 테스트
  - [ ] 회원가입/로그인
  - [ ] 년도/월/일 화면 이동
  - [ ] 일기 작성 및 저장
  - [ ] 반창고 기능
  - [ ] 로그아웃

**예상 시간**: 20-30분

---

## 🍎 Apple Developer 계정

### 5️⃣ Apple Developer 가입

- [ ] https://developer.apple.com 접속
- [ ] 계정 생성 (연간 $99)
- [ ] 결제 완료
- [ ] 계정 활성화 대기 (24시간 이내)

**예상 시간**: 30분 + 승인 대기

---

## 📱 App Store Connect 설정

### 6️⃣ 앱 정보 등록

- [ ] https://appstoreconnect.apple.com 접속
- [ ] "나의 앱" → "+" → "새로운 앱"
- [ ] **기본 정보**:
  - [ ] 플랫폼: iOS
  - [ ] 이름: Mind Storage
  - [ ] 기본 언어: 한국어
  - [ ] 번들 ID: com.mindstorage.app
  - [ ] SKU: MINDSTORAGE001 (고유 값)

**예상 시간**: 15분

---

### 7️⃣ 앱 설명 작성

- [ ] **앱 이름** (30자 이내):
  ```
  예: Mind Storage - 마음 보관함
  ```

- [ ] **부제** (30자 이내):
  ```
  예: 매일의 감정을 기록하는 일기
  ```

- [ ] **설명** (4000자 이내):
  ```
  Mind Storage는 당신의 하루를 기록하고 돌아보는 감정 일기 앱입니다.

  ✨ 주요 기능
  • 행복했던 일과 속상했던 일을 각각 기록
  • 속상한 기억은 반창고로 가려서 보호
  • 년/월/일별 기록 확인
  • 자동 저장 기능
  • 안전한 클라우드 동기화

  💡 이런 분께 추천합니다
  • 감정을 글로 정리하고 싶은 분
  • 하루를 돌아보는 습관을 만들고 싶은 분
  • 속상한 일을 조금 더 가볍게 기록하고 싶은 분

  🔒 개인정보 보호
  • 모든 데이터는 안전하게 암호화되어 저장됩니다
  • 오직 본인만 접근 가능합니다
  ```

- [ ] **키워드** (100자 이내, 쉼표로 구분):
  ```
  일기,감정,기록,다이어리,일상,마음,힐링,감정일기
  ```

- [ ] **개인정보 처리방침 URL**:
  ```
  앱을 호스팅한 후 URL 입력
  예: https://yourdomain.com/privacy-policy.html
  ```

**예상 시간**: 1-2시간

---

### 8️⃣ 스크린샷 준비

필요한 화면 크기:
- 6.7인치 (iPhone 14 Pro Max): 1290 x 2796
- 6.5인치 (iPhone 11 Pro Max): 1242 x 2688

각 크기당 최소 3장, 최대 10장

- [ ] **스크린샷 1**: 메인/년도 선택 화면
- [ ] **스크린샷 2**: 월 선택 화면
- [ ] **스크린샷 3**: 일기 작성 화면
- [ ] **스크린샷 4**: 캘린더 뷰 (선택)
- [ ] **스크린샷 5**: 반창고 기능 (선택)

**촬영 방법**:
1. Xcode 시뮬레이터에서 앱 실행
2. 원하는 화면에서 Cmd+S
3. 또는 iPhone에서 앱 실행 후 스크린샷

**예상 시간**: 1-2시간

---

### 9️⃣ 카테고리 및 가격 설정

- [ ] **주 카테고리**: 라이프스타일
- [ ] **부 카테고리**: 건강 및 피트니스 (선택)
- [ ] **가격**: 무료
- [ ] **판매 지역**: 대한민국 (또는 전 세계)
- [ ] **연령 등급**: 4+ (모든 연령)

**예상 시간**: 10분

---

## 🚀 빌드 및 제출

### 🔟 Archive 생성

Xcode에서:

- [ ] 상단 메뉴: Product > Destination > "Any iOS Device"
- [ ] Product > Archive
- [ ] 빌드 완료 대기 (5-10분)
- [ ] Organizer 창이 자동으로 열림

**예상 시간**: 15-20분

---

### 1️⃣1️⃣ App Store Connect에 업로드

Organizer 창에서:

- [ ] "Distribute App" 클릭
- [ ] "App Store Connect" 선택
- [ ] "Upload" 선택
- [ ] 자동 서명 선택 (Automatically manage signing)
- [ ] "Upload" 클릭
- [ ] 업로드 완료 대기 (5-15분)

**예상 시간**: 20-30분

---

### 1️⃣2️⃣ 심사 제출

App Store Connect에서:

- [ ] 앱 선택
- [ ] "TestFlight" 탭에서 빌드 확인 (처리 중... → 준비 완료)
- [ ] "앱 스토어" 탭으로 이동
- [ ] "+ 버전" 또는 "1.0.0 준비 중" 클릭
- [ ] 빌드 선택
- [ ] 스크린샷 업로드
- [ ] 설명, 키워드 확인
- [ ] "심사를 위해 제출" 클릭
- [ ] 수출 규정 준수 질문 답변:
  - [ ] 암호화 사용하지 않음 (또는 사용 시 문서 제출)
  - [ ] 광고 식별자 사용하지 않음

**예상 시간**: 30분

---

## ⏰ 심사 대기

- [ ] 심사 제출 완료!
- [ ] 상태: "심사 대기 중"
- [ ] 예상 심사 기간: 1-3일

심사 중 앱 상태:
- ⏳ 심사 대기 중
- 🔍 심사 중
- ✅ 승인됨 → 앱스토어 출시!
- ❌ 거절됨 → 피드백 확인 후 재제출

---

## 📊 전체 소요 시간 요약

| 단계 | 예상 시간 |
|------|----------|
| 기술 설정 | 2-3시간 |
| 아이콘 제작 | 1-3시간 |
| 스크린샷 준비 | 1-2시간 |
| 앱 정보 작성 | 1-2시간 |
| 빌드 및 제출 | 1-2시간 |
| **총합** | **6-12시간** |
| 심사 대기 | 1-3일 |

---

## 🎉 완료!

모든 체크박스를 완료했다면 축하합니다! 🎊

이제 앱이 심사 중입니다. 결과를 기다려보세요!

---

## 🆘 문제 해결

### 자주 발생하는 문제

**"No suitable application records found"**
- Bundle ID가 App Store Connect와 일치하는지 확인

**"Code signing error"**
- Xcode > Preferences > Accounts에서 Apple ID 로그인
- Signing & Capabilities에서 Team 선택

**"Build failed"**
- `npm run build` 실행 후 `npx cap sync ios`
- Xcode Clean (Cmd+Shift+K) 후 재빌드

**"심사 거절"**
- 거절 사유 확인
- 필요한 수정 사항 반영
- 재제출 (새 버전 번호 사용)

---

## 📞 추가 도움

- [APP_STORE_GUIDE.md](./APP_STORE_GUIDE.md) - 상세 가이드
- [ICON_GUIDE.md](./ICON_GUIDE.md) - 아이콘 제작 가이드
- Apple Developer Support: https://developer.apple.com/contact/

**화이팅! 🚀**
