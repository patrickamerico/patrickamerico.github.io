let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const isMobile = 'ontouchstart' in window;
    const moveEvent = isMobile ? 'touchmove' : 'mousemove';
    const downEvent = isMobile ? 'touchstart' : 'mousedown';
    const upEvent = isMobile ? 'touchend' : 'mouseup';

    const handleMove = (e) => {
      if(!this.rotating) {
        const clientX = isMobile ? e.touches[0].clientX : e.clientX;
        const clientY = isMobile ? e.touches[0].clientY : e.clientY;
        this.mouseX = clientX;
        this.mouseY = clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = (isMobile ? e.touches[0].clientX : e.clientX) - this.mouseTouchX;
      const dirY = (isMobile ? e.touches[0].clientY : e.clientY) - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    const handleDown = (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      if((!isMobile && e.button === 0) || isMobile) {
        const clientX = isMobile ? e.touches[0].clientX : e.clientX;
        const clientY = isMobile ? e.touches[0].clientY : e.clientY;
        this.mouseTouchX = clientX;
        this.mouseTouchY = clientY;
        this.prevMouseX = clientX;
        this.prevMouseY = clientY;
      }

      if(!isMobile && e.button === 2) {
        this.rotating = true;
      }
    };

    const handleUp = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    document.addEventListener(moveEvent, handleMove);
    paper.addEventListener(downEvent, handleDown);
    window.addEventListener(upEvent, handleUp);

    // Set random initial position
    this.currentPaperX = Math.random() * (window.innerWidth - 300);
    this.currentPaperY = Math.random() * (window.innerHeight - 300);
    paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }
}

const papers = Array.from(document.querySelectorAll('.paper:not(.heart)'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});