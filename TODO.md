# TODO

Remove items that are finished.
If "BE Block" is specified in an item, it means that at the moment of writing the backend still needed an updated before the item can be implemented in the frontend. Check first if they are ready before attempting the implementation on the frontend.

## To implement
- MS/MS demo data follow-up: the frontend can now switch comparisons and shows spectrum source, but the live `msmsSearch/request1.json` payload with `spectrumSource: "ALL"` currently returns only one experimental match. Replace the demo data when a backend-provided multi-experiment/multi-source request is available.
- Review inconsistent spacing for most forms: a lot of empty space, missaligned boxes, inconsistent sizes... (only implement if you're sure of what you're doing).


## For Manual Human Review
- Review the placeholders for multi line boxes
- Should adducts be set by default? -> Review new preselected fields.
- CEMS: Marker Compound should probably be a list?
- LC search score display: LC-MS/LC-IM-MS now render backend component scores (RT, adduct relation, ionization). Decide whether an aggregate final score should also be shown when the backend does not provide one.
- (BE Block) HUMAN REVIEW: New feature: implement GC-MS Batch Search that "allows uploading a csv with format 'KRI spectrum' (?) like e.g. 45:222, 57:12333".
- FOR HUMAN REVIEW: GCMS Search: "New GMCS Spectra Score Column: Crear pesos para RI difference + score del espectro. A poder ser con base científica (paper que lo soporte)."
- FOR HUMAN REVIEW: Overall review of all form structures. Structure of different elements seems messed up: inconsistent spacing, margins, etc. Multi line boxes (e.g. mzs/experimental masses) seem inconsistent in format.
- Forms: all boxes for multiple data values such as experimental masses, retention times, etc., all the values should be able to be put as different new lines, and be that way by default for demo data (currently it's comma separated values).
