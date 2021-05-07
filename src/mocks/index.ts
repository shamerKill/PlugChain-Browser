import fetchMock from 'fetch-mock';

const mockMain = () => {
  fetchMock.mock('http://www.baidu.com/api/demo', () => ({ status: 200, message: 'ok', data: { hello: 'world' }}));
};
export default mockMain;