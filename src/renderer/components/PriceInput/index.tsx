import React, { ReactNode } from 'react';
import './styles.scss';
import { IMaskInput } from 'react-imask';

export interface PriceInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'placeholder' | 'onChange' | 'value'
  > {
  label?: ReactNode;
  className?: string;
  fluid?: boolean;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
  (
    { className, label, placeholder, fluid, onChange, value, disabled },
    ref,
  ) => {
    const handleMaskedChange = (maskedValue: string, unmaskedValue: string) => {
      if (onChange) {
        onChange(maskedValue);
      }
    };

    return (
      <div className="position-relative">
        {label && <div>{label}</div>}

        <div className="custom-currency-input-wrapper">
          <IMaskInput
            mask={Number}
            scale={2}
            radix=","
            thousandsSeparator="."
            padFractionalZeros={true}
            normalizeZeros={true}
            className={`${className} custom-input`}
            style={{ width: fluid ? '100%' : '334px' }}
            placeholder={placeholder || '0,00'}
            value={value}
            disabled={disabled}
            inputRef={ref}
            // @ts-ignore
            onAccept={handleMaskedChange}
          />
        </div>
      </div>
    );
  },
);

export default PriceInput;
