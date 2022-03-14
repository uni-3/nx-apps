import { KENALL, Address } from '@ken-all/kenall';

type Candidates = {
    data: Address[];
};

const SENTINEL: Candidates = {
  data: [],
};

const apiBaseUrl = process.env.REACT_APP_KENALL_API_BASE_URL || 'https://api.kenall.jp/v1';

const api = new KENALL(process.env.REACT_APP_KENALL_API_KEY as string, {
  apibase: apiBaseUrl,
  timeout: 10000,
});

const canonicalizePostalCode = (postalCode: string): string =>
  postalCode
    .replace(/-/g, '')
    .replace(/[０１２３４５６７８９]/g, (c) =>
      String.fromCharCode(
        // 半角utf-16コードの基準から、全角utf-16の基準から相対位置を足す＝小文字数値->大文字数値
        '0'.charCodeAt(0) + (c.charCodeAt(0) - '０'.charCodeAt(0))
      )
    );

export const getAddresses = (() => {
    const cache: { [k: string]: Candidates } = {};
    return async (
      postalCode: string | undefined
    ): Promise<[string, Candidates]> => {
      if (postalCode === undefined) {
        return ['', SENTINEL];
      }
      const k = canonicalizePostalCode(postalCode);
      if (k.length < 7) {
        return [postalCode, SENTINEL];
      }
      let candidates: Candidates | undefined = cache[k];
      if (candidates === undefined) {
        candidates = await api.getAddress(k);
        cache[k] = candidates;
      }
      return [k, candidates || SENTINEL];
    };
  })();