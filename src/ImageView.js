const IMAGE_PATH_PREFIX = 'https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public'

export default function ImageView({ $app, initialState, onClose }) {
  this.state = initialState;
  this.onclose = onClose;

  this.$target = document.createElement('div');
  this.$target.className = 'MoDal ImageView';

  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render()
  }

  this.render = () => {
    this.$target.innerHTML = `<div class="content">
    ${this.state ? `<img src="${IMAGE_PATH_PREFIX}${this.state}">` : ''}
    </div>`;

    this.$target.style.display = this.state ? 'block' : 'none';

    if (this.$target.style.display === 'block') {
      this.$target.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
          this.onclose();
        }
      });

      document.addEventListener('keydown', (event) => {
        event.stopImmediatePropagation()
        if (event.key === "Escape") {
          this.onclose();
        }
      });
    }

  }
  this.render();
}
