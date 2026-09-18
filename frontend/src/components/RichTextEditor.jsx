import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, ZoomIn, ZoomOut, Check, X, HelpCircle } from 'lucide-react';

export default function RichTextEditor({ initialValue, onSave, onCancel, placeholder = '내용을 입력하세요...' }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue || '';
      // 에디터 마운트 시 포커스 및 커서 끝으로 이동
      editorRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [initialValue]);

  const applyFormat = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
    }
  };

  const adjustSize = (direction) => {
    // direction > 0: 확대, direction < 0: 축소
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    // font size 1~7 기준 (기본 3)
    let currentSize = 3;
    const fontEl = window.getSelection()?.anchorNode?.parentElement?.closest('font');
    if (fontEl && fontEl.getAttribute('size')) {
      currentSize = parseInt(fontEl.getAttribute('size'), 10);
    }

    let newSize = currentSize + direction;
    if (newSize < 1) newSize = 1;
    if (newSize > 7) newSize = 7;

    document.execCommand('fontSize', false, newSize);
  };

  const handleKeyDown = (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    if (modifier && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      applyFormat('bold');
    } else if (modifier && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      applyFormat('italic');
    } else if (modifier && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      applyFormat('underline');
    } else if (modifier && e.shiftKey && (e.key === '<' || e.key === ',')) {
      // 사이즈 축소: Ctrl + Shift + ,
      e.preventDefault();
      adjustSize(-1);
    } else if (modifier && e.shiftKey && (e.key === '>' || e.key === '.')) {
      // 사이즈 확대: Ctrl + Shift + .
      e.preventDefault();
      adjustSize(1);
    } else if (modifier && e.key === 'Enter') {
      // Ctrl + Enter로 바로 저장
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (onCancel) onCancel();
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      onSave(htmlContent);
    }
  };

  return (
    <div className="rich-editor-wrapper">
      <div className="rich-editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            className="tool-btn"
            onClick={() => applyFormat('bold')}
            title="굵게 (Ctrl+B)"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={() => applyFormat('italic')}
            title="기울임 (Ctrl+I)"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={() => applyFormat('underline')}
            title="밑줄 (Ctrl+U)"
          >
            <Underline size={15} />
          </button>
          <div className="tool-divider" />
          <button
            type="button"
            className="tool-btn"
            onClick={() => adjustSize(-1)}
            title="글자 크기 축소 (Ctrl+Shift+,)"
          >
            <ZoomOut size={15} />
            <span className="tool-sub-text">작게</span>
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={() => adjustSize(1)}
            title="글자 크기 확대 (Ctrl+Shift+.)"
          >
            <ZoomIn size={15} />
            <span className="tool-sub-text">크게</span>
          </button>
        </div>

        <div className="toolbar-group right">
          <span className="shortcut-hint" title="Ctrl+B (굵게) / Ctrl+Shift+, (작게) / Ctrl+Shift+. (크게) / Ctrl+Enter (저장)">
            <HelpCircle size={14} /> 단축키 지원
          </span>
          <button
            type="button"
            className="action-btn cancel"
            onClick={onCancel}
            title="취소 (Esc)"
          >
            <X size={15} /> 취소
          </button>
          <button
            type="button"
            className="action-btn save"
            onClick={handleSave}
            title="저장 (Ctrl+Enter)"
          >
            <Check size={15} /> 저장
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="rich-editor-content"
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
      />
    </div>
  );
}
