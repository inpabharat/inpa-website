// Integration checks against a locally simulated Worker. Never runs against remote data.
import assert from 'node:assert/strict'
const base = process.env.INPA_TEST_URL || 'http://127.0.0.1:8790'
const url = new URL(base)
assert.ok(['127.0.0.1', 'localhost'].includes(url.hostname), 'Editor tests are local only')
const created = []
const media = []
async function request(path, method = 'GET', body, expected = 200, headers = {}) {
  const response = await fetch(`${base}${path}`, { method, headers: { ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...headers }, body: body ? body instanceof FormData ? body : JSON.stringify(body) : undefined })
  const text = await response.text()
  assert.equal(response.status, expected, `${method} ${path}: ${text.slice(0, 400)}`)
  return text ? JSON.parse(text) : null
}
try {
  const stamp = Date.now()
  const issue = { title: `Local test issue ${stamp}`, slug: `local-issue-${stamp}`, volume: 9000, issueNumber: 1, issueLabel: 'LOCAL TEST ONLY', pageCount: 1, status: 'draft' }
  const draft = (await request('/api/admin/publications', 'POST', issue)).data
  created.push(['publications', draft.id])
  assert.ok(!(await request('/api/public/publications')).data.some(item => item.id === draft.id))
  await request(`/api/admin/publications/${draft.id}`, 'PUT', { ...draft, status: 'published' }, 422)
  const upload = new FormData()
  upload.append('file', new Blob(['%PDF-1.4\n% Local integration fixture\n%%EOF'], { type: 'application/pdf' }), 'local-test.pdf')
  const pdf = (await request('/api/admin/media', 'POST', upload)).data
  media.push(pdf.key)
  const completeIssue = { ...draft, status: 'published', publicationDate: '2026-01-01', pdfKey: pdf.key, coverImageKey: '/images/publications/nuclear-horizons-volume-1-issue-1.jpg', coverImageAlt: 'Local test cover' }
  await request(`/api/admin/publications/${draft.id}`, 'PUT', { ...completeIssue, pdfKey: 'uploads/2026/01/00000000.pdf' }, 422)
  await request(`/api/admin/publications/${draft.id}`, 'PUT', completeIssue)
  const publicIssue = (await request('/api/public/publications')).data.find(item => item.id === draft.id)
  assert.ok(publicIssue)
  assert.equal(publicIssue.updatedBy, undefined)
  const listed = (await request('/api/admin/media')).data.find(item => item.key === pdf.key)
  assert.ok(listed.usages.some(item => item.id === draft.id))
  await request(`/api/admin/media?key=${encodeURIComponent(pdf.key)}`, 'DELETE', null, 409)
  const secondUpload = new FormData()
  secondUpload.append('file', new Blob(['%PDF-1.4\n% replacement fixture\n%%EOF'], { type: 'application/pdf' }), 'local-replacement.pdf')
  const replacement = (await request('/api/admin/media', 'POST', secondUpload)).data
  media.push(replacement.key)
  await request(`/api/admin/publications/${draft.id}`, 'PUT', { ...completeIssue, pdfKey: replacement.key })
  assert.equal((await request('/api/public/publications')).data.find(item => item.id === draft.id).pdfKey, replacement.key)
  const r = { title: `Local research ${stamp}`, slug: `local-research-${stamp}`, status: 'draft', isFeatured: true }
  const rd = (await request('/api/admin/research', 'POST', r)).data
  created.push(['research', rd.id])
  await request(`/api/public/research/${rd.slug}`, 'GET', null, 404)
  const published = { ...rd, status: 'published', publishedAt: '2026-01-01', summary: 'LOCAL TEST ONLY', body: '<script>example text</script>', authors: 'Local test', institutions: 'Local test', journal: 'Local test', doi: '10.1234/local-test' }
  await request(`/api/admin/research/${rd.id}`, 'PUT', published)
  assert.equal((await request(`/api/public/research/${rd.slug}`)).data.createdBy, undefined)
  await request(`/api/admin/research/${rd.id}`, 'PUT', { ...published, publishedAt: '2099-01-01' })
  await request(`/api/public/research/${rd.slug}`, 'GET', null, 404)
  await request(`/api/admin/research/${rd.id}`, 'PUT', { ...published, status: 'archived' })
  await request(`/api/public/research/${rd.slug}`, 'GET', null, 404)
  await request('/api/admin/research', 'POST', r, 403, { Origin: 'https://other.invalid' })
  await request('/api/admin/publications', 'POST', issue, 409)
  console.log('PASS: draft privacy, validation, media upload, reference protection, replacement PDF, publish/read, metadata privacy, future dates, archive, duplicate prevention and cross-origin rejection')

  const { data: existingProgramme } = await request('/api/public/colloquium')
  for (const slug of ['inpa-colloquium-01-subhendu-rajbanshi', 'inpa-colloquium-02-neelam-upadhyay']) {
    assert.ok(existingProgramme.archive.some(item => item.slug === slug && item.posterPdfKey.endsWith('.pdf')))
    assert.ok((await request('/api/admin/content')).data.events.some(item => item.slug === slug))
  }

  const colloquium = {
    eventType: 'colloquium', slug: `local-colloquium-${stamp}`, title: 'Local colloquium fixture',
    summary: 'LOCAL TEST ONLY', body: 'Local seminar for testing the publication flow.',
    startAt: new Date(stamp - 120_000).toISOString(), endAt: new Date(stamp + 3_600_000).toISOString(),
    timezone: 'Asia/Kolkata', isOnline: true, isFeatured: false, status: 'draft',
    speaker: 'Local test speaker', speakerAffiliation: 'Local test affiliation', seminarLabel: 'Test seminar',
    posterPdfKey: pdf.key,
  }
  await request('/api/admin/events', 'POST', { ...colloquium, posterPdfKey: '/other.pdf' }, 422)
  const seminar = (await request('/api/admin/events', 'POST', colloquium)).data
  created.push(['events', seminar.id])
  const { data: draftProgramme } = await request('/api/public/colloquium')
  assert.ok(![...draftProgramme.upcoming, ...draftProgramme.archive].some(item => item.slug === seminar.slug))
  assert.ok((await request('/api/admin/media')).data.find(item => item.key === pdf.key).usages.some(item => item.id === seminar.id))
  await request(`/api/admin/media?key=${encodeURIComponent(pdf.key)}`, 'DELETE', null, 409)

  const eventPath = `/api/admin/events/${seminar.id}`
  await request(eventPath, 'PUT', { ...colloquium, status: 'published' })
  assert.ok((await request('/api/public/events')).data.some(item => item.slug === seminar.slug))
  const { data: liveProgramme } = await request('/api/public/colloquium')
  const liveSeminar = liveProgramme.upcoming.find(item => item.slug === seminar.slug)
  assert.equal(liveSeminar?.speaker, colloquium.speaker)
  assert.equal(liveSeminar?.posterPdfKey, pdf.key)

  await request(eventPath, 'PUT', { ...colloquium, status: 'published', endAt: new Date(stamp - 60_000).toISOString() })
  const { data: pastProgramme } = await request('/api/public/colloquium')
  assert.ok(!pastProgramme.upcoming.some(item => item.slug === seminar.slug))
  assert.equal(pastProgramme.archive.find(item => item.slug === seminar.slug)?.posterPdfKey, pdf.key)
  assert.ok(!(await request('/api/public/events')).data.some(item => item.slug === seminar.slug))
  assert.ok((await request('/api/public/events/archive')).data.some(item => item.slug === seminar.slug))
  const programmeHtml = await (await fetch(`${base}/activities/young-scientist-colloquium`)).text()
  assert.ok(programmeHtml.includes(`href="/media/${pdf.key}"`))
  const eventHtml = await (await fetch(`${base}/events/${seminar.slug}`)).text()
  assert.ok(eventHtml.includes(`href="/media/${pdf.key}"`))

  await request(eventPath, 'PUT', { ...colloquium, eventType: 'general', status: 'published' })
  const { data: generalProgramme } = await request('/api/public/colloquium')
  assert.ok(![...generalProgramme.upcoming, ...generalProgramme.archive].some(item => item.slug === seminar.slug))
  console.log('PASS: colloquium migration, automatic listing and archive, PDF links and reference protection')
} finally {
  for (const [kind, id] of created.reverse()) await request(`/api/admin/${kind}/${id}`, 'DELETE')
  for (const key of media) await request(`/api/admin/media?key=${encodeURIComponent(key)}`, 'DELETE')
  console.log('Local test records and uploaded fixtures removed; audit history retained.')
}
