<template>
  <v-app>
    <v-app-bar color="transparent" flat>
      <v-spacer></v-spacer>
      <v-btn size="large" color="white" variant="flat" target="_blank" href="https://github.com/0xSemicolon/composecastxyz">
        <v-icon start>mdi-github</v-icon>
        View on Github
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>