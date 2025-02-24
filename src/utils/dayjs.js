// src/utils/dayjs.js
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // UTC 플러그인
import timezone from 'dayjs/plugin/timezone'; // 타임존 플러그인

// 플러그인 활성화
dayjs.extend(utc);
dayjs.extend(timezone);

// 전역 설정 (옵션)
dayjs.tz.setDefault('Asia/Seoul'); // 기본 타임존 설정 (예: 서울)

export default dayjs;
