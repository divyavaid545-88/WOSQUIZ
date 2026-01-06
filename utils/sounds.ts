
import { ASSETS } from '../constants';

class SoundManager {
  private correct: HTMLAudioElement;
  private wrong: HTMLAudioElement;
  private winner: HTMLAudioElement;

  constructor() {
    this.correct = new Audio(ASSETS.CORRECT);
    this.wrong = new Audio(ASSETS.WRONG);
    this.winner = new Audio(ASSETS.WINNER);

    // Preload sounds
    [this.correct, this.wrong, this.winner].forEach(audio => {
      audio.load();
    });
  }

  playCorrect() {
    this.correct.currentTime = 0;
    this.correct.play().catch(e => console.warn('Audio play blocked:', e));
  }

  playWrong() {
    this.wrong.currentTime = 0;
    this.wrong.play().catch(e => console.warn('Audio play blocked:', e));
  }

  playWinner() {
    this.winner.currentTime = 0;
    this.winner.play().catch(e => console.warn('Audio play blocked:', e));
  }
}

export const soundManager = new SoundManager();
