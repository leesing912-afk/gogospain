import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Check, X, Tag } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export default function DayScheduleCard({ day, cityColor, onUpdateDay, onDeleteDay }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerData, setHeaderData] = useState({ date: day.date, title: day.title, tag: day.tag || '' });
  
  // 개별 아이템 편집 상태: idx -> number | null
  const [editingItemIdx, setEditingItemIdx] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleSaveHeader = (e) => {
    e.preventDefault();
    onUpdateDay({
      ...day,
      date: headerData.date,
      title: headerData.title,
      tag: headerData.tag
    });
    setIsEditingHeader(false);
  };

  const handleSaveItem = (idx, newContent) => {
    const newItems = [...day.items];
    newItems[idx] = newContent;
    onUpdateDay({ ...day, items: newItems });
    setEditingItemIdx(null);
  };

  const handleDeleteItem = (idx) => {
    if (window.confirm('이 일정 항목을 삭제하시겠습니까?')) {
      const newItems = day.items.filter((_, i) => i !== idx);
      onUpdateDay({ ...day, items: newItems });
    }
  };

  const handleAddItem = (newContent) => {
    if (!newContent || !newContent.trim()) {
      setIsAddingItem(false);
      return;
    }
    const newItems = [...(day.items || []), newContent];
    onUpdateDay({ ...day, items: newItems });
    setIsAddingItem(false);
  };

  return (
    <details className="day" open={isOpen} onToggle={(e) => setIsOpen(e.target.open)}>
      <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '9px', flex: 1, flexWrap: 'wrap' }}>
          <span className="d-date" style={{ color: cityColor }}>{day.date}</span>
          <span className="d-title">{day.title}</span>
          {day.tag && <span className="tag">{day.tag}</span>}
        </div>

        <div className="summary-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="icon-action-btn edit"
            onClick={() => {
              setHeaderData({ date: day.date, title: day.title, tag: day.tag || '' });
              setIsEditingHeader(true);
            }}
            title="일차 정보(날짜/제목/태그) 수정"
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            className="icon-action-btn delete"
            onClick={() => {
              if (window.confirm(`${day.date} (${day.title}) 전체 일정을 삭제하시겠습니까?`)) {
                onDeleteDay(day.id);
              }
            }}
            title="일차 전체 삭제"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </summary>

      <div className="d-body">
        {isEditingHeader && (
          <form onSubmit={handleSaveHeader} className="edit-day-header-form">
            <div className="form-inline-row">
              <input
                type="text"
                value={headerData.date}
                placeholder="날짜 (예: 4/19(월))"
                onChange={(e) => setHeaderData({ ...headerData, date: e.target.value })}
                required
              />
              <input
                type="text"
                value={headerData.title}
                placeholder="타이틀 (예: 가우디 건축 라인)"
                onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
                required
              />
              <input
                type="text"
                value={headerData.tag}
                placeholder="태그 (예: 사전예약 필수)"
                onChange={(e) => setHeaderData({ ...headerData, tag: e.target.value })}
              />
              <button type="submit" className="btn-confirm">
                <Check size={14} /> 저장
              </button>
              <button type="button" className="btn-cancel" onClick={() => setIsEditingHeader(false)}>
                <X size={14} /> 취소
              </button>
            </div>
          </form>
        )}

        <ul className="schedule-item-list">
          {day.items && day.items.map((item, idx) => {
            if (editingItemIdx === idx) {
              return (
                <li key={idx} className="editing-item-li">
                  <RichTextEditor
                    initialValue={item}
                    onSave={(content) => handleSaveItem(idx, content)}
                    onCancel={() => setEditingItemIdx(null)}
                    placeholder="일정 세부 내용을 입력하세요..."
                  />
                </li>
              );
            }

            return (
              <li key={idx} className="schedule-item-row">
                <div
                  className="item-content"
                  dangerouslySetInnerHTML={{ __html: item }}
                  onDoubleClick={() => setEditingItemIdx(idx)}
                  title="더블클릭하여 빠른 수정"
                />
                <div className="item-actions">
                  <button
                    type="button"
                    className="icon-action-btn edit"
                    onClick={() => setEditingItemIdx(idx)}
                    title="수정 (단축키 Ctrl+B, Ctrl+Shift+<,> 지원)"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn delete"
                    onClick={() => handleDeleteItem(idx)}
                    title="삭제"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {isAddingItem ? (
          <div className="add-item-editor-container">
            <RichTextEditor
              initialValue=""
              onSave={handleAddItem}
              onCancel={() => setIsAddingItem(false)}
              placeholder="새로운 세부 일정을 입력하세요 (Ctrl+B 볼드, Ctrl+Shift+<,> 폰트 크기)..."
            />
          </div>
        ) : (
          <button
            type="button"
            className="btn-add-schedule-item"
            onClick={() => setIsAddingItem(true)}
          >
            <Plus size={13} /> <span>세부 일정 항목 추가</span>
          </button>
        )}
      </div>
    </details>
  );
}
