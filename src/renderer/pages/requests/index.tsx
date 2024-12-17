import { useEffect, useState } from 'react';
import './styles.scss';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { useNavigate } from 'react-router-dom';

export default function Requests() {
  const navigate = useNavigate();

  const [openRequests, setOpenRequests] = useState<any[]>([]);

  const filterOpenRequests = (requests: any) => {
    return requests.filter((e: any) => e.open);
  };

  const fetchOpenRequests = async () => {
    const querySnapshot = await getDocs(collection(db, 'requests'));
    const requestsList = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as any,
    );

    setOpenRequests(filterOpenRequests(requestsList));
  };

  const deleteRequest = async (productId: any) => {
    try {
      const carDoc = doc(db, 'requests', productId);

      await deleteDoc(carDoc);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
    }
  };

  const closeRequest = async (requestId: string) => {
    try {
      const productDocRef = doc(db, 'requests', requestId);

      await updateDoc(productDocRef, {
        open: false,
      });

      window.location.reload();
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
    }
  };

  const goToNewRequest = () => {
    navigate('/newRequest');
  };

  useEffect(() => {
    fetchOpenRequests();
  }, []);

  return (
    <div className="d-flex flex-column content-container">
      <div className="d-flex justify-content-between">
        <Text className="f-5 white bold">Lista de pedidos</Text>

        <Button className="green-button" onClick={goToNewRequest}>
          <Icon name="RiAddFill" size={18} />

          <Text className="f-3 white bold">Criar pedido</Text>
        </Button>
      </div>

      <div className="d-flex mt-5 flex-wrap gap-4">
        {openRequests &&
          openRequests.length > 0 &&
          openRequests.map((e) => (
            <div key={e.name} className="d-flex flex-column request-container">
              <div className="d-flex">
                <Text className="f-5 white">{e.name}</Text>
              </div>

              <div className="d-flex mb-3">
                <div className="d-flex justify-content-between w-100">
                  <div style={{ width: '60%' }}>
                    <Text className="f-4 white">{e.client}</Text>
                  </div>

                  <Text className="f-4 white">R$ {e.price}</Text>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-1 mb-3 w-100">
                {e.details.map((d: any) => (
                  <div className="d-flex detail-container">
                    <Text className="f-3 black">{d.label}</Text>
                  </div>
                ))}
              </div>

              <div className="d-flex h-100 mb-3 w-100">
                <Text className="f-4 white">{e.description}</Text>
              </div>

              <div className="d-flex gap-3">
                <Button
                  className="cancel-button fluid"
                  onClick={() => deleteRequest(e.id)}
                >
                  <Icon name="FaRegTrashAlt" size={18} />
                </Button>

                <Button
                  className="green-button fluid"
                  onClick={() => closeRequest(e.id)}
                >
                  <Icon name="FaCheck" size={18} />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
