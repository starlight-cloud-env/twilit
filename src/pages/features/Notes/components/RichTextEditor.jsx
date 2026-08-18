import { useRef, useEffect, useCallback, useState } from 'react'
import { Bold, Italic, Underline as UnderlineIcon, Highlighter, Palette, X } from 'lucide-react'
import styles from './RichTextEditor.module.css'

const DEFAULT_HIGHLIGHT = '#fef08a'
const DEFAULT_TEXT_COLOR = '#f8fafc'

const FONT_SIZES = [
  { label: 'Small', value: '2' },
  { label: 'Normal', value: '3' },
  { label: 'Large', value: '5' },
  { label: 'Huge', value: '7' },
]

export default function RichTextEditor({ initialContent, onChange }) {
  const editorRef = useRef(null)
  const savedRangeRef = useRef(null)
  const hasInitialized = useRef(false)

  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false })
  const [highlightColor, setHighlightColor] = useState(DEFAULT_HIGHLIGHT)
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR)
  const [hasHighlight, setHasHighlight] = useState(false)

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

  // Any native form control (color picker, select) steals focus the
  // moment it's interacted with, which loses the editor's selection
  // entirely — so it's captured beforehand and explicitly restored right
  // before the formatting command actually runs. Listening for both
  // mouse and touch events matters here — mobile fires touch events
  // instead of mousedown, so relying on mousedown alone silently broke
  // this whole flow on phones.
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
    setHasHighlight(true)
    restoreSelection()
    editorRef.current?.focus()
    document.execCommand('hiliteColor', false, e.target.value)
    emitChange()
  }

  const clearHighlight = (e) => {
    e.preventDefault()
    restoreSelection()
    editorRef.current?.focus()
    document.execCommand('hiliteColor', false, 'transparent')
    setHasHighlight(false)
    emitChange()
  }

  const handleTextColorChange = (e) => {
    setTextColor(e.target.value)
    restoreSelection()
    editorRef.current?.focus()
    document.execCommand('foreColor', false, e.target.value)
    emitChange()
  }

  const handleFontSize = (e) => {
    restoreSelection()
    editorRef.current?.focus()
    document.execCommand('fontSize', false, e.target.value)
    emitChange()
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

        <label
          className={styles.colorSwatch}
          title="Highlight color"
          onMouseDown={saveSelection}
          onTouchStart={saveSelection}
        >
          <Highlighter size={16} />
          <span className={styles.colorIndicator} style={{ background: highlightColor }} />
          <input type="color" value={highlightColor} onChange={handleHighlightChange} />
        </label>

        {hasHighlight && (
          <button
            type="button"
            className={styles.clearButton}
            onMouseDown={saveSelection}
            onTouchStart={saveSelection}
            onClick={clearHighlight}
            title="Clear highlight"
          >
            <X size={13} />
          </button>
        )}

        <label
          className={styles.colorSwatch}
          title="Text color"
          onMouseDown={saveSelection}
          onTouchStart={saveSelection}
        >
          <Palette size={16} />
          <span className={styles.colorIndicator} style={{ background: textColor }} />
          <input type="color" value={textColor} onChange={handleTextColorChange} />
        </label>

        <div className={styles.divider} />

        <select
          className={styles.sizeSelect}
          onMouseDown={saveSelection}
          onTouchStart={saveSelection}
          onChange={handleFontSize}
          defaultValue="3"
          title="Font size"
        >
          {FONT_SIZES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
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