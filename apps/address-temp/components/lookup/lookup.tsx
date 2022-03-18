import React from 'react';
import './lookup.module.css';
import { useForm } from 'react-hook-form';
import { Address } from '@ken-all/kenall';

import { getAddresses } from '../../libs/api/kenall';

/* eslint-disable-next-line */
export interface LookupProps {}

type AddressForm = {
  postal: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string;
};

// tsxでは
const countVariations = <T,>(
  items: Iterable<T>,
  callback: (item: T) => any
): number => {
  const c: Record<any, number> = {};
  let variations = 0;
  for (const item of items) {
    const k = callback(item);
    if (c[k] === undefined) {
      variations++;
      c[k] = 1;
    } else {
      c[k]++;
    }
  }
  return variations;
};

const buildAddressLines = (addresses: Address[]): [string, string] => {
  // 候補なしの場合
  if (addresses.length === 0) {
    return ['', ''];
  } else if (addresses.length === 1) {
    const address = addresses[0];
    // 個別事業所番号
    if (address.corporation) {
      return [address.corporation.block_lot, address.building + address.floor];
    } else {
      // 住所の要素を組み立てる
      const elements: string[] = [];
      if (address.kyoto_street) {
        elements.push(address.kyoto_street);
      }
      elements.push(address.town);
      if (address.koaza) {
        elements.push(address.koaza);
      }
      return [elements.join(' '), addresses[0].building + addresses[0].floor];
    }
  } else {
    // 都道府県や市区町村のバリエーションが複数ある場合は
    // 補完しても意味がないので補完は行わない
    if (
      countVariations(addresses, (address) => address.prefecture) > 1 ||
      countVariations(addresses, (address) => address.city) > 1
    ) {
      return ['', ''];
    }

    // 町域が複数ある場合も補完しない
    const nTowns = countVariations(addresses, (address) => address.town);
    if (nTowns > 1) {
      return ['', ''];
    }

    // 住所の要素を組み立てる
    const elements: string[] = [];

    const nKoazas = countVariations(addresses, (address) => address.koaza);
    if (nKoazas === 1) {
      const nKyotoStreets = countVariations(
        addresses.filter((address) => Boolean(address.kyoto_street)),
        (address) => address.kyoto_street
      );
      if (nKyotoStreets === 1) {
        elements.push(addresses[0].kyoto_street || '');
      }
      elements.push(addresses[0].town);
      elements.push(addresses[0].koaza);
    } else {
      elements.push(addresses[0].town);
    }

    return [elements.join(' '), ''];
  }
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

  const watchFields = watch([
    'postal',
    'prefecture',
    'city',
    'address1',
    'address2',
  ]);
  // loading
  const timerRef = React.useRef<number | undefined>(undefined);
  const [timerRunning, setTimerRunning] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
      setTimerRunning(false);
    }
    // すでに入力済みであれば何もしない
    const [postalCode, prefecture, city, address1, address2] = watchFields;
    if (prefecture || city || address1 || address2) {
      return;
    }

    getAddresses(postalCode).then(([canonical, candidates]) => {
      // registerのform値
      setValue('postal', canonical);
      // promiseのあとなのでwatchFieldsの値が古くなってないか確認
      {
        const [prefecture, city, address1, address2] = getValues([
          'prefecture',
          'city',
          'address1',
          'address2',
        ]);
        if (prefecture || city || address1 || address2) {
          return;
        }
      }
      // 候補がない場合にも補完は実行しない
      if (candidates.data.length === 0) {
        return;
      }
      // ブラウザのautocompleteを邪魔しないように2秒後に補完を発動する
      timerRef.current = window.setTimeout(() => {
        setTimerRunning(false);
        // 再度バリデーション
        {
          const [prefecture, city, address1, address2] = getValues([
            'prefecture',
            'city',
            'address1',
            'address2',
          ]);
          if (prefecture || city || address1 || address2) {
            return;
          }
        }
        const candidate = candidates.data[0];
        setValue('prefecture', candidate.jisx0402.substring(0, 2));
        setValue('city', candidate.city);
        const [address1, address2] = buildAddressLines(candidates.data);
        setValue('address1', address1);
        setValue('address2', address2);
      }, 2000);
      setTimerRunning(true);
    });
    return () => {
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, watchFields); /* eslint "react-hooks/exhaustive-deps": "off" */

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
