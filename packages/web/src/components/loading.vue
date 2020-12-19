<template>
  <div class="loading">
    <svg viewBox="0 0 66 66" :width="size" :height="size">
      <circle fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'CLoading',
  props: {
    size: {
      type: String,
      default: '48',
    },
  },
}
</script>

<style lang="scss" scoped>
$offset: 187;
$duration: 1.4s;

.spinner {
  animation: rotator $duration linear infinite;
}

@keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

@keyframes colors {
  0% {
    stroke: #4285f4;
  }
  25% {
    stroke: #de3e35;
  }
  50% {
    stroke: #f7c223;
  }
  75% {
    stroke: #1b9a59;
  }
  100% {
    stroke: #4285f4;
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: $offset;
  }
  50% {
    stroke-dashoffset: $offset / 4;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: $offset;
    transform: rotate(450deg);
  }
}

.loading {
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);

  svg {
    margin: auto;

    circle {
      stroke-dasharray: $offset;
      stroke-dashoffset: 0;
      transform-origin: center;
      animation: dash $duration ease-in-out infinite, colors ($duration * 4) ease-in-out infinite;
    }
  }
}
</style>
