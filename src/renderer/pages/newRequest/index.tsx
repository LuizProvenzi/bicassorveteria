import { Controller, useForm } from 'react-hook-form';
import Text from '../../components/Text';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useEffect, useState } from 'react';
import Input from '../../components/Input';
import { Select } from '../../components/Select';
import Button from '../../components/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { formatArrayToSelect } from '../../utils/functions';
import PriceInput from '../../components/PriceInput';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

interface Option {
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  details: any;
  cost: string;
  producible: boolean;
}

interface FormValues {
  product: any;
  details: any[];
  price: string;
  client: string;
  description: string;
}

export default function NewRequest() {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Option[]>([]);
  const [details, setDetails] = useState<Option[]>([]);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-expect-error Select type error
    resolver: yupResolver(schema),
    defaultValues: {
      product: null,
      details: [],
    },
  });

  const formatDetails = (data: { name: string }[]) => {
    return data.map((item, index) => ({
      label: item.name,
      value: (index + 1).toString(),
    }));
  };

  const handleChangeCost = (value: any) => {
    setValue('price', value.toString());
  };

  const handleChangeProduct = (value: Product) => {
    setValue('product', value);
    const formattedDetails = formatDetails(value.details);

    if (value.cost !== 'Varíavel') {
      setValue('price', value.cost);
    }

    setDetails(formattedDetails);
  };

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productsList = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Product,
    );

    const formattedProducts = formatArrayToSelect(productsList, 'id', 'name');

    setProducts(formattedProducts);
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    const today = new Date();

    try {
      const newRequest = {
        client: values.client,
        description: values.description ? values.description : '',
        name: values.product.name,
        open: values.product.producible ? true : false,
        details: values.details,
        price: values.price,
        date: moment(today).format('DD/MM/YYYY'),
      };

      const requestsCollection = collection(db, 'requests');
      await addDoc(requestsCollection, newRequest);

      navigate('/requests');
      setLoading(false);
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error);
      setLoading(false);
    }
  };

  const goToRequests = () => {
    navigate('/requests');
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="d-flex flex-column content-container">
      <div className="d-flex mt-3 mb-5 justify-content-start">
        <Text className="white f-5 bold">Criar pedido</Text>
      </div>

      <form
        className="d-flex form-container flex-column"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="d-flex flex-column">
          <div className="d-flex flex-wrap mb-4 gap-4">
            <div className="form-group">
              <Controller
                name="product"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={<Text className="white f-2 bold mb-1">Produto</Text>}
                    disabled={loading}
                    onChange={handleChangeProduct}
                    options={products}
                    placeholder="Selecione o produto"
                  />
                )}
              />
              {errors.product && (
                <Text className="text-danger">{errors.product.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="details"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={
                      <Text className="white f-2 bold mb-1">Detalhes</Text>
                    }
                    disabled={loading || (details && details.length === 0)}
                    options={details}
                    isMulti
                    placeholder="Selecione os detalhes"
                  />
                )}
              />
              {errors.details && (
                <Text className="text-danger">{errors.details.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="client"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={<Text className="white f-2 bold mb-1">Cliente</Text>}
                    placeholder="Digite o nome"
                    disabled={loading}
                  />
                )}
              />
              {errors.client && (
                <Text className="text-danger">{errors.client.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <PriceInput
                    {...field}
                    label={
                      <Text className="white f-2 bold mb-1">Valor R$</Text>
                    }
                    placeholder="Digite o valor"
                    onChange={(value) => handleChangeCost(value)}
                    disabled={loading}
                  />
                )}
              />
              {errors.price && (
                <Text className="text-danger">{errors.price.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={
                      <Text className="white f-2 bold mb-1">Descrição</Text>
                    }
                    placeholder="Digite o descrição"
                    disabled={loading}
                  />
                )}
              />
              {errors.description && (
                <Text className="text-danger">
                  {errors.description.message}
                </Text>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3 mt-3 mb-5">
          <Button
            className="cancel-button"
            onClick={goToRequests}
            loading={loading}
          >
            <Text className="f-3 bold white">Cancelar</Text>
          </Button>

          <Button type="submit" className="green-button" loading={loading}>
            <Text className="f-3 bold white">Salvar</Text>
          </Button>
        </div>
      </form>
    </div>
  );
}
