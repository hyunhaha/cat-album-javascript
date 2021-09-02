import Nodes from "./Nodes.js"
import Breadcrumb from "./Breadcrumb.js"
import { request } from "./api.js"
import ImageView from './ImageView.js'

export default function App($app) {
  this.state = {
    isRoot: false,
    nodes: [],
    depth: [],
    seletedFilePath: null
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
    onClick: async (node) => {
      if (node.type === 'DIRECTORY') {
        console.log('directory');
        const nextNodes = await request(node.id);
        this.setState({
          ...this.state,
          depth: [...this.state.depth, node],
          nodes: nextNodes
        })
      } else if (node.type === 'FILE') {
        this.setState({
          ...this.state,
          seletedFilePath: node.filePath,
        })
      }
    }

  })

  const imageView = new ImageView({
    $app,
    initialState: this.state.seletedFilePath
  })

  this.setState = (nextState) => {
    this.state = nextState;
    console.log(this.state)

    breadcrumb.setState(this.state.depth);

    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes
    });

    imageView.setState(this.state.seletedFilePath)
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