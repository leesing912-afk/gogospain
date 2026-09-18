import React from 'react';

const INFO_TAB_IDS = ['budget', 'review', 'notice', 'checklist'];

function TabRow({ tabs, activeTab, onSelectTab }) {
  return (
    <div className="tabbar-inner" role="tablist">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className="tab-btn"
            role="tab"
            aria-selected={isSelected}
            style={{ '--c': tab.color }}
            onClick={() => onSelectTab(tab.id)}
          >
            <span className="t-label">{tab.label}</span>
            <span className="t-sub">{tab.sub}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function TabBar({ tabs, activeTab, onSelectTab }) {
  const cityTabs = tabs.filter((t) => !INFO_TAB_IDS.includes(t.id));
  const infoTabs = tabs.filter((t) => INFO_TAB_IDS.includes(t.id));

  return (
    <div className="tabbar">
      <div className="tabbar-group">
        <span className="tabbar-group-label">도시별 일정</span>
        <TabRow tabs={cityTabs} activeTab={activeTab} onSelectTab={onSelectTab} />
      </div>

      <div className="tabbar-group tabbar-group-info">
        <span className="tabbar-group-label">여행 정보</span>
        <TabRow tabs={infoTabs} activeTab={activeTab} onSelectTab={onSelectTab} />
      </div>
    </div>
  );
}
