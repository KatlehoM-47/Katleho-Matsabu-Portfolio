import { animate as animeAnimate, stagger as animeStagger } from 'animejs';

export const stagger = animeStagger;

export default function anime(params: any): any {
  if (params && params.targets) {
    const { targets, ...rest } = params;
    // Map onComplete/complete callback if present
    if (rest.complete && !rest.onComplete) {
      rest.onComplete = rest.complete;
    }
    return animeAnimate(targets, rest);
  }
  return null;
}

anime.stagger = animeStagger;
