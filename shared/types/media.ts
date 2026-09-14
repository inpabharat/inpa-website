export type MediaKind = 'image' | 'pdf'

export interface MediaUsage {
  kind: string
  id: string
  title: string
  status: string
}

export interface MediaSelection {
  key: string
  url: string
  alt: string
  contentType: string
  originalName?: string
}

export interface MediaItem extends MediaSelection {
  size: number
  uploadedAt: string
  uploadedBy?: string
  credit: string
  licence: string
  usages?: MediaUsage[]
}
