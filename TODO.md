# TODO

Remove items that are finished.
If "BE Block" is specified in an item, it means that at the moment of writing the backend still needed an updated before the item can be implemented in the frontend. Check first if they are ready before attempting the implementation on the frontend.

## To implement
- (BE Block) Some MS Searches are missing Chemical Alphabet filters (e.g. CHNOPS). Requires Backend update.
- (BE Block) For LC searches (LC-MS and LC-IM-MS Searches), scores should be properly represented after BE fix. See L-palmitoylcarnitine on LC-MS Search demo results, feature 2 (422.32), adduct [M+Na]+ -- which BE currently returns with some scores but are not being shown in results.
- (BE Block) MSMS Search: in results also specify if the match comes from predicted or experimental spectra. Also add a new input field to select ALL/experimental/predicted. This requires the right BE implementation.
- (BE Block) Better MSMS Search demo data with multiple experiments to test if switching comparisons works well.
- Review inconsistent spacing for most forms: a lot of empty space, missaligned boxes, inconsistent sizes... (only implement if you're sure of what you're doing).


## For Manual Human Review
- (BE Block) Scores representation for LC searches after BE fix. -> HUMAN REVIEW IF FINAL SCORE OR MULTIPLE. See L-palmitoylcarnitine on LC-MS Search, feature 2 (422.32), adduct [M+Na]+.
- (BE Block) HUMAN REVIEW: New feature: implement GC-MS Batch Search that "allows uploading a csv with format 'KRI spectrum' (?) like e.g. 45:222, 57:12333".
- FOR HUMAN REVIEW: GCMS Search: "New GMCS Spectra Score Column: Crear pesos para RI difference + score del espectro. A poder ser con base científica (paper que lo soporte)."
- FOR HUMAN REVIEW: Overall review of all form structures. Structure of different elements seems messed up: inconsistent spacing, margins, etc. Multi line boxes (e.g. mzs/experimental masses) seem inconsistent in format.
- Forms: all boxes for multiple data values such as experimental masses, retention times, etc., all the values should be able to be put as different new lines, and be that way by default for demo data (currently it's comma separated values).
