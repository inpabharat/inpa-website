export const membershipFees = [
  { category: 'Founding membership', minimumFeeLabel: 'Minimum ₹21,000' },
  { category: 'Life membership', amount: 11000 },
  { category: 'Annual membership', amount: 1000 },
  { category: 'Institutional / corporate membership', minimumFeeLabel: 'Minimum ₹1,00,000' },
] as const

export const membershipBankDetails = [
  { label: 'Account name', value: 'INDIAN NUCLEAR PHYSICS ASSOCIATION' },
  { label: 'Account number', value: '494501000164' },
  { label: 'IFSC', value: 'ICIC0004945' },
  { label: 'Bank branch', value: 'ICICI Bank, Sunderpur branch' },
  { label: 'Mobile number', value: '9760153344' },
] as const

export const membershipUpi = {
  id: 'MSINDIANNUCLEARPHYSICSASSOCIATION.eazypay@icici',
  qrImage: '/images/membership-upi-qr.png',
} as const

export const membershipPaymentFormUrl = 'https://forms.gle/Qp47Xzymc1EsGJmX9'
