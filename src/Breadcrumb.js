export default function Breadcrumb({ $app, initialState }) {
  this.state = initialState;
  console.log(this.state)
  this.$target = document.createElement('nav');
  this.$target.className = 'Breadcrumb';
  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render()
  }

  this.render = () => {
    this.$target.innerHTML = `<div>root</div>${this.state.map(
      (node, idx) => `<div class="nav_item" data-index="${idx}>${node.name}</div>`).join('')}`
  }

}