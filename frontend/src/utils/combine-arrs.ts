interface Item {
  id: any;
}

export const combineUniqueById = (array1: Item[], array2: Item[]) => {
  const combinedArray: Item[] = array1.concat(array2);

  return combinedArray.reduce((acc: Item[], current) => {
    const x = acc.find((item) => item.id === current.id);
    if (!x) {
      acc.push(current);
    }
    return acc;
  }, []);
};
