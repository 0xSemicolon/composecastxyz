<template>
  <v-app>
    <v-app-bar color="transparent" flat>
      <v-switch v-model="isDark" class="text-h6 mx-3 mt-4">
        <template #prepend>
          <v-icon color="red">mdi-weather-sunny</v-icon>
        </template>
        <template #append>
          <v-icon color="blue">mdi-weather-night</v-icon>
        </template>
      </v-switch>
      <v-spacer></v-spacer>
      <v-btn
        size="large"
        :color="githubBtnColor"
        variant="flat"
        target="_blank"
        href="https://github.com/0xSemicolon/composecastxyz"
      >
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
import { computed } from "vue";
import { useTheme } from "vuetify";
const theme = useTheme();

const githubBtnColor = computed(() => {
  if (theme.global.current.value.dark) {
    return "white";
  } else {
    return "black";
  }
});

const isDark = computed({
  get() {
    return theme.global.name.value === "dark";
  },
  set(v: boolean) {
    theme.global.name.value = v ? "dark" : "light";
  },
});
</script>
