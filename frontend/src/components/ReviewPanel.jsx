import React, { useState } from 'react';
import { Check, AlertTriangle, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function ReviewPanel({ review, onUpdateReview }) {
  const [editingGoodIdx, setEditingGoodIdx] = useState(null);
  const [goodText, setGoodText] = useState('');
  const [isAddingGood, setIsAddingGood] = useState(false);
  const [newGood, setNewGood] = useState('');

  const [editingBadIdx, setEditingBadIdx] = useState(null);
  const [badText, setBadText] = useState('');
  const [isAddingBad, setIsAddingBad] = useState(false);
  const [newBad, setNewBad] = useState('');

  // 장점 핸들러
  const handleSaveGood = (idx) => {
    if (!goodText.trim()) return;
    const updated = [...review.goods];
    updated[idx] = goodText.trim();
    onUpdateReview({ ...review, goods: updated });
    setEditingGoodIdx(null);
  };

  const handleDeleteGood = (idx) => {
    if (window.confirm('이 장점 항목을 삭제하시겠습니까?')) {
      const updated = review.goods.filter((_, i) => i !== idx);
      onUpdateReview({ ...review, goods: updated });
    }
  };

  const handleAddGood = () => {
    if (!newGood.trim()) return;
    const updated = [...(review.goods || []), newGood.trim()];
    onUpdateReview({ ...review, goods: updated });
    setNewGood('');
    setIsAddingGood(false);
  };

  // 단점 핸들러
  const handleSaveBad = (idx) => {
    if (!badText.trim()) return;
    const updated = [...review.bads];
    updated[idx] = badText.trim();
    onUpdateReview({ ...review, bads: updated });
    setEditingBadIdx(null);
  };

  const handleDeleteBad = (idx) => {
    if (window.confirm('이 단점 항목을 삭제하시겠습니까?')) {
      const updated = review.bads.filter((_, i) => i !== idx);
      onUpdateReview({ ...review, bads: updated });
    }
  };

  const handleAddBad = () => {
    if (!newBad.trim()) return;
    const updated = [...(review.bads || []), newBad.trim()];
    onUpdateReview({ ...review, bads: updated });
    setNewBad('');
    setIsAddingBad(false);
  };

  return (
    <div className="card">
      <h2 className="h-plain">{review.title || '장단점'}</h2>
      <div className="pc-grid">
        {/* 장점 박스 */}
        <div className="box good">
          <div className="box-header-row">
            <h4><Check size={16} className="inline-icon" /> 장점</h4>
            <button
              type="button"
              className="btn-add-mini"
              onClick={() => setIsAddingGood(!isAddingGood)}
            >
              <Plus size={12} /> 장점 추가
            </button>
          </div>

          {isAddingGood && (
            <div className="add-subform">
              <input
                type="text"
                value={newGood}
                placeholder="새로운 장점 입력..."
                onChange={(e) => setNewGood(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGood()}
              />
              <div className="subform-actions">
                <button type="button" className="btn-confirm" onClick={handleAddGood}>
                  <Check size={13} /> 추가
                </button>
                <button type="button" className="btn-cancel" onClick={() => setIsAddingGood(false)}>
                  취소
                </button>
              </div>
            </div>
          )}

          <ul>
            {review.goods?.map((item, idx) => {
              if (editingGoodIdx === idx) {
                return (
                  <li key={idx} className="editing-sub-item">
                    <input
                      type="text"
                      value={goodText}
                      onChange={(e) => setGoodText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveGood(idx)}
                      autoFocus
                    />
                    <div className="actions-inline">
                      <button type="button" className="icon-action-btn save" onClick={() => handleSaveGood(idx)}>
                        <Check size={13} />
                      </button>
                      <button type="button" className="icon-action-btn cancel" onClick={() => setEditingGoodIdx(null)}>
                        <X size={13} />
                      </button>
                    </div>
                  </li>
                );
              }

              return (
                <li key={idx} className="sub-item-row">
                  <span>{item}</span>
                  <div className="sub-actions">
                    <button
                      type="button"
                      className="icon-action-btn edit"
                      onClick={() => {
                        setEditingGoodIdx(idx);
                        setGoodText(item);
                      }}
                      title="수정"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      className="icon-action-btn delete"
                      onClick={() => handleDeleteGood(idx)}
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

        {/* 단점 박스 */}
        <div className="box bad">
          <div className="box-header-row">
            <h4><AlertTriangle size={16} className="inline-icon" /> 단점 / 고려사항</h4>
            <button
              type="button"
              className="btn-add-mini"
              onClick={() => setIsAddingBad(!isAddingBad)}
            >
              <Plus size={12} /> 단점 추가
            </button>
          </div>

          {isAddingBad && (
            <div className="add-subform">
              <input
                type="text"
                value={newBad}
                placeholder="고려할 단점 입력..."
                onChange={(e) => setNewBad(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBad()}
              />
              <div className="subform-actions">
                <button type="button" className="btn-confirm" onClick={handleAddBad}>
                  <Check size={13} /> 추가
                </button>
                <button type="button" className="btn-cancel" onClick={() => setIsAddingBad(false)}>
                  취소
                </button>
              </div>
            </div>
          )}

          <ul>
            {review.bads?.map((item, idx) => {
              if (editingBadIdx === idx) {
                return (
                  <li key={idx} className="editing-sub-item">
                    <input
                      type="text"
                      value={badText}
                      onChange={(e) => setBadText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveBad(idx)}
                      autoFocus
                    />
                    <div className="actions-inline">
                      <button type="button" className="icon-action-btn save" onClick={() => handleSaveBad(idx)}>
                        <Check size={13} />
                      </button>
                      <button type="button" className="icon-action-btn cancel" onClick={() => setEditingBadIdx(null)}>
                        <X size={13} />
                      </button>
                    </div>
                  </li>
                );
              }

              return (
                <li key={idx} className="sub-item-row">
                  <span>{item}</span>
                  <div className="sub-actions">
                    <button
                      type="button"
                      className="icon-action-btn edit"
                      onClick={() => {
                        setEditingBadIdx(idx);
                        setBadText(item);
                      }}
                      title="수정"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      className="icon-action-btn delete"
                      onClick={() => handleDeleteBad(idx)}
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
      </div>
    </div>
  );
}
