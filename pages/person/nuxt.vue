<template>
  <div>
    <h1 @click="count++">hey</h1>

    <p>{{ count }}</p>
    <p>{{ bounty }}</p>
    <p>{{ pay }}</p>

    <button @click="bounty++">Bounty++</button>
    <button @click="pay++">Pay++</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const count = ref(0)
const bounty = ref(0)
const pay = ref(0)

// Watch multiple states
watch([count, bounty, pay], () => {
  fetchProducts()
})

function fetchProducts() {
    if(count.value>4){
        count.value=0
    }else{
        count.value
    }
  console.log(
    `API Called => count=${count.value} bounty=${bounty.value} pay=${pay.value}`
  )
}
</script>
