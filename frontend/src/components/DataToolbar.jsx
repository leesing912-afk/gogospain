import React, { useRef } from 'react';
import { Download, FileText, Upload, RotateCcw, CheckCircle2 } from 'lucide-react';
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

  return (
    <div className="data-toolbar">
      <div className="toolbar-left">
        <span className="live-status">
          <CheckCircle2 size={14} className="status-icon" />
          <span>{statusMessage || '브라우저 & 파일에 실시간 자동 저장 중'}</span>
        </span>
      </div>

      <div className="toolbar-right">
        <button
          type="button"
          className="btn-pill json"
          onClick={handleExportJSON}
          title="현재 편집한 모든 내용을 JSON 파일로 저장합니다"
        >
          <Download size={14} />
          <span>JSON 파일 저장</span>
        </button>

        <button
          type="button"
          className="btn-pill txt"
          onClick={handleExportTXT}
          title="메모장이나 카톡에 붙여넣기 좋은 텍스트 파일로 저장합니다"
        >
          <FileText size={14} />
          <span>메모장(TXT) 저장</span>
        </button>

        <label className="btn-pill upload" title="저장해둔 JSON 파일을 불러와 복원합니다">
          <Upload size={14} />
          <span>파일 불러오기</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>

        <button
          type="button"
          className="btn-pill reset"
          onClick={handleReset}
          title="처음 기본 일정으로 복원합니다"
        >
          <RotateCcw size={14} />
          <span>초기화</span>
        </button>
      </div>
    </div>
  );
}
