# 코스트코 Galaxy 실시간 재고 화면

이 프로젝트는 구글시트의 점포별 재고를 읽어서 M7 모니터에 표시합니다.

## 포함된 품목

### 휴대폰
- 696801 Galaxy Z Flip8 핑크
- 696802 Galaxy Z Flip8 그라파이트
- 696803 Galaxy Z Flip8 크림
- 696804 Galaxy Z Fold8 라벤더
- 696805 Galaxy Z Fold8 그라파이트
- 696806 Galaxy Z Fold8 크림
- 696807 Galaxy Z Fold8 Ultra 그라파이트
- 696808 Galaxy Z Fold8 Ultra 바이올렛
- 696809 Galaxy Z Fold8 Ultra 크림

### 워치
- 696911 Galaxy Watch9 40mm 그라파이트
- 696912 Galaxy Watch9 40mm 크림
- 696913 Galaxy Watch9 44mm 그라파이트
- 696914 Galaxy Watch9 44mm 실버
- 696915 Galaxy Watch Ultra2 블랙
- 696916 Galaxy Watch Ultra2 화이트

---

## 1. 구글시트 만들기

1. 새 구글시트를 만듭니다.
2. 아래쪽 시트 탭 이름을 `재고현황`으로 변경합니다.
3. `sample-data.csv`를 열어서 전체 내용을 복사합니다.
4. 구글시트 `A1` 셀에 붙여넣습니다.
5. 각 점포별로 행을 복사하고 `store_code`, `store_name`, `quantity`를 수정합니다.

필수 헤더는 아래 순서입니다.

```text
store_code | store_name | item_code | model | color | quantity | updated_at
```

점포 예시:

```text
851 | 코스트코 대구점
852 | 코스트코 대전점
58  | 코스트코 세종점
59  | 코스트코 혁신점
```

---

## 2. Apps Script 넣기

1. 구글시트 상단 메뉴에서 `확장 프로그램`
2. `Apps Script`
3. 기존 `Code.gs` 내용을 모두 삭제
4. 이 폴더의 `apps-script/Code.gs` 내용을 붙여넣기
5. 상단 `저장`

### 웹 앱 배포

1. 우측 상단 `배포`
2. `새 배포`
3. 유형 선택에서 `웹 앱`
4. 다음 사용자로 실행: `나`
5. 액세스 권한: `모든 사용자`
6. `배포`
7. 생성된 `/exec` 주소를 복사

주의: 이 웹 앱은 재고 데이터만 읽습니다. 개인정보는 시트에 넣지 마세요.

---

## 3. 화면 코드에 Apps Script URL 넣기

`config.js`를 열고 아래 항목에 배포 주소를 붙여넣습니다.

```js
window.STOCK_CONFIG = {
  API_URL: "여기에 Apps Script /exec 주소",
  REFRESH_MS: 10000,
  DEFAULT_STORE_CODE: "851",
  DEFAULT_STORE_NAME: "코스트코 대구점"
};
```

---

## 4. Cloudflare Pages 또는 기존 Item HUB에 올리기

### 별도 폴더로 넣는 경우

기존 저장소 안에 아래처럼 폴더를 추가합니다.

```text
stock-display/
  index.html
  styles.css
  app.js
  config.js
  assets/
```

배포 후 주소 예시:

```text
https://itemhub.pages.dev/stock-display/?store=851
```

### 점포별 주소

```text
대구점: https://itemhub.pages.dev/stock-display/?store=851
대전점: https://itemhub.pages.dev/stock-display/?store=852
세종점: https://itemhub.pages.dev/stock-display/?store=58
혁신점: https://itemhub.pages.dev/stock-display/?store=59
```

---

## 5. 가로형·세로형 자동 전환

별도의 가로형·세로형 주소를 사용하지 않습니다.

M7 화면을 회전하거나 화면 방향이 바뀌면 웹페이지가 자동으로 레이아웃을 변경합니다.

점포별로 아래 주소 하나만 사용하면 됩니다.

```text
https://itemhub.pages.dev/stock-display/?store=851
```

점포마다 `store=` 뒤의 점포코드만 바꿉니다.

```text
대구점: https://itemhub.pages.dev/stock-display/?store=851
대전점: https://itemhub.pages.dev/stock-display/?store=852
세종점: https://itemhub.pages.dev/stock-display/?store=58
혁신점: https://itemhub.pages.dev/stock-display/?store=59
```

화면이 가로이면 가로형으로, 세로이면 세로형으로 자동 변경됩니다.

---

## 6. M7에서 띄우기

1. M7을 Wi-Fi에 연결합니다.
2. `인터넷` 앱을 실행합니다.
3. 해당 점포 URL을 입력합니다.
4. 즐겨찾기에 등록합니다.
5. 전체 화면으로 표시합니다.

M7 화면이 재시작되었을 때 자동으로 다시 열리지 않으면 인터넷 앱의 최근 페이지나 즐겨찾기에서 다시 실행해야 합니다.

---

## 7. 수량 변경 방법

구글시트의 `quantity` 열 숫자만 수정합니다.

예:

```text
696801 핑크 3대 → 판매 후 2대로 수정
```

화면은 기본 10초마다 다시 불러옵니다.

`updated_at`에는 다음처럼 입력합니다.

```text
2026-07-23 11:30
```

---

## 8. 제품 이미지 교체

현재 `assets` 폴더 이미지는 시안용입니다. 공식 누끼 PNG를 받으면 아래 파일명으로 덮어쓰면 됩니다.

```text
flip8.png
fold8.png
fold8-ultra.png
watch9-40.png
watch9-44.png
watch-ultra2.png
```

파일명만 유지하면 코드 수정은 필요 없습니다.
