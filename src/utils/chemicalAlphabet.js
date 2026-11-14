export const CHEMICAL_ALPHABET_OPTIONS = ["ALL", "CHNOPS", "CHNOPSCL"];

export const toDeuteriumAwareAlphabet = (
  chemicalAlphabet,
  deuteriumEnabled
) => {
  if (!deuteriumEnabled || chemicalAlphabet === "ALL") {
    return chemicalAlphabet;
  }

  if (chemicalAlphabet === "CHNOPS") {
    return "CHNOPSD";
  }

  if (chemicalAlphabet === "CHNOPSCL") {
    return "CHNOPSCLD";
  }

  return chemicalAlphabet;
};
