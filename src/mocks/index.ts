import fetchMock from 'fetch-mock';
import { getEnvConfig } from '../tools';

const getMockUrl = (path: string) => `${getEnvConfig.BASE_URL}/${path}`;

const mockMain = () => {
  fetchMock.mock(
    getMockUrl('api/demo'),
    () => ({ status: 200, message: 'ok', data: { hello: 'world' }}),
    { delay: 100 },
  );
};
export default mockMain;