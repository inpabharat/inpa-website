# Expand crowded institution markers

Date: 28 September 2026. Status: implemented.

## Decision

Retain the existing 42 CSS-pixel grouping rule for map targets, but treat each numbered group as an invitation to expand, rather than the final representation of its members. Selecting a group opens a focused map view with one numbered target per institution. Leader lines connect targets to their stored approximate map coordinates; the selected institution's line and anchor are emphasized while the others recede, keeping large phone groups legible. The selected group's member list uses the same numbers, so names remain easy to locate when the map is dense. Closing the group or pressing Escape restores the grouped map and focus. The full institution list remains the default phone view and the map's text alternative.

Expansion lays out up to nine members radially. Larger phone groups use the available map area as a numbered grid, sorted roughly north to south. The map outline and source-coordinate anchors remain visible. Other groups are hidden while one group is expanded to avoid competing targets. The open group is tracked by a member institution ID, so width-dependent regrouping does not silently close it.

This is a display interaction only. No institution, coordinate, category, link, or database record changes. Coordinates and lines are approximate because the source dataset and outline map are generalized; a line is a pointer to the stored coordinate, not a precise geodetic claim.

## Validation and rollback

Unit tests verify each group's institutions remain individually present, targets stay separated at phone and desktop widths, and line anchors equal the source projection. Check the built page at phone and desktop widths for group opening, closing, focus, filters, and horizontal overflow. No migration or new dependency is required. Reverting this commit restores the previous grouped-marker interaction; Worker rollback follows `docs/deployment.md`.
