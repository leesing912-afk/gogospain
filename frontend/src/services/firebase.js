import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { initialPlanData } from '../data/defaultPlan';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAivrsVK1v3V5RPwoPVpM6IZCu_-LJznog",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gogospain-940b6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gogospain-940b6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gogospain-940b6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "690875987743",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:690875987743:web:ad8ba1ca8605344844a22a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-N2YVYBMMR8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const PLAN_DOC_REF = doc(db, 'honeymoon', 'main_plan');

/**
 * Firebase Firestore 실시간 구독 (모든 기기/사용자 실시간 동기화)
 */
export function subscribePlan(onData, onError) {
  return onSnapshot(
    PLAN_DOC_REF,
    async (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        onData(cloudData);
      } else {
        // Firestore에 데이터가 아직 없는 초기 상태면 initialPlanData로 생성
        try {
          await setDoc(PLAN_DOC_REF, initialPlanData);
          onData(initialPlanData);
        } catch (err) {
          console.error('초기 데이터 Firestore 생성 실패', err);
          if (onError) onError(err);
        }
      }
    },
    (err) => {
      console.error('Firestore 실시간 리스너 오류:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Firebase Firestore에 여행 계획 저장
 */
export async function savePlanToFirebase(planData) {
  try {
    await setDoc(PLAN_DOC_REF, planData);
    return true;
  } catch (err) {
    console.error('Firestore 저장 실패:', err);
    throw err;
  }
}

/**
 * Firebase Firestore 초기화 (기본 일정으로 복원)
 */
export async function resetPlanInFirebase() {
  try {
    await setDoc(PLAN_DOC_REF, initialPlanData);
    return initialPlanData;
  } catch (err) {
    console.error('Firestore 초기화 실패:', err);
    throw err;
  }
}
