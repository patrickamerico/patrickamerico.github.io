new Vue({
  el: '#app',
  data() {
    return {
      passwordInput: '',
      unlocked: false,
      error: false,
      correctPassword: 'amor30', // Defina aqui a senha para desbloquear
    };
  },
  methods: {
    checkPassword() {
      if (this.passwordInput === this.correctPassword) {
        this.unlocked = true;
        this.error = false;
        this.passwordInput = '';
        this.startHeartAnimation();
      } else {
        this.error = true;
        this.passwordInput = '';
      }
    },
    startHeartAnimation() {
      const container = this.$el.querySelector('.container');
      if (!container) return;

      // Cria corações em intervalos
      this.heartInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        container.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 2000);
      }, 300);
    },
  },
  beforeDestroy() {
    if (this.heartInterval) clearInterval(this.heartInterval);
  },
});
