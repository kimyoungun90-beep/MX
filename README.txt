미디어 통합 버전 v10

이 버전은 한 화면에서 이미지 / 영상 / 3D(GLB)를 모두 지원합니다.

1. GitHub MX 저장소 업로드
- index.html
- styles.css
- app.js
- config.js
- assets 폴더 전체

2. 추가 파일 업로드 위치
- 영상 파일: assets/videos/
- 3D 파일(GLB): assets/models/

예시
- https://mx-dfl.pages.dev/assets/videos/fold8-ultra-white-bg-h264.mp4
- https://mx-dfl.pages.dev/assets/models/galaxy-z-fold8-approx.glb

3. Apps Script 적용
- 확장 프로그램 > Apps Script
- Code.gs 전체 교체
- 저장
- 배포 > 배포 관리 > 수정 > 새 버전 > 배포
- 구글시트 새로고침
- 재고 관리 > 미디어 설정 시트 만들기

4. 미디어설정 시트 사용법
열 구조:
model | use_media | media_type | media_url | rotation_speed

- use_media: 체크하면 사용
- media_type:
  - image : 기본 PNG 사용
  - video : mp4/webm 영상 사용
  - 3d    : glb 3D 파일 사용
- media_url:
  - video면 공개 영상 주소
  - 3d면 공개 glb 주소
- rotation_speed:
  - 3d 자동 회전 속도 예: 20deg, 24deg, 30deg

5. 예시 입력
Galaxy Z Fold8 | TRUE | 3d | https://mx-dfl.pages.dev/assets/models/galaxy-z-fold8-approx.glb | 24deg
Galaxy Z Fold8 Ultra | TRUE | video | https://mx-dfl.pages.dev/assets/videos/fold8-ultra-white-bg-h264.mp4 | 30deg

6. 확인 주소
https://mx-dfl.pages.dev/?store=851&v=10
