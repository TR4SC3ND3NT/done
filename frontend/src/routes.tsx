import Inventory from './screens/Inventory';
import Recipes   from './screens/Recipes';
import Craft     from './screens/Craft';
import Home      from './screens/Home';

export const routes = [
  { path: '/',          element: <Home/>      },
  { path: '/inventory', element: <Inventory/> },
  { path: '/recipes',   element: <Recipes/>   },
  { path: '/craft',     element: <Craft/>     },
];
