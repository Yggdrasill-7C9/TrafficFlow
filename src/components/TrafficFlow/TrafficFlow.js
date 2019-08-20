import {
  defaults,
  isEqual,
  reduce
} from 'lodash'
import VizceralGraph from 'vizceral'
import {
  getPerformanceNow
} from '../../utils'

export default {
  name: 'TrafficFlow',
  props: {
    /*
    Object map of definitions.
    */
    definitions: {
      type: Object
    },
    /*
    Array of filter definitions and current values to filter out nodes and connections.
    */
    filters: {
      type: Array
    },
    /*
    A search string to highlight nodes that match
    */
    match: {
      type: String
    },
    /*
    Map of modes to mode type, e.g. { detailedNode: 'volume' }
    */
    modes: {
      type: Object
    },
    /*
    Pass in an object to highlight
    */
    objectToHighlight: {
      type: Object
    },
    /*
    Whether or not to show labels on the nodes.
    */
    showLabels: {
      type: Boolean
    },
    /*
    Nodes can be repositioned through dragging if and only if this is true.
    */
    allowDraggingOfNodes: {
      type: Boolean
    },
    /*
    Styles to override default properties.
    */
    styles: {
      type: Object
    },
    /*
    The traffic data.
    */
    traffic: {
      type: Object
    },
    /*
    Target framerate for rendering engine.
    */
    targetFramerate: {
      type: Number
    },
    /*
    Current view.
    */
    view: {
      type: Array
    }
  },
  data () {
    return {
      vizceral: {},
      options: {},
      defaults: {
        definitions: {},
        filters: [],
        match: '',
        objectToHighlight: null,
        showLabels: true,
        allowDraggingOfNodes: false,
        styles: {},
        traffic: {},
        view: [],
        targetFramerate: null
      }
    }
  },
  methods: {
    connectionHighlighted (payload) {
      console.log('connectionHighlighted')
      this.$emit('connectionHighlighted', payload)
    },
    nodeHighlighted (payload) {
      console.log('nodeHighlighted')
      this.$emit('nodeHighlighted', payload)
    },
    nodeUpdated (payload) {
      console.log('nodeUpdated')
      this.$emit('nodeUpdated', payload)
    },
    nodeContextSizeChanged (payload) {
      console.log('nodeContextSizeChanged')
      this.$emit('nodeContextSizeChanged', payload)
    },
    matchesFound (payload) {
      console.log('matchesFound')
      this.$emit('matchesFound', payload)
    },
    objectHighlighted (payload) {
      console.log('objectHighlighted')
      this.$emit('objectHighlighted', payload)
    },
    objectHovered (payload) {
      console.log('objectHovered')
      this.$emit('objectHovered', payload)
    },
    updateStyles (styles) {
      const styleNames = this.vizceral.getStyles()
      const customStyles = reduce(styleNames, (result, styleName) => {
        result[styleName] = styles[styleName] || result[styleName]
        return result
      }, {})

      this.vizceral.updateStyles(customStyles)
    },
    viewChanged (payload) {
      console.log('viewChanged')
      this.$emit('viewChanged', payload)
    },
    viewUpdated () {
      console.log('viewChanged')
      this.$emit('viewUpdated')
    }
  },
  render (createElement) {
    return createElement(
      'div', {
        staticClass: 'vizceral',
        staticStyle: {
          display: 'block',
          boxSizing: 'border-box',
          width: '100%',
          height: '100%'
        }
      },
      [
        createElement('canvas', {
          ref: 'canvas',
          staticClass: 'vizceral-canvas',
          staticStyle: {
            width: '100%',
            height: '100%'
          }
        }),
        createElement('div', {
          staticClass: 'vizceral-notice'
        })
      ]
    )
  },
  watch: {
    allowDraggingOfNodes (value) {
      this.options.allowDraggingOfNodes = value
      this.vizceral.setOptions({
        allowDraggingOfNodes: value
      })
    },
    definitions (value) {
      this.options.definitions = value
      this.vizceral.updateDefinitions(value)
    },
    filters (value) {
      this.options.filters = value
      this.vizceral.setFilters(value)
    },
    match (value) {
      this.options.match = value
      this.vizceral.findNodes(value)
    },
    modes (value) {
      this.options.modes = value
      this.vizceral.setModes(value)
    },
    showLabels (value) {
      this.options.showLabels = value
      this.vizceral.setOptions({
        showLabels: value
      })
    },
    styles (value) {
      this.options.styles = value
      this.updateStyles(value)
    },
    traffic (value, previousValue) {
      this.options.traffic = value
      if (!value) this.vizceral.updateData(value)

      const valueUpdated = value.updated || Date.now()
      if (!previousValue || !previousValue.nodes || valueUpdated > (previousValue.updated || 0)) {
        this.vizceral.updateData(value)
      }
    },
    view (value) {
      this.options.view = value
      this.vizceral.setView(value, this.options.objectToHighlight)
    }
  },
  beforeMount () {
    this.options = defaults({}, this.$props, this.defaults)
  },
  mounted () {
    this.vizceral = new VizceralGraph(this.$refs.canvas, this.targetFramerate)
    this.updateStyles(this.options.styles)

    this.vizceral.on('viewChanged', this.viewChanged)
    this.vizceral.on('objectHighlighted', this.objectHighlighted)
    this.vizceral.on('objectHovered', this.objectHovered)
    this.vizceral.on('nodeUpdated', this.nodeUpdated)
    this.vizceral.on('nodeContextSizeChanged', this.nodeContextSizeChanged)
    this.vizceral.on('matchesFound', this.matchesFound)
    this.vizceral.on('viewUpdated', this.viewUpdated)
    this.vizceral.on('connectionHighlighted', this.connectionHighlighted)
    this.vizceral.on('nodeHighlighted', this.nodeHighlighted)

    this.vizceral.updateData(this.traffic)

    this.vizceral.setOptions({
      allowDraggingOfNodes: this.options.allowDraggingOfNodes,
      showLabels: this.options.showLabels
    })

    this.vizceral.updateStyles({
      colorText: 'rgb(214, 214, 214)',
      colorTextDisabled: 'rgb(129, 129, 129)',
      colorTraffic: {
        normal: 'rgb(186, 213, 237)',
        normalDonut: 'rgb(91, 91, 91)',
        warning: 'rgb(268, 185, 73)',
        danger: 'rgb(184, 36, 36)'
      },
      colorNormalDimmed: 'rgb(101, 117, 128)',
      colorBackgroundDark: 'rgb(35, 35, 35)',
      colorLabelBorder: 'rgb(16, 17, 18)',
      colorLabelText: 'rgb(0, 0, 0)',
      colorDonutInternalColor: 'rgb(35, 35, 35)',
      colorDonutInternalColorHighlighted: 'rgb(35, 35, 35)',
      colorConnectionLine: 'rgb(91, 91, 91)',
      colorPageBackground: 'rgb(45, 45, 45)',
      colorPageBackgroundTransparent: 'rgba(45, 45, 45, 0)',
      colorBorderLines: 'rgb(137, 137, 137)',
      colorArcBackground: 'rgb(60, 60, 60)'
    })

    if (!isEqual(this.options.filters, this.defaults.filters)) {
      this.vizceral.setFilters(this.options.filters)
    }

    if (!isEqual(this.options.definitions, this.defaults.definitions)) {
      this.vizceral.updateDefinitions(this.options.definitions)
    }

    this.$nextTick(() => {
      this.vizceral.setView(this.options.view, this.options.objectToHighlight)
      // this.vizceral.updateData(this.traffic)
      const performanceNow = getPerformanceNow()
      this.vizceral.animate(performanceNow === null ? 0 : performanceNow)
      this.vizceral.updateBoundingRectCache()
      console.log(this.vizceral)
    })
  },
  beforeDestroy () {
    delete this.vizceral
  }
}
