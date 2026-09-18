import React, { useState } from 'react';
import { Plus, Edit2, Check, X } from 'lucide-react';
import DayScheduleCard from './DayScheduleCard';
import StayTransCard from './StayTransCard';

export default function CityPanel({ city, onUpdateCity }) {
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerData, setHeaderData] = useState({
    title: city.title,
    dates: city.dates,
    tagline: city.tagline
  });

  const handleSaveHeader = (e) => {
    e.preventDefault();
    onUpdateCity({
      ...city,
      title: headerData.title,
      dates: headerData.dates,
      tagline: headerData.tagline
    });
    setIsEditingHeader(false);
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
        <button
          type="button"
          className="icon-action-btn edit"
          onClick={() => {
            setHeaderData({ title: city.title, dates: city.dates, tagline: city.tagline });
            setIsEditingHeader(!isEditingHeader);
          }}
          title="도시 기본 정보 수정"
        >
          <Edit2 size={14} /> <span>도시 정보 수정</span>
        </button>
      </div>

      {isEditingHeader && (
        <form onSubmit={handleSaveHeader} className="city-header-edit-form">
          <div className="form-row">
            <input
              type="text"
              value={headerData.title}
              placeholder="도시명 (예: 바르셀로나)"
              onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
              required
            />
            <input
              type="text"
              value={headerData.dates}
              placeholder="일정 기간 (예: 4/18(일)~4/22(목))"
              onChange={(e) => setHeaderData({ ...headerData, dates: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={headerData.tagline}
              placeholder="도시 한줄 소개 및 가이드 팁"
              onChange={(e) => setHeaderData({ ...headerData, tagline: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-confirm">
              <Check size={14} /> 저장
            </button>
            <button type="button" className="btn-cancel" onClick={() => setIsEditingHeader(false)}>
              <X size={14} /> 취소
            </button>
          </div>
        </form>
      )}

      <div className="city-tagline">{city.tagline}</div>

      {/* 날짜별 일정 리스트 */}
      <div className="days-container">
        {city.days && city.days.map((day) => (
          <DayScheduleCard
            key={day.id}
            day={day}
            cityColor={city.color}
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
