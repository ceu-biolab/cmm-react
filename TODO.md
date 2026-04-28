# TODO

Remove items that are finished.
If "BE Block" is specified in an item, it means that at the moment of writing the backend still needed an updated before the item can be implemented in the frontend. Check first if they are ready before attempting the implementation on the frontend.

## To implement
- (BE Block) Create the page for LC-MS/MS Search after the endpoint is implemented in the backend.
- (BE Block) Browse Search is missing a Chemical Alphabet "CHNOPS" filter


## For Manual Human Review
- Deploy swagger manual
- Create and add Frontend Manual
- Add "Composite Spectra" box to LC-IM-MS Search ?
- (BE Block) CE-MS Searches: Reference / Marker compounds should be provided as a list, not as text, and changing depending on availability on the ionization mode, buffer and polarity. Requires new getter from backend. E.g. Positive formic 1M -> methionine; Negative formic 0.1M -> paracetamol, MES. Same with temperature, Capillary Length and Capillary Voltage. SEE OLD MEDIATOR
- (BE Block) Add RMT Searches for 1 and 2 markers.
- (BE Block) For GCMS Search, design "GCMS Spectra Score" ponderating RI Error + Score, preferably using scientific literature if available.
- (BE Block) Enable in all GC-MS a Fragment Search using tables compound_ce_product_ion -> ce_product_ion_mz. Use a checkbox to enable this fragment search. Search for spectrums at 100-125V?
- Review: "LC-IM-MS Search: igual que antes, ¿Se podrían poner 3 recuadros y añadir el Composite Spectra que servirá para el RT service y las anotaciones? El CCS puede quedar debajo, y arriba mzs, rts y composite spectra"
- Review inconsistent spacing for most forms: a lot of empty space, missaligned boxes, inconsistent sizes... (only implement if you're sure of what you're doing).
- Should adducts be set by default? -> Review new preselected fields.
- CEMS: Marker Compound should probably be a list?
- LC search score display: LC-MS/LC-IM-MS now render backend component scores (RT, adduct relation, ionization). Decide whether an aggregate final score should also be shown when the backend does not provide one.
- (BE Block) HUMAN REVIEW: New feature: implement GC-MS Batch Search that "allows uploading a csv with format 'KRI spectrum' (?) like e.g. 45:222, 57:12333".
- FOR HUMAN REVIEW: GCMS Search: "New GMCS Spectra Score Column: Crear pesos para RI difference + score del espectro. A poder ser con base científica (paper que lo soporte)."
- FOR HUMAN REVIEW: Overall review of all form structures. Structure of different elements seems messed up: inconsistent spacing, margins, etc. Multi line boxes (e.g. mzs/experimental masses) seem inconsistent in format.
