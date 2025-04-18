import './style.css';
import App from './app/App';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="pixi-container">
    </div>
  </div>
`;

App();
