import Nodes from "./Nodes.js"
import Breadcrumb from "./Breadcrumb.js"
import { request } from "./api.js"

export default function App($app) {
  this.state = {
    isRoot: false,
    nodes: [],
    depth: []
  }

  const breadcrumb = new Breadcrumb({
    $app,
    initialState: this.state.depth
  })

  const nodes = new Nodes({
    $app,
    initialState: {
      isRoot: this.state.isRoot,
      nodes: this.state.nodes
    },
    onClick: (node) => {
      if (node.type === 'DIRECTORY') {
        console.log('directory')
      } else if (node.type === 'file') {
        console.log('file')
      }
    }

  })

  this.setState = (nextState) => {
    this.state = nextState;
    console.log(this.state)
    breadcrumb.setState(this.state.depth);
    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes
    });

  }

  const init = async () => {
    try {
      const rootNodes = await request();
      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes
      })
    } catch (e) {

    }
  }
  init();
}