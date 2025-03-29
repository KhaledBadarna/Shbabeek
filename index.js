import {AppRegistry} from 'react-native';
import App from './App'; // ✅ Will now import App.js
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
