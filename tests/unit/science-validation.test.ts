import { describe, expect, it } from 'vitest'
import { parsePublicationInput, parseResearchInput } from '../../shared/utils/science-validation'

const publication = { title: 'Test issue', slug: 'test-issue', volume: 9, issueNumber: 1, issueLabel: 'Volume 9, Issue 1', pageCount: 80, status: 'draft', publicationDate: '', pdfKey: '', coverImageKey: '', coverImageAlt: '' }
const research = { title: 'Test research', slug: 'test-research', status: 'draft', isFeatured: false }
describe('science publishing validation', () => {
  it('saves incomplete work as drafts', () => {
    expect(parsePublicationInput(publication).pdfKey).toBe('')
    expect(parseResearchInput(research).doi).toBe('')
  })
  it('prevents incomplete drafts being published', () => {
    expect(() => parsePublicationInput({ ...publication, status: 'published' })).toThrow(/required/)
    expect(() => parseResearchInput({ ...research, status: 'published' })).toThrow(/required/)
  })
  it('allows an issue without optional editorial content', () => {
    expect(parsePublicationInput({ ...publication, status: 'published', publicationDate: '2026-09-01', pdfKey: 'uploads/test.pdf', coverImageKey: 'uploads/test.jpg', coverImageAlt: 'Cover' }).editorial).toBe('')
  })
  it('rejects impossible calendar dates', () => {
    expect(() => parsePublicationInput({ ...publication, publicationDate: '2026-02-30' })).toThrow(/calendar/)
  })
  it('normalises DOI identifiers and rejects unsafe links', () => {
    expect(parseResearchInput({ ...research, doi: '10.1103/PhysRevC.100.024001' }).doi).toBe('https://doi.org/10.1103/PhysRevC.100.024001')
    expect(() => parseResearchInput({ ...research, doi: 'javascript:alert(1)' })).toThrow(/DOI/)
  })
  it('requires descriptions and credits for research figures', () => {
    expect(() => parseResearchInput({ ...research, imageKey: 'uploads/test.jpg' })).toThrow(/description and credit/)
  })
  it('rejects invalid publication numbers and statuses', () => {
    expect(() => parsePublicationInput({ ...publication, volume: 0 })).toThrow()
    expect(() => parseResearchInput({ ...research, status: 'anything' })).toThrow()
  })
})
