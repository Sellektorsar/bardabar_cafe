import { render } from '@testing-library/react';
import { MenuItemSkeleton } from './skeleton';

describe('MenuItemSkeleton', () => {
  it('рендерится без ошибок', () => {
    const { container } = render(<MenuItemSkeleton />);
    expect(container).toBeInTheDocument();
  });
}); 