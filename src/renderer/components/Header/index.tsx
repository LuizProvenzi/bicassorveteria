import { useNavigate } from 'react-router-dom';
import './styles.scss';
import Icon from '../Icon';
import Text from '../Text';
import logo2 from '../../../../assets/logo2.png';

export default function Header() {
  const navigate = useNavigate();

  const goToRequests = () => {
    navigate('/requests');
  };

  const goToProducts = () => {
    navigate('/products');
  };

  const goToReport = () => {
    navigate('/report');
  };

  return (
    <div className="d-flex justify-content-between bar">
      <div className="d-flex title ms-2">
        <img src={logo2} alt="Description" />
      </div>

      <div className="d-flex">
        <div
          className="item teste d-flex flex-column h-100 gap-2 align-items-center justify-content-center"
          onClick={goToRequests}
        >
          <Icon name="HiOutlineClipboardList" size={50} />

          <Text className="f-4-menu bold">Pedidos</Text>
        </div>
        <div
          className="item d-flex flex-column h-100 gap-2 align-items-center justify-content-center"
          onClick={goToProducts}
        >
          <Icon name="TbIceCream2" size={50} />

          <Text className="f-4-menu bold">Produtos</Text>
        </div>
        <div
          className="item d-flex flex-column h-100 gap-2 align-items-center justify-content-center"
          onClick={goToReport}
        >
          <Icon name="HiOutlineDocumentReport" size={50} />

          <Text className="f-4-menu bold">Relatórios</Text>
        </div>
      </div>
    </div>
  );
}
