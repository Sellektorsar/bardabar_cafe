import { encodeFileAsBase64DataURL } from './utils';

describe('encodeFileAsBase64DataURL', () => {
  it('корректно кодирует файл в base64 data url', async () => {
    // Мокаем FileReader
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const result = await encodeFileAsBase64DataURL(file);
    expect(result).toMatch(/^data:text\/plain;base64,/);
  });
}); 