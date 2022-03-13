import './lookup.module.css';
import { useForm } from 'react-hook-form';

/* eslint-disable-next-line */
export interface LookupProps {}

type AddressForm = {
  postal: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string;
};

const PrefList: React.FC = () => {
  const prefs = ['北海道'];
  return (
    <select>
      {prefs.map((pref, i) => (
        <option key={i} value={i}>
          {pref}
        </option>
      ))}
    </select>
  );
};

export function Lookup(props: LookupProps) {
  const { getValues, setValue, register, watch, reset, handleSubmit } =
    useForm<AddressForm>();
  const onSubmit = (data: AddressForm) => {
    console.log('submit!!', data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            <span>郵便番号</span>
            <input
              type="text"
              name="postal_code"
              maxLength={8}
              autoComplete="shipping postal-code"
              pattern="\d*"
            />
          </label>
        </div>
        <div>
          <label>
            <span>都道府県</span>
            <PrefList />
          </label>
        </div>
        <div>
          <label>
            <span>市区町村</span>
            <span>(例: 中央区)</span>
          </label>
          <input
            type="text"
            autoComplete="shipping address-level2"
            placeholder="市区町村"
            className="md:w-52 w-full"
          />
        </div>
        <div>
          <label>
            <span>町域・番地</span>
            <span>(例: 銀座4-1-2)</span>
          </label>
          <input
            type="text"
            autoComplete="shipping address-line1"
            placeholder="町域・番地"
            className="md:w-52 w-full"
          />
        </div>
        <div>
          <label>
            <span>建物名など</span>
            <span>(例: xxマンション203号室)</span>
          </label>
          <input
            type="text"
            autoComplete="shipping address-line2"
            placeholder="建物名など"
            className="md:w-52 w-full"
          />
        </div>
        <button type="submit" className="bg-gray-300 item-center">
          <span>submit</span>
        </button>
      </form>
    </div>
  );
}

export default Lookup;
