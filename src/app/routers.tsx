import { Route, BrowserRouter, Switch } from 'react-router-dom';
import RoutersRoot from '../routers';

const Routers = () => {
  return (
    <BrowserRouter>
      <Switch>
        {
          RoutersRoot.map(router => (
            <Route exact {...router} />
          ))
        }
      </Switch>
    </BrowserRouter>
  );
};

export default Routers;
