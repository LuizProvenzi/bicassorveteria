import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import Text from '../../components/Text';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { useEffect, useState } from 'react';
import Input from '../../components/Input';
import { Select } from '../../components/Select';
import Button from '../../components/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import Icon from '../../components/Icon';
import { useNavigate, useParams } from 'react-router-dom';
import PriceInput from '../../components/PriceInput';

interface Option {
  label: string;
  value: string;
}

interface FormValues {
  id: string;
  producible: Option;
  details: any[];
  name: string;
  cost: string;
}

export default function NewProduct() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const producibleOptions: Option[] = [
    { label: 'Sim', value: '1' },
    { label: 'Não', value: '2' },
  ];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-expect-error Select type error
    resolver: yupResolver(schema),
    defaultValues: {
      producible: null as unknown as Option,
      details: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  const producibleValue = useWatch({
    control,
    name: 'producible',
  });

  const handleChangeCost = (value: any) => {
    setValue('cost', value.toString());
  };

  const goToProducts = () => {
    navigate('/products');
  };

  const fetchProductDetails = async () => {
    if (id) {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const productData = { id: docSnap.id, ...docSnap.data() } as FormValues;

        setValue('name', productData?.name);
        setValue('details', productData?.details);

        setValue(
          'producible',
          productData?.producible
            ? { label: 'Sim', value: '1' }
            : { label: 'Não', value: '2' },
        );

        if (!productData.producible) {
          setValue('cost', productData.cost);
        }
      } else {
        console.error('Carro não encontrado!');
      }
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      const newProduct = {
        producible: values.producible.value === '1' ? true : false,
        name: values.name,
        cost: values.producible.value === '1' ? 'Variável' : values.cost,
        details:
          values.details && values.details.length > 0 ? values.details : [],
      };

      if (id && id !== 'false') {
        const productDocRef = doc(db, 'products', id);
        await updateDoc(productDocRef, newProduct);

        navigate('/products');
        setLoading(false);
      } else {
        const productsCollection = collection(db, 'products');
        await addDoc(productsCollection, newProduct);

        navigate('/products');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <div className="d-flex flex-column content-container">
      <div className="d-flex mt-3 mb-5 justify-content-start">
        <Text className="white f-5 bold">Criar produto</Text>
      </div>

      <form
        className="d-flex form-container flex-column"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="d-flex flex-column">
          <div className="d-flex flex-wrap mb-4 gap-4">
            <div className="form-group">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={<Text className="white f-2 bold mb-1">Nome</Text>}
                    placeholder="Digite o nome"
                    disabled={loading}
                  />
                )}
              />
              {errors.name && (
                <Text className="text-danger">{errors.name.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="producible"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={
                      <Text className="white f-2 bold mb-1">Produzível</Text>
                    }
                    disabled={loading}
                    options={producibleOptions}
                    placeholder="Selecione sim ou não"
                  />
                )}
              />
              {errors.producible && (
                <Text className="text-danger">{errors.producible.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="cost"
                control={control}
                render={({ field }) => (
                  <PriceInput
                    {...field}
                    label={
                      <Text className="white f-2 bold mb-1">Valor R$</Text>
                    }
                    placeholder="Digite o valor"
                    onChange={(value) => handleChangeCost(value)}
                    disabled={
                      loading ||
                      (producibleValue && producibleValue.value === '1')
                    }
                  />
                )}
              />
              {errors.cost && (
                <Text className="text-danger">{errors.cost.message}</Text>
              )}
            </div>

            {producibleValue && producibleValue.value === '1' && (
              <div className="expenses-section mb-4">
                <Text className="white f-3 bold mb-2">Detalhes</Text>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="d-flex gap-3 mb-3 align-items-center"
                  >
                    <Controller
                      name={`details.${index}.name` as const}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label={
                            <Text className="white f-2 bold mb-1">Nome</Text>
                          }
                          placeholder="Nome"
                          disabled={loading}
                        />
                      )}
                    />

                    <div className="d-flex mt-4">
                      <Icon
                        name="RiDeleteBin7Line"
                        size={25}
                        onClick={() => remove(index)}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  onClick={() =>
                    append({
                      name: '',
                    })
                  }
                  className="black-button"
                  loading={loading}
                >
                  <Icon name="RiAddFill" size={18} />

                  <Text className="f-3 bold white">Adicionar detalhe</Text>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3 mt-3 mb-5">
          <Button
            className="cancel-button"
            onClick={goToProducts}
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
