import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonNav, IonTab, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon, IonPage} from '@ionic/react';
import { IonReactHashRouter, IonReactRouter } from '@ionic/react-router';
import { homeSharp, settingsSharp, ticketSharp } from 'ionicons/icons';
import Shift from './pages/ShiftModel';
import Home2 from './pages/Home2';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Lottries from './pages/Lottries';
import Home from './pages/Home';
import LotterySetting from './pages/LotterySetting';
import LottriesPage from './pages/LottriesPage';

setupIonicReact();

const App: React.FC = () => (
  <>
  <IonApp>
  <IonReactRouter>
    <IonTabs>
    <IonRouterOutlet>
   
      <Route exact path="/home">
        <Home2 />
      </Route>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>

      <Route exact path="/lottries">
        <LottriesPage />
      </Route>

      <Route exact path="/lottery-setting">
        <LotterySetting />
      </Route>

    </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton href='/home' tab='home'>
          <IonLabel>Home</IonLabel>
          <IonIcon icon={homeSharp}/>
        </IonTabButton>

        <IonTabButton href='/lottries' tab='lottries'>
          <IonLabel>Lottries</IonLabel>
          <IonIcon icon={ticketSharp}/>
        </IonTabButton>

        <IonTabButton href='/lottery-setting' tab='Settings'>
          <IonLabel>Lottery Settings</IonLabel>
          <IonIcon icon={settingsSharp}/>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
    </IonReactRouter>
  </IonApp>
  </>
);

export default App;
