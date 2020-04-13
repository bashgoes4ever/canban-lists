<template>
    <v-container>
        <v-row v-if="getDesks.length">
            <v-col cols="3" v-for="desk in getDesks" :key="desk.id">
                <v-card :to="`desks/${desk.id}`">
                    <v-card-title>{{desk.title}}</v-card-title>
                    <v-card-text>
                        <p v-for="c in desk.columns" :key="c.id">
                            {{c.title}}: {{c.tasks.length}}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-alert type="info" v-else>
            Пока не создано ни одной доски. <br><router-link to="/add" class="add">Создать</router-link>
        </v-alert>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "Home",
        data: () => ({}),
        computed: mapGetters(['getDesks'])
    }
</script>

<style scoped>
    .add {
        color: #ffffff !important;
        position: relative;
    }
    .add::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: #ffffff;
        bottom: 0;
        left: 0;
        right: 0;
        transition: all .3s;
    }
    .add:hover::after {
        opacity: 0;
    }
</style>