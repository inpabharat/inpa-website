# Institution directory corrections

## 27 September 2026

The user requested correcting the ambiguous Bareilly entry and adding official websites for Bareilly College and IIT Roorkee.

- **Bareilly College, Bareilly**: [college homepage](https://bcb.ac.in/) confirms the institution name and its affiliation with M.J.P. Rohilkhand University. The [university's affiliated-college list](https://mjpru.ac.in/Affiliated_collegeList.aspx) lists Bareilly College separately from the university campus. Replace the combined title and its generic summary with the college name and a description of the affiliation.
- **Official Bareilly website**: use `https://bcb.ac.in/`, verified in a browser. The [college admission portal](https://www.bcbonlineadmission.com/) also directs visitors to `www.bcb.ac.in`. The older `bareillycollege.org` address still listed in some directories redirected to unrelated content during verification and is excluded.
- **Faculty spelling**: the [college's Physics department](https://bcb.ac.in/physics/) lists **Dr Avinash Agarwal**. Correct the displayed spelling while retaining the existing researcher identifier. [IUAC's UFR status page](https://iuac.res.in/hi/node/9960) associates him with Bareilly College and a nuclear-reaction research project.
- **IIT Roorkee**: add `https://iitr.ac.in/`, verified from the [institute's official homepage](https://iitr.ac.in/).

Institution IDs, coordinates, categories, and the 44-entry directory remain unchanged. This correction does not represent a fresh audit of every research area, facility, or researcher in the dataset.

Validation: lint, typecheck, all 53 unit tests, and the production build passed. Both institution profiles and their exact website links were checked in the built Worker locally. The corrected Bareilly profile was visually inspected at 320 CSS px with no horizontal overflow.

Release uses the existing user authorisation to push to GitHub and production. The production version before this correction is `1733ce12-a7bd-47ca-8087-533773f02936`, verified with Wrangler on 27 September 2026. Restore that version with the procedure in `docs/deployment.md` if needed. No migration or content seed is required.
