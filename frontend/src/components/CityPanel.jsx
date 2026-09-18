import React, { useState } from 'react';
import { Plus, ChevronsDown, ChevronsUp } from 'lucide-react';
import DayScheduleCard from './DayScheduleCard';
import StayTransCard from './StayTransCard';

export default function CityPanel({ city, onUpdateCity }) {
  // 일차별 펼침/닫힘 상태 (기본값: 전부 닫힘)
  const [openDays, setOpenDays] = useState({});
  const dayList = city.days || [];
  const allOpen = dayList.length > 0 && dayList.every((d) => openDays[d.id]);

  const handleToggleDay = (dayId) => {
    setOpenDays((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const handleToggleAll = () => {
    if (allOpen) {
      setOpenDays({});
    } else {
      const next = {};
      dayList.forEach((d) => { next[d.id] = true; });
      setOpenDays(next);
    }
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
      <div className="city-head">
        <div className="city-title-wrapper">
          <h2>{city.title}</h2>
          <span className="stay-badge">{city.dates}</span>
        </div>
      </div>

      <div className="city-tagline">{city.tagline}</div>

      {/* 날짜별 일정 리스트 */}
      <div className="days-container">
        {dayList.length > 0 && (
          <button type="button" className="btn-toggle-all" onClick={handleToggleAll}>
            {allOpen ? <ChevronsUp size={14} /> : <ChevronsDown size={14} />}
            <span>{allOpen ? '전체 접기' : '전체 펼치기'}</span>
          </button>
        )}

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

      {/* 숙소 & 다음 구간 */}
      <StayTransCard
        hotels={city.hotels}
        nextRoute={city.nextRoute}
        cityColor={city.color}
        onUpdateHotels={handleUpdateHotels}
        onUpdateNextRoute={handleUpdateNextRoute}
      />
    </section>
  );
}
