import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Trash2, UserPlus, Percent } from 'lucide-react'
import { supabase } from '../../../lib/supabase.js'
import { useBillPeople } from '../../../hooks/useBillPeople.js'
import PersonRow from './components/PersonRow.jsx'
import styles from './BillDetail.module.css'
import {
  calculateTaxMultiplier,
  calculateItemizedGrandTotal,
  calculateEvenSplitGrandTotal,
  calculateEvenSplitPerPerson,
} from './calculations.js'

export default function BillDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [bill, setBill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [taxDraft, setTaxDraft] = useState('0')
  const [evenTotalDraft, setEvenTotalDraft] = useState('0')
  const [evenCountDraft, setEvenCountDraft] = useState('2')

  const [newPersonName, setNewPersonName] = useState('')
  const [addingPerson, setAddingPerson] = useState(false)

  const { people, loading: peopleLoading, addPerson, updatePerson, deletePerson } = useBillPeople(
    bill?.mode === 'itemized' ? id : null
  )

  useEffect(() => {
    fetchBill()
  }, [id])

  const fetchBill = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      setNotFound(true)
    } else {
      setBill(data)
      setTaxDraft(String(data.tax_rate))
      setEvenTotalDraft(String(data.even_split_total ?? 0))
      setEvenCountDraft(String(data.even_split_people_count ?? 2))
    }
    setLoading(false)
  }

  const patchBill = async (updates) => {
    const { error } = await supabase
      .from('bills')
      .update(updates)
      .eq('id', id)

    if (!error) {
      setBill(prev => ({ ...prev, ...updates }))
    }
  }

  const commitTax = () => {
    const value = parseFloat(taxDraft)
    const safeValue = Number.isFinite(value) && value >= 0 ? value : 0
    setTaxDraft(String(safeValue))
    if (safeValue !== bill.tax_rate) {
      patchBill({ tax_rate: safeValue })
    }
  }

  const commitEvenTotal = () => {
    const value = parseFloat(evenTotalDraft)
    const safeValue = Number.isFinite(value) && value >= 0 ? value : 0
    setEvenTotalDraft(String(safeValue))
    if (safeValue !== bill.even_split_total) {
      patchBill({ even_split_total: safeValue })
    }
  }

  const commitEvenCount = () => {
    const value = parseInt(evenCountDraft, 10)
    const safeValue = Number.isFinite(value) && value >= 1 ? value : 1
    setEvenCountDraft(String(safeValue))
    if (safeValue !== bill.even_split_people_count) {
      patchBill({ even_split_people_count: safeValue })
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('bills').delete().eq('id', id)
    if (!error) {
      navigate('/bills')
    } else {
      setDeleting(false)
    }
  }

  const handleAddPerson = async (e) => {
    e.preventDefault()
    if (!newPersonName.trim() || addingPerson) return
    setAddingPerson(true)
    const name = newPersonName
    setNewPersonName('')
    const { error } = await addPerson(name)
    if (error) setNewPersonName(name)
    setAddingPerson(false)
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.stateText}>Loading bill...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <p className={styles.stateText}>Bill not found.</p>
        <Link to="/bills" className={styles.backLink}><ArrowLeft size={16} /> Back to Bills</Link>
      </div>
    )
  }

  const taxMultiplier = calculateTaxMultiplier(bill.tax_rate)
  const itemizedGrandTotal = calculateItemizedGrandTotal(people, taxMultiplier)
  const evenGrandTotal = calculateEvenSplitGrandTotal(bill.even_split_total, taxMultiplier)
  const evenPerPerson = calculateEvenSplitPerPerson(evenGrandTotal, bill.even_split_people_count)

  return (
    <div className={styles.page}>

      <Link to="/bills" className={styles.backLink}><ArrowLeft size={16} /> Back to Bills</Link>

      <div className={styles.header}>
        <h1 className={styles.name}>{bill.name}</h1>

        {confirming ? (
          <div className={styles.confirmRow}>
            <span className={styles.confirmText}>Delete this bill?</span>
            <button className={styles.confirmYes} onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Yes, delete'}
            </button>
            <button className={styles.confirmNo} onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className={styles.iconButton} onClick={() => setConfirming(true)} title="Delete bill">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className={styles.taxField}>
        <label className={styles.taxLabel}><Percent size={13} /> Tax Rate</label>
        <div className={styles.taxInputWrap}>
          <input
            className={styles.taxInput}
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            value={taxDraft}
            onChange={e => setTaxDraft(e.target.value)}
            onBlur={commitTax}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
          />
          <span className={styles.percentSign}>%</span>
        </div>
      </div>

      {bill.mode === 'itemized' ? (
        <div className={styles.calculator}>

          <form className={styles.addPersonForm} onSubmit={handleAddPerson}>
            <input
              className={styles.addPersonInput}
              type="text"
              placeholder="Add a person..."
              value={newPersonName}
              onChange={e => setNewPersonName(e.target.value)}
            />
            <button
              type="submit"
              className={styles.addPersonButton}
              disabled={!newPersonName.trim() || addingPerson}
            >
              <UserPlus size={16} />
            </button>
          </form>

          {peopleLoading ? (
            <p className={styles.stateText}>Loading people...</p>
          ) : people.length === 0 ? (
            <p className={styles.stateText}>No one added yet — add a person above.</p>
          ) : (
            <div className={styles.peopleList}>
              {people.map(person => (
                <PersonRow
                  key={person.id}
                  person={person}
                  taxMultiplier={taxMultiplier}
                  onUpdateSubtotal={(personId, value) => updatePerson(personId, { subtotal: value })}
                  onDelete={deletePerson}
                />
              ))}
            </div>
          )}

          <div className={styles.grandTotalRow}>
            <span>Grand Total</span>
            <span className={styles.grandTotalValue}>${itemizedGrandTotal.toFixed(2)}</span>
          </div>

        </div>
      ) : (
        <div className={styles.calculator}>

          <div className={styles.evenField}>
            <label className={styles.evenLabel}>Total Amount (pre-tax)</label>
            <div className={styles.taxInputWrap}>
              <span className={styles.dollarSign}>$</span>
              <input
                className={styles.evenInput}
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={evenTotalDraft}
                onChange={e => setEvenTotalDraft(e.target.value)}
                onBlur={commitEvenTotal}
                onKeyDown={e => e.key === 'Enter' && e.target.blur()}
              />
            </div>
          </div>

          <div className={styles.evenField}>
            <label className={styles.evenLabel}>Number of People</label>
            <input
              className={styles.evenInput}
              type="number"
              step="1"
              min="1"
              inputMode="numeric"
              value={evenCountDraft}
              onChange={e => setEvenCountDraft(e.target.value)}
              onBlur={commitEvenCount}
              onKeyDown={e => e.key === 'Enter' && e.target.blur()}
            />
          </div>

          <div className={styles.grandTotalRow}>
            <span>Total with Tax</span>
            <span className={styles.grandTotalValue}>${evenGrandTotal.toFixed(2)}</span>
          </div>

          <div className={styles.perPersonRow}>
            <span>Per Person</span>
            <span className={styles.perPersonValue}>${evenPerPerson.toFixed(2)}</span>
          </div>

        </div>
      )}

    </div>
  )
}