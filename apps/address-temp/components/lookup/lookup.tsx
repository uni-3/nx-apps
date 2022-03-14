import React from 'react';
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
  const prefs = [
    '北海道',
    '青森県',
    '岩手県',
    '宮城県',
    '秋田県',
    '山形県',
    '福島県',
    '茨城県',
    '栃木県',
    '群馬県',
    '埼玉県',
    '千葉県',
    '東京都',
    '神奈川県',
    '新潟県',
    '富山県',
    '石川県',
    '福井県',
    '山梨県',
    '長野県',
    '岐阜県',
    '静岡県',
    '愛知県',
    '三重県',
    '滋賀県',
    '京都府',
    '大阪府',
    '兵庫県',
    '奈良県',
    '和歌山県',
    '鳥取県',
    '島根県',
    '岡山県',
    '広島県',
    '山口県',
    '徳島県',
    '香川県',
    '愛媛県',
    '高知県',
    '福岡県',
    '佐賀県',
    '長崎県',
    '熊本県',
    '大分県',
    '宮崎県',
    '鹿児島県',
    '沖縄県',
  ];
  return (
    <>
      <option key="" value="">
        (選択)
      </option>
      {prefs.map((pref, i) => (
        <option key={i} value={i}>
          {pref}
        </option>
      ))}
    </>
  );
};

export function Lookup(props: LookupProps) {
  const { getValues, setValue, register, watch, reset, handleSubmit } =
    useForm<AddressForm>();
  const onSubmit = (data: AddressForm) => {
    console.log('submitted!!', data);
  };
  return (
    <div>
      <h2>郵便番号正引き検索</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            <span>郵便番号</span>
            <input
              type="text"
              name="postal_code"
              maxLength={8}
              minLength={7}
              autoComplete="shipping postal-code"
              pattern="\d{3}-?\d{4}"
              inputMode="numeric"
              placeholder="郵便番号"
              {...register('postal', {
                required: '郵便番号を入力してください',
              })}
            />
          </label>
        </div>
        <div>
          <label>
            <span>都道府県</span>
            <select
              id="form-prefecture"
              autoComplete="shipping address-level1"
              className="w-28"
              {...register('prefecture', {
                required: '都道府県を入力してください',
              })}
            >
              <PrefList />
            </select>
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
            {...register('city', {
              required: '市区町村を入力してください',
            })}
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
            {...register('address1', {
              required: '町域・番地入力してください',
            })}
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
            {...register('address2')}
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
