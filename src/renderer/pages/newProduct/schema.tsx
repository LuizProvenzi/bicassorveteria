import * as yup from 'yup';

export const schema = yup.object().shape({
  producible: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .required('Produto é obrigatório'),
  name: yup.string().required('Cliente é obrigatório'),
  cost: yup.string(),
});
