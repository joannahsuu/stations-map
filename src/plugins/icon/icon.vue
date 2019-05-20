<script>
const icons = {}

export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true,
      validator(val) {
        if (val && !(val in icons)) {
          console.warn(
            `Invalid prop "name" is referring to an unregistered icon "${val}".`,
            `\nPlease make sure you have imported this icon before using it.`,
          )
          return false
        }
        return true
      },
    },
    scale: {
      type: [Number, String],
      default: 1,
    },
    spin: {
      type: Boolean,
      default: false,
    },
    pulse: {
      type: Boolean,
      default: false,
    },
    flip: {
      type: String,
      default: '',
      validator(val) {
        return val === '' || val === 'horizontal' || val === 'vertical'
      },
    },
  },
  data() {
    return {
      x: 0,
      y: 0,
      childrenWidth: 0,
      childrenHeight: 0,
      outerScale: 1,
    }
  },
  computed: {
    normalizedScale() {
      let { scale } = this
      scale = typeof scale === 'undefined' ? 1 : Number(scale)
      if (Number.isNaN(scale) || scale <= 0) {
        console.warn(`Invalid prop "scale" should be a number over 0.`)
        return this.outerScale
      }
      return scale * this.outerScale
    },
    clazz() {
      return {
        svg__icon: true,
        svg__spin: this.spin,
        'svg__flip--horizontal': this.flip === 'horizontal',
        'svg__flip--vertical': this.flip === 'vertical',
        svg__pulse: this.pulse,
      }
    },
    icon() {
      if (this.name) {
        return icons[this.name]
      }
      return null
    },
    box() {
      if (this.icon) {
        return `0 0 ${this.icon.width} ${this.icon.height}`
      }
      return `0 0 ${this.width} ${this.height}`
    },
    ratio() {
      if (!this.icon) {
        return 1
      }
      const { width, height } = this.icon
      return Math.max(width, height) / 16
    },
    width() {
      return (
        this.childrenWidth
        || (this.icon && (this.icon.width / this.ratio) * this.normalizedScale)
        || 0
      )
    },
    height() {
      return (
        this.childrenHeight
        || (this.icon && (this.icon.height / this.ratio) * this.normalizedScale)
        || 0
      )
    },
    style() {
      if (this.normalizedScale === 1) {
        return false
      }
      return {
        fontSize: `${this.normalizedScale}em`,
      }
    },
  },
  mounted() {
    if (!this.name && this.name !== null && this.$children.length === 0) {
      console.warn(`Invalid prop "name" is required.`)
      return
    }

    if (this.icon) {
      return
    }

    let width = 0
    let height = 0
    /* eslint-disable no-param-reassign */
    this.$children.forEach((child) => {
      child.outerScale = this.normalizedScale
      width = Math.max(width, child.width)
      height = Math.max(height, child.height)
    })

    this.childrenWidth = width
    this.childrenHeight = height

    this.$children.forEach((child) => {
      child.x = (width - child.width) / 2
      child.y = (height - child.height) / 2
    })
    /* eslint-enable no-param-reassign */
  },
  render(h) {
    if (this.name === null) {
      return h()
    }

    const options = {
      class: this.clazz,
      style: this.style,
      attrs: {
        role: this.label ? 'img' : 'presentation',
        'aria-label': this.label || null,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        viewBox: this.box,
        fill: 'currentColor',
      },
    }

    return h(
      'svg',
      options,
      this.icon
        ? (this.$slots.default || [
          ...this.icon.paths.map((path, i) => h('path', {
            attrs: path,
            key: `path-${i}`,
          })),
          ...this.icon.polygons.map((polygon, i) => h('polygon', {
            attrs: polygon,
            key: `polygon-${i}`,
          })),
        ])
        : null,
    )
  },
  register(data) {
    Object.keys(data).forEach((name) => {
      const icon = data[name]
      const {
        paths = [],
        d,
        polygons = [],
        points,
      } = icon

      if (d) {
        paths.push({ d })
      }

      if (points) {
        polygons.push({ points })
      }

      icons[name] = Object.assign({}, icon, {
        paths,
        polygons,
      })
    })
  },
  icons,
}
</script>

<style lang="scss">
/** @define svg  */

.svg {
  &__icon {
    display: inline-block;
  }

  &__spin {
    animation: spin 1s 0s infinite linear;
  }

  &__flip {
    &--horizontal {
      transform: scale(-1, 1);
    }

    &--vertical {
      transform: scale(1, -1);
    }
  }

  &__pulse {
    animation: spin 1s infinite steps(8);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
