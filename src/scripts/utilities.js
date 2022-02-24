// Show and hide elements
export const hideElement = function(targets = undefined) {
  targets = targets === undefined ? this.targets() : targets.targets();

  for (let item of targets) {
    item.classList.add('is-inactive');
    item.classList.remove('is-active');
    item.style.opacity = '';
    item.style.display = '';
  }
};

export const setupShowElement = function(targets = undefined) {
  targets = targets === undefined ? this.targets() : targets.targets();

  for (let item of targets) {
    item.classList.remove('is-inactive');
  }
};

export const showElement = function(targets = undefined) {
  targets = targets === undefined ? this.targets() : targets.targets();
  
  for (let item of targets) {
    item.classList.remove('is-inactive', 'is-invisible');
    item.classList.add('is-active');
    item.style.opacity = '';
  }
};


// Sprite-sheet control
const spriteSheetExists = function(spriteSheet) {
  return (spriteSheet !== undefined && spriteSheet !== null);
};

export const spriteSheetPlay = function(spriteSheet, pauseTimeout = 0) {
  if (!spriteSheetExists(spriteSheet)) return;

  spriteSheet.classList.remove('is-paused');
  spriteSheet.classList.add('is-playing'); 

  if (pauseTimeout > 0) {
    setTimeout(() => {
      spriteSheet.classList.remove('is-playing');
      spriteSheet.classList.add('is-paused');
    }, pauseTimeout);
  }
};

export const spriteSheetPause = function(spriteSheet, pauseTimeout = 0) {
  if (!spriteSheetExists(spriteSheet)) return;

  spriteSheet.classList.add('is-paused');

  if (pauseTimeout > 0) {
    setTimeout(() => {
      spriteSheet.classList.remove('is-paused');
    }, pauseTimeout);
  }
};

export const spriteSheetSeek = function(spriteSheet, time) {
  if (!spriteSheetExists(spriteSheet)) return;
  spriteSheet.style.animationDelay = `-${time}ms`;
};


// Timeline control
const timelineLabelExists = function(timeline, frame) {
  return timeline.labels[frame] !== undefined;
};

export const timelinePlay = function(timeline, frame) {
  if (!timelineLabelExists(timeline, frame)) return;
  timeline.seek(`${frame}-=.1`, false);
};

export const timelinePause = function(timeline, frame) {
  if (!timelineLabelExists(timeline, frame)) return;
  timeline.addPause(`${frame}`);
};

const timelinePlayPause = function(timeline, frameFrom, frameTo) {
  timelinePlay(timeline, frameFrom);
  timelinePause(timeline, frameTo);
};

export const timelineSeek = function(timeline, frame) {
  timelinePlayPause(timeline, frame, frame);
};

export const timelineFromTo = function(timeline, frameFrom, frameTo) {
  timelinePlayPause(timeline, frameFrom, frameTo);
};


export const timelineElementExists = function(selector) {
  let exists = false;
  let element = document.querySelector(selector);

  if (element !== null) {
    let elementContent = (element.tagName === 'IMG') ? element.getAttribute('src') : element.textContent;
    if (elementContent !== '') exists = true;
  }
  // console.log(exists);

  return exists;
};
