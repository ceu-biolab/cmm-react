import React from "react";
import MoleculeViewer from "../components/search/MainPageViewer3D";
import CMMFinalHeader from "../assets/images/CEU-2.png";
import MainImage1 from "../assets/images/Main-Image-1.jpg";
import MainImage2 from "../assets/images/Main-Image-2.jpg";
import MainImage3 from "../assets/images/Main-Image-3.jpg";
import MainImage4 from "../assets/images/Main-Image-4.jpg";
import MainImage5 from "../assets/images/Main-Image-5.jpg";
import MainImage6 from "../assets/images/Main-Image-6.jpg";
import BWHeader from "../assets/images/CEMBIO-BW copy.jpg";

const MainWeb = () => {
  const mol2A = `@<TRIPOS>MOLECULE
*****
 128 127 0 0 0
SMALL
GASTEIGER

@<TRIPOS>ATOM
      1 C          10.6623   15.4595  -12.7951 C.3     1  UNL1       -0.0653
      2 C          12.0522   14.8872  -12.5776 C.3     1  UNL1       -0.0559
      3 C          12.0003   13.5934  -11.7688 C.3     1  UNL1       -0.0533
      4 C          13.4030   13.0311  -11.5553 C.3     1  UNL1       -0.0531
      5 C          13.3635   11.7370  -10.7477 C.3     1  UNL1       -0.0531
      6 C          14.7733   11.1891  -10.5433 C.3     1  UNL1       -0.0531
      7 C          14.7451    9.8927   -9.7429 C.3     1  UNL1       -0.0531
      8 C          16.1568    9.3480   -9.5349 C.3     1  UNL1       -0.0531
      9 C          16.1078    8.0553   -8.7318 C.3     1  UNL1       -0.0531
     10 C          17.4990    7.4706   -8.4947 C.3     1  UNL1       -0.0530
     11 C          17.3655    6.1855   -7.6838 C.3     1  UNL1       -0.0526
     12 C          18.7066    5.5020   -7.4255 C.3     1  UNL1       -0.0430
     13 C          18.5240    4.2111   -6.6199 C.3     1  UNL1        0.0450
     14 C          17.6118    3.2049   -7.2936 C.2     1  UNL1        0.3075
     15 O          16.7725    2.5407   -6.7051 O.2     1  UNL1       -0.2508
     16 O          17.8660    3.1495   -8.6292 O.3     1  UNL1       -0.4555
     17 C          16.9923    2.3267   -9.4267 C.3     1  UNL1        0.1604
     18 H          15.9556    2.5515   -9.1484 H       1  UNL1        0.0792
     19 C          17.2708    0.8262   -9.2219 C.3     1  UNL1        0.1315
     20 O          18.5898    0.3864   -9.6103 O.3     1  UNL1       -0.4608
     21 C          19.5891    0.5250   -8.6998 C.2     1  UNL1        0.3072
     22 O          19.5436    1.2100   -7.6851 O.2     1  UNL1       -0.2509
     23 C          20.7437   -0.4115   -8.9585 C.3     1  UNL1        0.0449
     24 C          20.8857   -0.8440  -10.4052 C.3     1  UNL1       -0.0430
     25 C          22.0279   -1.8417  -10.5946 C.3     1  UNL1       -0.0526
     26 C          22.0911   -2.2091  -12.0693 C.3     1  UNL1       -0.0530
     27 C          23.1935   -3.2070  -12.4005 C.3     1  UNL1       -0.0528
     28 C          23.2414   -3.4919  -13.9057 C.3     1  UNL1       -0.0496
     29 C          23.4576   -2.2504  -14.7774 C.3     1  UNL1       -0.0348
     30 C          24.7828   -1.5993  -14.4982 C.2     1  UNL1       -0.0879
     31 C          25.7772   -1.4544  -15.3846 C.2     1  UNL1       -0.0879
     32 C          25.7154   -1.8772  -16.8214 C.3     1  UNL1       -0.0348
     33 C          25.0559   -0.8051  -17.6917 C.3     1  UNL1       -0.0496
     34 C          25.8628    0.4920  -17.7045 C.3     1  UNL1       -0.0528
     35 C          25.2254    1.5412  -18.6067 C.3     1  UNL1       -0.0530
     36 C          26.0653    2.8161  -18.6073 C.3     1  UNL1       -0.0531
     37 C          25.4460    3.8743  -19.5132 C.3     1  UNL1       -0.0533
     38 C          26.2844    5.1493  -19.5247 C.3     1  UNL1       -0.0559
     39 C          25.6650    6.1971  -20.4331 C.3     1  UNL1       -0.0653
     40 C          17.1964    2.7227  -10.8913 C.3     1  UNL1        0.0951
     41 O          16.9685    4.1123  -11.0974 O.3     1  UNL1       -0.3236
     42 P          17.2398    4.5868  -12.6167 P.3     1  UNL1        0.2128
     43 O          18.6245    4.1755  -13.0358 O.co2   1  UNL1       -0.4373
     44 O          16.0457    4.2639  -13.4776 O.2     1  UNL1       -0.5172
     45 O          17.2410    6.2090  -12.4379 O.3     1  UNL1       -0.3221
     46 C          18.4046    6.8997  -12.8577 C.3     1  UNL1        0.0947
     47 C          18.7775    6.7128  -14.3474 C.3     1  UNL1       -0.0064
     48 N          17.7741    7.3088  -15.3820 N.4     1  UNL1        0.2385
     49 C          16.4317    6.5766  -15.2936 C.3     1  UNL1       -0.0417
     50 C          17.5743    8.7882  -15.1790 C.3     1  UNL1       -0.0417
     51 C          18.3391    7.0510  -16.7731 C.3     1  UNL1       -0.0417
     52 H          10.7218   16.3877  -13.3713 H       1  UNL1        0.0230
     53 H          10.1768   15.6815  -11.8395 H       1  UNL1        0.0230
     54 H          10.0315   14.7551  -13.3464 H       1  UNL1        0.0230
     55 H          12.6705   15.6271  -12.0560 H       1  UNL1        0.0263
     56 H          12.5223   14.6993  -13.5500 H       1  UNL1        0.0263
     57 H          11.3820   12.8537  -12.2919 H       1  UNL1        0.0265
     58 H          11.5268   13.7821  -10.7975 H       1  UNL1        0.0265
     59 H          14.0213   13.7711  -11.0325 H       1  UNL1        0.0265
     60 H          13.8764   12.8427  -12.5267 H       1  UNL1        0.0265
     61 H          12.7487   10.9931  -11.2690 H       1  UNL1        0.0265
     62 H          12.8928   11.9212   -9.7742 H       1  UNL1        0.0265
     63 H          15.3855   11.9326  -10.0186 H       1  UNL1        0.0265
     64 H          15.2446   11.0094  -11.5172 H       1  UNL1        0.0265
     65 H          14.1352    9.1475  -10.2686 H       1  UNL1        0.0265
     66 H          14.2694   10.0694   -8.7701 H       1  UNL1        0.0265
     67 H          16.7675   10.0904   -9.0072 H       1  UNL1        0.0265
     68 H          16.6312    9.1645  -10.5063 H       1  UNL1        0.0265
     69 H          15.4895    7.3210   -9.2635 H       1  UNL1        0.0265
     70 H          15.6218    8.2432   -7.7662 H       1  UNL1        0.0265
     71 H          18.1265    8.1921   -7.9586 H       1  UNL1        0.0265
     72 H          17.9845    7.2618   -9.4557 H       1  UNL1        0.0265
     73 H          16.6980    5.5062   -8.2264 H       1  UNL1        0.0265
     74 H          16.8822    6.4064   -6.7243 H       1  UNL1        0.0265
     75 H          19.3643    6.1791   -6.8672 H       1  UNL1        0.0270
     76 H          19.2086    5.2884   -8.3774 H       1  UNL1        0.0270
     77 H          18.0860    4.4578   -5.6463 H       1  UNL1        0.0377
     78 H          19.4930    3.7360   -6.4387 H       1  UNL1        0.0377
     79 H          16.5752    0.2536   -9.8474 H       1  UNL1        0.0736
     80 H          17.0876    0.5083   -8.1904 H       1  UNL1        0.0736
     81 H          20.5879   -1.2880   -8.3199 H       1  UNL1        0.0377
     82 H          21.6627    0.0921   -8.6376 H       1  UNL1        0.0377
     83 H          21.0511    0.0400  -11.0342 H       1  UNL1        0.0270
     84 H          19.9553   -1.3090  -10.7532 H       1  UNL1        0.0270
     85 H          21.8624   -2.7378   -9.9860 H       1  UNL1        0.0265
     86 H          22.9787   -1.3957  -10.2771 H       1  UNL1        0.0265
     87 H          22.2425   -1.2778  -12.6236 H       1  UNL1        0.0265
     88 H          21.1269   -2.6220  -12.3914 H       1  UNL1        0.0265
     89 H          23.0141   -4.1485  -11.8679 H       1  UNL1        0.0265
     90 H          24.1626   -2.8335  -12.0512 H       1  UNL1        0.0265
     91 H          22.2996   -3.9669  -14.2090 H       1  UNL1        0.0268
     92 H          24.0363   -4.2216  -14.1067 H       1  UNL1        0.0268
     93 H          22.6623   -1.5122  -14.6311 H       1  UNL1        0.0307
     94 H          23.3606   -2.5524  -15.8242 H       1  UNL1        0.0307
     95 H          24.9273   -1.1954  -13.4995 H       1  UNL1        0.0569
     96 H          26.6870   -0.9467  -15.0654 H       1  UNL1        0.0569
     97 H          25.1727   -2.8227  -16.9258 H       1  UNL1        0.0307
     98 H          26.7335   -2.0816  -17.1771 H       1  UNL1        0.0307
     99 H          24.0371   -0.5987  -17.3324 H       1  UNL1        0.0268
    100 H          24.9549   -1.1895  -18.7124 H       1  UNL1        0.0268
    101 H          26.8827    0.2793  -18.0476 H       1  UNL1        0.0265
    102 H          25.9419    0.9014  -16.6906 H       1  UNL1        0.0265
    103 H          24.2103    1.7655  -18.2555 H       1  UNL1        0.0265
    104 H          25.1383    1.1504  -19.6271 H       1  UNL1        0.0265
    105 H          27.0827    2.5861  -18.9470 H       1  UNL1        0.0265
    106 H          26.1473    3.2054  -17.5848 H       1  UNL1        0.0265
    107 H          24.4303    4.1030  -19.1683 H       1  UNL1        0.0265
    108 H          25.3607    3.4790  -20.5326 H       1  UNL1        0.0265
    109 H          27.3009    4.9254  -19.8687 H       1  UNL1        0.0263
    110 H          26.3666    5.5518  -18.5083 H       1  UNL1        0.0263
    111 H          25.6006    5.8309  -21.4628 H       1  UNL1        0.0230
    112 H          26.2709    7.1078  -20.4314 H       1  UNL1        0.0230
    113 H          24.6558    6.4566  -20.0975 H       1  UNL1        0.0230
    114 H          16.5107    2.1572  -11.5315 H       1  UNL1        0.0602
    115 H          18.2277    2.4974  -11.1896 H       1  UNL1        0.0602
    116 H          19.2405    6.5733  -12.2300 H       1  UNL1        0.0618
    117 H          18.2569    7.9589  -12.6298 H       1  UNL1        0.0618
    118 H          18.9100    5.6736  -14.6462 H       1  UNL1        0.0838
    119 H          19.7276    7.2301  -14.5296 H       1  UNL1        0.0838
    120 H          15.9530    6.8181  -14.3446 H       1  UNL1        0.0778
    121 H          16.6198    5.5114  -15.4319 H       1  UNL1        0.0778
    122 H          15.7987    6.9408  -16.1095 H       1  UNL1        0.0778
    123 H          17.1018    8.9618  -14.2098 H       1  UNL1        0.0778
    124 H          16.9266    9.1640  -15.9772 H       1  UNL1        0.0778
    125 H          18.5513    9.2788  -15.2276 H       1  UNL1        0.0778
    126 H          18.4742    5.9733  -16.9087 H       1  UNL1        0.0778
    127 H          19.2972    7.5715  -16.8629 H       1  UNL1        0.0778
    128 H          17.6314    7.4379  -17.5137 H       1  UNL1        0.0778
@<TRIPOS>UNITY_ATOM_ATTR
43 1
charge -1
48 1
charge 1
@<TRIPOS>BOND
     1     1     2    1
     2     2     3    1
     3     3     4    1
     4     4     5    1
     5     5     6    1
     6     6     7    1
     7     7     8    1
     8     8     9    1
     9     9    10    1
    10    10    11    1
    11    11    12    1
    12    12    13    1
    13    13    14    1
    14    14    15    2
    15    14    16    1
    16    17    19    1
    17    19    20    1
    18    20    21    1
    19    21    22    2
    20    21    23    1
    21    23    24    1
    22    24    25    1
    23    25    26    1
    24    26    27    1
    25    27    28    1
    26    28    29    1
    27    29    30    1
    28    30    31    2
    29    31    32    1
    30    32    33    1
    31    33    34    1
    32    34    35    1
    33    35    36    1
    34    36    37    1
    35    37    38    1
    36    38    39    1
    37    17    40    1
    38    40    41    1
    39    41    42    1
    40    42    43    1
    41    42    44    2
    42    42    45    1
    43    45    46    1
    44    46    47    1
    45    47    48    1
    46    48    49    1
    47    48    50    1
    48    48    51    1
    49    17    18    1
    50    17    16    1
    51     1    52    1
    52     1    53    1
    53     1    54    1
    54     2    55    1
    55     2    56    1
    56     3    57    1
    57     3    58    1
    58     4    59    1
    59     4    60    1
    60     5    61    1
    61     5    62    1
    62     6    63    1
    63     6    64    1
    64     7    65    1
    65     7    66    1
    66     8    67    1
    67     8    68    1
    68     9    69    1
    69     9    70    1
    70    10    71    1
    71    10    72    1
    72    11    73    1
    73    11    74    1
    74    12    75    1
    75    12    76    1
    76    13    77    1
    77    13    78    1
    78    19    79    1
    79    19    80    1
    80    23    81    1
    81    23    82    1
    82    24    83    1
    83    24    84    1
    84    25    85    1
    85    25    86    1
    86    26    87    1
    87    26    88    1
    88    27    89    1
    89    27    90    1
    90    28    91    1
    91    28    92    1
    92    29    93    1
    93    29    94    1
    94    30    95    1
    95    31    96    1
    96    32    97    1
    97    32    98    1
    98    33    99    1
    99    33   100    1
   100    34   101    1
   101    34   102    1
   102    35   103    1
   103    35   104    1
   104    36   105    1
   105    36   106    1
   106    37   107    1
   107    37   108    1
   108    38   109    1
   109    38   110    1
   110    39   111    1
   111    39   112    1
   112    39   113    1
   113    40   114    1
   114    40   115    1
   115    46   116    1
   116    46   117    1
   117    47   118    1
   118    47   119    1
   119    49   120    1
   120    49   121    1
   121    49   122    1
   122    50   123    1
   123    50   124    1
   124    50   125    1
   125    51   126    1
   126    51   127    1
   127    51   128    1
`;

  return (
    <div>
      <section className="full-width-section-main">
        <img src={CMMFinalHeader} alt="CMM Header" />
      </section>
      <section className="full-width-section-main">
        <div className="whiteBlock"></div>
      </section>

      <main className="main-container">
        <section className="section-1 section-1-container">
          <div className="section-1-left">
            <h2>Metabolite Identification ➤</h2>
            <h4>
              Using Kegg, HMDB, LipidMaps, Metlin, NP Atlas, KNApSAck, MINE, and
              an in-house library, CEU Mass Mediator identifies metabolites
              faster, simpler, and with less errors.
            </h4>
            <img
              src={MainImage1}
              alt="Main laboratory image"
              className="main-image-one-structure"
            />
          </div>
        </section>
        <section className="section-2">
          <div className="citation-heading">
            <h2>Interactive</h2>
            <h4>Structural Analysis</h4>
          </div>
          <div className="molecule-viewer-main-page">
            <MoleculeViewer
              mol2Data={mol2A}
              className="custom-molecule-viewer custom-molecule-viewer-main-page"
            />
          </div>
        </section>
        <section className="section-3">
          <section className="cards scrollable-cards">
            <a
              href="https://www.sciencedirect.com/science/article/abs/pii/S0731708517326559"
              target="_blank"
              rel="noopener noreferrer"
              className="card"
            >
              <div className="card-content">
                <h3 className="card-title">Batch Search</h3>
                <h4 className="card-description">Mass Spectrometry</h4>
                <img
                  src={MainImage3}
                  alt="Lab image 3"
                  className="card-image"
                />
              </div>
            </a>
            <a
              href="https://pubs.acs.org/doi/abs/10.1021/acs.jproteome.8b00720"
              target="_blank"
              rel="noopener noreferrer"
              className="card"
            >
              <div className="card-content">
                <h3 className="card-title">Browse Search</h3>
                <h4 className="card-description">Mass Spectrometry</h4>
                <img
                  src={MainImage4}
                  alt="Lab image 4"
                  className="card-image"
                />
              </div>
            </a>
            <a
              href="https://pubs.acs.org/doi/abs/10.1021/acs.jproteome.8b00720"
              target="_blank"
              rel="noopener noreferrer"
              className="card"
            >
              <div className="card-content">
                <h3 className="card-title">MS/MS Search</h3>
                <h4 className="card-description">
                  Liquid Chromatography-Mass Spectrometry
                </h4>
                <img
                  src={MainImage5}
                  alt="Lab image 4"
                  className="card-image"
                />
              </div>
            </a>
            <a
              href="https://pubs.acs.org/doi/abs/10.1021/acs.jproteome.8b00720"
              target="_blank"
              rel="noopener noreferrer"
              className="card"
            >
              <div className="card-content">
                <h3 className="card-title">LC-IM-MS Search</h3>
                <h4 className="card-description">
                  Liquid Chromatography-Mass Spectrometry
                </h4>
                <img
                  src={MainImage2}
                  alt="Lab image 4"
                  className="card-image"
                />
              </div>
            </a>
            <a
              href="https://pubs.acs.org/doi/abs/10.1021/acs.jproteome.8b00720"
              target="_blank"
              rel="noopener noreferrer"
              className="card"
            >
              <div className="card-content">
                <h3 className="card-title">IM-MS Search</h3>
                <h4 className="card-description">Collisional Cross Section</h4>
                <img
                  src={MainImage6}
                  alt="Lab image 4"
                  className="card-image"
                />
              </div>
            </a>
          </section>
        </section>
        <section className="section-4 section-4-container"></section>
        <section className="section-5">
          <h2 className="citation-heading">CMM Citations</h2>
          <section className="citation-links scrollable-citations">
            <a
              href="https://www.sciencedirect.com/science/article/abs/pii/S0731708517326559"
              target="_blank"
              className="citation-link"
            >
              <strong>CMM 2.0:</strong> Gil-de-la-Fuente A., Godzien J. et al.
              Knowledge-based metabolite annotation tool: CEU Mass Mediator.{" "}
              <em>
                Journal of Pharmaceutical and Biomedical Analysis, 2018, 154,
                138-149.
              </em>
            </a>
            <a
              href="https://pubs.acs.org/doi/abs/10.1021/acs.jproteome.8b00720"
              target="_blank"
              className="citation-link"
            >
              <strong>CMM 3.0:</strong> Gil-de-la-Fuente A., Godzien J. et al.
              CEU Mass Mediator 3.0: A Metabolite Annotation Tool.{" "}
              <em>Journal of Proteome Research 2019, 18 (2), 797-802.</em>
            </a>
            <a
              href="https://www.sciencedirect.com/science/article/abs/pii/S0021967320310323"
              target="_blank"
              className="citation-link"
            >
              <strong>CE-MS Database:</strong> Mamani-Huanca, M.,
              Gil-de-la-Fuente A. et al. Enhancing confidence of metabolite
              annotation in Capillary Electrophoresis-Mass Spectrometry
              untargeted metabolomics with relative migration time and in-source
              fragmentation.{" "}
              <em>Journal of Chromatography A 2020, 1635 (4), 461758.</em>
            </a>
            <a
              href="https://jcheminf.biomedcentral.com/articles/10.1186/s13321-022-00613-8"
              target="_blank"
              className="citation-link"
            >
              <strong>RT Pred search:</strong> García, C.A., Gil-de-la-Fuente,
              A., Barbas, C. et al. Probabilistic metabolite annotation using
              retention time prediction and meta-learned projections.{" "}
              <em>Journal of Cheminformatics 2022, 14, 33.</em>
            </a>
          </section>
        </section>
      </main>
      <section className="full-width-section-main">
        <img src={BWHeader} alt="CMM Header" />
      </section>
    </div>
  );
};

export default MainWeb;
