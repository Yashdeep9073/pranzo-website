<template>
 
 <NuxtLayout >
    <NuxtPage /> 
  </NuxtLayout > 
 
</template>  

<style>
@media (max-width: 1024px) {
  html,
  body,
  #__nuxt {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    scroll-behavior: auto !important;
  }

  body {
    touch-action: pan-y;
    overscroll-behavior-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
