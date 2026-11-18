import source from './nnpi-consultation.json'

export type NnpiText = string | { text: string, href?: string, bold?: boolean, italic?: boolean }[]

type Block =
  | { kind: 'paragraph' | 'callout' | 'heading', text: NnpiText, id?: string }
  | { kind: 'figure', src: string, alt: string, caption: string, width: number, height: number }
  | { kind: 'list', items: NnpiText[] }
  | { kind: 'table', caption: string, rows: string[][] }

interface Consultation {
  cover: { label: string, title: string, subtitle: string, version: string, message: NnpiText, response: NnpiText }
  chapters: {
    id: string
    label: string
    title: string
    sections: { id?: string, title?: string, blocks: Block[] }[]
  }[]
}

export const nnpiConsultation = source as Consultation
