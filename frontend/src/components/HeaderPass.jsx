import React, { useState } from 'react';
import { Edit2, Plane, Calendar, Compass, Check, X } from 'lucide-react';

export default function HeaderPass({ headerPass, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...headerPass });

  const handleOpen = () => {
    setFormData({ ...headerPass });
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="pass">
      <div className="pass-top">
        <div className="pass-title-row">
          <h1>{headerPass.title}</h1>
          <button
            type="button"
            className="btn-edit-pass btn-edit-pass-sm"
            onClick={handleOpen}
            title="항공권 및 기본 일정 요약 수정"
          >
            <Edit2 size={11} />
            <span>수정</span>
          </button>
        </div>
      </div>

      <div className="stub">
        <div className="stub-box">
          <div className="lbl"><Plane size={12} className="inline-icon" /> {headerPass.inCity}</div>
          <div className="val">{headerPass.inDate}</div>
          <div className="sub">{headerPass.inFlight}</div>
        </div>
        <div className="stub-box">
          <div className="lbl"><Plane size={12} className="inline-icon rotate-45" /> {headerPass.outCity}</div>
          <div className="val">{headerPass.outDate}</div>
          <div className="sub">{headerPass.outFlight}</div>
        </div>
        <div className="stub-box">
          <div className="lbl"><Calendar size={12} className="inline-icon" /> 기간</div>
          <div className="val">{headerPass.periodVal}</div>
          <div className="sub">{headerPass.periodSub}</div>
        </div>
        <div className="stub-box">
          <div className="lbl"><Compass size={12} className="inline-icon" /> 동선</div>
          <div className="val">{headerPass.routeVal}</div>
          <div className="sub">{headerPass.routeSub}</div>
        </div>
      </div>

      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✈️ 여행 헤더 정보 수정</h3>
              <button type="button" className="close-btn" onClick={() => setIsEditing(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>여행 제목</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>IN 도시 레이블</label>
                  <input
                    type="text"
                    value={formData.inCity}
                    onChange={(e) => handleChange('inCity', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>IN 날짜</label>
                  <input
                    type="text"
                    value={formData.inDate}
                    onChange={(e) => handleChange('inDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>IN 항공편 상세</label>
                <input
                  type="text"
                  value={formData.inFlight}
                  onChange={(e) => handleChange('inFlight', e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>OUT 도시 레이블</label>
                  <input
                    type="text"
                    value={formData.outCity}
                    onChange={(e) => handleChange('outCity', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>OUT 날짜</label>
                  <input
                    type="text"
                    value={formData.outDate}
                    onChange={(e) => handleChange('outDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>OUT 항공편 상세</label>
                <input
                  type="text"
                  value={formData.outFlight}
                  onChange={(e) => handleChange('outFlight', e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>총 여행 기간</label>
                  <input
                    type="text"
                    value={formData.periodVal}
                    onChange={(e) => handleChange('periodVal', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>기간 부제 (도시/이동 횟수)</label>
                  <input
                    type="text"
                    value={formData.periodSub}
                    onChange={(e) => handleChange('periodSub', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>교통/동선</label>
                  <input
                    type="text"
                    value={formData.routeVal}
                    onChange={(e) => handleChange('routeVal', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>동선 부제</label>
                  <input
                    type="text"
                    value={formData.routeSub}
                    onChange={(e) => handleChange('routeSub', e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                  취소
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={16} /> 변경사항 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
