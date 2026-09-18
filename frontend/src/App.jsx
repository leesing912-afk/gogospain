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
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const unsubscribe = initPlanSubscription(
      (updatedData) => setPlanData(updatedData),
      (msg) => setStatusMessage(msg)
    );

    try {
      const savedTab = localStorage.getItem('hm_active_tab');
      if (savedTab) setActiveTab(savedTab);
    } catch (e) {}

    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, []);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    try { localStorage.setItem('hm_active_tab', tabId); } catch (e) {}
  };

  const handleUpdatePlan = (updatedPlan) => {
    setPlanData(updatedPlan);
    savePlanData(updatedPlan);
  };

  const handleResetPlan = async () => {
    const restored = await resetToDefault();
    setPlanData(restored);
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
      <HeaderPass
        headerPass={planData.headerPass}
        onUpdate={(updatedPass) => handleUpdatePlan({ ...planData, headerPass: updatedPass })}
      />

      <OverviewTable
        overview={planData.overview}
        onUpdate={(updatedOverview) => handleUpdatePlan({ ...planData, overview: updatedOverview })}
      />

      <DataToolbar
        planData={planData}
        onUpdatePlan={handleUpdatePlan}
        onResetPlan={handleResetPlan}
        statusMessage={statusMessage}
      />

      <TabBar
        tabs={planData.tabs}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

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
        <p>🇪🇸 스페인 &amp; 🇵🇹 포르투갈 15일 이베리아 신혼여행 플래너</p>
      </footer>
    </div>
  );
}
