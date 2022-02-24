import * as utilities from './utilities.js';
// Version folder
// import * as utilities from '../../../scripts/utilities.js'; 
// Size folder
// import * as utilities from '../../../../scripts/utilities.js';

// import { bubbles } from './o2-bubbles.js';


const advert = (function () {

  // Variables
  const options = {
    version: '$bannerVersion',
    size: '$bannerSize',
    width: $bannerWidth,
    height: $bannerHeight,
    animTransition: .4,
    animTransitionFirst: .1,
    animPause: 3,
    animEase: Power1.easeOut
  }

  const timeline = gsap.timeline({ ease: options.animEase });
  const bannerSizeMobile = (options.size === '320x50' || options.size === '320x100');

  const init = function () {
    // animate();

  };

  const animateEnd = function () {
    // bubbles();
  };


  const animate = function() {

    // Examples

    // gsap.set('.frame-1', { });

    // if (options.version === 'version-1') { }
    // if (options.size === '300x250') { }
    // if (utilities.timelineElementExists('.text-1')) { }

    // onComplete: () => { utilities.showElement(this); document.querySelector('.text-1').classList.add('is-active'); }



    // Setup
    let spriteSheet1 = document.querySelector('.sprite-sheet-1');
    gsap.set(spriteSheet1, { y: options.size !== '728x90' ? 300 : options.height });


    // Frame 1
    timeline.to('.frame-1', { opacity: 1, duration: options.animTransitionFirst, onStart: utilities.setupShowElement, onComplete: utilities.showElement });
    timeline.addLabel('frame-1');


    // Frame 1 out
    timeline.to('.frame-1', { opacity: 0, duration: options.animTransition, delay: options.animPause, onComplete: utilities.hideElement });


    // Frame 2
    timeline.to('.frame-2', { opacity: 1, duration: options.animTransition, onStart: utilities.setupShowElement, onComplete: utilities.showElement }); 
    timeline.addLabel('frame-2');


    // Frame 2 out
    timeline.to('.frame-2', { opacity: 0, duration: options.animTransition, delay: options.animPause,
      onComplete: function() { 
        utilities.hideElement(this);
        gsap.set(spriteSheet1, { zIndex: 1 });
      }
    });

    timeline.set(spriteSheet1, { opacity: 1 }, `-=${options.animTransition}`);
    timeline.to(spriteSheet1, { y: 0, duration: options.animTransition, ease: 'none', 
      onComplete: function() { 
        utilities.spriteSheetPlay(spriteSheet1, 1250);
      }
    }, `-=${options.animTransition}`);


    // Frame 3
    timeline.to('.frame-3', { opacity: 1, duration: options.animTransition, onStart: utilities.setupShowElement, onComplete: utilities.showElement });
    
    if (!bannerSizeMobile) {
      timeline.to('.terms', { opacity: 1, duration: options.animTransition, onStart: utilities.setupShowElement, onComplete: utilities.showElement }, `-=${options.animTransition}`);
    }
    timeline.addLabel('frame-3');


    // Frame 3 out
    timeline.to('.frame-3', { opacity: 0, duration: options.animTransition, delay: options.animPause, onComplete: utilities.hideElement });
    


    // Frame 4
    timeline.to('.frame-4', { opacity: 1, duration: options.animTransition, onStart: utilities.setupShowElement, onComplete: utilities.showElement });

    timeline.to(spriteSheet1, { opacity: 1, duration: options.animTransition,
      onStart: function() { 
        utilities.spriteSheetPlay(spriteSheet1, 500);
      }
    }, `-=${options.animTransition}`);
    timeline.addLabel('frame-4');


    // Frame 4 out
    timeline.to('.frame-4', { opacity: 0, duration: options.animTransition, delay: options.animPause, onComplete: utilities.hideElement });
    
    timeline.to(spriteSheet1, { opacity: 0, duration: options.animTransition, onComplete: utilities.hideElement }, `-=${ options.animTransition }`);
    
    
    // Frame End
    timeline.to('.frame-end, .terms', { opacity: 1, duration: options.animTransition, onStart: utilities.setupShowElement, 
      onComplete: function() {
        utilities.showElement(this);
        if (!bannerSizeMobile) animateEnd(); 
      }
    });
    timeline.addLabel('frame-end');


    // Frame End
    if (bannerSizeMobile) {
      timeline.to('.frame-end .frame-content', { opacity: 0, duration: options.animTransition, delay: options.animPause, onComplete: utilities.hideElement });
      
      timeline.to('.btn', { opacity: 1, duration: options.animTransition, onStart: utilities.setupShowElement, 
        onComplete: function(){
          utilities.showElement(this);
          animateEnd(); 
        }
      });
      timeline.addLabel('frame-end-mobile');
    }


    // Pause timeline for debugging
    utilities.timelineSeek(timeline, 'frame-1');
    // utilities.timelineSeek(timeline, 'frame-2');
    // utilities.timelineSeek(timeline, 'frame-3');
    // utilities.timelineSeek(timeline, 'frame-4');
    // utilities.timelineSeek(timeline, 'frame-end');

    // utilities.timelineFromTo(timeline, 'frame-2', 'frame-4');

    // utilities.timelinePlay(timeline, 'frame-end');

  }


  return {
    init
  };

})();

window.advert = advert;  