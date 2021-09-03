import Nodes from "./Nodes.js"
import Breadcrumb from "./Breadcrumb.js"
import { request } from "./api.js"
import ImageView from './ImageView.js'
import Loading from './Loading.js'

const cache = { root: null }

export default class App {
  constructor($app) {
    this.state = {
      isRoot: true,
      nodes: [],
      depth: [],
      selectedFilePath: null,
      isLoading: false
    }

    this.breadcrumb = new Breadcrumb({
      $app,
      initialState: this.state.depth,
      onClick: (index) => {
        if (index === null) {
          this.setState({
            ...this.state,
            depth: [],
            nodes: cache.root,
            isRoot: true,
          })
          return
        }

        if (index === this.state.depth.length - 1)
          return

        const nextState = { ...this.state }
        const nextDepth = this.state.depth.slice(0, index + 1)

        this.setState({
          ...nextState,
          depth: nextDepth,
          nodes: cache[nextDepth[nextDepth.length - 1].id],
        })
      }
    })

    this.nodes = new Nodes({
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
          })

          if (node.type === 'DIRECTORY') {
            if (cache[node.id]) {
              this.setState({
                ...this.state,
                isRoot: false,
                depth: [...this.state.depth, node],
                nodes: cache[node.id],
              })
            } else {
              const nextNodes = await request(node.id)
              this.setState({
                ...this.state,
                isRoot: false,
                depth: [...this.state.depth, node],
                nodes: nextNodes,
              })

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

          throw new Error(error.message);

        } finally {
          this.setState({
            ...this.state,
            isLoading: false
          })
        }

      },
      onBackClick: async () => {
        try {

          const nextState = { ...this.state }
          nextState.depth.pop()
          const prevNodeId = nextState.depth.length === 0 ? null : nextState.depth[nextState.depth.length - 1].id

          if (prevNodeId === null) { //null일때 아닐때 반대로함..
            this.setState({
              ...nextState,
              isRoot: true,
              nodes: cache.root,
            })
          } else {
            this.setState({
              ...nextState,
              isRoot: false,
              nodes: cache[prevNodeId],
            })
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
    })

    this.imageView = new ImageView({
      $app,
      initialState: this.state.selectedFilePath,
      onClose: () => {
        this.setState({
          ...this.state,
          selectedFilePath: null
        })
      }
    })

    this.loading = new Loading({
      $app,
      initialState: this.state.isLoading
    })



    this.init = async () => {
      try {
        this.setState({
          ...this.state,
          isLoading: true
        })
        const rootNodes = await request()

        this.setState({
          ...this.state,
          isRoot: true,
          nodes: rootNodes,
        })

        cache.root = rootNodes

      } catch (e) {
        throw new Error(e.message);
      } finally {
        this.setState({
          ...this.state,
          isLoading: false
        })
      }
    }
    this.init()
  }

  setState = (nextState) => {
    this.state = nextState

    this.breadcrumb.setState(this.state.depth)

    this.nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes
    })

    this.imageView.setState(this.state.selectedFilePath)
    this.loading.setState(this.state.isLoading)
  }
}