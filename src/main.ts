import './style.css';
import App from './app/App';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Pillar walker</h1>
    <div id="pixi-container">
    </div>
  </div>
`;

App();
