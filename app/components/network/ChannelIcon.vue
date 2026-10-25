<script setup lang="ts">
import type { ChannelIcon } from '~~/types/content'

defineProps<{ name: ChannelIcon }>()
</script>

<!--
  One fine line icon per distribution channel, drawn in currentColor so
  each surface sets the colour through its own text token. A 48px grid
  with a 1.5 stroke keeps the line light at the 2–3rem these render at.
  Decorative: every use sits beside the channel's name.
-->
<template>
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <!-- A shopfront under a cross sign. -->
    <template v-if="name === 'pharmacy'">
      <circle
        cx="24"
        cy="9.5"
        r="5.5"
      />
      <path d="M24 7v5M21.5 9.5h5M24 15v2" />
      <path d="M9 17h30l3 6H6l3-6Z" />
      <path d="M6 23a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M9 26v15M39 26v15M4 41h40" />
      <rect
        x="13"
        y="30"
        width="9"
        height="6"
        rx="1"
      />
      <path d="M27 41V30h8v11" />
    </template>
    <!-- A laptop with a shopping cart on screen. -->
    <template v-else-if="name === 'e-commerce'">
      <rect
        x="8"
        y="9"
        width="32"
        height="22"
        rx="2"
      />
      <path d="M4 35h40l-2 4H6l-2-4ZM8 31l-4 4M40 31l4 4" />
      <path d="M16 14h2.5l2.75 10h10.5L34 17H19.4" />
      <circle
        cx="22.5"
        cy="27"
        r="1"
      />
      <circle
        cx="30.5"
        cy="27"
        r="1"
      />
    </template>
    <!-- A hospital block with a cross, between two wings. -->
    <template v-else-if="name === 'hospital'">
      <path d="M17 41V10a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v31" />
      <path d="M17 19H9a2 2 0 0 0-2 2v20M31 19h8a2 2 0 0 1 2 2v20M4 41h40" />
      <path d="M24 11.5v8M20 15.5h8" />
      <path d="M21 41v-8h6v8" />
      <path d="M10.5 25h3M10.5 30h3M10.5 35h3M34.5 25h3M34.5 30h3M34.5 35h3" />
    </template>
    <!-- A warehouse with stacked cartons inside. -->
    <template v-else-if="name === 'wholesale'">
      <path d="M5 41V18L24 8l19 10v23M3 41h42" />
      <rect
        x="14.5"
        y="32"
        width="9"
        height="9"
      />
      <rect
        x="24.5"
        y="32"
        width="9"
        height="9"
      />
      <rect
        x="19.5"
        y="23"
        width="9"
        height="9"
      />
    </template>
    <!-- A serum dropper bottle beside a lipstick. -->
    <template v-else-if="name === 'cosmetics'">
      <path d="M14 12V8.5a3 3 0 0 1 6 0V12" />
      <rect
        x="12"
        y="12"
        width="10"
        height="4.5"
        rx="1"
      />
      <rect
        x="9"
        y="16.5"
        width="16"
        height="24.5"
        rx="4"
      />
      <path d="M17 26.5c-1.6 2-2.5 3.4-2.5 4.6a2.5 2.5 0 0 0 5 0c0-1.2-.9-2.6-2.5-4.6Z" />
      <rect
        x="29"
        y="28"
        width="10"
        height="13"
        rx="1.5"
      />
      <rect
        x="30.5"
        y="22"
        width="7"
        height="6"
      />
      <path d="M31 22v-9.6a2 2 0 0 1 1.1-1.8L37 8v14" />
    </template>
  </svg>
</template>
