import React, { useEffect, useRef } from "react";

const MoleculeViewer = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.$3Dmol) {
      console.error("$3Dmol is not loaded!");
      return;
    }

    const viewer = $3Dmol.createViewer(containerRef.current, {
      backgroundColor: "#f1f7f9",
    });

    const pdbData = `
HETATM    1  P   UNL     1       5.846  -1.965   0.000  1.00  0.00           P  
HETATM    2  P   UNL     1       8.466  -1.965   0.000  1.00  0.00           P  
HETATM    3  O   UNL     1       7.156  -1.965   0.000  1.00  0.00           O  
HETATM    4  O   UNL     1       4.546  -1.975   0.000  1.00  0.00           O  
HETATM    5  O   UNL     1       5.846  -3.275   0.000  1.00  0.00           O  
HETATM    6  O   UNL     1       5.846  -0.528   0.000  1.00  0.00           O  
HETATM    7  O   UNL     1       8.466  -3.275   0.000  1.00  0.00           O  
HETATM    8  O   UNL     1       9.775  -1.965   0.000  1.00  0.00           O  
HETATM    9  O   UNL     1       8.466  -0.528   0.000  1.00  0.00           O  
HETATM   10  C   UNL     1       3.412  -1.320   0.000  1.00  0.00           C  
HETATM   11  C   UNL     1       2.268  -1.975   0.000  1.00  0.00           C  
HETATM   12  C   UNL     1       1.134  -1.320   0.000  1.00  0.00           C  
HETATM   13  C   UNL     1       0.000  -1.975   0.000  1.00  0.00           C  
HETATM   14  C   UNL     1       1.134   0.000   0.000  1.00  0.00           C  
CONECT    1    3    4    5    5                                       
CONECT    1    6                                                      
CONECT    2    3    7    7    8                                       
CONECT    2    9                                                      
CONECT    3    1    2                                                 
CONECT    4    1   10                                                 
CONECT    5    1    1                                                 
CONECT    6    1                                                      
CONECT    7    2    2                                                 
CONECT    8    2                                                      
CONECT    9    2                                                      
CONECT   10    4   11                                                 
CONECT   11   10   12   12                                            
CONECT   12   11   11   13   14                                       
CONECT   13   12                                                      
CONECT   14   12                                                      
MASTER        0    0    0    0    0    0    0    0   14    0   14    0
END
    `;

    viewer.addModel(pdbData, "pdb");
    viewer.setStyle(
      {},
      {
        stick: { radius: 0.1, color: "#D8BFD8" },
        sphere: { radius: 0.3, color: "#5F9EA0" },
      }
    );
    viewer.zoomTo();
    viewer.render();
    viewer.resize();
  }, []);

  return <div className="viewer-wrapper" ref={containerRef} />;
};

export default MoleculeViewer;
