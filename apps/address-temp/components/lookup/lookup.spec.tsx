import { render } from '@testing-library/react';

import Lookup from './lookup';

describe('Lookup', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Lookup />);
    expect(baseElement).toBeTruthy();
  });
});
