# Mind Storage 앱스토어 출시 가이드

## 📱 현재 상태
✅ 로그인 로직 수정 완료
- 처음 로그인/가입 시 → 년도 화면 표시
- 데이터가 있는 경우 → 현재 달 화면 표시

✅ Capacitor 설정 파일 준비 완료

---

## 🚀 앱스토어 출시 단계

### 1단계: Capacitor 설치 및 설정 (10분)

터미널에서 프로젝트 폴더로 이동 후 실행:

```bash
cd /Users/jisooshin/Desktop/file/project/mind_storage

# Capacitor 설치
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios

# Capacitor 초기화
npx cap init "Mind Storage" "com.mindstorage.app" --web-dir=dist

# iOS 플랫폼 추가
npx cap add ios
```

### 2단계: 앱 아이콘 준비 (필수!)

앱 아이콘을 준비해야 합니다:

#### 옵션 1: 직접 만들기
1. 1024x1024 PNG 이미지 준비
2. `resources` 폴더에 `icon.png`로 저장
3. 아이콘 생성 도구 사용:
   ```bash
   npm install -g @capacitor/assets
   npx capacitor-assets generate --ios
   ```

#### 옵션 2: 온라인 도구 사용
- https://icon.kitchen/ 또는 https://appicon.co/
- 1024x1024 이미지 업로드
- iOS 아이콘 세트 다운로드
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/`에 복사

### 3단계: 앱 빌드 및 동기화 (5분)

```bash
# 웹 앱 빌드
npm run build

# iOS 프로젝트에 동기화
npx cap sync ios

# Xcode에서 프로젝트 열기
npx cap open ios
```

### 4단계: Xcode 설정 (10-20분)

Xcode가 열리면:

1. **왼쪽 상단 "App" 프로젝트 클릭**

2. **"Signing & Capabilities" 탭에서:**
   - Team: 본인의 Apple Developer 계정 선택
   - Bundle Identifier: `com.mindstorage.app` (또는 원하는 이름으로 변경)

3. **"General" 탭에서:**
   - Display Name: "Mind Storage" (앱 이름)
   - Version: 1.0.0
   - Build: 1
   - Deployment Target: iOS 13.0 이상

4. **개인정보 보호 설정:**
   - `ios/App/App/Info.plist` 파일 열기
   - 필요한 권한 설명 추가 (예: 카메라, 사진 등)

### 5단계: 실제 기기에서 테스트 (10분)

1. iPhone을 Mac에 USB로 연결
2. Xcode 상단에서 본인의 iPhone 선택
3. ▶️ 버튼 클릭 (또는 Cmd+R)
4. iPhone에서 "설정 > 일반 > VPN 및 기기 관리"에서 개발자 신뢰

### 6단계: 앱스토어 제출 준비

#### 6-1. Apple Developer 계정 필요
- https://developer.apple.com
- 연간 $99 (약 129,000원)

#### 6-2. App Store Connect 설정
1. https://appstoreconnect.apple.com 접속
2. "나의 앱" → "+" → "새로운 앱"
3. 앱 정보 입력:
   - 앱 이름: Mind Storage
   - 기본 언어: 한국어
   - 번들 ID: com.mindstorage.app
   - SKU: 고유 식별자 (예: MINDSTORAGE001)

#### 6-3. 앱 스크린샷 준비 (필수)
필요한 화면 크기:
- 6.7인치 (iPhone 14 Pro Max): 1290 x 2796
- 6.5인치 (iPhone 11 Pro Max): 1242 x 2688
- 5.5인치 (iPhone 8 Plus): 1242 x 2208

최소 3장, 최대 10장

#### 6-4. 앱 설명 작성
- 제목 (30자 이내)
- 부제 (30자 이내)
- 설명 (4000자 이내)
- 키워드 (100자 이내)
- 개인정보 처리방침 URL

#### 6-5. Archive 생성 및 제출
```bash
# Xcode에서:
# 1. Product > Archive
# 2. 빌드 완료되면 자동으로 Organizer 창 열림
# 3. "Distribute App" 클릭
# 4. "App Store Connect" 선택
# 5. "Upload" 선택
# 6. 자동 서명 또는 수동 서명 선택
# 7. "Upload" 클릭
```

### 7단계: 앱 심사 제출

1. App Store Connect에서 앱 선택
2. "TestFlight" 탭에서 빌드 확인
3. "앱 스토어" 탭에서:
   - 빌드 선택
   - 스크린샷 업로드
   - 앱 설명 입력
   - 가격 및 판매 지역 설정
4. "심사를 위해 제출" 클릭

---

## 💡 팁과 주의사항

### 앱 이름 (Bundle ID) 변경하려면:
`capacitor.config.json` 파일에서:
```json
{
  "appId": "com.yourname.mindstorage"  // 여기를 수정
}
```

### 로컬에서 빠르게 테스트:
```bash
npm run ios:build  # 빌드 + 동기화 + Xcode 열기 (한 번에!)
```

### 코드 수정 후:
```bash
npm run build       # 웹 빌드
npx cap sync ios    # iOS에 동기화
# Xcode에서 재실행
```

### 문제 해결:
- **"Failed to build"**: `node_modules` 삭제 후 `npm install` 재실행
- **"Developer not found"**: Xcode > Preferences > Accounts에서 Apple ID 로그인
- **"Signing error"**: Bundle ID가 고유한지 확인 (다른 사람이 사용 중일 수 있음)

---

## 📋 체크리스트

- [ ] Capacitor 설치 완료
- [ ] iOS 플랫폼 추가 완료
- [ ] 앱 아이콘 준비 (1024x1024)
- [ ] 실제 기기에서 테스트 완료
- [ ] Apple Developer 계정 등록
- [ ] 앱 스크린샷 준비 (최소 3장)
- [ ] 앱 설명 및 키워드 작성
- [ ] 개인정보 처리방침 페이지 준비
- [ ] Archive 생성 및 업로드
- [ ] 심사 제출

---

## 🎉 예상 소요 시간
- 기술적 설정: 1-2시간
- 아이콘/스크린샷 준비: 2-4시간
- 앱스토어 등록 및 제출: 2-3시간
- 심사 대기: 1-3일

**총 예상 시간: 약 5-9시간 + 심사 대기**

---

## 🆘 도움이 필요하면
- [Capacitor 공식 문서](https://capacitorjs.com/docs)
- [App Store Connect 가이드](https://developer.apple.com/app-store-connect/)
- 문제가 생기면 언제든지 질문하세요!
