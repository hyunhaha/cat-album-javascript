import Nodes from "./Nodes.js"
import Breadcrumb from "./Breadcrumb.js"
import { request } from "./api.js"
import ImageView from './ImageView.js'
import Loading from './Loading.js'

const cache = { root: null }

export default function App($app) {
  this.state = {
    isRoot: true,
    nodes: [],
    depth: [],
    selectedFilePath: null,
    isLoading: false
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
      try {
        this.setState({
          ...this.state,
          isLoading: true,
          selectedFilePath: null
        })

        if (node.type === 'DIRECTORY') {
          console.log('directory');
          if (cache[node.id]) {
            this.setState({
              ...this.state,
              isRoot: false,
              depth: [...this.state.depth, node],
              nodes: cache[node.id],
            })
          } else {
            const nextNodes = await request(node.id);
            this.setState({
              ...this.state,
              isRoot: false,
              depth: [...this.state.depth, node],
              nodes: nextNodes,
            });

            cache[node.id] = nextNodes
          }

        } else if (node.type === 'FILE') {
          this.setState({
            ...this.state,
            isRoot: false,
            selectedFilePath: node.filePath,
          })
        }
      } catch (error) {

      } finally {
        this.setState({
          ...this.state,
          isLoading: false
        })
      }

    },
    onBackClick: async () => {
      try {
        // this.setState({
        //   ...this.state,
        //   isLoading: true
        // })

        const nextState = { ...this.state };
        nextState.depth.pop();
        const prevNodeId = nextState.depth.length === 0 ? null : nextState.depth[nextState.depth.length - 1].id;

        if (prevNodeId === null) {//null일때 아닐때 반대로함..
          // const rootNodes = await request();
          this.setState({
            ...nextState,
            isRoot: true,
            nodes: cache.root,
            selectedFilePath: null
          });
        } else {
          // const prevNodes = await request(prevNodeId);
          this.setState({
            ...nextState,
            isRoot: false,
            nodes: cache[prevNodeId],
            selectedFilePath: null
          });
        }
      } catch (error) {
      } finally {
        // this.setState({
        //   ...this.state,
        //   isLoading: false
        // })
      }

    }

  })

  const imageView = new ImageView({
    $app,
    initialState: this.state.selectedFilePath
  })

  const loading = new Loading({
    $app,
    initialState: this.state.isLoading
  })

  this.setState = (nextState) => {
    this.state = nextState;
    console.log(this.state)
    console.log(cache)
    breadcrumb.setState(this.state.depth);

    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes
    });

    imageView.setState(this.state.selectedFilePath);
    loading.setState(this.state.isLoading);
  }

  const init = async () => {
    try {
      this.setState({
        ...this.state,
        isLoading: true
      })
      const rootNodes = await request();

      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes,
      })

      cache.root = rootNodes;

    } catch (e) {

    } finally {
      this.setState({
        ...this.state,
        isLoading: false
      })
    }
  }
  init();
}