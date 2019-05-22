<template lang="pug">
  #app
    router-view.app-view
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+TC:400,700&subset=chinese-traditional');

#app {
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans TC', Helvetica, 'Microsoft JhengHei', Arial, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

button,
button:focus,
button:active,
textarea,
textarea:focus,
textarea:active,
input,
input:focus,
input:active {
  border: 0;
  appearance: none;
  outline: none;
}

.app {
  overflow-x: hidden;
  font-family: 'Noto Sans TC', Helvetica, 'Microsoft JhengHei', Arial, sans-serif;
  user-select: none;
  -webkit-font-smoothing: antialiased;

  &-view {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
