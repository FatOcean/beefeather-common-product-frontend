<script>
export default {
  name: "ocr-el",
  props: ["id", "value"],
  render: function (h) {
    return h(
      "tr",
      {
        class: ["text", { active: this.activeText === this.value,'not-point': !this?.value?.startX }],
        on: { click: this.clickHandler },
      },
      [this.$slots.default]
    );
  },
  methods: {
    clickHandler(e) {
      if(!this?.value?.startX) return
      e = e || window.event;
      this.$parent.$events.trigger("click-ocr-el", {
        el: this.$el,
        value: this.value,
      });
    },
  },
  computed: {
    activeText() {
      return this.$parent.activeText;
    },
  },
};
</script>
