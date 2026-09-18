import React, { useState, useEffect } from 'react';
import { Wallet, Scale, AlertTriangle, ListChecks, X } from 'lucide-react';
import HeaderPass from './components/HeaderPass';
import OverviewTable from './components/OverviewTable';
import TopSection from './components/TopSection';
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

const CITY_TAB_IDS = ['bcn', 'gra', 'sev', 'lis', 'opo'];

const INFO_CARDS = [
  { id: 'budget', label: '예산', sub: '비용 정리', icon: Wallet, color: 'var(--accent)' },
  { id: 'review', label: '장단점', sub: '요약', icon: Scale, color: 'var(--accent)' },
  { id: 'notice', label: '주의사항', sub: '체크포인트', icon: AlertTriangle, color: 'var(--warn)' },
  { id: 'checklist', label: '체크리스트', sub: '준비물 점검', icon: ListChecks, color: 'var(--good)' }
];

export default function App() {
  const [planData, setPlanData] = useState(initialPlanData);
  const [activeTab, setActiveTab] = useState('bcn');
  const [statusMessage, setStatusMessage] = useState('');
  const [infoModal, setInfoModal] = useState(null); // 'budget' | 'review' | 'notice' | 'checklist' | null

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

      <TopSection title="세부일정">
        <TabBar
          tabs={planData.tabs.filter((t) => CITY_TAB_IDS.includes(t.id))}
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
        </main>
      </TopSection>

      {/* 여행 정보: 도시별 일정과 분리된 카드 → 클릭 시 모달로 열림 */}
      <TopSection title="기타사항">
        <section className="info-cards-section">
          <div className="info-cards-grid">
            {INFO_CARDS.map(({ id, label, sub, icon: Icon, color }) => (
              <button
                key={id}
                type="button"
                className="info-card"
                style={{ '--c': color }}
                onClick={() => setInfoModal(id)}
              >
                <Icon size={22} />
                <span className="info-card-label">{label}</span>
                <span className="info-card-sub">{sub}</span>
              </button>
            ))}
          </div>
        </section>
      </TopSection>

      {infoModal && (
        <div className="modal-overlay" onClick={() => setInfoModal(null)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{INFO_CARDS.find((c) => c.id === infoModal)?.label}</h3>
              <button type="button" className="close-btn" onClick={() => setInfoModal(null)}>
                <X size={18} />
              </button>
            </div>

            {infoModal === 'budget' && (
              <BudgetPanel
                budget={planData.budget}
                onUpdateBudget={(updatedBudget) => handleUpdatePlan({ ...planData, budget: updatedBudget })}
              />
            )}
            {infoModal === 'review' && (
              <ReviewPanel
                review={planData.review}
                onUpdateReview={(updatedReview) => handleUpdatePlan({ ...planData, review: updatedReview })}
              />
            )}
            {infoModal === 'notice' && (
              <NoticePanel
                notices={planData.notices}
                onUpdateNotices={(updatedNotices) => handleUpdatePlan({ ...planData, notices: updatedNotices })}
              />
            )}
            {infoModal === 'checklist' && (
              <ChecklistPanel
                checklist={planData.checklist}
                onUpdateChecklist={(updatedChecklist) =>
                  handleUpdatePlan({ ...planData, checklist: updatedChecklist })
                }
              />
            )}
          </div>
        </div>
      )}

      <footer className="app-footer">
        <DataToolbar
          planData={planData}
          onUpdatePlan={handleUpdatePlan}
          onResetPlan={handleResetPlan}
          statusMessage={statusMessage}
        />
      </footer>
    </div>
  );
}
