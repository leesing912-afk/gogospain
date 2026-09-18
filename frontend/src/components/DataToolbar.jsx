import React, { useRef } from 'react';
import { Download, FileText, Upload, RotateCcw } from 'lucide-react';
import { exportToJSON, exportToTXT, importFromJSONFile } from '../services/fileExport';

export default function DataToolbar({ planData, onUpdatePlan, onResetPlan, statusMessage }) {
  const fileInputRef = useRef(null);

  const handleExportJSON = () => {
    exportToJSON(planData, `honeymoon_plan_${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleExportTXT = () => {
    exportToTXT(planData, `honeymoon_itinerary_${new Date().toISOString().slice(0, 10)}.txt`);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromJSONFile(file);
      if (imported && (imported.cities || imported.headerPass)) {
        onUpdatePlan(imported);
        alert('여정 데이터를 성공적으로 불러왔습니다! 🎉');
      } else {
        alert('올바른 여정 데이터 파일 형식이 아닙니다.');
      }
    } catch (err) {
      alert(err.message || '파일 불러오기 실패');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (window.confirm('기본 15일 이베리아 일정 원본으로 되돌리시겠습니까? 현재 작성 중인 내용은 초기화됩니다.')) {
      onResetPlan();
    }
  };

  const isConnected = /실시간 연결됨/.test(statusMessage || '');
  const isConnecting = /연결\s*중/.test(statusMessage || '');

  return (
    <div className="data-toolbar">
      <div className={`dt-status ${isConnected ? 'is-live' : isConnecting ? 'is-connecting' : 'is-local'}`}>
        <span className="dt-status-dot" />
        <span className="dt-status-text">{statusMessage || '브라우저 & 파일에 실시간 자동 저장 중'}</span>
      </div>

      <div className="dt-grid">
        <button type="button" className="dt-btn dt-json" onClick={handleExportJSON}>
          <Download size={18} />
          <span>JSON 저장</span>
        </button>

        <button type="button" className="dt-btn dt-txt" onClick={handleExportTXT}>
          <FileText size={18} />
          <span>텍스트 저장</span>
        </button>

        <label className="dt-btn dt-upload">
          <Upload size={18} />
          <span>파일 불러오기</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>

        <button type="button" className="dt-btn dt-reset" onClick={handleReset}>
          <RotateCcw size={18} />
          <span>초기화</span>
        </button>
      </div>
    </div>
  );
}
