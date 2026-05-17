export interface BusinessSettings {
  id: string
  clinicName: string | null
  taxId: string | null
  address: string | null
  phone: string | null
  email: string | null
  logoUrl: string | null
  reportHeader: string | null
  reportFooter: string | null
  billingSeries: string | null
  billingNextNumber: number
  currency: string
}
