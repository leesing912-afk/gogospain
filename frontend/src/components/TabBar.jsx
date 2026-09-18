import React from 'react';

export default function TabBar({ tabs, activeTab, onSelectTab }) {
  return (
    <div className="tabbar">
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
    </div>
  );
}
