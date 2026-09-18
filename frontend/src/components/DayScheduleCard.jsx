import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Check, X, ChevronDown } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

// 항목 맨 앞의 "19:10~20:00" 또는 "19:10" 같은 시간 표기를 찾아
// 컬러 스티커(칩)로 감싸고, 나머지 본문과 분리해 렌더링한다.
const TIME_PREFIX_RE = /^(\d{1,2}:\d{2}(?:~\d{1,2}:\d{2})?)\s*(.*)$/s;

function renderItemHtml(item) {
  const match = item.match(TIME_PREFIX_RE);
  if (match) {
    const [, time, rest] = match;
    return `<span class="time-chip">${time}</span><span class="item-text">${rest}</span>`;
  }
  return `<span class="item-text item-text-noicon">${item}</span>`;
}

export default function DayScheduleCard({ day, cityColor, onUpdateDay, onDeleteDay }) {
  const [isOpen, setIsOpen] = useState(false); // 기본값: 닫힘
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerData, setHeaderData] = useState({ date: day.date, title: day.title, tag: day.tag || '' });
  const [editingItemIdx, setEditingItemIdx] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleSaveHeader = (e) => {
    e.preventDefault();
    onUpdateDay({ ...day, date: headerData.date, title: headerData.title, tag: headerData.tag });
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
    <div className="day-card">
      {/* 요약 헤더 (항상 표시) */}
      <div className="day-summary">
        {/* 왼쪽: 토글 버튼 + 날짜/제목/태그 */}
        <button
          type="button"
          className="day-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <ChevronDown
            size={16}
            className={`day-chev ${isOpen ? 'open' : ''}`}
          />
          <span className="d-date" style={{ color: cityColor }}>{day.date}</span>
          <span className="d-title">{day.title}</span>
          {day.tag && <span className="tag">{day.tag}</span>}
        </button>

        {/* 오른쪽: 수정/삭제 버튼 */}
        <div className="day-header-actions">
          <button
            type="button"
            className="icon-action-btn edit"
            onClick={(e) => {
              e.stopPropagation();
              setHeaderData({ date: day.date, title: day.title, tag: day.tag || '' });
              setIsEditingHeader(true);
              setIsOpen(true);
            }}
            title="날짜/제목 수정"
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            className="icon-action-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`${day.date} (${day.title}) 일정을 삭제하시겠습니까?`)) {
                onDeleteDay(day.id);
              }
            }}
            title="일차 삭제"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* 열렸을 때만 표시되는 본문 */}
      {isOpen && (
        <div className="day-body">
          {/* 날짜/제목 인라인 수정 폼 */}
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
                <button type="submit" className="btn-confirm"><Check size={14} /></button>
                <button type="button" className="btn-cancel" onClick={() => setIsEditingHeader(false)}><X size={14} /></button>
              </div>
            </form>
          )}

          {/* 세부 일정 항목 리스트 */}
          <ul className="schedule-item-list">
            {day.items && day.items.map((item, idx) => {
              if (editingItemIdx === idx) {
                return (
                  <li key={idx} className="editing-item-li">
                    <RichTextEditor
                      initialValue={item}
                      onSave={(content) => handleSaveItem(idx, content)}
                      onCancel={() => setEditingItemIdx(null)}
                      placeholder="일정 내용을 입력하세요..."
                    />
                  </li>
                );
              }
              return (
                <li key={idx} className="schedule-item-row">
                  <div
                    className="item-content"
                    style={{ '--c': cityColor || 'var(--accent)' }}
                    dangerouslySetInnerHTML={{ __html: renderItemHtml(item) }}
                    onDoubleClick={() => setEditingItemIdx(idx)}
                    title="더블클릭하여 빠른 수정"
                  />
                  <div className="item-actions">
                    <button
                      type="button"
                      className="icon-action-btn edit"
                      onClick={() => setEditingItemIdx(idx)}
                      title="수정"
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

            {/* 추가 에디터 */}
            {isAddingItem && (
              <li className="editing-item-li">
                <RichTextEditor
                  initialValue=""
                  onSave={handleAddItem}
                  onCancel={() => setIsAddingItem(false)}
                  placeholder="새 일정 항목 입력 (Ctrl+B 볼드, Ctrl+Enter 저장)..."
                />
              </li>
            )}
          </ul>

          {/* + 추가 버튼 (수정/삭제와 같은 라인 느낌으로 하단에 배치) */}
          {!isAddingItem && (
            <button
              type="button"
              className="btn-add-item-inline"
              onClick={() => setIsAddingItem(true)}
            >
              <Plus size={13} /> 추가
            </button>
          )}
        </div>
      )}
    </div>
  );
}
