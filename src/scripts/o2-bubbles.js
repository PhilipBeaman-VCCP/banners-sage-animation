import * as utilities from './utilities.js';

export const bubbles = function () {  
  
  let bubbleObjects = [];
  const bubbleElements = document.querySelector('#bubble-elements');
  const bubblePathsElement = document.querySelector('#bubble-paths');

  const init = function () {
    if(bubbleElements === null || bubblePathsElement === null) return;

    const bubblePaths = bubblePathsElement.querySelectorAll('path');

    for (let [index, item] of bubblePaths.entries()) {
      bubbleObjects.push({
        path: bubblePaths[index].getAttribute('d')
      });

      let bubbleImage = document.createElement('img');
      bubbleImage.src = 'images/bubble.png';
      bubbleImage.classList = `bubble bubble--${index}`;
      bubbleElements.appendChild(bubbleImage);

      if (index === bubblePaths.length - 1) {
        animate();
      }
    }
  };

  var animate = function() {
    const bubbleTimeline = gsap.timeline({});
    const bubbleScaleTransition = .5;
    const bubbleMotionTransition = 5;

    bubbleTimeline.to(bubbleElements, 0, { onStart: utilities.setupShowElement, onComplete: utilities.showElement });

    for (let [index, item] of bubbleObjects.entries()) {
      let bubbleElement = document.querySelector(`.bubble--${index}`);

      let currentPath = item.path;
      let rawPath = MotionPathPlugin.getRawPath(currentPath);
      let motionPathOffset = { path: currentPath, align: "relative", offsetX: (rawPath[0][0] - 25), offsetY: rawPath[0][1], type: "cubic" };

      let bubbleTimelinePosition = index / bubbleObjects.length;
      let bubbleTimelineSpacer = index / (bubbleObjects.length * 4);

      if (index % 5 === 0) {
        bubbleTimeline.to(bubbleElement, bubbleScaleTransition, { opacity: 1, scale: Math.random() / 3 }, bubbleTimelinePosition);
      }
      else {
        bubbleTimeline.to(bubbleElement, bubbleScaleTransition, { opacity: 1, scale: Math.random() / 4 }, bubbleTimelinePosition);
      }

      bubbleTimeline.to(bubbleElement, bubbleScaleTransition, { opacity: 1, scale: Math.random() / 3 }, bubbleTimelinePosition);

      bubbleTimeline.to(bubbleElement, bubbleMotionTransition, { motionPath: motionPathOffset }, bubbleTimelineSpacer);

      bubbleTimeline.to(bubbleElement, 0.1, { opacity: 0 }, bubbleMotionTransition - bubbleTimelineSpacer);
    }

    bubbleTimeline.to(bubbleElements, 0, { onComplete: utilities.hideElement });
  };

  return init();

};
