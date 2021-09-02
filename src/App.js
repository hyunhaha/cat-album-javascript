import Nodes from "./Nodes.js"
import Breadcrumb from "./Breadcrumb.js"
import { request } from "./api.js"
import ImageView from './ImageView.js'

export default function App($app) {
  this.state = {
    isRoot: true,
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
      console.log(node)
      if (node.type === 'DIRECTORY') {
        console.log('directory');
        const nextNodes = await request(node.id);
        this.setState({
          ...this.state,
          isRoot: false,
          depth: [...this.state.depth, node],
          nodes: nextNodes
        })
      } else if (node.type === 'FILE') {
        this.setState({
          ...this.state,
          isRoot: false,
          seletedFilePath: node.filePath,
        })
      }
    },
    onBackClick: async () => {
      try {
        const nextState = { ...this.state };
        nextState.depth.pop();
        const prevNodeId = nextState.depth.length === 0 ? null : nextState.depth[nextState.depth.length - 1].id;

        if (prevNodeId === null) {//null일때 아닐때 반대로함..
          const rootNodes = await request();
          this.setState({
            ...nextState,
            isRoot: true,
            nodes: rootNodes
          });
        } else {
          const prevNodes = await request(prevNodeId);
          this.setState({
            ...nextState,
            isRoot: false,
            nodes: prevNodes,
          });
        }
      } catch (error) {

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