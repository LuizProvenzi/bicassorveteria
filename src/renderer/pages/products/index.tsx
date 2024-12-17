import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Link, useNavigate } from 'react-router-dom';

interface Product {
  name: string;
  details: [{ name: string }];
  cost: string;
  producible: boolean;
}

export default function Products() {
  const [productsList, setProductsList] = useState<any[]>([]);

  const navigate = useNavigate();

  const columns = [
    {
      key: 'name',
      name: <Text className="gray-2 f-2 bold">Nome</Text>,
      render: (entity: Product) => (
        <Text className="gray-2 f-2">{entity.name ? entity.name : '-'}</Text>
      ),
    },
    {
      key: 'producible',
      name: <Text className="gray-2 f-2 bold">Produzível</Text>,
      render: (entity: Product) => (
        <Text className="gray-2 f-2">{entity.producible ? 'Sim' : 'Não'}</Text>
      ),
    },
    {
      key: 'cost',
      name: <Text className="gray-2 f-2 bold">Valor</Text>,
      render: (entity: Product) => (
        <Text className="gray-2 f-2">{entity.cost ? entity.cost : '-'}</Text>
      ),
    },
    {
      key: 'management',
      name: <Text className="gray-2 f-2 bold">Ações</Text>,
      render: (entity: any) => (
        <div className="d-flex gap-2 justify-content-end">
          <Link to={`/newProduct/${entity.id}`} className="link-no-underline">
            <Icon
              name="RiPencilLine"
              size={22}
              onClick={() => console.log('')}
            />
          </Link>

          <Icon
            name="RiDeleteBin7Line"
            size={22}
            onClick={() => deleteProduct(entity.id)}
          />
        </div>
      ),
    },
  ];

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const requestsList = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as any,
    );

    setProductsList(requestsList);
  };

  const deleteProduct = async (productId: any) => {
    try {
      const carDoc = doc(db, 'products', productId);

      await deleteDoc(carDoc);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const goToNewProduct = () => {
    navigate('/newProduct/false');
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="d-flex flex-column content-container">
      <div className="d-flex justify-content-between">
        <Text className="f-5 white bold">Produtos</Text>

        <Button className="green-button" onClick={() => goToNewProduct()}>
          <Icon name="RiAddFill" size={18} />

          <Text className="f-3 white bold">Criar produto</Text>
        </Button>
      </div>

      <div className="d-flex mt-3">
        <DataTable data={productsList} columns={columns} />
      </div>
    </div>
  );
}
