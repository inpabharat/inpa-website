# Single-step geographic map expansion

Date: 30 September 2026. Supersedes `0005-expand-map-markers.md`.

## Interaction

One click on a crowded group fits its geographic extent and reveals every member. There are no nested groups in the focused view. The outline, boundaries, markers and line anchors share one 380 ms animation driven by the same view coordinates, including when returning to India. Reduced-motion preferences skip the animation. Individual targets remain a fixed readable size.

Source coordinates determine positions. When targets still overlap after the single zoom, the closest available screen positions are used, with short leader lines back to the stored coordinates. Targets avoid the heading, overview and zoom controls. The focused phone canvas grows to at least 480 px in height, with additional capacity for especially dense groups at narrow widths; the geographic projection retains its proportions. Original editorial offsets, circular expansion and the phone-wide numbered grid are no longer used. National grouping uses a 44 px centre-distance threshold.

Clicking a marker updates its named preview and profile without scrolling away from the map. The matching region list uses the same numbers. View profile explicitly reveals the profile. Dragging or arrow keys pan an enlarged map; plus/minus controls allow optional manual adjustment. Clear map space, All locations, India or Escape returns to the national view. Filters reset the view. All 44 institutions, their source coordinates, categories, profiles and official links are preserved.

## Reference boundaries

Locally hosted geoBoundaries layers add state/UT lines from scale 1.5 and district lines from scale 3. Only polygons intersecting the viewport are rendered; labels avoid targets and other labels. Latitude/longitude guides and an India overview provide geographic context. Layer requests occur only when zooming, are reused during the page session, and expose a retry message on failure. No paid map service, runtime map dependency or external browser request is introduced.

Pinned source commit: `9469f09592ced973a3448cf66b6100b741b64c0d`. State source: DataMeet / Election Commission of India, 36 features, CC BY 2.5 India, metadata year 2011. District source: Pathways Data / lgdirectory.gov.in, 735 features in the simplified file (metadata lists 736), ODbL 1.0, year 2021. The page states these dates and does not present the layers as current administrative authority. Sources, licence notices, modification statements and the modified downloadable databases are available in `public/maps/attribution.txt` and the neighbouring JSON files. The district database is distributed under ODbL independently of the application and institution data.

The source geometry is simplified at 0.003 degrees and projected with the institution coordinate mapping. It is clipped for display to the existing Survey of India national outline. The map and source institution coordinates remain approximate. Administrative reorganisations since the source vintages may not be represented. Geometry can be regenerated with Node >=22.18 and `node scripts/prepare-map-boundaries.mjs <source-directory>` using the pinned simplified GeoJSON and metadata files linked in the checked-in metadata.

## Validation and rollback

Unit checks preserve every institution through grouping and one-step expansion, verify readable separation across phone/desktop widths, retain exact source anchors, protect map controls, check coordinate guides and validate boundary feature identities, geometry and viewport culling. Run `pnpm typecheck`, `pnpm lint`, `pnpm test` and `pnpm build`. Browser checks cover 320/390 px phones, desktop, region opening, selection, filters, map closing, keyboard navigation, boundary display and horizontal overflow. A screen-reader certification is not claimed.

No database migration is needed. Revert this change to restore the previous interaction, or follow `docs/deployment.md` to roll back the Worker. The pre-change production deployment was `077c48e7-5427-484e-9a00-efaf8f1522ab`; verify the live deployment history before rollback.
