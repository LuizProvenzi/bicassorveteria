import * as yup from 'yup';

export const schema = yup.object().shape({
  product: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .required('Produto é obrigatório'),
  details: yup.array().nullable().required('Documentação é obrigatória'),
  client: yup.string().required('Cliente é obrigatório'),
  price: yup.string().required('Valor é obrigatório'),
  description: yup.string(),
});
