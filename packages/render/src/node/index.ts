
import { render } from './render';

/**
 * @deprecated use {@link render}
 */
export const renderAsync = (element: React.ReactElement) => {
  return render(element);
};

export * from '../shared/plain-text-selectors';
export * from './render';
