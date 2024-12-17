interface Option {
  label: string;
  value: string;
}

export const formatArrayToSelect = (
  data: any[],
  id: string,
  label: string,
): Option[] => {
  return data.map((item) => {
    return {
      value: item[id],
      label: item[label] ? item[label] : 'Sem nome',
      ...item,
    };
  });
};
