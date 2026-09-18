import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

export default function OverviewTable({ overview, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editRow, setEditRow] = useState({ name: '', dates: '', highlight: '', colorVar: 'var(--accent)' });
  const [isAdding, setIsAdding] = useState(false);
  const [newRow, setNewRow] = useState({ name: '', dates: '', highlight: '', colorVar: 'var(--accent)' });
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(overview.note || '');

  const handleStartEdit = (idx) => {
    setEditingIndex(idx);
    setEditRow({ ...overview.cities[idx] });
  };

  const handleSaveEdit = (idx) => {
    const updated = [...overview.cities];
    updated[idx] = editRow;
    onUpdate({ ...overview, cities: updated });
    setEditingIndex(null);
  };

  const handleDelete = (idx) => {
    if (window.confirm(`'${overview.cities[idx].name}' 요약을 삭제하시겠습니까?`)) {
      const updated = overview.cities.filter((_, i) => i !== idx);
      onUpdate({ ...overview, cities: updated });
    }
  };

  const handleAdd = () => {
    if (!newRow.name) {
      alert('도시 이름을 입력해주세요.');
      return;
    }
    const updated = [...overview.cities, newRow];
    onUpdate({ ...overview, cities: updated });
    setNewRow({ name: '', dates: '', highlight: '', colorVar: 'var(--accent)' });
    setIsAdding(false);
  };

  const handleSaveNote = () => {
    onUpdate({ ...overview, note: noteText });
    setEditingNote(false);
  };

  return (
    <details className="overview" open={isOpen} onToggle={(e) => setIsOpen(e.target.open)}>
      <summary>
        <span>🗺️ 한눈에 보기 (전체 동선 요약)</span>
        <span className={`chev ${isOpen ? 'open' : ''}`}>▾</span>
      </summary>

      <div className="ov-body">
        <div className="table-actions-top">
          <button
            type="button"
            className="btn-add-mini"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus size={14} /> <span>{isAdding ? '닫기' : '도시 추가'}</span>
          </button>
        </div>

        {isAdding && (
          <div className="add-row-form">
            <input
              type="text"
              placeholder="도시명 (예: 톨레도)"
              value={newRow.name}
              onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="일정 (예: 4/25 경유)"
              value={newRow.dates}
              onChange={(e) => setNewRow({ ...newRow, dates: e.target.value })}
            />
            <input
              type="text"
              placeholder="핵심 명소 (예: 대성당/알카사르)"
              value={newRow.highlight}
              onChange={(e) => setNewRow({ ...newRow, highlight: e.target.value })}
            />
            <button type="button" className="btn-confirm" onClick={handleAdd}>
              <Check size={14} /> 추가
            </button>
          </div>
        )}

        <div className="wrap-table">
          <table className="ov">
            <thead>
              <tr>
                <th style={{ width: '24px' }}></th>
                <th>도시</th>
                <th>일정</th>
                <th>핵심</th>
                <th style={{ width: '80px', textAlign: 'center' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {overview.cities.map((city, idx) => {
                if (editingIndex === idx) {
                  return (
                    <tr key={idx} className="editing-row">
                      <td className="dot">
                        <span className="dotmark" style={{ backgroundColor: editRow.colorVar || 'var(--accent)' }}></span>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editRow.name}
                          onChange={(e) => setEditRow({ ...editRow, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editRow.dates}
                          onChange={(e) => setEditRow({ ...editRow, dates: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editRow.highlight}
                          onChange={(e) => setEditRow({ ...editRow, highlight: e.target.value })}
                        />
                      </td>
                      <td className="actions-cell">
                        <button type="button" className="icon-action-btn save" onClick={() => handleSaveEdit(idx)}>
                          <Check size={14} />
                        </button>
                        <button type="button" className="icon-action-btn cancel" onClick={() => setEditingIndex(null)}>
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={idx}>
                    <td className="dot">
                      <span className="dotmark" style={{ backgroundColor: city.colorVar || 'var(--accent)' }}></span>
                    </td>
                    <td className="city-name-cell">{city.name}</td>
                    <td>{city.dates}</td>
                    <td>{city.highlight}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="icon-action-btn edit"
                        onClick={() => handleStartEdit(idx)}
                        title="수정"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="icon-action-btn delete"
                        onClick={() => handleDelete(idx)}
                        title="삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="foot-note-area">
          {editingNote ? (
            <div className="edit-note-form">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="note-input"
              />
              <button type="button" className="btn-confirm" onClick={handleSaveNote}>
                <Check size={14} /> 저장
              </button>
              <button type="button" className="btn-cancel" onClick={() => setEditingNote(false)}>
                취소
              </button>
            </div>
          ) : (
            <div className="foot-note-display">
              <span className="foot-note">{overview.note}</span>
              <button
                type="button"
                className="icon-action-btn edit"
                onClick={() => {
                  setNoteText(overview.note || '');
                  setEditingNote(true);
                }}
                title="안내문 수정"
              >
                <Edit2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </details>
  );
}
