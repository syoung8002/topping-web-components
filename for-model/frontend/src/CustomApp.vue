<template>
    <v-app>
        <v-main>
            <v-container>
                <component v-bind:is="componentName" :data="data"></component>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: "App",
    props: {
        data: Object,
        componentName: String
    }
};
</script>