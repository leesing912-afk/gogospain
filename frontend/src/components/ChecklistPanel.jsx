import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Edit2, Check, X, ShieldAlert, Sparkles } from 'lucide-react';

export default function ChecklistPanel({ checklist, onUpdateChecklist }) {
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingText, setEditingText] = useState('');
  
  const [addingCatId, setAddingCatId] = useState(null);
  const [newText, setNewText] = useState('');

  // 체크 토글
  const handleToggleCheck = (catId, itemId) => {
    const updated = checklist.map((cat) => {
      if (cat.id !== catId) return cat;
      const updatedItems = cat.items.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, checked: !item.checked };
      });
      return { ...cat, items: updatedItems };
    });
    onUpdateChecklist(updated);
  };

  // 아이템 수정
  const handleStartEdit = (item) => {
    setEditingItemId(item.id);
    setEditingText(item.text);
  };

  const handleSaveEdit = (catId, itemId) => {
    if (!editingText.trim()) return;
    const updated = checklist.map((cat) => {
      if (cat.id !== catId) return cat;
      const updatedItems = cat.items.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, text: editingText.trim() };
      });
      return { ...cat, items: updatedItems };
    });
    onUpdateChecklist(updated);
    setEditingItemId(null);
  };

  // 아이템 삭제
  const handleDeleteItem = (catId, itemId) => {
    if (window.confirm('이 체크리스트 항목을 삭제하시겠습니까?')) {
      const updated = checklist.map((cat) => {
        if (cat.id !== catId) return cat;
        return { ...cat, items: cat.items.filter((i) => i.id !== itemId) };
      });
      onUpdateChecklist(updated);
    }
  };

  // 아이템 추가
  const handleAddItem = (catId) => {
    if (!newText.trim()) return;
    const updated = checklist.map((cat) => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: [
          ...(cat.items || []),
          { id: `c-${Date.now()}`, text: newText.trim(), checked: false }
        ]
      };
    });
    onUpdateChecklist(updated);
    setNewText('');
    setAddingCatId(null);
  };

  // 전체 통계
  const totalItems = checklist.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
  const checkedItems = checklist.reduce(
    (acc, cat) => acc + (cat.items?.filter((i) => i.checked).length || 0),
    0
  );
  const percent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <div className="card checklist-card">
      <div className="checklist-header">
        <div>
          <h2 className="h-plain">
            <CheckSquare size={18} className="inline-icon" /> 서유럽 여행 투어 준비물 체크리스트
          </h2>
          <p className="checklist-sub">
            가이드 추천 필수 준비물 점검표 (체크 시 브라우저 및 파일에 즉시 영속 저장됩니다)
          </p>
        </div>

        <div className="progress-badge">
          <div className="progress-info">
            <span>준비 완료</span>
            <strong>{checkedItems} / {totalItems} ({percent}%)</strong>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      <div className="checklist-categories">
        {checklist.map((cat) => {
          const catTotal = cat.items?.length || 0;
          const catChecked = cat.items?.filter((i) => i.checked).length || 0;

          return (
            <div key={cat.id} className="checklist-category-box">
              <div className="cat-header">
                <div className="cat-title">
                  <Sparkles size={14} className="cat-icon" />
                  <h3>{cat.category}</h3>
                  <span className="cat-count">({catChecked}/{catTotal})</span>
                </div>
                <button
                  type="button"
                  className="btn-add-mini"
                  onClick={() => setAddingCatId(addingCatId === cat.id ? null : cat.id)}
                >
                  <Plus size={13} /> {addingCatId === cat.id ? '취소' : '항목 추가'}
                </button>
              </div>

              {addingCatId === cat.id && (
                <div className="add-checklist-row">
                  <input
                    type="text"
                    value={newText}
                    placeholder="새로운 준비물 또는 확인 사항을 입력하세요..."
                    onChange={(e) => setNewText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem(cat.id)}
                    autoFocus
                  />
                  <button type="button" className="btn-confirm" onClick={() => handleAddItem(cat.id)}>
                    <Check size={14} /> 추가
                  </button>
                </div>
              )}

              <ul className="checklist-ul">
                {cat.items?.map((item) => {
                  if (editingItemId === item.id) {
                    return (
                      <li key={item.id} className="checklist-li editing">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(cat.id, item.id)}
                          autoFocus
                        />
                        <div className="item-actions">
                          <button
                            type="button"
                            className="icon-action-btn save"
                            onClick={() => handleSaveEdit(cat.id, item.id)}
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            className="icon-action-btn cancel"
                            onClick={() => setEditingItemId(null)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={item.id} className={`checklist-li ${item.checked ? 'completed' : ''}`}>
                      <label className="checkbox-label">
                        <button
                          type="button"
                          className="check-toggle-btn"
                          onClick={() => handleToggleCheck(cat.id, item.id)}
                          title={item.checked ? '완료 취소' : '체크 완료'}
                        >
                          {item.checked ? (
                            <CheckSquare size={18} className="icon-checked" />
                          ) : (
                            <Square size={18} className="icon-unchecked" />
                          )}
                        </button>
                        <span className="check-text">{item.text}</span>
                      </label>

                      <div className="item-actions">
                        <button
                          type="button"
                          className="icon-action-btn edit"
                          onClick={() => handleStartEdit(item)}
                          title="수정"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          type="button"
                          className="icon-action-btn delete"
                          onClick={() => handleDeleteItem(cat.id, item.id)}
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
          );
        })}
      </div>
    </div>
  );
}
