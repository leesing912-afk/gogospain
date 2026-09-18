import React, { useState, useEffect } from 'react';
import HeaderPass from './components/HeaderPass';
import OverviewTable from './components/OverviewTable';
import TabBar from './components/TabBar';
import CityPanel from './components/CityPanel';
import BudgetPanel from './components/BudgetPanel';
import ReviewPanel from './components/ReviewPanel';
import NoticePanel from './components/NoticePanel';
import ChecklistPanel from './components/ChecklistPanel';
import DataToolbar from './components/DataToolbar';
import { initPlanSubscription, savePlanData, resetToDefault } from './services/api';
import { initialPlanData } from './data/defaultPlan';
import './App.css';

export default function App() {
  const [planData, setPlanData] = useState(initialPlanData);
  const [activeTab, setActiveTab] = useState('bcn');
  const [statusMsg, setStatusMsg] = useState('클라우드 DB에 연결하는 중...');

  useEffect(() => {
    // 1. Firebase 실시간 동기화 구독 시작
    const unsubscribe = initPlanSubscription(
      (updatedData) => {
        setPlanData(updatedData);
      },
      (status) => {
        setStatusMsg(status);
      }
    );

    // 이전 선택 탭 복원
    try {
      const savedTab = localStorage.getItem('hm_active_tab');
      if (savedTab) setActiveTab(savedTab);
    } catch (e) {}

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    try {
      localStorage.setItem('hm_active_tab', tabId);
    } catch (e) {}
  };

  const handleUpdatePlan = (updatedPlan) => {
    setPlanData(updatedPlan);
    savePlanData(updatedPlan);
  };

  const handleResetPlan = async () => {
    const defaultData = await resetToDefault();
    setPlanData(defaultData);
    setStatusMsg('초기 기본 일정으로 복원되었습니다 🔄');
  };

  if (!planData) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>이베리아 신혼여행 일정을 불러오는 중입니다...</p>
      </div>
    );
  }

  const currentCity = planData.cities ? planData.cities[activeTab] : null;

  return (
    <div className="container">
      {/* 데이터 관리 툴바 (JSON/메모장 즉시 저장, 불러오기, 초기화) */}
      <DataToolbar
        planData={planData}
        onUpdatePlan={handleUpdatePlan}
        onResetPlan={handleResetPlan}
        statusMessage={statusMsg}
      />

      {/* 상단 보딩패스 티켓 */}
      <HeaderPass
        headerPass={planData.headerPass}
        onUpdate={(updatedPass) => handleUpdatePlan({ ...planData, headerPass: updatedPass })}
      />

      {/* 한눈에 보기 요약 아코디언 */}
      <OverviewTable
        overview={planData.overview}
        onUpdate={(updatedOverview) => handleUpdatePlan({ ...planData, overview: updatedOverview })}
      />

      {/* 탭 네비게이션 */}
      <TabBar
        tabs={planData.tabs}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* 탭별 메인 컨텐츠 패널 */}
      <main className="tab-content-area">
        {currentCity && (
          <CityPanel
            city={currentCity}
            onUpdateCity={(updatedCity) => {
              const updatedCities = { ...planData.cities, [activeTab]: updatedCity };
              handleUpdatePlan({ ...planData, cities: updatedCities });
            }}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPanel
            budget={planData.budget}
            onUpdateBudget={(updatedBudget) => handleUpdatePlan({ ...planData, budget: updatedBudget })}
          />
        )}

        {activeTab === 'review' && (
          <ReviewPanel
            review={planData.review}
            onUpdateReview={(updatedReview) => handleUpdatePlan({ ...planData, review: updatedReview })}
          />
        )}

        {activeTab === 'notice' && (
          <NoticePanel
            notices={planData.notices}
            onUpdateNotices={(updatedNotices) => handleUpdatePlan({ ...planData, notices: updatedNotices })}
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistPanel
            checklist={planData.checklist}
            onUpdateChecklist={(updatedChecklist) =>
              handleUpdatePlan({ ...planData, checklist: updatedChecklist })
            }
          />
        )}
      </main>

      <footer>
        <p>🇪🇸 스페인 &amp; 🇵🇹 포르투갈 15일 이베리아 신혼여행 투어 가이드 플래너</p>
        <p className="footer-sub">모든 수정사항은 Firebase 클라우드 DB 및 로컬 브라우저에 실시간으로 안전하게 동기화됩니다.</p>
      </footer>
    </div>
  );
}
