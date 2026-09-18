import React, { useState } from 'react';
import { AlertCircle, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function NoticePanel({ notices, onUpdateNotices }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ tag: '', text: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [newNotice, setNewNotice] = useState({ tag: '', text: '' });

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ tag: item.tag, text: item.text });
  };

  const handleSaveEdit = (id) => {
    if (!editForm.text.trim()) return;
    const updated = notices.map((n) => (n.id === id ? { ...n, ...editForm } : n));
    onUpdateNotices(updated);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('이 주의사항 항목을 삭제하시겠습니까?')) {
      const updated = notices.filter((n) => n.id !== id);
      onUpdateNotices(updated);
    }
  };

  const handleAdd = () => {
    if (!newNotice.text.trim()) return;
    const updated = [
      ...notices,
      {
        id: `n-${Date.now()}`,
        tag: newNotice.tag.trim() || '주의',
        text: newNotice.text.trim()
      }
    ];
    onUpdateNotices(updated);
    setNewNotice({ tag: '', text: '' });
    setIsAdding(false);
  };

  return (
    <div className="card">
      <div className="card-header-row">
        <h2 className="h-plain">
          <AlertCircle size={18} className="inline-icon" /> 주의할 점 &amp; 여행 팁
        </h2>
        <button
          type="button"
          className="btn-add-mini"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus size={14} /> <span>{isAdding ? '닫기' : '주의사항 추가'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="add-row-form notice-form">
          <input
            type="text"
            placeholder="태그 (예: 팁, 시에스타, 환전)"
            value={newNotice.tag}
            onChange={(e) => setNewNotice({ ...newNotice, tag: e.target.value })}
            style={{ maxWidth: '140px' }}
          />
          <input
            type="text"
            placeholder="주의사항 내용 상세..."
            value={newNotice.text}
            onChange={(e) => setNewNotice({ ...newNotice, text: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button type="button" className="btn-confirm" onClick={handleAdd}>
            <Check size={14} /> 추가
          </button>
        </div>
      )}

      <ul className="warn-list">
        {notices.map((n) => {
          if (editingId === n.id) {
            return (
              <li key={n.id} className="editing-notice-li">
                <input
                  type="text"
                  value={editForm.tag}
                  onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                  style={{ maxWidth: '100px' }}
                  placeholder="태그"
                />
                <input
                  type="text"
                  value={editForm.text}
                  onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                  placeholder="주의사항 내용"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(n.id)}
                  autoFocus
                />
                <div className="actions-inline">
                  <button
                    type="button"
                    className="icon-action-btn save"
                    onClick={() => handleSaveEdit(n.id)}
                  >
                    <Check size={14} />
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn cancel"
                    onClick={() => setEditingId(null)}
                  >
                    <X size={14} />
                  </button>
                </div>
              </li>
            );
          }

          return (
            <li key={n.id} className="notice-li-item">
              <div className="notice-text-content">
                <b>{n.tag}</b>
                <span>{n.text}</span>
              </div>
              <div className="notice-actions">
                <button
                  type="button"
                  className="icon-action-btn edit"
                  onClick={() => handleStartEdit(n)}
                  title="수정"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  type="button"
                  className="icon-action-btn delete"
                  onClick={() => handleDelete(n.id)}
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
}
