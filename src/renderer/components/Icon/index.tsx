import {
  RiFileList2Line,
  RiAddFill,
  RiDeleteBin7Line,
  RiPencilLine,
  RiSearch2Line,
  RiArrowDropLeftLine,
  RiArrowDropRightLine,
} from 'react-icons/ri';
import { TbIceCream2 } from 'react-icons/tb';
import {
  HiOutlineDocumentReport,
  HiOutlineClipboardList,
} from 'react-icons/hi';
import { FaCheck, FaRegTrashAlt } from 'react-icons/fa';
import './styles.scss';

interface IconProps {
  name: keyof typeof iconComponents;
  size?: number;
  disabled?: boolean;
  onClick?: () => void;
}

const iconComponents: Record<string, React.ElementType> = {
  RiFileList2Line,
  TbIceCream2,
  HiOutlineDocumentReport,
  HiOutlineClipboardList,
  RiAddFill,
  FaCheck,
  FaRegTrashAlt,
  RiDeleteBin7Line,
  RiPencilLine,
  RiSearch2Line,
  RiArrowDropLeftLine,
  RiArrowDropRightLine,
};

const Icon: React.FC<IconProps> = ({
  name,
  size,
  onClick,
  disabled,
}: IconProps) => {
  const SelectedIcon = iconComponents[name];

  if (!SelectedIcon) {
    return null;
  }

  return (
    <SelectedIcon
      size={size || '24px'}
      onClick={!disabled && onClick}
      className={`custom-icon ${onClick && !disabled ? 'icon-clickable' : ''} ${disabled ? 'disable-icon' : ''}`}
    />
  );
};

export default Icon;
