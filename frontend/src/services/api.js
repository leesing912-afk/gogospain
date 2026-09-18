import { initialPlanData } from '../data/defaultPlan';
import { subscribePlan, savePlanToFirebase, resetPlanInFirebase } from './firebase';

const STORAGE_KEY = 'honeymoon_plan_data_v1';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * 실시간 플랜 구독 설정:
 * 1. Firebase Firestore 실시간 구독 시도 (모든 사람에게 즉시 반영)
 * 2. 실패 시 LocalStorage에서 로드
 */
export function initPlanSubscription(onUpdate, onStatusChange) {
  // 1. LocalStorage의 캐시가 있으면 즉시 화면에 먼저 띄워 로딩 속도 극대화
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      onUpdate(JSON.parse(cached));
    }
  } catch (e) {}

  // 2. Firebase 실시간 리스너 연결
  try {
    onStatusChange('🔥 Firebase 클라우드 DB 연결 중...');
    const unsubscribe = subscribePlan(
      (cloudData) => {
        if (cloudData && cloudData.cities) {
          // 로컬 캐시 갱신
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
          } catch (e) {}
          onUpdate(cloudData);
          onStatusChange('🔥 Firebase 클라우드 DB 실시간 연결됨 (모든 사람과 실시간 공유 중) 🟢');
        }
      },
      (error) => {
        console.warn('Firebase 연결 실패, 로컬 모드로 전환:', error);
        onStatusChange('브라우저 로컬 저장소 모드로 작동 중 ⚡');
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Firebase 초기화 실패:', err);
    onStatusChange('브라우저 로컬 저장소 모드로 작동 중 ⚡');
    return () => {};
  }
}

/**
 * 여행 데이터 저장:
 * 1. Firebase Firestore에 저장 (클라우드 DB)
 * 2. LocalStorage에 동시 보관 (오프라인 캐시)
 * 3. Spring Boot 백엔드가 있으면 백엔드 파일에도 동기화
 */
export async function savePlanData(data) {
  // 1. LocalStorage 즉시 저장
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage save failed', err);
  }

  // 2. Firebase 클라우드 DB 저장 (핵심: 모든 사람과 실시간 공유)
  try {
    await savePlanToFirebase(data);
  } catch (err) {
    console.warn('Firebase 저장 중 경고 (로컬에는 저장됨):', err);
  }

  // 3. Spring Boot 로컬 백엔드가 있으면 백엔드 파일에도 기록
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    fetch(`${API_BASE_URL}/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
  } catch (e) {}

  return true;
}

/**
 * 기본 일정으로 초기화
 */
export async function resetToDefault() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPlanData));
  } catch (e) {}

  try {
    await resetPlanInFirebase();
  } catch (e) {}

  return initialPlanData;
}
