import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DayScheduleCard from './DayScheduleCard';
import StayTransCard from './StayTransCard';

export default function CityPanel({ city, onUpdateCity }) {
  // 도시 패널 내부 서브탭: 일정 / 숙소&다음구간
  const [subTab, setSubTab] = useState('schedule');

  // 일차별 펼침/닫힘 상태 (기본값: 전부 닫힘)
  const [openDays, setOpenDays] = useState({});
  const dayList = city.days || [];

  const handleToggleDay = (dayId) => {
    setOpenDays((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  // 일차별 업데이트
  const handleUpdateDay = (updatedDay) => {
    const updatedDays = city.days.map((d) => (d.id === updatedDay.id ? updatedDay : d));
    onUpdateCity({ ...city, days: updatedDays });
  };

  // 일차 삭제
  const handleDeleteDay = (dayId) => {
    const updatedDays = city.days.filter((d) => d.id !== dayId);
    onUpdateCity({ ...city, days: updatedDays });
  };

  // 새로운 일차 추가
  const handleAddNewDay = () => {
    const dayCount = (city.days ? city.days.length : 0) + 1;
    const newDay = {
      id: `${city.id}-${Date.now()}`,
      date: `Day ${dayCount}`,
      title: '새로운 일정',
      items: ['세부 일정 내용을 입력해주세요.'],
      tag: ''
    };
    const updatedDays = [...(city.days || []), newDay];
    onUpdateCity({ ...city, days: updatedDays });
  };

  // 숙소 업데이트
  const handleUpdateHotels = (updatedHotels) => {
    onUpdateCity({ ...city, hotels: updatedHotels });
  };

  // 다음 구간 업데이트
  const handleUpdateNextRoute = (newRoute) => {
    onUpdateCity({ ...city, nextRoute: newRoute });
  };

  return (
    <section className="city" style={{ '--c': city.color || 'var(--accent)' }}>
      <div className="city-static-header">
        <span className="city-summary-title">{city.title}</span>
        <span className="stay-badge">{city.dates}</span>
      </div>

      <div className="city-panel-body">
        <div className="city-tagline">{city.tagline}</div>

        {/* 도시 내부 서브탭 */}
        <div className="sub-tabbar" style={{ '--c': city.color }} role="tablist">
          <button
            type="button"
            className="sub-tab-btn"
            aria-selected={subTab === 'schedule'}
            onClick={() => setSubTab('schedule')}
          >
            일정
          </button>
          <button
            type="button"
            className="sub-tab-btn"
            aria-selected={subTab === 'stay'}
            onClick={() => setSubTab('stay')}
          >
            숙소 &amp; 다음 구간 정보
          </button>
        </div>

        {subTab === 'schedule' && (
          /* 날짜별 일정 리스트 */
          <div className="days-container">
            {dayList.map((day) => (
              <DayScheduleCard
                key={day.id}
                day={day}
                cityColor={city.color}
                isOpen={!!openDays[day.id]}
                onToggleOpen={() => handleToggleDay(day.id)}
                onUpdateDay={handleUpdateDay}
                onDeleteDay={handleDeleteDay}
              />
            ))}

            <button
              type="button"
              className="btn-add-day-card"
              onClick={handleAddNewDay}
            >
              <Plus size={16} /> <span>새로운 일차(Day) 추가</span>
            </button>
          </div>
        )}

        {subTab === 'stay' && (
          /* 숙소 & 다음 구간 */
          <StayTransCard
            hotels={city.hotels}
            nextRoute={city.nextRoute}
            cityColor={city.color}
            stayDates={city.dates}
            onUpdateHotels={handleUpdateHotels}
            onUpdateNextRoute={handleUpdateNextRoute}
          />
        )}
      </div>
    </section>
  );
}
