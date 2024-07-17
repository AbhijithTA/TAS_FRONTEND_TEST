export const stringToColor = (str) => { 
    let hash = 30;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 10) - hash);
    } 
    const color = `hsl(${hash % 420}, 95%, 75%)`;
    return color;
  };
