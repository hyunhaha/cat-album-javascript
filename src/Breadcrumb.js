export default class Breadcrumb {
  constructor({ $app, initialState, onClick }) {
    this.state = initialState;
    this.onClick = onClick;

    this.$target = document.createElement('nav');
    this.$target.className = 'Breadcrumb nav-item';
    $app.appendChild(this.$target);

    this.$target.addEventListener('click', e => {
      const $navItem = e.target.closest('.nav-item');

      if ($navItem) {
        const { index } = $navItem.dataset;
        this.onClick(index ? parseInt(index, 10) : null);
      }
    });
  }
  setState = (nextState) => {
    this.state = nextState;

    this.render();
  };

  render = () => {
    this.$target.innerHTML = `<div>root</div>
  ${this.state.map((node, idx) => `<div class="nav-item" data-index="${idx}">${node.name}</div>`).join('')}`; //따옴표 빼먹었음
  };
}