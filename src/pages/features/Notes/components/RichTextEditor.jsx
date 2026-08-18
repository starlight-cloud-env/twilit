import { useRef, useEffect, useCallback, useState } from 'react'
import { Bold, Italic, Underline as UnderlineIcon, Highlighter, Palette } from 'lucide-react'
import styles from './RichTextEditor.module.css'

const DEFAULT_HIGHLIGHT = '#fef08a'
const DEFAULT_TEXT_COLOR = '#f8fafc'
const DEFAULT_PT_SIZE = 16
const MIN_PT_SIZE = 8
const MAX_PT_SIZE = 96

export default function RichTextEditor({ initialContent, onChange }) {
  const editorRef = useRef(null)
  const savedRangeRef = useRef(null)
  const hasInitialized = useRef(false)

  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false })
  const [highlightColor, setHighlightColor] = useState(DEFAULT_HIGHLIGHT)
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR)
  const [ptSize, setPtSize] = useState(DEFAULT_PT_SIZE)

  // contentEditable is uncontrolled by design — setting innerHTML from
  // React state on every render would reset the cursor position while
  // typing, so the initial content is applied once and never again.
  useEffect(() => {
    if (editorRef.current && !hasInitialized.current) {
      editorRef.current.innerHTML = initialContent || ''
      hasInitialized.current = true
    }
  }, [initialContent])

  const emitChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  // Reflects the formatting actually active at the cursor/selection onto
  // the toolbar, so Bold/Italic/Underline visibly "glow" when the text
  // you're on (or about to type) already has that formatting.
  const updateActiveFormats = useCallback(() => {
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
      })
    } catch {
      // queryCommandState can throw in rare edge cases (e.g. no active
      // selection yet) — safe to just skip the update when that happens.
    }
  }, [])

  // Tracks the browser's own selection changes (arrow keys, clicking
  // around, etc.), filtered to only react when the selection is actually
  // inside this editor.
  useEffect(() => {
    const handleSelectionChange = () => {
      const editor = editorRef.current
      if (!editor) return
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return
      const range = sel.getRangeAt(0)
      if (!editor.contains(range.commonAncestorContainer)) return
      updateActiveFormats()
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [updateActiveFormats])

  // onMouseDown + preventDefault (rather than onClick) keeps the editor's
  // current text selection intact — clicking a toolbar button would
  // otherwise blur the editor and lose the selection before the command
  // has a chance to apply to it.
  const runCommand = (command, value = null) => (e) => {
    e.preventDefault()
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    emitChange()
    updateActiveFormats()
  }

  // Any native form control (color picker, number input) steals focus
  // the moment it's interacted with, which loses the editor's selection
  // entirely — so it's captured beforehand and explicitly restored right
  // before the formatting command actually runs.
  const saveSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange()
    }
  }

  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(savedRangeRef.current)
    }
  }

  const handleHighlightChange = (e) => {
    setHighlightColor(e.target.value)
    restoreSelection()
    editorRef.current?.focus()
    document.execCommand('hiliteColor', false, e.target.value)
    emitChange()
  }

  const handleTextColorChange = (e) => {
    setTextColor(e.target.value)
    restoreSelection()
    editorRef.current?.focus()
    document.execCommand('foreColor', false, e.target.value)
    emitChange()
  }

  // execCommand's native fontSize only understands the legacy 1–7 HTML
  // scale, not arbitrary point values. The standard workaround: apply
  // size "7" as a throwaway marker (guaranteed to produce a <font> tag
  // wrapping the selection), then immediately swap that marker for a
  // real inline font-size in pt.
  const applyPtSize = () => {
    restoreSelection()
    const editor = editorRef.current
    if (!editor) return
    editor.focus()
    document.execCommand('fontSize', false, '7')
    editor.querySelectorAll('font[size="7"]').forEach(el => {
      el.removeAttribute('size')
      el.style.fontSize = `${ptSize}pt`
    })
    emitChange()
  }

  const handlePtSizeChange = (e) => {
    const raw = parseInt(e.target.value, 10)
    const clamped = Number.isFinite(raw) ? Math.max(MIN_PT_SIZE, Math.min(MAX_PT_SIZE, raw)) : DEFAULT_PT_SIZE
    setPtSize(clamped)
  }

  return (
    <div className={styles.wrap}>

      <div className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.toolButton} ${activeFormats.bold ? styles.active : ''}`}
          onMouseDown={runCommand('bold')}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          className={`${styles.toolButton} ${activeFormats.italic ? styles.active : ''}`}
          onMouseDown={runCommand('italic')}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          className={`${styles.toolButton} ${activeFormats.underline ? styles.active : ''}`}
          onMouseDown={runCommand('underline')}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>

        <div className={styles.divider} />

        <label className={styles.colorSwatch} title="Highlight color" onMouseDown={saveSelection}>
          <Highlighter size={16} />
          <span className={styles.colorIndicator} style={{ background: highlightColor }} />
          <input type="color" value={highlightColor} onChange={handleHighlightChange} />
        </label>

        <label className={styles.colorSwatch} title="Text color" onMouseDown={saveSelection}>
          <Palette size={16} />
          <span className={styles.colorIndicator} style={{ background: textColor }} />
          <input type="color" value={textColor} onChange={handleTextColorChange} />
        </label>

        <div className={styles.divider} />

        <div className={styles.ptSizeGroup} title="Font size (pt)">
          <input
            type="number"
            className={styles.ptSizeInput}
            min={MIN_PT_SIZE}
            max={MAX_PT_SIZE}
            value={ptSize}
            onMouseDown={saveSelection}
            onChange={handlePtSizeChange}
            onBlur={applyPtSize}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
          />
          <span className={styles.ptSizeLabel}>pt</span>
        </div>
      </div>

      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        data-placeholder="Start writing..."
      />

    </div>
  )
}