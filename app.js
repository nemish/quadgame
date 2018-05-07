import './app.styl';
import { createGameInstance } from '@/game';

const div = document.createElement('div', {id: 'app'});
div.setAttribute('id', 'app');
document.body.appendChild(div);

const game = createGameInstance({root: 'app'});
game.init();
