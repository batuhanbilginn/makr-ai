export const titleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
};

// Put dot every 3 digits
export const dottedNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
