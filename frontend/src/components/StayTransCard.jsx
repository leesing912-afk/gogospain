import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Check, X, Building2, Send } from 'lucide-react';

export default function StayTransCard({ hotels, nextRoute, cityColor, stayDates, onUpdateHotels, onUpdateNextRoute }) {
  const [editingHotelIdx, setEditingHotelIdx] = useState(null);
  const [hotelForm, setHotelForm] = useState({ name: '', note: '' });
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const [newHotel, setNewHotel] = useState({ name: '', note: '' });

  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [routeText, setRouteText] = useState(nextRoute || '');

  // 숙소 편집
  const handleStartEditHotel = (idx) => {
    setEditingHotelIdx(idx);
    setHotelForm({ ...hotels[idx] });
  };

  const handleSaveHotel = (idx) => {
    const updated = [...hotels];
    updated[idx] = hotelForm;
    onUpdateHotels(updated);
    setEditingHotelIdx(null);
  };

  const handleDeleteHotel = (idx) => {
    if (window.confirm(`'${hotels[idx].name}' 숙소를 삭제하시겠습니까?`)) {
      const updated = hotels.filter((_, i) => i !== idx);
      onUpdateHotels(updated);
    }
  };

  const handleAddHotel = () => {
    if (!newHotel.name) {
      alert('숙소명을 입력해주세요.');
      return;
    }
    const updated = [...(hotels || []), newHotel];
    onUpdateHotels(updated);
    setNewHotel({ name: '', note: '' });
    setIsAddingHotel(false);
  };

  // 이동 경로 저장
  const handleSaveRoute = () => {
    onUpdateNextRoute(routeText);
    setIsEditingRoute(false);
  };

  return (
    <div className="info-panel" style={{ '--c': cityColor }}>
      <div className="info-body">
        <div className="subgrid">
          {/* 추천 숙소 박스 */}
          <div className="box">
            <div className="box-header-row">
              <h4><Building2 size={13} className="inline-icon" /> 추천 숙소</h4>
              <button
                type="button"
                className="btn-add-mini"
                onClick={() => setIsAddingHotel(!isAddingHotel)}
              >
                <Plus size={12} /> 숙소 추가
              </button>
            </div>
            {stayDates && (
              <p className="stay-duration-note">🛏️ {stayDates} 동안 한 숙소에서 연박 추천</p>
            )}

            {isAddingHotel && (
              <div className="add-subform">
                <input
                  type="text"
                  placeholder="호텔명 (예: H10 Casa Mimosa)"
                  value={newHotel.name}
                  onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="특징/위치/비고 (예: 명소 도보권, 루프탑)"
                  value={newHotel.note}
                  onChange={(e) => setNewHotel({ ...newHotel, note: e.target.value })}
                />
                <div className="subform-actions">
                  <button type="button" className="btn-confirm" onClick={handleAddHotel}>
                    <Check size={13} /> 추가
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setIsAddingHotel(false)}>
                    취소
                  </button>
                </div>
              </div>
            )}

            <ul>
              {hotels && hotels.map((hotel, idx) => {
                if (editingHotelIdx === idx) {
                  return (
                    <li key={idx} className="editing-sub-item">
                      <input
                        type="text"
                        value={hotelForm.name}
                        onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                        placeholder="호텔명"
                      />
                      <input
                        type="text"
                        value={hotelForm.note}
                        onChange={(e) => setHotelForm({ ...hotelForm, note: e.target.value })}
                        placeholder="비고"
                      />
                      <div className="actions-inline">
                        <button type="button" className="icon-action-btn save" onClick={() => handleSaveHotel(idx)}>
                          <Check size={13} />
                        </button>
                        <button type="button" className="icon-action-btn cancel" onClick={() => setEditingHotelIdx(null)}>
                          <X size={13} />
                        </button>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={idx} className="sub-item-row">
                    <div>
                      <span className="hname">{hotel.name}</span>
                      <br />
                      <span className="hnote">{hotel.note}</span>
                    </div>
                    <div className="sub-actions">
                      <button
                        type="button"
                        className="icon-action-btn edit"
                        onClick={() => handleStartEditHotel(idx)}
                        title="수정"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        type="button"
                        className="icon-action-btn delete"
                        onClick={() => handleDeleteHotel(idx)}
                        title="삭제"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 다음 구간 박스 */}
          <div className="box">
            <div className="box-header-row">
              <h4><Send size={13} className="inline-icon" /> 다음 구간 이동</h4>
              {!isEditingRoute && (
                <button
                  type="button"
                  className="icon-action-btn edit"
                  onClick={() => {
                    setRouteText(nextRoute || '');
                    setIsEditingRoute(true);
                  }}
                  title="이동 정보 수정"
                >
                  <Edit2 size={12} />
                </button>
              )}
            </div>

            {isEditingRoute ? (
              <div className="edit-route-container">
                <textarea
                  rows={3}
                  value={routeText}
                  onChange={(e) => setRouteText(e.target.value)}
                  placeholder="다음 구간 이동 정보 입력..."
                />
                <div className="subform-actions">
                  <button type="button" className="btn-confirm" onClick={handleSaveRoute}>
                    <Check size={13} /> 저장
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setIsEditingRoute(false)}>
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <ul>
                <li>{nextRoute || '다음 구간 정보가 없습니다.'}</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
