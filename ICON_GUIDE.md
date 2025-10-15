# 📱 앱 아이콘 생성 가이드

앱스토어에 출시하려면 앱 아이콘이 필수입니다!

## 🎨 아이콘 요구사항

- **크기**: 1024 x 1024 픽셀
- **형식**: PNG (투명 배경 없이)
- **내용**: 앱을 대표하는 심플한 디자인
- **모서리**: 둥글게 처리하지 마세요 (iOS가 자동으로 처리)

## 💡 디자인 아이디어

Mind Storage 앱의 컨셉에 맞는 아이콘:

1. **뇌 아이콘** 🧠
   - 심플한 뇌 실루엣
   - 색상: 검정색 + 흰색 배경

2. **일기장 + 감정**
   - 노트북에 😊 😢 이모지
   - 미니멀한 스타일

3. **반창고 모티브**
   - 교차된 반창고 디자인
   - 앱의 "치유" 컨셉 강조

4. **캘린더 + 하트**
   - 날짜와 감정을 동시에 표현

## 🛠️ 아이콘 제작 도구

### 온라인 도구 (무료)
1. **Canva** (추천!)
   - https://www.canva.com
   - 템플릿: "App Icon" 검색
   - 1024x1024 크기 선택
   - 무료로 간단하게 제작 가능

2. **Figma**
   - https://www.figma.com
   - 전문적인 디자인 도구
   - 무료 계정으로 사용 가능

3. **Adobe Express**
   - https://www.adobe.com/express
   - 간단한 로고 메이커

### AI 도구
1. **DALL-E 3** (ChatGPT Plus)
   - 프롬프트 예시: "minimalist app icon for a diary app, brain icon, black and white, simple design, 1024x1024"

2. **Midjourney**
   - 프롬프트: "/imagine app icon, minimal, diary, emotions, flat design"

## 📥 아이콘 저장 위치

아이콘을 만든 후:

```bash
# 이 폴더에 icon.png로 저장
resources/icon.png
```

## 🚀 아이콘 적용하기

### 방법 1: 자동 생성 (추천)

```bash
# 아이콘 생성 도구 설치
npm install -g @capacitor/assets

# resources/icon.png 파일 준비 후
npx capacitor-assets generate --ios
```

### 방법 2: 수동 복사

1. 온라인 도구로 iOS 아이콘 세트 생성:
   - https://appicon.co
   - https://icon.kitchen
   
2. 다운로드한 아이콘을 다음 위치에 복사:
   ```
   ios/App/App/Assets.xcassets/AppIcon.appiconset/
   ```

## ✅ 체크리스트

- [ ] 1024x1024 PNG 아이콘 제작
- [ ] `resources/icon.png`에 저장
- [ ] `npx capacitor-assets generate --ios` 실행
- [ ] Xcode에서 아이콘 확인

## 🎨 디자인 팁

1. **심플하게**: 복잡한 디테일은 작은 크기에서 보이지 않음
2. **대비 높게**: 배경과 명확하게 구분되는 색상 사용
3. **텍스트 최소화**: 작은 아이콘에서는 텍스트가 잘 안 보임
4. **테스트**: 다양한 크기로 축소해서 확인

## 📱 앱스토어 스크린샷도 필요해요!

아이콘 외에도 스크린샷이 필요합니다:

### 필요한 크기
- 6.7인치: 1290 x 2796
- 6.5인치: 1242 x 2688
- 5.5인치: 1242 x 2208

### 스크린샷 찍는 방법
1. Xcode 시뮬레이터에서 앱 실행
2. Cmd + S 로 스크린샷 저장
3. 최소 3장, 최대 10장 준비

### 스크린샷 내용
- 메인 화면
- 날짜 선택 화면
- 일기 작성 화면
- 캘린더 뷰

## 🆘 도움말

아이콘 제작이 어려우면:
1. Canva에서 "App Icon" 템플릿 검색
2. 간단한 기호나 이모지 사용
3. 배경색 + 중앙 심볼만으로도 충분!

예시:
- 흰색 배경 + 검정 뇌 아이콘 🧠
- 파스텔 배경 + 반창고 모양 🩹
- 그라데이션 배경 + 하트 ❤️
