<template>
  <div id="app">
    <button @click="setHomeView">Home</button>
    <TrafficFlow
      :traffic="trafficSampleSimple"
      :view="currentView"
      :allow-dragging-of-nodes="true"
      :show-labels="false"
      @viewChanged="setView"
    />
  </div>
</template>

<script>
const trafficSample = require('@/mocks/sample.json')
const trafficSampleSimple = require('@/mocks/sample-simple.json')

export default {
  name: 'App',
  data () {
    return {
      trafficSample,
      trafficSampleSimple,
      currentView: []
    }
  },
  methods: {
    setHomeView () {
      this.currentView = []
    },
    setView (value) {
      console.log('viewChanged', value)
      this.currentView = value
    }
  }
}
</script>

<style>
html,
body,
#app {
  padding: 0;
  margin: 0;
  height: 100%;
  overflow: hidden;
  background-color: #2d2d2d;
}
</style>
