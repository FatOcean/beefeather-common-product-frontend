<script>
export default {
  name: 'ocr-el',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    value: {
      type: Object | Array,
      requird: true
    },
    id: {
      type: String | Number,
      default: ''
    }
  },
  render: function(h) {
    return h(
      this.tag || 'div',
      {
        class: [
          'text',
          {
            active: this.activeText === this.value || this.id && this.activeTextId === this.id,
            'not-point': this.notPoint
          }
        ],
        on: { click: this.clickHandler }
      },
      [this.$slots.default]
    )
  },
  methods: {
    clickHandler(e) {
      if (this.value == null || this.notPoint) return
      e = e || window.event
      const $ocrLayoutEvents = this.find('$ocrLayoutEvents', this.$parent)
      $ocrLayoutEvents.trigger('click-ocr-el', {
        el: this.$el,
        value: this.value,
        id: this.value.id || this.id
      })
    },
    find(target, parent) {
      if (!parent) {
        return null
      }
      if (parent[target]) {
        return parent[target]
      } else {
        return this.find(target, parent.$parent)
      }
    }
  },
  computed: {
    activeText() {
      return this.find('activeText', this.$parent)
    },
    activeTextId() {
      return this.find('activeTextId', this.$parent)
    },
    notPoint() {
      const type = Object.prototype.toString.call(this.value)
      return (
        this.value == null ||
        (type === '[object Object]' && !this.value.position) ||
        (type === '[object Array]' && !this.value.length)
      )
    }
  }
}
</script>
