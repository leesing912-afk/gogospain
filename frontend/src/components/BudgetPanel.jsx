import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Calculator } from 'lucide-react';

export default function BudgetPanel({ budget, onUpdateBudget }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [rowForm, setRowForm] = useState({ category: '', desc: '', amount: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [newRow, setNewRow] = useState({ category: '', desc: '', amount: '' });

  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [totalText, setTotalText] = useState(budget.totalText || '');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(budget.note || '');

  const handleStartEdit = (idx) => {
    setEditingIdx(idx);
    setRowForm({ ...budget.items[idx] });
  };

  const handleSaveEdit = (idx) => {
    const updated = [...budget.items];
    updated[idx] = rowForm;
    onUpdateBudget({ ...budget, items: updated });
    setEditingIdx(null);
  };

  const handleDelete = (idx) => {
    if (window.confirm(`'${budget.items[idx].category}' 예산 항목을 삭제하시겠습니까?`)) {
      const updated = budget.items.filter((_, i) => i !== idx);
      onUpdateBudget({ ...budget, items: updated });
    }
  };

  const handleAdd = () => {
    if (!newRow.category) {
      alert('예산 카테고리를 입력해주세요.');
      return;
    }
    const updated = [
      ...budget.items,
      { id: `b-${Date.now()}`, ...newRow }
    ];
    onUpdateBudget({ ...budget, items: updated });
    setNewRow({ category: '', desc: '', amount: '' });
    setIsAdding(false);
  };

  const handleSaveTotal = () => {
    onUpdateBudget({ ...budget, totalText });
    setIsEditingTotal(false);
  };

  const handleSaveNote = () => {
    onUpdateBudget({ ...budget, note: noteText });
    setIsEditingNote(false);
  };

  return (
    <div className="card">
      <div className="card-header-row">
        <h2 className="h-plain"><Calculator size={18} className="inline-icon" /> {budget.title}</h2>
        <button
          type="button"
          className="btn-add-mini"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus size={14} /> <span>{isAdding ? '닫기' : '항목 추가'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="add-row-form budget-form">
          <input
            type="text"
            placeholder="카테고리 (예: 쇼핑/선물)"
            value={newRow.category}
            onChange={(e) => setNewRow({ ...newRow, category: e.target.value })}
          />
          <input
            type="text"
            placeholder="내용 (예: 와인, 올리브유, 기념품)"
            value={newRow.desc}
            onChange={(e) => setNewRow({ ...newRow, desc: e.target.value })}
          />
          <input
            type="text"
            placeholder="금액 (예: 50~80만)"
            value={newRow.amount}
            onChange={(e) => setNewRow({ ...newRow, amount: e.target.value })}
          />
          <button type="button" className="btn-confirm" onClick={handleAdd}>
            <Check size={14} /> 추가
          </button>
        </div>
      )}

      <div className="wrap-table">
        <table className="budget">
          <thead>
            <tr>
              <th>항목</th>
              <th>내용</th>
              <th className="num">2인 합계</th>
              <th style={{ width: '80px', textAlign: 'center' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {budget.items && budget.items.map((item, idx) => {
              if (editingIdx === idx) {
                return (
                  <tr key={item.id || idx} className="editing-row">
                    <td>
                      <input
                        type="text"
                        value={rowForm.category}
                        onChange={(e) => setRowForm({ ...rowForm, category: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={rowForm.desc}
                        onChange={(e) => setRowForm({ ...rowForm, desc: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="num-input"
                        value={rowForm.amount}
                        onChange={(e) => setRowForm({ ...rowForm, amount: e.target.value })}
                      />
                    </td>
                    <td className="actions-cell">
                      <button type="button" className="icon-action-btn save" onClick={() => handleSaveEdit(idx)}>
                        <Check size={14} />
                      </button>
                      <button type="button" className="icon-action-btn cancel" onClick={() => setEditingIdx(null)}>
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={item.id || idx}>
                  <td className="category-cell">{item.category}</td>
                  <td>{item.desc}</td>
                  <td className="num">{item.amount}</td>
                  <td className="actions-cell">
                    <button
                      type="button"
                      className="icon-action-btn edit"
                      onClick={() => handleStartEdit(idx)}
                      title="수정"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      className="icon-action-btn delete"
                      onClick={() => handleDelete(idx)}
                      title="삭제"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}

            <tr className="total">
              <td colSpan={2}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>합계</span>
                  {!isEditingTotal && (
                    <button
                      type="button"
                      className="icon-action-btn edit"
                      onClick={() => {
                        setTotalText(budget.totalText || '');
                        setIsEditingTotal(true);
                      }}
                      title="합계 금액 직접 수정"
                    >
                      <Edit2 size={12} />
                    </button>
                  )}
                </div>
              </td>
              <td className="num" colSpan={2}>
                {isEditingTotal ? (
                  <div className="inline-edit-total">
                    <input
                      type="text"
                      value={totalText}
                      onChange={(e) => setTotalText(e.target.value)}
                    />
                    <button type="button" className="icon-action-btn save" onClick={handleSaveTotal}>
                      <Check size={13} />
                    </button>
                    <button type="button" className="icon-action-btn cancel" onClick={() => setIsEditingTotal(false)}>
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <span>{budget.totalText}</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="foot-note-area">
        {isEditingNote ? (
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
            <button type="button" className="btn-cancel" onClick={() => setIsEditingNote(false)}>
              취소
            </button>
          </div>
        ) : (
          <div className="foot-note-display">
            <span className="foot-note">{budget.note}</span>
            <button
              type="button"
              className="icon-action-btn edit"
              onClick={() => {
                setNoteText(budget.note || '');
                setIsEditingNote(true);
              }}
              title="비고 문구 수정"
            >
              <Edit2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
