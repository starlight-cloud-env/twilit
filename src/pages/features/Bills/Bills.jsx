import { useState } from 'react'
import { Receipt, Plus } from 'lucide-react'
import { useBills } from '../../../hooks/useBills.js'
import BillCard from './components/BillCard.jsx'
import NewBillModal from './components/NewBillModal.jsx'
import styles from './Bills.module.css'

export default function Bills() {
  const { bills, loading, createBill, deleteBill } = useBills()
  const [showNewBillModal, setShowNewBillModal] = useState(false)

  return (
    <div className={styles.page}>

      <div className={styles.toolbar}>
        <h1 className={styles.pageTitle}>Bills</h1>
        <button className={styles.newBillButton} onClick={() => setShowNewBillModal(true)}>
          <Plus size={16} /> New Bill
        </button>
      </div>

      {loading ? (
        <p className={styles.stateText}>Loading your bills...</p>
      ) : bills.length === 0 ? (
        <div className={styles.emptyState}>
          <Receipt size={40} strokeWidth={1.5} />
          <p className={styles.stateText}>You don't have any bills yet.</p>
          <button className={styles.newBillButton} onClick={() => setShowNewBillModal(true)}>
            <Plus size={16} /> Create your first bill
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {bills.map(bill => (
            <BillCard
              key={bill.id}
              bill={bill}
              onDelete={() => deleteBill(bill.id)}
            />
          ))}
        </div>
      )}

      {showNewBillModal && (
        <NewBillModal
          onClose={() => setShowNewBillModal(false)}
          onCreate={createBill}
        />
      )}

    </div>
  )
}