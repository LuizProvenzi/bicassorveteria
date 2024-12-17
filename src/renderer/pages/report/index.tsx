import { collection, getDocs } from 'firebase/firestore';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import { db } from '../../../firebase';
import { useEffect, useState } from 'react';
import { Select } from '../../components/Select';
import { formatArrayToSelect } from '../../utils/functions';
import PaginatedTable from './components/PaginatedTable';
import DatePicker from '../../components/DatePicker';

interface Option {
  label: string;
  value: string;
}

interface Request {
  client: string;
  description: string;
  details: any;
  name: string;
  open: boolean;
  price: string;
}

interface Product {
  id: string;
  name: string;
  details: any;
  cost: string;
  producible: boolean;
}

export default function Report() {
  const [requestList, setRequestList] = useState<any[]>([]);
  const [products, setProducts] = useState<Option[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [total, setTotal] = useState<string>('0');
  const [date, setDate] = useState<string>();

  const handleChangeDate = (value: any) => {
    setDate(value);
  };

  const columns = [
    {
      key: 'name',
      name: <Text className="gray-2 f-2 bold">Nome</Text>,
      render: (entity: Request) => (
        <Text className="gray-2 f-2">{entity.name ? entity.name : '-'}</Text>
      ),
    },
    {
      key: 'producible',
      name: <Text className="gray-2 f-2 bold">Descrição</Text>,
      render: (entity: Request) => (
        <Text className="gray-2 f-2">
          {entity.description ? entity.description : '-'}
        </Text>
      ),
    },
    {
      key: 'client',
      name: <Text className="gray-2 f-2 bold">Cliente</Text>,
      render: (entity: Request) => (
        <Text className="gray-2 f-2">
          {entity.client ? entity.client : '-'}
        </Text>
      ),
    },
    {
      key: 'price',
      name: <Text className="gray-2 f-2 bold">Valor</Text>,
      render: (entity: Request) => (
        <Text className="gray-2 f-2">
          {entity.price ? 'R$ ' + entity.price : '-'}
        </Text>
      ),
    },
  ];

  const handleChangeProduct = (value: Option) => {
    setSelectedProduct(value);
  };

  function calculateTotalPrice(data: Array<{ price: string }>): string {
    const total = data.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(',', '.'));
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    return total.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const fetchRequests = async () => {
    const querySnapshot = await getDocs(collection(db, 'requests'));
    let requestsList = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as any,
    );

    if (selectedProduct) {
      requestsList = requestsList.filter(
        (request) => request.name === selectedProduct.name,
      );
    }

    const startDate = date ? new Date(date[0]) : '';
    const endDate = date ? new Date(date[1]) : '';

    const parseDate = (dateString: string) => {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    requestsList = requestsList.filter((request) => {
      const requestDate = parseDate(request.date);
      return requestDate >= startDate && requestDate <= endDate;
    });

    const totalPrice = calculateTotalPrice(requestsList);

    setRequestList(requestsList);
    setTotal(totalPrice);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="d-flex flex-column content-container">
      <div className="d-flex justify-content-between mb-4">
        <Text className="f-5 white bold">Relatório de pedidos</Text>

        <Button
          className="green-button"
          onClick={() => fetchRequests()}
          disabled={!date}
        >
          <Icon name="RiSearch2Line" size={18} />

          <Text className="f-3 white bold">Buscar</Text>
        </Button>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <Select
            onChange={handleChangeProduct}
            label={<Text className="white f-2 bold mb-1">Produtos</Text>}
            options={products}
            // @ts-ignore
            value={selectedProduct}
            placeholder="Selecione um produto"
          />

          <DatePicker
            placeholder="Selecione a data"
            value={date}
            onChange={(value) => handleChangeDate(value)}
            disableFutureDates
            label={<Text className="secondary f-2 bold mb-1">Período</Text>}
          />
        </div>

        <div className="d-flex">
          <Text className="f-4 green bold">R$ {total}</Text>
        </div>
      </div>

      <div className="d-flex mt-3">
        <PaginatedTable data={requestList} columns={columns} />
      </div>
    </div>
  );
}
